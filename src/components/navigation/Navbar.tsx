import React from 'react';
import { Compass, GraduationCap, Sparkles, Network, Clock, ShieldCheck, UserCheck } from 'lucide-react';

export type AppView =
  | 'landing'
  | 'diagnostic'
  | 'concept-graph'
  | 'learning'
  | 'assistant'
  | 'sandbox'
  | 'revision'
  | 'dashboard'
  | 'teacher';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  masteryScore?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, masteryScore = 78 }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E7]/90 backdrop-blur-md border-b border-[#171717]/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-xl font-bold tracking-tight text-[#171717] font-display flex items-center gap-2 whitespace-nowrap shrink-0 group hover:opacity-90 transition-opacity"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF572E] inline-block group-hover:scale-125 transition-transform" />
          <span>ALIS</span>
          <span className="text-xs font-normal text-[#171717]/50 font-sans hidden lg:inline">
            Class 10 Physics AI Prep
          </span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-medium uppercase tracking-wider text-[#171717]/70 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'landing' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('diagnostic')}
            className={`hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'diagnostic' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            Diagnostic Test
          </button>
          <button
            onClick={() => onNavigate('concept-graph')}
            className={`flex items-center gap-1 hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'concept-graph' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#FF572E]" />
            <span>Concept Graph</span>
          </button>
          <button
            onClick={() => onNavigate('learning')}
            className={`hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'learning' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            Question Bank
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className={`flex items-center gap-1 hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'assistant' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF572E]" />
            <span>Ask ALIS</span>
          </button>
          <button
            onClick={() => onNavigate('revision')}
            className={`flex items-center gap-1 hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'revision' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#FF572E]" />
            <span>Revision Queue</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'dashboard' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            Learner Model
          </button>
          <button
            onClick={() => onNavigate('teacher')}
            className={`flex items-center gap-1 hover:text-[#FF572E] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentView === 'teacher' ? 'text-[#FF572E] border-b-2 border-[#FF572E] font-bold' : ''
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#FF572E]" />
            <span>Teacher Portal</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate(currentView === 'diagnostic' ? 'concept-graph' : 'diagnostic')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#FF572E] rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 shadow-xs"
          >
            {currentView === 'diagnostic' ? 'Concept Graph' : 'Start Diagnostic'}
          </button>
        </div>
      </div>
    </header>
  );
};
