import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Sparkles, Check } from 'lucide-react';

interface LandingCtaAndFooterProps {
  onStartLearning: () => void;
  onExploreExperiments: () => void;
}

export const LandingCtaAndFooter: React.FC<LandingCtaAndFooterProps> = ({
  onStartLearning,
  onExploreExperiments,
}) => {
  return (
    <div>
      {/* SECTION 5 — START YOUR LEARNING JOURNEY */}
      <section className="py-24 px-6 bg-[#F5F0E7] border-b border-[#171717]/10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF572E] mb-4">
            Section 05 · The Next Stage
          </div>

          <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-[#171717] leading-tight text-balance mb-6">
            STOP MEMORISING ANSWERS. <br />
            <span className="text-[#FF572E]">START DISCOVERING TRUTH.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#171717]/75 font-sans max-w-2xl mb-10 leading-relaxed">
            Commit your predictions to the test. Let the laws of physics challenge your intuitive assumptions. Experience adaptive cognitive mastery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartLearning}
              className="flex items-center gap-3 px-8 py-4 bg-[#FF572E] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Launch Student Learning Lab</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreExperiments}
              className="flex items-center gap-2.5 px-7 py-4 border border-[#171717]/20 hover:border-[#171717] bg-[#FFFCF6] text-[#171717] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Compass className="w-4 h-4 text-[#171717]" />
              <span>Full Physics Sandbox</span>
            </motion.button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-10 border-t border-[#171717]/10 w-full text-left font-mono text-xs text-[#171717]/80">
            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#FF572E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#171717] block">Speech & Dictation</span>
                <span>Wispr Flow & Web Speech dictation enabled</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#FF572E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#171717] block">Gemini Cognitive Diagnosis</span>
                <span>Pinpoints root misconceptions in real time</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#FF572E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#171717] block">Interactive Counter-Proofs</span>
                <span>Shatter false intuition via direct simulation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6 — MINIMAL EDITORIAL FOOTER */}
      <footer className="py-12 px-6 bg-[#FFFCF6] text-[#171717]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#171717]/10 pt-8">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF572E]" />
            <span className="font-display font-bold text-sm tracking-tight">ALIS</span>
            <span className="text-xs text-[#171717]/50 font-mono">
              Adaptive Learning Intelligence System
            </span>
          </div>

          <div className="text-xs font-mono text-[#171717]/60">
            Editorial Science · Interactive Physics Laboratory · Continuous Evaluation
          </div>

          <div className="text-xs font-mono text-[#171717]/40">
            © {new Date().getFullYear()} ALIS Physics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
