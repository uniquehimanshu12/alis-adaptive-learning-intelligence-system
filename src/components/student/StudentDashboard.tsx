import React from 'react';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { LearnerProfile, PhysicsTopic } from '../../types/physics';

interface StudentDashboardProps {
  learnerProfile: LearnerProfile;
  onResumeLearning: () => void;
  onExploreSandbox: () => void;
  onOpenAskAlis: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  learnerProfile,
  onResumeLearning,
  onExploreSandbox,
  onOpenAskAlis,
}) => {
  const topics: { key: string; label: string; description: string }[] = [
    {
      key: 'NEWTONS_LAWS',
      label: "Newton's Laws & Dynamics",
      description: 'Action-reaction pairs, friction limits, net force vectors, connected bodies.',
    },
    {
      key: 'GRAVITATION',
      label: 'Universal Gravitation & Orbits',
      description: 'Inverse-square force, freefall equivalence, Keplerian harmonics, escape velocity.',
    },
    {
      key: 'WORK_AND_ENERGY',
      label: 'Work, Energy and Power',
      description: 'Inner products, perpendicular zero-work, conservation of mechanical energy.',
    },
    {
      key: 'KINEMATICS_PROJECTILE',
      label: 'Kinematics & Projectiles',
      description: 'Orthogonal vector independence, parabolic flight paths.',
    },
    {
      key: 'CIRCULAR_ROTATIONAL',
      label: 'Circular & Rotational Motion',
      description: 'Centripetal constraints, moment of inertia, rolling without slip.',
    },
    {
      key: 'OSCILLATIONS_WAVES',
      label: 'Oscillations & Waves',
      description: 'Simple harmonic motion, isochronous pendulums, mechanical resonance.',
    },
  ];

  // Calculate composite mastery score
  const totalScores = Object.values(learnerProfile.masteryScores);
  const averageMastery = Math.round(
    totalScores.reduce((acc, v) => acc + v, 0) / Math.max(1, totalScores.length)
  );

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto w-full">
      {/* Editorial Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-10 border-b border-[#171717]/10">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF572E] mb-2 font-bold">
            Plate 09 · Cognitive Learner Model
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#171717]">
            {learnerProfile.studentName}'s STEM Topology
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onResumeLearning}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF572E] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-colors shadow-xs"
          >
            <span>Adaptive Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAskAlis}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#171717] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>Ask ALIS</span>
          </button>
          <button
            onClick={onExploreSandbox}
            className="px-4 py-2.5 border border-[#171717]/15 rounded-xl text-xs font-bold uppercase tracking-wider text-[#171717] hover:bg-[#171717]/5 transition-colors"
          >
            Open Sandbox
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/60 mb-1">
            Composite Physical Intuition
          </div>
          <div className="text-4xl font-bold font-display text-[#171717] tabular-nums">
            {averageMastery}%
          </div>
          <div className="text-xs font-mono text-[#10B981] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Empirical reasoning verified
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/60 mb-1">
            Questions Mastered
          </div>
          <div className="text-4xl font-bold font-display text-[#171717] tabular-nums">
            {learnerProfile.questionsMastered} / {learnerProfile.questionsAttempted}
          </div>
          <div className="text-xs font-mono text-[#171717]/60 mt-2">
            Targeting intuitive traps
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/60 mb-1">
            Misconceptions Deconstructed
          </div>
          <div className="text-4xl font-bold font-display text-[#FF572E] tabular-nums">
            {learnerProfile.activeMisconceptions.length}
          </div>
          <div className="text-xs font-mono text-[#FF572E] mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Under active spaced review
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/60 mb-1">
            Ask ALIS Queries Logged
          </div>
          <div className="text-4xl font-bold font-display text-[#171717] tabular-nums">
            {learnerProfile.assistantHistory?.length || 0}
          </div>
          <div className="text-xs font-mono text-[#10B981] mt-2 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Cross-disciplinary inquiries
          </div>
        </div>
      </div>

      {/* Main Grid: Topic Mastery Bars on Left, Active Misconceptions Log on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Topic Mastery Bars */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-7 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#171717]/10">
              <h2 className="text-xl font-bold font-display text-[#171717]">
                Curriculum Mastery Breakdown
              </h2>
              <span className="text-xs font-mono text-[#171717]/50">Calibrated Scale</span>
            </div>

            <div className="space-y-6">
              {topics.map((t) => {
                const score = learnerProfile.masteryScores[t.key] || 50;
                return (
                  <div key={t.key} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#171717] font-display text-sm block">
                          {t.label}
                        </span>
                        <span className="text-[#171717]/60 font-sans text-xs">
                          {t.description}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm tabular-nums text-[#171717]">
                        {score}%
                      </span>
                    </div>

                    <div className="w-full bg-[#171717]/10 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#FF572E] h-full rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ask ALIS Learning History */}
          {learnerProfile.assistantHistory && learnerProfile.assistantHistory.length > 0 && (
            <div className="p-7 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#171717]/10">
                <h2 className="text-lg font-bold font-display text-[#171717]">
                  Recent Ask ALIS Explorations
                </h2>
                <span className="text-xs font-mono text-[#10B981] font-bold">Synchronized</span>
              </div>

              <div className="space-y-2.5">
                {learnerProfile.assistantHistory.slice(-5).reverse().map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#171717]/10 flex items-center justify-between gap-4 text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-[#171717] block font-sans text-sm">
                        "{h.query}"
                      </span>
                      <span className="text-[11px] text-[#FF572E] font-semibold">{h.subject} · {h.topic}</span>
                    </div>
                    <span className="text-[10px] text-[#171717]/40 shrink-0">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Misconception Archive & Spaced Repetition */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Misconceptions Card */}
          <div className="p-7 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#171717]/10">
              <h2 className="text-lg font-bold font-display text-[#171717]">
                Isolated Misconceptions
              </h2>
              <span className="text-xs font-mono text-[#FF572E] font-semibold">Diagnostic Records</span>
            </div>

            {learnerProfile.activeMisconceptions.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#171717]/60 bg-[#F5F0E7] rounded-xl">
                No active misconceptions detected yet. Launch learning challenges to test your intuition!
              </div>
            ) : (
              <div className="space-y-3">
                {learnerProfile.activeMisconceptions.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-[#171717]/10 bg-[#FAF6F0] flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display font-bold text-xs text-[#171717]">
                        {m.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF572E]/10 text-[#FF572E] font-semibold">
                        {m.topic}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#171717]/60">
                      Discovered: {new Date(m.detectedAt).toLocaleDateString()}
                    </div>

                    <button
                      onClick={onResumeLearning}
                      className="mt-1 self-start text-[11px] font-mono font-bold text-[#FF572E] hover:underline flex items-center gap-1"
                    >
                      Re-run Counter-Experiment →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spaced Repetition Card */}
          <div className="p-7 rounded-2xl bg-[#20201E] text-[#FFFCF6] border border-white/10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C8F169]" />
                <h2 className="text-lg font-bold font-display text-white">
                  Spaced Retention Cycle
                </h2>
              </div>
              <span className="text-xs font-mono text-[#C8F169]">Optimal Timing</span>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
              To cement first principles into long-term memory, ALIS serves questions right before memory decay sets in.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Newton\'s 3rd Law Re-Test</span>
                <span className="text-[#C8F169]">Due in 18 hrs</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Freefall Equivalence In Vacuum</span>
                <span className="text-white/60">Due in 3 days</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Work Inner Product Orthogonality</span>
                <span className="text-white/60">Due in 5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
