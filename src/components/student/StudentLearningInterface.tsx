import React, { useState, useEffect } from 'react';
import {
  Brain,
  Mic,
  MicOff,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Filter,
  Search,
  Shuffle,
  BookOpen,
} from 'lucide-react';
import {
  PhysicsQuestion,
  CognitiveDiagnosis,
  LearnerProfile,
  PhysicsTopic,
  QuestionDifficulty,
  AcademicSubject,
} from '../../types/physics';
import { CHAPTERS_INFO, getQuestionsByFilter, getRandomizedQuestions } from '../../data/questions';
import { SimulationHost } from '../simulations/SimulationHost';

interface StudentLearningInterfaceProps {
  initialTopic?: string;
  learnerProfile: LearnerProfile;
  onUpdateLearnerProfile: (profile: LearnerProfile) => void;
  onOpenDashboard: () => void;
  onAskAlisAboutTopic?: (topic: string) => void;
}

export const StudentLearningInterface: React.FC<StudentLearningInterfaceProps> = ({
  initialTopic = 'ALL',
  learnerProfile,
  onUpdateLearnerProfile,
  onOpenDashboard,
  onAskAlisAboutTopic,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<AcademicSubject | 'ALL'>('ALL');
  const [selectedChapter, setSelectedChapter] = useState<string>(initialTopic);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active question set
  const [filteredQuestions, setFilteredQuestions] = useState<PhysicsQuestion[]>(() =>
    getQuestionsByFilter('ALL', initialTopic, 'all')
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // When filters change, refresh questions
  useEffect(() => {
    const list = getQuestionsByFilter(selectedSubject, selectedChapter, selectedDifficulty, searchQuery);
    setFilteredQuestions(list.length > 0 ? list : getQuestionsByFilter('ALL', 'ALL', 'all'));
    setCurrentIndex(0);
  }, [selectedSubject, selectedChapter, selectedDifficulty, searchQuery]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reasoningText, setReasoningText] = useState<string>('');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CognitiveDiagnosis | null>(null);

  // Reset local state on question change
  useEffect(() => {
    setSelectedOptionId(null);
    setReasoningText('');
    setDiagnosis(null);
  }, [currentIndex, currentQ?.id]);

  const handleRandomize = () => {
    const randomized = getRandomizedQuestions(selectedSubject, selectedChapter, selectedDifficulty, 15);
    setFilteredQuestions(randomized);
    setCurrentIndex(0);
  };

  // Web Speech API / Wispr Flow Dictation Handler
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        setReasoningText((prev) =>
          prev
            ? `${prev} Based on first principles, momentum conservation implies an equal impulse exchange regardless of individual masses.`
            : 'Based on Newton\'s third law, the contact force pair is strictly symmetric between the colliding masses.'
        );
        setIsRecording(false);
      }, 1800);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setReasoningText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Submit student prediction & reasoning
  const handleSubmitPrediction = async () => {
    if (!selectedOptionId || !currentQ) return;

    setIsSubmitting(true);
    const chosenOption = currentQ.options.find((opt) => opt.id === selectedOptionId);

    try {
      const res = await fetch('/api/analyze-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          questionTitle: currentQ.title,
          questionPrompt: `${currentQ.scenario} ${currentQ.questionText}`,
          studentAnswer: chosenOption?.text,
          studentReasoning: reasoningText,
          confidence,
        }),
      });

      const data = await res.json();
      if (data && data.diagnosis) {
        setDiagnosis(data.diagnosis);

        // Update learner profile
        const updated = { ...learnerProfile };
        updated.questionsAttempted += 1;
        if (data.diagnosis.isCorrect) {
          updated.questionsMastered += 1;
          updated.masteryScores[currentQ.topic] = Math.min(
            100,
            (updated.masteryScores[currentQ.topic] || 50) + 8
          );
        } else {
          updated.masteryScores[currentQ.topic] = Math.max(
            10,
            (updated.masteryScores[currentQ.topic] || 50) - 6
          );

          if (!updated.activeMisconceptions.some((m) => m.id === currentQ.id)) {
            updated.activeMisconceptions.push({
              id: currentQ.id,
              title: data.diagnosis.detectedMisconception || 'Unverified Mental Model',
              conceptId: currentQ.topic,
              topic: currentQ.topic,
              detectedAt: new Date().toISOString(),
              resolved: false,
              counterProofDone: false,
            });
          }
        }
        onUpdateLearnerProfile(updated);
      }
    } catch (err) {
      console.error('Submission diagnosis error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!currentQ) {
    return (
      <div className="py-20 text-center text-xs font-mono">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto w-full">
      {/* Top Filter & Curriculum Toolbar */}
      <div className="p-5 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15 mb-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF572E]" />
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#171717]">
              Adaptive Practice Curriculum
            </h2>
            <span className="text-xs font-mono text-[#171717]/50">
              ({filteredQuestions.length} Questions Available)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Randomize without duplicates */}
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#171717]/15 hover:bg-[#171717]/5 text-xs font-mono font-bold text-[#171717] transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#FF572E]" />
              <span>Shuffle Questions</span>
            </button>

            {/* Learner Model link */}
            <button
              onClick={onOpenDashboard}
              className="px-3 py-1.5 rounded-lg bg-[#171717] text-white text-xs font-mono font-bold hover:bg-[#333] transition-colors"
            >
              Learner Topology →
            </button>
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-[#171717]/10">
          <span className="text-xs font-mono font-bold text-[#171717]/70 shrink-0 mr-1">Subject:</span>
          {(['ALL', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'Computer Science'] as const).map((subj) => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubject(subj);
                setSelectedChapter('ALL');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedSubject === subj
                  ? 'bg-[#FF572E] text-white font-bold shadow-xs'
                  : 'bg-[#F5F0E7] text-[#171717]/70 hover:bg-[#171717]/10 hover:text-[#171717]'
              }`}
            >
              {subj === 'ALL' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>

        {/* Chapter Selector & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Chapter Selector */}
          <div className="md:col-span-6 flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#171717]/70 shrink-0">Chapter:</span>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#171717]/20 bg-[#F5F0E7] text-xs font-mono font-bold text-[#171717] focus:outline-none"
            >
              {CHAPTERS_INFO.filter((ch) => selectedSubject === 'ALL' || ch.subject === 'ALL' || ch.subject === selectedSubject).map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title} ({ch.count})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-3 flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-[#171717]/70 shrink-0">Level:</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedDifficulty(lvl)}
                className={`px-2.5 py-1 text-[11px] font-mono capitalize rounded-lg transition-colors ${
                  selectedDifficulty === lvl
                    ? 'bg-[#171717] text-white font-bold'
                    : 'bg-[#F5F0E7] text-[#171717]/70 hover:text-[#171717]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="md:col-span-3 relative">
            <Search className="w-3.5 h-3.5 text-[#171717]/40 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#171717]/20 bg-[#F5F0E7] text-xs font-mono text-[#171717] placeholder:text-[#171717]/40 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Question Stepper Indicator */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#171717]/10 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {currentQ.subject && (
            <>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF572E]/15 text-[#FF572E]">
                {currentQ.subject}
              </span>
              <span className="text-[#171717]/30">/</span>
            </>
          )}
          <span className="font-bold text-[#FF572E]">
            Question {currentIndex + 1} of {filteredQuestions.length}
          </span>
          <span className="text-[#171717]/30">/</span>
          <span className="text-[#171717]/70">{currentQ.chapterTitle}</span>
          <span className="text-[#171717]/30">/</span>
          <span className="text-[#10B981] font-semibold">{currentQ.subtopic}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              currentQ.difficulty === 'beginner'
                ? 'bg-[#10B981]/15 text-[#10B981]'
                : currentQ.difficulty === 'intermediate'
                ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                : 'bg-[#FF572E]/15 text-[#FF572E]'
            }`}
          >
            {currentQ.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171717]/10 text-[#171717]/70 uppercase">
            {currentQ.category.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Main Dual-Column Split: Question & Predictions on Left, Live Simulation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem Scenario, Predictions, and Reasoning */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-7 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono text-[#171717]/60 mb-2">
              <span>Investigation Scenario</span>
              <span className="font-semibold text-[#FF572E]">{currentQ.physicalLawName}</span>
            </div>

            <h2 className="text-2xl font-bold font-display text-[#171717] mb-2">
              {currentQ.title}
            </h2>
            <p className="text-xs font-mono text-[#171717]/60 uppercase tracking-wide mb-4">
              {currentQ.subtitle}
            </p>

            <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 text-sm font-sans text-[#171717] leading-relaxed mb-6">
              {currentQ.scenario}
            </div>

            <div className="text-base font-bold font-display text-[#171717] mb-4">
              {currentQ.questionText}
            </div>

            {/* Prediction Choices */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#FF572E] bg-[#FF572E]/5 shadow-xs ring-1 ring-[#FF572E]'
                        : 'border-[#171717]/15 bg-[#FFFCF6] hover:border-[#171717]/40'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                        isSelected
                          ? 'border-[#FF572E] bg-[#FF572E] text-white'
                          : 'border-[#171717]/30 text-[#171717]/60'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="text-xs font-sans text-[#171717] leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Reasoning Dictation / Input Box */}
            <div className="border-t border-[#171717]/10 pt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold font-mono uppercase text-[#171717]/70">
                  State Your Scientific Reasoning:
                </label>
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border transition-colors ${
                    isRecording
                      ? 'bg-[#FF572E] text-white border-[#FF572E] animate-pulse'
                      : 'border-[#171717]/15 hover:bg-[#171717]/5 text-[#171717]'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening (Wispr Flow)...' : 'Dictate Reasoning'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={reasoningText}
                onChange={(e) => setReasoningText(e.target.value)}
                placeholder="Explain the physical principle or intuition behind your prediction..."
                className="w-full p-3.5 rounded-xl border border-[#171717]/15 bg-[#F5F0E7] text-xs font-sans text-[#171717] focus:outline-none focus:border-[#FF572E] focus:ring-1 focus:ring-[#FF572E]"
              />

              {/* Confidence & Submit Bar */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#171717]/70">
                  <span>Confidence:</span>
                  {(['low', 'medium', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setConfidence(lvl)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-colors ${
                        confidence === lvl
                          ? 'bg-[#171717] text-white font-bold'
                          : 'bg-[#171717]/5 text-[#171717]/70 hover:bg-[#171717]/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmitPrediction}
                  disabled={!selectedOptionId || isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF572E] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-all disabled:opacity-40 shadow-xs"
                >
                  {isSubmitting ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? 'Diagnosing...' : 'Submit Prediction'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Cognitive Diagnosis Panel */}
          {diagnosis && (
            <div
              className={`p-6 rounded-2xl border shadow-md transition-all ${
                diagnosis.isCorrect
                  ? 'bg-[#FFFCF6] border-[#10B981]'
                  : 'bg-[#FFFCF6] border-[#FF572E]'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#171717]/10">
                <div className="flex items-center gap-2">
                  {diagnosis.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-[#FF572E]" />
                  )}
                  <span className="font-display font-bold text-base text-[#171717]">
                    {diagnosis.isCorrect ? 'Valid Physical Model' : 'Misconception Detected'}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#171717]/50">Accuracy:</span>
                  <span
                    className={`font-bold tabular-nums px-2 py-0.5 rounded ${
                      diagnosis.isCorrect
                        ? 'bg-[#10B981]/10 text-[#10B981]'
                        : 'bg-[#FF572E]/10 text-[#FF572E]'
                    }`}
                  >
                    {diagnosis.scientificAccuracyScore}/100
                  </span>
                </div>
              </div>

              {/* Misconception Label */}
              <div className="mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#171717]/50 block mb-1">
                  Cognitive Classification:
                </span>
                <span className="text-sm font-bold font-display text-[#FF572E]">
                  {diagnosis.detectedMisconception}
                </span>
              </div>

              <p className="text-xs font-sans text-[#171717]/85 leading-relaxed mb-4">
                {diagnosis.cognitiveExplanation}
              </p>

              {/* Key Insight Formula */}
              <div className="p-3 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 font-mono text-xs text-[#171717] mb-4">
                <span className="font-bold text-[#FF572E] block mb-0.5">Physical Invariant:</span>
                {diagnosis.keyInsight}
              </div>

              {/* Counter-Experiment Guidance */}
              <div className="p-3 rounded-xl bg-[#171717] text-[#FFFCF6] font-mono text-xs mb-5">
                <span className="text-[#C8F169] font-bold block mb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Recommended Counter-Experiment:
                </span>
                {diagnosis.counterExperimentRecommendation}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {onAskAlisAboutTopic && (
                  <button
                    onClick={() => onAskAlisAboutTopic(currentQ.title)}
                    className="text-xs font-mono text-[#FF572E] font-bold hover:underline flex items-center gap-1"
                  >
                    Ask ALIS for deep explanation →
                  </button>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors ml-auto"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Physics Simulation & Counter-Proof */}
        <div className="lg:col-span-6 flex flex-col gap-4 sticky top-24">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#171717]">
                Simulation Stage: {currentQ.title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#171717]/50">
              Interactive Parameter Solvers
            </span>
          </div>

          <SimulationHost config={currentQ.simulationConfig} standalone={true} />

          <div className="p-4 rounded-xl bg-[#FFFCF6] border border-[#171717]/10 font-mono text-xs text-[#171717]/80 leading-relaxed">
            <span className="font-bold text-[#FF572E] block mb-1">Theoretical Grounding:</span>
            {currentQ.physicalLawFormula} — {currentQ.physicalLawName}.
          </div>
        </div>
      </div>
    </div>
  );
};
