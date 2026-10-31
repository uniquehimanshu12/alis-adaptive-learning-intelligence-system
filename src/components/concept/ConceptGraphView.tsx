import React, { useState } from 'react';
import { CLASS10_PHYSICS_CONCEPT_GRAPH, ConceptNode } from '../../data/conceptGraph';
import { LearnerProfile } from '../../types/physics';
import { Network, ArrowRight, AlertTriangle, CheckCircle2, Play, BookOpen, Layers, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react';

interface ConceptGraphViewProps {
  learnerProfile: LearnerProfile;
  onPracticeConcept: (conceptId: string) => void;
  onLaunchSimulation: (simType: string) => void;
}

export const ConceptGraphView: React.FC<ConceptGraphViewProps> = ({
  learnerProfile,
  onPracticeConcept,
  onLaunchSimulation,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>('c10_newton_second');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('ALL');

  const selectedConcept: ConceptNode = CLASS10_PHYSICS_CONCEPT_GRAPH[selectedConceptId] || CLASS10_PHYSICS_CONCEPT_GRAPH['c10_newton_second'];

  const getConceptMasteryLevel = (conceptId: string): 'NOT_ASSESSED' | 'WEAK' | 'DEVELOPING' | 'STRONG' | 'MASTERED' => {
    const data = learnerProfile.conceptMastery?.[conceptId];
    if (data?.masteryLevel) return data.masteryLevel;
    // Check old masteryScores map or fallback
    const score = learnerProfile.masteryScores?.[conceptId];
    if (score !== undefined) {
      if (score >= 85) return 'MASTERED';
      if (score >= 70) return 'STRONG';
      if (score >= 50) return 'DEVELOPING';
      return 'WEAK';
    }
    return 'NOT_ASSESSED';
  };

  const getStatusBadge = (level: string) => {
    switch (level) {
      case 'MASTERED':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">Mastered (95%)</span>;
      case 'STRONG':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#0284C7]/15 text-[#0284C7] border border-[#0284C7]/30">Strong (75%)</span>;
      case 'DEVELOPING':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30">Developing (50%)</span>;
      case 'WEAK':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#FF572E]/15 text-[#FF572E] border border-[#FF572E]/30">Weak Prerequisite</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#171717]/10 text-[#171717]/60">Not Assessed</span>;
    }
  };

  const getStatusDotColor = (level: string) => {
    switch (level) {
      case 'MASTERED': return 'bg-[#10B981] shadow-[0_0_8px_#10B981]';
      case 'STRONG': return 'bg-[#0284C7] shadow-[0_0_8px_#0284C7]';
      case 'DEVELOPING': return 'bg-[#D97706]';
      case 'WEAK': return 'bg-[#FF572E] shadow-[0_0_8px_#FF572E]';
      default: return 'bg-[#171717]/30';
    }
  };

  const chapters = [
    { id: 'ALL', name: 'All Chapters (23 Concepts)' },
    { id: 'motion', name: 'Motion & Kinematics' },
    { id: 'force', name: 'Force & Laws of Motion' },
    { id: 'gravitation', name: 'Gravitation & Free Fall' },
    { id: 'work_energy', name: 'Work, Energy & Power' },
    { id: 'electricity', name: 'Electricity & Circuits' },
    { id: 'magnetic', name: 'Magnetic Effects' },
    { id: 'light', name: 'Light: Reflection & Refraction' },
  ];

  const allNodes = Object.values(CLASS10_PHYSICS_CONCEPT_GRAPH);
  const filteredNodes = selectedChapterFilter === 'ALL'
    ? allNodes
    : allNodes.filter((n) => n.chapterId === selectedChapterFilter);

  // Check if any prerequisite of selected concept is weak
  const weakPrerequisites = selectedConcept.prerequisites
    .map((pId) => ({ id: pId, node: CLASS10_PHYSICS_CONCEPT_GRAPH[pId], level: getConceptMasteryLevel(pId) }))
    .filter((p) => p.level === 'WEAK' || p.level === 'NOT_ASSESSED');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#171717]/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF572E] flex items-center gap-1.5">
            <Network className="w-4 h-4" />
            <span>Structured Concept Dependency Graph</span>
          </span>
          <h1 className="text-3xl font-bold font-display text-[#171717] mt-1">
            Class 10 Physics Syllabus Graph
          </h1>
          <p className="text-sm text-[#171717]/70 mt-1 max-w-2xl">
            ALIS tracks prerequisites and prevents advancing to dependent concepts until foundational prerequisites are mastered.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium bg-white p-3 rounded-xl border border-[#171717]/10 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <span>Strong</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span>Developing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF572E]" />
            <span>Weak Priority</span>
          </div>
        </div>
      </div>

      {/* Chapter Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {chapters.map((chap) => (
          <button
            key={chap.id}
            onClick={() => setSelectedChapterFilter(chap.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedChapterFilter === chap.id
                ? 'bg-[#171717] text-white shadow-xs'
                : 'bg-white text-[#171717]/70 hover:bg-[#171717]/10 border border-[#171717]/10'
            }`}
          >
            {chap.name}
          </button>
        ))}
      </div>

      {/* Grid Layout: Left Node Board (60%), Right Inspector (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Node Board */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#171717]/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#171717]/60">
              Interactive Concept Map ({filteredNodes.length} Nodes)
            </span>
            <span className="text-xs text-[#171717]/50">Click any concept node to inspect dependencies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => {
              const level = getConceptMasteryLevel(node.id);
              const isSelected = selectedConceptId === node.id;
              const hasWeakPrereq = node.prerequisites.some((pId) => getConceptMasteryLevel(pId) === 'WEAK');

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedConceptId(node.id)}
                  className={`text-left p-4 rounded-xl border transition-all relative group ${
                    isSelected
                      ? 'border-[#FF572E] bg-[#FF572E]/5 ring-1 ring-[#FF572E] shadow-sm'
                      : 'border-[#171717]/10 bg-[#F5F0E7]/30 hover:bg-[#F5F0E7] hover:border-[#171717]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${getStatusDotColor(level)}`} />
                      <h4 className="text-sm font-bold text-[#171717] leading-snug">{node.name}</h4>
                    </div>
                    {hasWeakPrereq && (
                      <span title="Prerequisite concept is weak" className="text-[#FF572E]">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-[#171717]/60 line-clamp-1">{node.description}</div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-[#171717]/50 pt-2 border-t border-[#171717]/5">
                    <span>{node.chapter}</span>
                    <span className="font-mono">{node.prerequisites.length} Prereqs</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Concept Inspector Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#171717]/10 shadow-lg space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-[#171717]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF572E]">
                {selectedConcept.chapter}
              </span>
              <h2 className="text-xl font-bold font-display text-[#171717] mt-0.5">
                {selectedConcept.name}
              </h2>
            </div>
            {getStatusBadge(getConceptMasteryLevel(selectedConcept.id))}
          </div>

          <p className="text-sm text-[#171717]/80 leading-relaxed">
            {selectedConcept.description}
          </p>

          {/* Prerequisite Warnings */}
          {weakPrerequisites.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FF572E]/10 border border-[#FF572E]/30 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FF572E] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Prerequisite Warning</span>
              </div>
              <p className="text-xs text-[#171717]/80 leading-normal">
                Prerequisite concept <strong className="text-[#171717]">{weakPrerequisites[0].node?.name}</strong> has not been mastered yet. ALIS recommends revising it first before advancing.
              </p>
              <button
                onClick={() => weakPrerequisites[0].node && onPracticeConcept(weakPrerequisites[0].node.id)}
                className="mt-1 px-3 py-1.5 text-xs font-bold text-white bg-[#FF572E] hover:bg-[#FF572E]/90 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Revise Prerequisite ({weakPrerequisites[0].node?.name})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Prerequisites & Dependents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]/60">
              Prerequisite Concepts
            </h4>
            {selectedConcept.prerequisites.length > 0 ? (
              <div className="space-y-1.5">
                {selectedConcept.prerequisites.map((pId) => {
                  const pNode = CLASS10_PHYSICS_CONCEPT_GRAPH[pId];
                  const pLevel = getConceptMasteryLevel(pId);
                  return (
                    <div key={pId} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F5F0E7] text-xs font-medium">
                      <span>{pNode?.name || pId}</span>
                      {getStatusBadge(pLevel)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#171717]/50 italic">None (Foundational Concept)</p>
            )}

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]/60 pt-2">
              Dependent Concepts (Next Steps)
            </h4>
            {selectedConcept.dependents.length > 0 ? (
              <div className="space-y-1.5">
                {selectedConcept.dependents.map((dId) => {
                  const dNode = CLASS10_PHYSICS_CONCEPT_GRAPH[dId];
                  const dLevel = getConceptMasteryLevel(dId);
                  return (
                    <div key={dId} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F5F0E7] text-xs font-medium">
                      <span>{dNode?.name || dId}</span>
                      {getStatusBadge(dLevel)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#171717]/50 italic">None (Apex Chapter Concept)</p>
            )}
          </div>

          {/* Common Misconceptions */}
          {selectedConcept.misconceptions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#171717]/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]/60 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#FF572E]" />
                <span>Known Intuitive Misconception</span>
              </h4>
              <div className="p-3 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 space-y-1">
                <div className="text-xs font-bold text-[#FF572E]">
                  {selectedConcept.misconceptions[0].name}
                </div>
                <div className="text-xs text-[#171717]/70">
                  {selectedConcept.misconceptions[0].description}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#171717]/10 space-y-2">
            <button
              onClick={() => onPracticeConcept(selectedConcept.id)}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#FF572E] hover:bg-[#FF572E]/90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Practice {selectedConcept.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {selectedConcept.simulations.length > 0 && (
              <button
                onClick={() => onLaunchSimulation(selectedConcept.simulations[0])}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#171717] bg-[#F5F0E7] hover:bg-[#171717]/10 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-[#FF572E]" />
                <span>Launch Interactive Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
