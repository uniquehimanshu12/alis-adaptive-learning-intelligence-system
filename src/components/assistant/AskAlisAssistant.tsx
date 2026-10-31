import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Brain,
  Sliders,
  ArrowRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Calculator,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Copy,
  Check,
  RefreshCw,
  XCircle,
  Trophy,
  Target,
} from 'lucide-react';
import { AcademicSubject, AssistantMessage, LearnerProfile, SimulationType } from '../../types/physics';
import { SimulationHost } from '../simulations/SimulationHost';

interface AskAlisAssistantProps {
  onPracticeConcept: (topicKey: string) => void;
  onExploreSimulation: (simType: string) => void;
  learnerProfile: LearnerProfile;
  onUpdateLearnerProfile: (profile: LearnerProfile) => void;
  initialQuery?: string;
}

const SUBJECT_CATEGORIES: { name: AcademicSubject; iconColor: string; bgBadge: string }[] = [
  { name: 'Physics', iconColor: 'text-[#FF572E]', bgBadge: 'bg-[#FF572E]/10 border-[#FF572E]/30 text-[#FF572E]' },
  { name: 'Mathematics', iconColor: 'text-[#8B5CF6]', bgBadge: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]' },
  { name: 'Chemistry', iconColor: 'text-[#10B981]', bgBadge: 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' },
  { name: 'Biology', iconColor: 'text-[#F59E0B]', bgBadge: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]' },
  { name: 'Computer Science', iconColor: 'text-[#06B6D4]', bgBadge: 'bg-[#06B6D4]/10 border-[#06B6D4]/30 text-[#06B6D4]' },
];

const CURATED_DISCOVERY_QUERIES = [
  {
    subject: 'Physics',
    text: 'Explain Coulomb\'s law and what happens when the distance between two charges doubles.',
  },
  {
    subject: 'Mathematics',
    text: 'Differentiate x² sin(x) using the product rule with step-by-step working.',
  },
  {
    subject: 'Chemistry',
    text: 'Why does increasing temperature increase reaction rates according to Arrhenius kinetics?',
  },
  {
    subject: 'Biology',
    text: 'Explain DNA replication and the difference between leading and lagging strands.',
  },
  {
    subject: 'Computer Science',
    text: 'Explain recursion using a Python factorial function and call stack execution.',
  },
  {
    subject: 'Physics',
    text: 'What is acceleration and how is it calculated when velocity changes from 10 m/s to 25 m/s in 3 seconds?',
  },
];

export const AskAlisAssistant: React.FC<AskAlisAssistantProps> = ({
  onPracticeConcept,
  onExploreSimulation,
  learnerProfile,
  onUpdateLearnerProfile,
  initialQuery,
}) => {
  const [inputText, setInputText] = useState(initialQuery || '');
  const [selectedSubject, setSelectedSubject] = useState<AcademicSubject | 'Auto'>('Auto');
  const [isLoading, setIsLoading] = useState(false);
  const [globalExplanationLevel, setGlobalExplanationLevel] = useState<'simple' | 'detailed' | 'advanced'>('detailed');
  const [messageLevelOverrides, setMessageLevelOverrides] = useState<Record<string, 'simple' | 'detailed' | 'advanced'>>({});

  // Interactive state tracking
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [quizSelections, setQuizSelections] = useState<Record<string, number>>({});
  const [revealedPracticeIndex, setRevealedPracticeIndex] = useState<Record<string, boolean>>({});
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Agentic loop session tracking
  const [agenticEvaluations, setAgenticEvaluations] = useState<Record<string, any>>({});
  const [verificationSelections, setVerificationSelections] = useState<Record<string, number>>({});
  const [resolvedNotices, setResolvedNotices] = useState<Record<string, boolean>>({});
  const [transferSelections, setTransferSelections] = useState<Record<string, number>>({});
  const [transferMasteryGranted, setTransferMasteryGranted] = useState<Record<string, boolean>>({});

  const handleSelectQuizOption = async (msg: AssistantMessage, optIdx: number) => {
    if (quizSelections[msg.id] !== undefined) return;
    setQuizSelections((prev) => ({ ...prev, [msg.id]: optIdx }));

    if (!msg.checkUnderstanding) return;

    try {
      const res = await fetch('/api/evaluate-agentic-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionSessionId: msg.questionSessionId,
          question: msg.checkUnderstanding.question,
          subject: msg.subject,
          topic: msg.topic,
          selectedOptionIndex: optIdx,
          selectedOptionText: msg.checkUnderstanding.options[optIdx],
          correctIndex: msg.checkUnderstanding.correctIndex,
          explanation: msg.checkUnderstanding.explanation,
          attemptId: msg.id,
          learnerProfile,
        }),
      });

      const data = await res.json();
      if (data && data.agenticResult) {
        const evalResult = data.agenticResult;
        setAgenticEvaluations((prev) => ({ ...prev, [msg.id]: evalResult }));

        const topicKey = evalResult.recommendedTopicKey || msg.recommendedTopicKey || msg.topic || 'NEWTONS_LAWS';
        const isCorrect = evalResult.isCorrect;

        const updated = { ...learnerProfile };
        if (data.updatedEvaluatedAttemptIds) {
          updated.evaluatedAttemptIds = data.updatedEvaluatedAttemptIds;
        }

        // Only update counts if NOT a duplicate submission
        if (!data.isDuplicateAttempt) {
          updated.questionsAttempted = (updated.questionsAttempted || 0) + 1;

          if (!updated.masteryScores) updated.masteryScores = {};

          if (isCorrect) {
            updated.questionsMastered = (updated.questionsMastered || 0) + 1;
            updated.masteryScores[topicKey] = Math.max(updated.masteryScores[topicKey] || 0, evalResult.calculatedScore || 35);

            if (updated.activeMisconceptions) {
              updated.activeMisconceptions = updated.activeMisconceptions.map((mc) => {
                if (mc.topic === topicKey || mc.title.toLowerCase().includes((msg.topic || '').toLowerCase())) {
                  return { ...mc, resolved: true, counterProofDone: true };
                }
                return mc;
              });
            }
          } else {
            updated.masteryScores[topicKey] = Math.max(updated.masteryScores[topicKey] || 0, 15);
            if (!updated.activeMisconceptions) updated.activeMisconceptions = [];
            const miscTitle = evalResult.detectedMisconception || 'Conceptual Misconception';
            const existing = updated.activeMisconceptions.find((m) => m.title === miscTitle && !m.resolved);
            if (!existing) {
              updated.activeMisconceptions.push({
                id: `mc-${Date.now()}`,
                title: miscTitle,
                conceptId: topicKey,
                topic: topicKey,
                detectedAt: new Date().toISOString(),
                resolved: false,
                counterProofDone: false,
              });
            }
          }
        }

        onUpdateLearnerProfile(updated);
      }
    } catch (err) {
      console.error('Failed agentic evaluation step:', err);
    }
  };

  const handleSelectVerificationOption = (msgId: string, topicKey: string, optIdx: number, correctIdx: number) => {
    setVerificationSelections((prev) => ({ ...prev, [msgId]: optIdx }));

    if (optIdx === correctIdx) {
      setResolvedNotices((prev) => ({ ...prev, [msgId]: true }));

      const updated = { ...learnerProfile };
      if (!updated.masteryScores) updated.masteryScores = {};
      updated.questionsMastered = (updated.questionsMastered || 0) + 1;
      updated.masteryScores[topicKey] = Math.max(updated.masteryScores[topicKey] || 0, 65); // Counterproof verified score

      if (updated.activeMisconceptions) {
        updated.activeMisconceptions = updated.activeMisconceptions.map((mc) => {
          if (mc.topic === topicKey || mc.title.toLowerCase().includes((topicKey || '').toLowerCase())) {
            return { ...mc, resolved: true, counterProofDone: true };
          }
          return mc;
        });
      }

      onUpdateLearnerProfile(updated);
    }
  };

  const handleSelectTransferOption = async (msgId: string, topicKey: string, optIdx: number) => {
    if (transferSelections[msgId] !== undefined) return;
    setTransferSelections((prev) => ({ ...prev, [msgId]: optIdx }));

    const msg = messages.find((m) => m.id === msgId);
    const qSessionId = msg?.questionSessionId || msgId;

    try {
      const res = await fetch('/api/evaluate-transfer-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionSessionId: qSessionId,
          question: agenticEvaluations[msgId]?.transferQuestion?.question,
          correctIndex: agenticEvaluations[msgId]?.transferQuestion?.correctIndex,
          selectedOptionIndex: optIdx,
          attemptId: `transfer-${msgId}-${optIdx}`,
          topicKey,
          learnerProfile,
        }),
      });

      const data = await res.json();
      if (data && data.success) {
        if (data.isCorrect) {
          setTransferMasteryGranted((prev) => ({ ...prev, [msgId]: true }));
        }
        if (data.updatedProfile) {
          onUpdateLearnerProfile(data.updatedProfile);
        }
      }
    } catch (err) {
      console.error('Failed transfer evaluation step:', err);
    }
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Welcome to Ask ALIS — your universal AI learning intelligence. Ask any academic question across Physics, Mathematics, Chemistry, Biology, and Computer Science. I provide step-by-step mathematical reasoning, scaffolded hints, interactive check questions, and live simulations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: 'General Science',
      topic: 'Universal STEM Learning Engine',
      explanationSimple:
        'Ask ALIS is your personal AI tutor! Ask any school or college STEM question, choose your preferred explanation depth, test your understanding with interactive quizzes, and experiment with real-time simulations.',
      explanationDetailed:
        'ALIS synthesizes cognitive pedagogy across STEM disciplines. For numerical problems, it details Given conditions, Target variables, Governing equations, and Unit conversions. For theoretical questions, it addresses common intuitive misconceptions and provides interactive check questions.',
      explanationAdvanced:
        'Governed by first-principles mechanics, variational principles, differential calculus, and algorithmic analysis, ALIS provides formal mathematical derivations, boundary condition evaluations, and algorithmic asymptotic complexities.',
      keyFormula: '\\mathcal{H} = \\sum_{i} p_i \\dot{q}_i - \\mathcal{L} \\quad \\text{and} \\quad T(n) = O(f(n))',
      stepByStepSolution: [
        'Ask any new problem or paste homework questions.',
        'Toggle between Simple, Detailed, and Advanced explanation depths on any response.',
        'Inspect scaffolded hints before revealing complete solutions.',
        'Engage with embedded live simulations and verify concepts with check questions.',
      ],
      suggestedFollowUps: [
        "Explain Coulomb's law and distance doubling.",
        'Differentiate x² sin(x) step by step.',
        'Why does increasing temperature increase reaction rates?',
        'Explain DNA replication.',
        'Explain recursion using a Python example.',
      ],
      hint: 'Try asking a multi-step numerical calculation, a conceptual question with an intuitive trap, or a follow-up question!',
      hasInteractiveSimulation: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice dictation using Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Voice recognition error:', e);
      setIsListening(false);
    }
  };

  const handleCopyFormula = (formulaText: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(formulaText);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleAskQuestion = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-alis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          subjectOverride: selectedSubject === 'Auto' ? undefined : selectedSubject,
          explanationLevel: globalExplanationLevel,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data && data.answer) {
        const a = data.answer;
        const assistantMsg: AssistantMessage = {
          id: `alis-${Date.now()}`,
          role: 'assistant',
          content: a.explanationDetailed || a.explanationSimple,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: a.subject,
          topic: a.topic,
          explanationLevel: globalExplanationLevel,
          explanationSimple: a.explanationSimple,
          explanationDetailed: a.explanationDetailed,
          explanationAdvanced: a.explanationAdvanced,
          keyFormula: a.keyFormula,
          stepByStepSolution: a.stepByStepSolution,
          numericalSolution: a.numericalSolution,
          commonMisconceptions: a.commonMisconceptions,
          realWorldExample: a.realWorldExample,
          hint: a.hint,
          checkUnderstanding: a.checkUnderstanding,
          practiceProblems: a.practiceProblems,
          ambiguityNote: a.ambiguityNote,
          isRateLimited: a.isRateLimited,
          suggestedFollowUps: a.suggestedFollowUps,
          hasInteractiveSimulation: a.hasInteractiveSimulation,
          simulationType: a.simulationType,
          simulationParams: a.simulationParams,
          recommendedPracticeConcept: a.recommendedPracticeConcept,
          recommendedTopicKey: a.recommendedTopicKey,
          questionSessionId: a.questionSessionId,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Update learner profile history
        const updated = { ...learnerProfile };
        if (!updated.assistantHistory) updated.assistantHistory = [];
        updated.assistantHistory.push({
          query: q,
          subject: (a.subject as AcademicSubject) || 'General Science',
          timestamp: new Date().toISOString(),
          topic: a.topic || 'General Inquiry',
        });
        onUpdateLearnerProfile(updated);
      }
    } catch (err) {
      console.error('Failed to query Ask ALIS:', err);
      const fallbackMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'ALIS encountered a connection timeout while communicating with the AI service. Please verify your query or click Retry below.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRateLimited: true,
        subject: 'General Science',
        topic: 'System Connection Error',
        suggestedFollowUps: [
          'Retry my question',
          'What can you teach me?',
          "Explain Coulomb's law.",
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectBadgeStyle = (subject?: string) => {
    switch (subject) {
      case 'Physics':
        return 'bg-[#FF572E]/10 text-[#FF572E] border-[#FF572E]/30';
      case 'Mathematics':
        return 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30';
      case 'Chemistry':
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30';
      case 'Biology':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
      case 'Computer Science':
        return 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30';
      default:
        return 'bg-[#171717]/10 text-[#171717] border-[#171717]/20';
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Top Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-[#171717]/10"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF572E] mb-2 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal AI Learning Assistant</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#171717]/60">Multi-Disciplinary Synthesis</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#171717]">
            ASK ALIS
          </h1>
          <p className="mt-1 text-sm font-sans text-[#171717]/70 max-w-xl">
            Ask any academic question across Physics, Math, Chemistry, Biology, and Computer Science.
            Receive tiered explanations, numerical breakdowns, scaffolded hints, and live simulations.
          </p>
        </div>

        {/* Global Default Explanation Depth Toggle */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/50 font-bold">
            Default Explanation Depth:
          </span>
          <div className="inline-flex items-center gap-1 p-1 bg-[#FFFCF6] border border-[#171717]/15 rounded-xl shadow-2xs">
            {(['simple', 'detailed', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setGlobalExplanationLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-mono font-bold capitalize rounded-lg transition-all ${
                  globalExplanationLevel === lvl
                    ? 'bg-[#171717] text-white shadow-2xs scale-[1.02]'
                    : 'text-[#171717]/70 hover:text-[#171717]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Subject Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl shadow-2xs"
      >
        <span className="text-xs font-mono font-bold text-[#171717]/60 mr-2 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-[#FF572E]" />
          Target Subject:
        </span>
        <button
          onClick={() => setSelectedSubject('Auto')}
          className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
            selectedSubject === 'Auto'
              ? 'bg-[#171717] text-white border-[#171717] font-bold shadow-2xs scale-[1.02]'
              : 'bg-transparent text-[#171717] border-[#171717]/15 hover:border-[#171717]'
          }`}
        >
          Auto-Detect
        </button>
        {SUBJECT_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedSubject(cat.name)}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all flex items-center gap-1.5 ${
              selectedSubject === cat.name
                ? `${cat.bgBadge} font-bold shadow-2xs scale-[1.02]`
                : 'bg-transparent text-[#171717]/80 border-[#171717]/15 hover:border-[#171717]'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Suggested Quick Prompt Chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-8"
      >
        <div className="text-xs font-mono text-[#171717]/60 uppercase tracking-wider mb-2.5 font-bold flex items-center justify-between">
          <span>Benchmark Inquiries (Try Asking Directly):</span>
          <span className="text-[10px] text-[#171717]/40 lowercase">click any to launch</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CURATED_DISCOVERY_QUERIES.map((sq, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.015, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAskQuestion(sq.text)}
              className="text-left p-3.5 rounded-xl bg-[#FFFCF6] border border-[#171717]/15 hover:border-[#FF572E] hover:text-[#FF572E] text-xs font-mono text-[#171717] transition-all shadow-2xs flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#171717]/40 mb-1">
                <span>{sq.subject}</span>
                <ArrowRight className="w-3 h-3 text-[#FF572E] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="line-clamp-2">{sq.text}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Conversation Stream */}
      <div className="space-y-8 mb-10">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            if (isUser) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex justify-end"
                >
                  <div className="max-w-2xl bg-[#171717] text-[#FFFCF6] p-5 rounded-2xl rounded-tr-xs shadow-md font-sans text-sm leading-relaxed">
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-50 mb-1.5">
                      <span>Student Inquiry</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="font-medium text-white">{msg.content}</div>
                  </div>
                </motion.div>
              );
            }

            // Active level for this message
            const activeLevel = messageLevelOverrides[msg.id] || globalExplanationLevel;
            const activeText =
              activeLevel === 'simple' && msg.explanationSimple
                ? msg.explanationSimple
                : activeLevel === 'advanced' && msg.explanationAdvanced
                ? msg.explanationAdvanced
                : msg.explanationDetailed || msg.content;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15 shadow-sm transition-all">
                  {/* Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#171717]/10 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md border font-bold text-[11px] ${getSubjectBadgeStyle(
                          msg.subject
                        )}`}
                      >
                        {msg.subject || 'General Science'}
                      </span>
                      <span className="text-[#171717]/30">/</span>
                      <span className="text-[#FF572E] font-semibold">{msg.topic || 'Concept Analysis'}</span>
                    </div>

                    {/* Per-card Depth Switcher */}
                    <div className="flex items-center gap-1 p-0.5 bg-[#F5F0E7] border border-[#171717]/10 rounded-lg">
                      {(['simple', 'detailed', 'advanced'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() =>
                            setMessageLevelOverrides((prev) => ({ ...prev, [msg.id]: lvl }))
                          }
                          className={`px-2.5 py-1 text-[11px] font-mono capitalize rounded-md transition-colors ${
                            activeLevel === lvl
                              ? 'bg-[#171717] text-white font-bold'
                              : 'text-[#171717]/60 hover:text-[#171717]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Honest Rate-Limit Notice Banner (if API quota/connection error) */}
                  {msg.isRateLimited && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 text-xs font-mono text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider block text-amber-900 mb-0.5">
                            AI Service Capacity Status
                          </span>
                          <span>
                            Gemini API is currently at free-tier demand limits. ALIS provided the first-principles framework above. You can retry the generative query now.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                          if (lastUser) handleAskQuestion(lastUser.content);
                        }}
                        className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry AI Query</span>
                      </button>
                    </motion.div>
                  )}

                  {/* Ambiguity Note (if any) */}
                  {msg.ambiguityNote && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-900">
                      <span className="font-bold">Clarification Note: </span>
                      <span>{msg.ambiguityNote}</span>
                    </div>
                  )}

                  {/* Scaffolded Hint (Collapsible) */}
                  {msg.hint && (
                    <div className="mb-6 p-4 rounded-xl bg-[#C8F169]/20 border border-[#C8F169]/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#171717]">
                          <Lightbulb className="w-4 h-4 text-[#10B981]" />
                          <span>Need a pedagogical hint before reading full solution?</span>
                        </div>
                        <button
                          onClick={() =>
                            setRevealedHints((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                          }
                          className="px-3 py-1 bg-[#171717] text-white text-[11px] font-mono font-bold rounded-lg hover:bg-[#FF572E] transition-colors cursor-pointer"
                        >
                          {revealedHints[msg.id] ? 'Hide Hint' : 'Reveal Hint'}
                        </button>
                      </div>
                      {revealedHints[msg.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-[#171717]/10 text-xs font-sans text-[#171717] leading-relaxed"
                        >
                          {msg.hint}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Main Explanation Body */}
                  <div className="text-sm font-sans text-[#171717] leading-relaxed mb-6 whitespace-pre-line">
                    {activeText}
                  </div>

                  {/* Numerical Problem Structured Solution (if applicable) */}
                  {msg.numericalSolution && (
                    <div className="mb-6 p-5 rounded-xl bg-[#FAF6F0] border-2 border-[#171717]/15">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-[#FF572E] mb-4 pb-2 border-b border-[#171717]/10">
                        <Calculator className="w-4 h-4 text-[#FF572E]" />
                        <span>Formal Step-by-Step Numerical Solution</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-4">
                        {msg.numericalSolution.given && (
                          <div className="p-3 bg-[#FFFCF6] rounded-lg border border-[#171717]/10">
                            <span className="font-bold text-[#171717] block mb-1">1. Given Information:</span>
                            <span className="text-[#171717]/80">{msg.numericalSolution.given}</span>
                          </div>
                        )}
                        {msg.numericalSolution.toCalculate && (
                          <div className="p-3 bg-[#FFFCF6] rounded-lg border border-[#171717]/10">
                            <span className="font-bold text-[#171717] block mb-1">2. Target Variable:</span>
                            <span className="text-[#171717]/80">{msg.numericalSolution.toCalculate}</span>
                          </div>
                        )}
                      </div>

                      {msg.numericalSolution.formulaPrinciple && (
                        <div className="p-3 bg-[#FFFCF6] rounded-lg border border-[#171717]/10 text-xs font-mono mb-4">
                          <span className="font-bold text-[#171717] block mb-1">3. Relevant Formula / Principle:</span>
                          <code className="text-[#FF572E] font-bold">{msg.numericalSolution.formulaPrinciple}</code>
                        </div>
                      )}

                      {msg.numericalSolution.substitutionCalculation && (
                        <div className="p-3 bg-[#FFFCF6] rounded-lg border border-[#171717]/10 text-xs font-mono mb-4">
                          <span className="font-bold text-[#171717] block mb-1">4. Substitution & Calculation:</span>
                          <pre className="text-[#171717] font-mono whitespace-pre-wrap leading-relaxed">
                            {msg.numericalSolution.substitutionCalculation}
                          </pre>
                        </div>
                      )}

                      {msg.numericalSolution.finalAnswer && (
                        <div className="p-4 bg-[#171717] text-[#FFFCF6] rounded-xl mb-3 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8F169] block font-bold">
                              5. Final Result (with Units):
                            </span>
                            <span className="text-base sm:text-lg font-bold font-mono">
                              {msg.numericalSolution.finalAnswer}
                            </span>
                          </div>
                          <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        </div>
                      )}

                      {msg.numericalSolution.interpretation && (
                        <div className="text-xs font-sans text-[#171717]/80 italic">
                          <span className="font-bold not-italic">Physical Meaning: </span>
                          {msg.numericalSolution.interpretation}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Governing Equation Box */}
                  {msg.keyFormula && (
                    <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 mb-6 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF572E] font-bold mb-1">
                          Governing Equation / Invariant Principle:
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-[#171717] tracking-tight">
                          {msg.keyFormula}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyFormula(msg.keyFormula!)}
                        className="p-2 rounded-lg border border-[#171717]/15 hover:border-[#171717] text-[#171717]/70 hover:text-[#171717] transition-colors cursor-pointer"
                        title="Copy equation"
                      >
                        {copiedFormula === msg.keyFormula ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step-by-Step Solution Breakdown */}
                  {msg.stepByStepSolution && msg.stepByStepSolution.length > 0 && !msg.numericalSolution && (
                    <div className="mb-6 p-5 rounded-xl bg-[#FAF6F0] border border-[#171717]/10">
                      <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Analytical Step-by-Step Derivation:</span>
                      </div>
                      <div className="space-y-2">
                        {msg.stepByStepSolution.map((st, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-xs font-mono text-[#171717]">
                            <span className="text-[#FF572E] font-bold shrink-0">0{idx + 1}.</span>
                            <span className="leading-relaxed">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Misconceptions & Cognitive Traps */}
                  {msg.commonMisconceptions && msg.commonMisconceptions.length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-[#FF572E]/5 border border-[#FF572E]/20">
                      <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#FF572E] mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#FF572E]" />
                        <span>Cognitive Traps & Common Misconceptions:</span>
                      </div>
                      <ul className="space-y-1.5 text-xs font-sans text-[#171717]/90 list-disc list-inside">
                        {msg.commonMisconceptions.map((mc, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {mc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Real-World Application */}
                  {msg.realWorldExample && (
                    <div className="text-xs font-mono text-[#171717]/80 mb-6 flex items-start gap-2 p-3 bg-[#FFFCF6] rounded-xl border border-[#171717]/10">
                      <Lightbulb className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#171717]">Real-World Manifestation: </span>
                        <span>{msg.realWorldExample}</span>
                      </div>
                    </div>
                  )}

                  {/* Interactive Simulation Stage (Embedded directly if relevant) */}
                  {msg.hasInteractiveSimulation && msg.simulationType && (
                    <div className="my-6 border-2 border-[#171717]/15 rounded-2xl overflow-hidden shadow-xs">
                      <div className="px-4 py-2 bg-[#171717] text-white flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-[#C8F169]">
                          <Sliders className="w-3.5 h-3.5" />
                          Relevant Interactive Simulation
                        </span>
                        <span className="text-white/60">Live Mathematical Solver</span>
                      </div>
                      <SimulationHost
                        config={{
                          type: msg.simulationType as SimulationType,
                          initialParams: msg.simulationParams || {},
                          labels: {},
                        }}
                        standalone={true}
                      />
                    </div>
                  )}

                  {/* Interactive "Check Your Understanding" Quiz Widget */}
                  {msg.checkUnderstanding && (
                    <div className="my-6 p-5 rounded-xl bg-[#FFFCF6] border-2 border-[#10B981]/30 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10B981] mb-2">
                        <Brain className="w-4 h-4 text-[#10B981]" />
                        <span>Check Your Understanding (Quick Check):</span>
                      </div>
                      <p className="text-xs font-mono text-[#171717] font-semibold mb-3">
                        {msg.checkUnderstanding.question}
                      </p>

                      <div className="space-y-2 mb-3">
                        {msg.checkUnderstanding.options.map((opt, optIdx) => {
                          const selected = quizSelections[msg.id] === optIdx;
                          const isCorrect = optIdx === msg.checkUnderstanding!.correctIndex;
                          const hasSelected = quizSelections[msg.id] !== undefined;

                          let btnStyle =
                            'bg-[#FAF6F0] border-[#171717]/15 hover:border-[#171717] text-[#171717]';
                          if (hasSelected) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                            } else if (selected && !isCorrect) {
                              btnStyle = 'bg-red-50 border-red-500 text-red-900 line-through';
                            } else {
                              btnStyle = 'opacity-40 border-transparent text-[#171717]';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasSelected}
                              onClick={() => handleSelectQuizOption(msg, optIdx)}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>
                                <span className="font-bold mr-2">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </span>
                              {hasSelected && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Agentic Evaluation & Counter-Proof Action Card */}
                      {quizSelections[msg.id] !== undefined && (
                        <div className="mt-4 space-y-4">
                          {agenticEvaluations[msg.id] ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 rounded-xl border-2 text-xs font-mono ${
                                agenticEvaluations[msg.id].isCorrect
                                  ? 'bg-emerald-50 border-emerald-500/40 text-emerald-950'
                                  : 'bg-red-500/10 border-red-500/40 text-red-950'
                              }`}
                            >
                              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                                {agenticEvaluations[msg.id].isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span>First Principles Validated — Mastery Score Increased!</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    <span>
                                      Misconception Detected: {agenticEvaluations[msg.id].detectedMisconception}
                                    </span>
                                  </>
                                )}
                              </div>

                              <p className="font-sans text-xs leading-relaxed mb-3">
                                {agenticEvaluations[msg.id].pedagogicalExplanation}
                              </p>

                              {/* Correct Answer Mastery Badge */}
                              {agenticEvaluations[msg.id].isCorrect && (
                                <div className="p-3 bg-emerald-600 text-white rounded-lg flex items-center justify-between font-mono font-bold">
                                  <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-[#C8F169]" />
                                    <span>Initial Understanding Demonstrated (Developing Level: 35%)</span>
                                  </div>
                                  <span className="text-[10px] uppercase tracking-wider text-emerald-200">
                                    Evidence Recorded
                                  </span>
                                </div>
                              )}

                              {/* Misconception Counter-Proof Interactive Simulation */}
                              {!agenticEvaluations[msg.id].isCorrect && (
                                <div className="mt-4 space-y-3">
                                  <div className="p-3 bg-red-900 text-white rounded-lg font-mono text-xs">
                                    <span className="font-bold text-amber-300 block mb-1">
                                      Counter-Experiment Strategy:
                                    </span>
                                    <span>
                                      {agenticEvaluations[msg.id].counterProofInstruction ||
                                        'Use the slider controls in the counter-proof lab below to observe the physical invariant and disprove this misconception.'}
                                    </span>
                                  </div>

                                  {agenticEvaluations[msg.id].counterProofSimulationType && (
                                    <div className="my-3 border-2 border-red-500/30 rounded-xl overflow-hidden bg-white">
                                      <div className="px-3 py-1.5 bg-red-900 text-white text-[11px] font-mono flex items-center justify-between font-bold">
                                        <span className="flex items-center gap-1.5 text-amber-300">
                                          <Sliders className="w-3.5 h-3.5" />
                                          Counter-Proof Live Experiment Lab
                                        </span>
                                        <span>Interactive Disproof</span>
                                      </div>
                                      <SimulationHost
                                        config={{
                                          type: agenticEvaluations[msg.id].counterProofSimulationType as SimulationType,
                                          initialParams: agenticEvaluations[msg.id].counterProofParams || {},
                                          labels: {},
                                        }}
                                        standalone={true}
                                      />
                                    </div>
                                  )}

                                  {/* Verification Follow-Up Question */}
                                  {agenticEvaluations[msg.id].verificationFollowUp && (
                                    <div className="mt-4 p-4 rounded-xl bg-white border-2 border-[#171717]/20 shadow-xs">
                                      <div className="flex items-center gap-2 font-bold text-xs text-[#171717] mb-2 font-mono">
                                        <Target className="w-4 h-4 text-[#FF572E]" />
                                        <span>Follow-Up Verification (Prove Your Understanding):</span>
                                      </div>
                                      <p className="text-xs font-mono font-semibold text-[#171717] mb-3">
                                        {agenticEvaluations[msg.id].verificationFollowUp.question}
                                      </p>

                                      <div className="space-y-2 mb-3">
                                        {agenticEvaluations[msg.id].verificationFollowUp.options.map(
                                          (vOpt: string, vIdx: number) => {
                                            const vSelected = verificationSelections[msg.id] === vIdx;
                                            const vCorrectIdx =
                                              agenticEvaluations[msg.id].verificationFollowUp.correctIndex;
                                            const vHasSelected = verificationSelections[msg.id] !== undefined;

                                            let vBtnStyle =
                                              'bg-[#FAF6F0] border-[#171717]/15 hover:border-[#171717] text-[#171717]';
                                            if (vHasSelected) {
                                              if (vIdx === vCorrectIdx) {
                                                vBtnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                                              } else if (vSelected && vIdx !== vCorrectIdx) {
                                                vBtnStyle = 'bg-red-50 border-red-500 text-red-900 line-through';
                                              } else {
                                                vBtnStyle = 'opacity-40 border-transparent text-[#171717]';
                                              }
                                            }

                                            return (
                                              <button
                                                key={vIdx}
                                                disabled={vHasSelected}
                                                onClick={() =>
                                                  handleSelectVerificationOption(
                                                    msg.id,
                                                    msg.recommendedTopicKey || msg.topic || 'NEWTONS_LAWS',
                                                    vIdx,
                                                    vCorrectIdx
                                                  )
                                                }
                                                className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${vBtnStyle}`}
                                              >
                                                <span>
                                                  <span className="font-bold mr-2">
                                                    {String.fromCharCode(65 + vIdx)}.
                                                  </span>
                                                  {vOpt}
                                                </span>
                                                {vHasSelected && vIdx === vCorrectIdx && (
                                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                )}
                                              </button>
                                            );
                                          }
                                        )}
                                      </div>

                                      {/* Resolved Misconception Celebration Badge */}
                                      {resolvedNotices[msg.id] && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="p-3 bg-amber-500 text-amber-950 font-bold font-mono text-xs rounded-lg flex items-center justify-between"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-amber-950" />
                                            <span>
                                              Misconception Resolved! Counterproof Verified (Score: 65%)
                                            </span>
                                          </div>
                                          <CheckCircle2 className="w-4 h-4 text-amber-950" />
                                        </motion.div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Transfer Learning Question (Displayed when available) */}
                              {agenticEvaluations[msg.id].transferQuestion && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 p-4 rounded-xl bg-purple-900/10 border-2 border-purple-500/30 text-xs font-mono"
                                >
                                  <div className="flex items-center gap-2 font-bold text-xs text-purple-900 mb-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    <span>
                                      Contextual Learning Transfer Check ({agenticEvaluations[msg.id].transferQuestion.contextDescription}):
                                    </span>
                                  </div>
                                  <p className="text-xs font-mono font-semibold text-purple-950 mb-3">
                                    {agenticEvaluations[msg.id].transferQuestion.question}
                                  </p>

                                  <div className="space-y-2 mb-3">
                                    {agenticEvaluations[msg.id].transferQuestion.options.map(
                                      (tOpt: string, tIdx: number) => {
                                        const tSelected = transferSelections[msg.id] === tIdx;
                                        const tCorrectIdx =
                                          agenticEvaluations[msg.id].transferQuestion.correctIndex;
                                        const tHasSelected = transferSelections[msg.id] !== undefined;

                                        let tBtnStyle = 'bg-white border-purple-200 hover:border-purple-500 text-[#171717]';
                                        if (tHasSelected) {
                                          if (tIdx === tCorrectIdx) {
                                            tBtnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                                          } else if (tSelected && tIdx !== tCorrectIdx) {
                                            tBtnStyle = 'bg-red-50 border-red-500 text-red-900 line-through';
                                          } else {
                                            tBtnStyle = 'opacity-40 border-transparent text-[#171717]';
                                          }
                                        }

                                        return (
                                          <button
                                            key={tIdx}
                                            disabled={tHasSelected}
                                            onClick={() =>
                                              handleSelectTransferOption(
                                                msg.id,
                                                agenticEvaluations[msg.id].recommendedTopicKey || msg.topic || 'NEWTONS_LAWS',
                                                tIdx
                                              )
                                            }
                                            className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${tBtnStyle}`}
                                          >
                                            <span>
                                              <span className="font-bold mr-2">{String.fromCharCode(65 + tIdx)}.</span>
                                              {tOpt}
                                            </span>
                                            {tHasSelected && tIdx === tCorrectIdx && (
                                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>

                                  {transferMasteryGranted[msg.id] && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="p-3 bg-purple-950 text-purple-100 font-bold font-mono text-xs rounded-lg flex items-center justify-between shadow-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-[#C8F169]" />
                                        <span>Contextual Transfer Verified! Deep Topic Mastery Granted (95%)</span>
                                      </div>
                                      <CheckCircle2 className="w-4 h-4 text-[#C8F169]" />
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-sans text-emerald-950">
                              <span className="font-bold">Pedagogical Explanation: </span>
                              {msg.checkUnderstanding.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practice Problems Section */}
                  {msg.practiceProblems && msg.practiceProblems.length > 0 && (
                    <div className="my-6 p-4 rounded-xl bg-[#FAF6F0] border border-[#171717]/15">
                      <div className="text-xs font-mono font-bold text-[#171717] mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#FF572E]" />
                        <span>Targeted Practice Problems on this Concept:</span>
                      </div>

                      {msg.practiceProblems.map((prob, pIdx) => {
                        const probKey = `${msg.id}-p-${pIdx}`;
                        const isRevealed = revealedPracticeIndex[probKey];
                        return (
                          <div key={pIdx} className="p-3 bg-[#FFFCF6] rounded-lg border border-[#171717]/10 mb-2 text-xs font-mono">
                            <p className="font-semibold text-[#171717] mb-2">{prob.question}</p>
                            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#171717]/10">
                              <span className="text-[#171717]/60 italic">Hint: {prob.hint}</span>
                              <button
                                onClick={() =>
                                  setRevealedPracticeIndex((prev) => ({
                                    ...prev,
                                    [probKey]: !prev[probKey],
                                  }))
                                }
                                className="text-[#FF572E] font-bold hover:underline cursor-pointer"
                              >
                                {isRevealed ? 'Hide Solution' : 'View Solution'}
                              </button>
                            </div>
                            {isRevealed && (
                              <div className="mt-2 p-2 bg-[#F5F0E7] rounded text-emerald-900 whitespace-pre-line">
                                <span className="font-bold">Solution: </span>
                                {prob.solution}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions & Practice Concept Bridge */}
                  <div className="pt-4 border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {msg.recommendedPracticeConcept && (
                        <button
                          onClick={() => onPracticeConcept(msg.recommendedTopicKey || 'NEWTONS_LAWS')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#FF572E] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-colors shadow-2xs cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Practice in Question Bank ({msg.recommendedPracticeConcept})</span>
                        </button>
                      )}

                      {msg.simulationType && (
                        <button
                          onClick={() => onExploreSimulation(msg.simulationType!)}
                          className="flex items-center gap-1.5 px-3 py-2 border border-[#171717]/20 text-[#171717] text-xs font-bold font-mono uppercase tracking-wider rounded-xl hover:bg-[#171717]/5 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Explore in Full Physics Lab</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-[#171717]/50">
                      Logged to Learner Model
                    </span>
                  </div>

                  {/* Suggested Follow-Ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#171717]/10">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#171717]/60 mb-2 font-bold">
                        Recommended Follow-Up Inquiries:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedFollowUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAskQuestion(fu)}
                            className="text-left px-3 py-1.5 rounded-lg border border-[#171717]/15 bg-[#FAF6F0] hover:bg-[#FFFCF6] hover:border-[#171717] text-xs font-mono text-[#171717] transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3 text-[#FF572E]" />
                            <span>{fu}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Spinner State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-5 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15 text-xs font-mono text-[#171717] shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-[#FF572E] animate-spin" />
            <div>
              <div className="font-bold">ALIS AI Engine is synthesizing answer...</div>
              <div className="text-[#171717]/60 text-[11px]">
                Diagnosing core principles, formulating derivations, and configuring simulation models.
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Persistent Question Input Box */}
      <div className="sticky bottom-6 z-40 bg-[#FFFCF6]/95 backdrop-blur-md border border-[#171717]/20 rounded-2xl p-3 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion(inputText);
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask any question in Physics, Math, Chemistry, Biology, or Computer Science..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm font-sans text-[#171717] placeholder:text-[#171717]/40 focus:outline-none"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-500 animate-pulse'
                : 'bg-transparent text-[#171717]/60 border-[#171717]/15 hover:text-[#171717] hover:border-[#171717]'
            }`}
            title={isListening ? 'Stop listening' : 'Dictate with voice'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FF572E] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-all disabled:opacity-40 shadow-xs shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask ALIS</span>
          </button>
        </form>
      </div>
    </div>
  );
};
