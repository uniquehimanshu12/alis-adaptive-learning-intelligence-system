import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Sliders, Database } from 'lucide-react';

export const AdaptiveIntelligenceShowcase: React.FC = () => {
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  const pipeline = [
    {
      step: '01',
      title: 'Student Answer & Prediction',
      icon: <Brain className="w-5 h-5 text-[#FF572E]" />,
      summary: 'Student is presented with an intuitive trap scenario and commits to an explicit prediction.',
      sampleInput: 'Choice: "The truck exerts 5x more force on the car."',
      technicalDetail: 'Bayesian prior updated. Cognitive trap triggered.',
    },
    {
      step: '02',
      title: 'Voice & Text Reasoning Extraction',
      icon: <Sparkles className="w-5 h-5 text-[#C8F169]" />,
      summary: 'ALIS analyzes spoken or typed natural language reasoning to uncover the internal heuristic.',
      sampleInput: 'Reasoning: "Because the truck is heavier and crushes the car\'s engine block."',
      technicalDetail: 'Gemini reasoning analysis extracts semantic entity relations.',
    },
    {
      step: '03',
      title: 'Misconception Classification',
      icon: <AlertTriangle className="w-5 h-5 text-[#FF572E]" />,
      summary: 'The exact cognitive distortion is isolated rather than simply issuing a penalty score.',
      sampleInput: 'Misconception: [Impulse-Mass Conflation] — Conflating acceleration (a=F/m) with interaction force (F).',
      technicalDetail: 'Cognitive taxonomy node tagged with high confidence (0.94).',
    },
    {
      step: '04',
      title: 'Scientific Counter-Experiment',
      icon: <Sliders className="w-5 h-5 text-[#10B981]" />,
      summary: 'ALIS generates a targeted physical simulation designed to directly falsify the false belief.',
      sampleInput: 'Action: Forces student to set Truck=5000kg and Car=500kg and read the instantaneous force gauges.',
      technicalDetail: 'Cognitive dissonance triggered by empirical observation.',
    },
    {
      step: '05',
      title: 'Learner Model & Spaced Repetition',
      icon: <Database className="w-5 h-5 text-[#FF572E]" />,
      summary: 'The student\'s mastery matrix is updated and a spaced revision challenge is scheduled for 48 hours.',
      sampleInput: 'State: Newton\'s Third Law shifted from "Vulnerable" to "Deconstructed". Revision in 2 days.',
      technicalDetail: 'SuperMemo-2 spaced repetition curve adjusted.',
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#20201E] text-[#FFFCF6] border-b border-[#FFFCF6]/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#FFFCF6]/10 pb-8"
        >
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C8F169] mb-3">
              Section 04 · Cognitive Diagnostic Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-balance">
              HOW ALIS UNDERSTANDS YOU
            </h2>
          </div>
          <p className="text-sm font-sans text-[#FFFCF6]/70 max-w-md">
            ALIS deconstructs your reasoning step by step, using Gemini AI and real-time physical counter-proofs to rebuild your mental model.
          </p>
        </motion.div>

        {/* 2-Column Layout: Pipeline Steps on Left, Cognitive Model Graphic on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive 5-Step Diagnostic Sequence */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-3"
          >
            {pipeline.map((item, idx) => (
              <button
                key={item.step}
                onClick={() => setPipelineStep(idx)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                  pipelineStep === idx
                    ? 'bg-[#FFFCF6] text-[#171717] border-[#C8F169] shadow-lg translate-x-1'
                    : 'bg-[#171717] text-[#FFFCF6]/70 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#FF572E]">{item.step}</span>
                    <span className="font-display font-bold text-base">{item.title}</span>
                  </div>
                  {pipelineStep === idx ? (
                    <CheckCircle2 className="w-4 h-4 text-[#FF572E]" />
                  ) : (
                    <span className="text-[11px] font-mono opacity-40">Inspect</span>
                  )}
                </div>

                <p
                  className={`text-xs font-sans leading-relaxed ${
                    pipelineStep === idx ? 'text-[#171717]/80' : 'text-[#FFFCF6]/60'
                  }`}
                >
                  {item.summary}
                </p>
              </button>
            ))}
          </motion.div>

          {/* Right Column: Active Diagnostic Node Details */}
          <motion.div
            key={pipelineStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-5 p-8 rounded-2xl bg-[#171717] border-2 border-[#C8F169]/40 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  {pipeline[pipelineStep].icon}
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C8F169] font-bold">
                    Step {pipeline[pipelineStep].step} Processing
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/40">Diagnostic Pipeline</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-4">
                {pipeline[pipelineStep].title}
              </h3>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-white/80 mb-6">
                <span className="text-[#FF572E] block mb-1 font-bold">Data Capture:</span>
                {pipeline[pipelineStep].sampleInput}
              </div>

              <div className="p-4 rounded-xl bg-[#C8F169]/10 border border-[#C8F169]/30 font-mono text-xs text-[#C8F169]">
                <span className="block mb-1 font-bold">Internal Engine Action:</span>
                {pipeline[pipelineStep].technicalDetail}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
