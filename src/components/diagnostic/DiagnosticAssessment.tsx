import React, { useState } from 'react';
import { CLASS10_DIAGNOSTIC_QUESTIONS, DiagnosticQuestion } from '../../data/diagnosticQuestions';
import { LearnerProfile } from '../../types/physics';
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Brain, Clock, Award, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';

interface DiagnosticAssessmentProps {
  learnerProfile: LearnerProfile;
  onUpdateLearnerProfile: (updated: LearnerProfile) => void;
  onCompleteDiagnostic: () => void;
  onOpenConceptGraph: () => void;
}

export const DiagnosticAssessment: React.FC<DiagnosticAssessmentProps> = ({
  learnerProfile,
  onUpdateLearnerProfile,
  onCompleteDiagnostic,
  onOpenConceptGraph,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selectedOptionId: string; reasoningText: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [diagnosticReport, setDiagnosticReport] = useState<any | null>(null);

  const currentQuestion: DiagnosticQuestion = CLASS10_DIAGNOSTIC_QUESTIONS[currentStepIndex];
  const isLastQuestion = currentStepIndex === CLASS10_DIAGNOSTIC_QUESTIONS.length - 1;

  const currentAnswer = userAnswers[currentQuestion.id] || { selectedOptionId: '', reasoningText: '' };

  const handleSelectOption = (optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOptionId: optionId,
        reasoningText: prev[currentQuestion.id]?.reasoningText || '',
      },
    }));
  };

  const handleReasoningChange = (text: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOptionId: prev[currentQuestion.id]?.selectedOptionId || '',
        reasoningText: text,
      },
    }));
  };

  const handleNext = () => {
    if (!currentAnswer.selectedOptionId) return;
    if (currentQuestion.requiresReasoning && !currentAnswer.reasoningText.trim()) return;

    if (!isLastQuestion) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/evaluate-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: userAnswers,
          learnerProfile,
        }),
      });

      const data = await res.json();
      if (data && data.success) {
        setDiagnosticReport(data.report);
        if (data.updatedProfile) {
          onUpdateLearnerProfile(data.updatedProfile);
        }
      } else {
        throw new Error('Diagnostic evaluation failed');
      }
    } catch (err) {
      console.error('Failed to submit diagnostic:', err);
      // Fallback evaluation client-side if offline
      const fallbackReport = generateClientFallbackReport(userAnswers, learnerProfile);
      setDiagnosticReport(fallbackReport.report);
      onUpdateLearnerProfile(fallbackReport.updatedProfile);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper client-side evaluation fallback
  const generateClientFallbackReport = (answers: Record<string, any>, profile: LearnerProfile) => {
    let correctCount = 0;
    const conceptScores: Record<string, number> = {};
    const weakConcepts: string[] = [];
    const strongConcepts: string[] = [];

    CLASS10_DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const ans = answers[q.id];
      const selected = q.options.find((o) => o.id === ans?.selectedOptionId);
      const isCorrect = selected?.isCorrect || false;
      if (isCorrect) correctCount++;
      const score = isCorrect ? 85 : 30;
      conceptScores[q.conceptId] = score;
      if (isCorrect) strongConcepts.push(q.conceptName);
      else weakConcepts.push(q.conceptName);
    });

    const overallPct = Math.round((correctCount / CLASS10_DIAGNOSTIC_QUESTIONS.length) * 100);

    const updatedProfile: LearnerProfile = {
      ...profile,
      diagnosticCompleted: true,
      diagnosticBaselineAt: new Date().toISOString(),
      questionsAttempted: profile.questionsAttempted + CLASS10_DIAGNOSTIC_QUESTIONS.length,
      questionsMastered: profile.questionsMastered + correctCount,
    };

    return {
      report: {
        totalQuestions: CLASS10_DIAGNOSTIC_QUESTIONS.length,
        correctCount,
        overallPct,
        weakConcepts,
        strongConcepts,
      },
      updatedProfile,
    };
  };

  if (diagnosticReport) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 border border-[#171717]/10 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-[#171717]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF572E]">
                Diagnostic Baseline Report
              </span>
              <h1 className="text-3xl font-bold font-display text-[#171717] mt-1">
                Class 10 Physics Learning Profile
              </h1>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold font-mono text-[#10B981]">
                {diagnosticReport.overallPct}%
              </div>
              <div className="text-xs text-[#171717]/60 font-medium">Overall Diagnostic Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 space-y-1">
              <div className="text-xs font-bold text-[#171717]/60 uppercase">Assessed Concepts</div>
              <div className="text-2xl font-bold font-mono text-[#171717]">
                {CLASS10_DIAGNOSTIC_QUESTIONS.length} Concepts
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 space-y-1">
              <div className="text-xs font-bold text-[#10B981] uppercase">Strong Concepts</div>
              <div className="text-2xl font-bold font-mono text-[#10B981]">
                {diagnosticReport.strongConcepts?.length || 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#FF572E]/10 border border-[#FF572E]/20 space-y-1">
              <div className="text-xs font-bold text-[#FF572E] uppercase">Weak Concepts Identified</div>
              <div className="text-2xl font-bold font-mono text-[#FF572E]">
                {diagnosticReport.weakConcepts?.length || 0}
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#FF572E]" />
              <span>Concept Mastery Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-[#171717]/10 bg-[#F5F0E7]/50 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF572E] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Targeted Priorities for Practice</span>
                </div>
                {diagnosticReport.weakConcepts?.length > 0 ? (
                  <ul className="space-y-2">
                    {diagnosticReport.weakConcepts.map((cName: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm font-medium text-[#171717]">
                        <span className="w-2 h-2 rounded-full bg-[#FF572E]" />
                        <span>{cName}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#171717]/70">No critical weak concepts detected!</p>
                )}
              </div>

              <div className="p-5 rounded-xl border border-[#171717]/10 bg-[#10B981]/5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mastered Baseline Concepts</span>
                </div>
                {diagnosticReport.strongConcepts?.length > 0 ? (
                  <ul className="space-y-2">
                    {diagnosticReport.strongConcepts.map((cName: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm font-medium text-[#171717]">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span>{cName}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#171717]/70">Initial baseline established. Ready to build mastery!</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#171717]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onOpenConceptGraph}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171717] bg-[#F5F0E7] hover:bg-[#171717]/10 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Concept Graph</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onCompleteDiagnostic}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#FF572E] hover:bg-[#FF572E]/90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Start Adaptive Learning Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF572E]">
            Initial Diagnostic Assessment
          </span>
          <h2 className="text-2xl font-bold font-display text-[#171717]">
            Class 10 Physics Baseline Test
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#171717]/70 bg-white px-3 py-1.5 rounded-lg border border-[#171717]/10">
          <Clock className="w-4 h-4 text-[#FF572E]" />
          <span>
            Question {currentStepIndex + 1} of {CLASS10_DIAGNOSTIC_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#171717]/10 rounded-full h-2 overflow-hidden">
        <div
          className="bg-[#FF572E] h-full transition-all duration-300"
          style={{
            width: `${((currentStepIndex + 1) / CLASS10_DIAGNOSTIC_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-8 border border-[#171717]/10 shadow-lg space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#171717]/50 uppercase tracking-wider">
            <span>{currentQuestion.chapter}</span>
            <span>·</span>
            <span className="text-[#FF572E]">{currentQuestion.conceptName}</span>
            <span>·</span>
            <span className="capitalize">{currentQuestion.difficulty}</span>
          </div>

          <h3 className="text-xl font-bold text-[#171717] leading-relaxed">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {
            const isSelected = currentAnswer.selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#FF572E] bg-[#FF572E]/5 shadow-xs text-[#171717]'
                    : 'border-[#171717]/10 bg-[#F5F0E7]/40 hover:bg-[#F5F0E7] text-[#171717]/80'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#FF572E] text-white'
                      : 'bg-[#171717]/10 text-[#171717]/70'
                  }`}
                >
                  {opt.id.toUpperCase()}
                </span>
                <span className="text-sm font-medium leading-normal">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Reasoning Input */}
        {currentQuestion.requiresReasoning && (
          <div className="pt-4 border-t border-[#171717]/10 space-y-2">
            <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-[#FF572E]" />
              <span>{currentQuestion.reasoningPrompt || 'Explain your reasoning or working:'}</span>
            </label>
            <textarea
              value={currentAnswer.reasoningText}
              onChange={(e) => handleReasoningChange(e.target.value)}
              placeholder="Type your step-by-step reasoning or formula substitution here (ALIS detects misconceptions from reasoning quality)..."
              rows={3}
              className="w-full p-3.5 text-sm rounded-xl border border-[#171717]/15 bg-[#F5F0E7]/30 text-[#171717] focus:outline-none focus:border-[#FF572E] focus:ring-1 focus:ring-[#FF572E] transition-all"
            />
          </div>
        )}

        {/* Navigation Actions */}
        <div className="pt-4 flex items-center justify-between">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717]/60 hover:text-[#171717] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>

          <button
            disabled={
              !currentAnswer.selectedOptionId ||
              (currentQuestion.requiresReasoning && !currentAnswer.reasoningText.trim()) ||
              isSubmitting
            }
            onClick={handleNext}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#FF572E] disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Evaluating Baseline...</span>
            ) : isLastQuestion ? (
              <span>Submit Diagnostic Test</span>
            ) : (
              <>
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
