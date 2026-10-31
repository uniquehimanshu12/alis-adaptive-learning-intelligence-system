import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Brain, Sliders, ArrowRight } from 'lucide-react';

export const TraditionalVsAlis: React.FC = () => {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);

  const steps = [
    {
      num: '01',
      title: 'The Evaluation Method',
      traditional: {
        tag: 'Passive Testing',
        headline: 'Memorise formulaic equations. Select multiple-choice option A, B, C, or D.',
        visualText: 'Find acceleration if F=12N and m=4kg.\n[A] 2 m/s²   [B] 3 m/s²   [C] 48 m/s²',
        verdict: 'Measures test-taking recall, not genuine comprehension.',
      },
      alis: {
        tag: 'Diagnostic Exploration',
        headline: 'Predict the physical outcome before simulation begins.',
        visualText: 'Two colliding masses with differing inertia.\nWhich vehicle exerts more instantaneous force?',
        verdict: 'Forces the mind to commit to its underlying mental model.',
      },
    },
    {
      num: '02',
      title: 'The Error Handling',
      traditional: {
        tag: 'Punitive Feedback',
        headline: 'Marked wrong with red ink. Show answer key and demand chapter re-reading.',
        visualText: '✖ Score: 0/1. The correct answer was B.\n"Review Chapter 4 on Newton\'s Laws."',
        verdict: 'The student remains trapped in the same intuitive misconception.',
      },
      alis: {
        tag: 'Cognitive Dissection',
        headline: 'Pinpoints the exact intuitive trap that generated the error.',
        visualText: 'Misconception Identified: Size-Impulse Conflation.\n"You confused resulting acceleration with contact force."',
        verdict: 'Dissects why your intuition failed, not just that it did.',
      },
    },
    {
      num: '03',
      title: 'The Permanent Retention',
      traditional: {
        tag: 'Rapid Decay',
        headline: 'Formulas crammed for the exam vanish from memory within 72 hours.',
        visualText: 'Exam: 85%  →  60 Days Later: 24% Concept Retention\nIntuitive bias permanently resurfaces.',
        verdict: 'Zero deep physical intuition is acquired.',
      },
      alis: {
        tag: 'Empirical Reconstruction',
        headline: 'Physical counter-experiments shatter false heuristics forever.',
        visualText: 'Interactive Proof: Real-time sensor reading F₁₂ = -F₂₁.\nBelief updated through direct sensory contradiction.',
        verdict: 'First-principles mental models that last for decades.',
      },
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#20201E] text-[#FFFCF6] border-b border-[#FFFCF6]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#FFFCF6]/10 pb-8"
        >
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF572E] mb-3">
              Section 02 · Comparative Pedagogy
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-balance">
              TRADITIONAL ROTE CRAMMING <br />
              <span className="text-[#C8F169]">VERSUS COGNITIVE INTELLIGENCE</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-[#FFFCF6]/60 max-w-sm">
            Traditional education tests what you can remember. ALIS investigates how you actually think.
          </p>
        </motion.div>

        {/* Interactive Step Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {steps.map((st, idx) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(idx as 0 | 1 | 2)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                activeStep === idx
                  ? 'bg-[#FFFCF6] text-[#171717] border-[#FFFCF6] shadow-md scale-[1.01]'
                  : 'bg-[#20201E] text-[#FFFCF6]/70 border-[#FFFCF6]/15 hover:border-[#FFFCF6]/40'
              }`}
            >
              <div className="font-mono text-xs opacity-60 mb-1">{st.num}</div>
              <div className="font-display font-bold text-sm sm:text-base leading-snug">{st.title}</div>
            </button>
          ))}
        </motion.div>

        {/* Comparative Side-by-Side Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Card */}
          <motion.div
            key={`trad-${activeStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-2xl bg-[#171717] border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                    {steps[activeStep].traditional.tag}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/40">Status Quo</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-4 leading-snug">
                {steps[activeStep].traditional.headline}
              </h3>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-white/70 whitespace-pre-line leading-relaxed mb-6">
                {steps[activeStep].traditional.visualText}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs font-mono text-red-400/90 font-medium">
              Verdict: {steps[activeStep].traditional.verdict}
            </div>
          </motion.div>

          {/* ALIS Card */}
          <motion.div
            key={`alis-${activeStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-2xl bg-[#262624] border-2 border-[#C8F169]/40 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C8F169]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C8F169] font-bold">
                    {steps[activeStep].alis.tag}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#FF572E] font-bold">ALIS Intelligence</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-4 leading-snug">
                {steps[activeStep].alis.headline}
              </h3>

              <div className="p-4 rounded-xl bg-[#171717] border border-[#C8F169]/20 font-mono text-xs text-[#C8F169] whitespace-pre-line leading-relaxed mb-6">
                {steps[activeStep].alis.visualText}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs font-mono text-[#C8F169] font-medium">
              Verdict: {steps[activeStep].alis.verdict}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
