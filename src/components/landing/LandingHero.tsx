import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Orbit, Sparkles } from 'lucide-react';
import { GravitationSimulator } from '../simulations/GravitationSimulator';

interface LandingHeroProps {
  onStartLearning: () => void;
  onExploreExperiments: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartLearning,
  onExploreExperiments,
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center px-6 pt-12 pb-20 border-b border-[#171717]/10 bg-scientific-grid overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Editorial Subtitle Marker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#171717]/60 mb-6"
        >
          <span>Plate 01</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Cognitive Mechanics</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#FF572E] font-semibold">Empirical Investigation</span>
        </motion.div>

        {/* 2-Column Split: Editorial Typography on Left, Dramatic Interactive Gravity Lab on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Oversized Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-[#171717] leading-[1.08] text-balance mb-6">
              PHYSICS ISN'T SOMETHING YOU JUST READ.{' '}
              <span className="text-[#FF572E] underline decoration-[#FF572E]/30 underline-offset-8">
                EXPERIENCE IT.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#171717]/80 leading-relaxed font-sans max-w-xl mb-8">
              Experiment with the laws of nature. Discover how you think. Learn what you actually need.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStartLearning}
                className="group flex items-center gap-3 px-7 py-3.5 bg-[#FF572E] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreExperiments}
                className="flex items-center gap-2.5 px-6 py-3.5 border border-[#171717]/20 hover:border-[#171717] bg-[#FFFCF6] text-[#171717] font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 shadow-xs cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#171717]" />
                <span>Explore Experiments</span>
              </motion.button>
            </div>

            {/* Micro proof ticker */}
            <div className="flex items-center gap-6 mt-12 pt-6 border-t border-[#171717]/10 text-xs font-mono text-[#171717]/70">
              <div>
                <span className="font-bold text-[#171717] text-sm block">100%</span>
                <span>Active First Principles</span>
              </div>
              <div className="w-[1px] h-8 bg-[#171717]/10" />
              <div>
                <span className="font-bold text-[#FF572E] text-sm block">0 Memorization</span>
                <span>Counter-Intuitive Proofs</span>
              </div>
              <div className="w-[1px] h-8 bg-[#171717]/10" />
              <div>
                <span className="font-bold text-[#171717] text-sm block">Voice + AI</span>
                <span>Cognitive Diagnostics</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Immersive Interactive Gravitational Lab */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <div className="relative rounded-2xl p-1 bg-[#171717]/5 border border-[#171717]/15 shadow-md">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#FFFCF6] rounded-t-xl border-b border-[#171717]/10">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#FF572E] animate-pulse" />
                  <span className="font-semibold text-[#171717]">Simulation 01 · Spacetime Field</span>
                </div>
                <span className="text-[11px] font-mono text-[#171717]/50">Interactive Orbit Sandbox</span>
              </div>

              <GravitationSimulator standalone={true} />
            </div>

            <div className="mt-3 text-center text-xs font-mono text-[#171717]/50">
              Figure 1.1 — Drag anywhere inside the coordinate grid to project an orbital body with initial velocity vector.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
