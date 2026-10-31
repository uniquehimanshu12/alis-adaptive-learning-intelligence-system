import React, { useState } from 'react';
import { RotateCcw, Play, Pause, Dna } from 'lucide-react';

interface DnaReplicationSimulatorProps {
  standalone?: boolean;
}

const TEMPLATE_BASES = ['A', 'T', 'C', 'G', 'A', 'A', 'T', 'C', 'G', 'T', 'G', 'C'];
const COMPLEMENTS: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };

export const DnaReplicationSimulator: React.FC<DnaReplicationSimulatorProps> = ({
  standalone = true,
}) => {
  const [forkProgress, setForkProgress] = useState<number>(6); // number of base pairs unzipped
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setForkProgress((prev) => {
        if (prev >= TEMPLATE_BASES.length) {
          setIsPlaying(false);
          return TEMPLATE_BASES.length;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A':
        return 'bg-red-500 text-white border-red-700';
      case 'T':
        return 'bg-blue-500 text-white border-blue-700';
      case 'C':
        return 'bg-emerald-500 text-white border-emerald-700';
      case 'G':
        return 'bg-amber-500 text-white border-amber-700';
      default:
        return 'bg-gray-400 text-white border-gray-600';
    }
  };

  return (
    <div className={`p-6 bg-[#FFFCF6] rounded-2xl border border-[#171717]/15 ${standalone ? 'shadow-sm' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase">
            <Dna className="w-3.5 h-3.5" />
            <span>Molecular Genetics & Semi-Conservative Synthesis</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#171717]">
            DNA Replication Fork & Base Pairing Visualizer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] text-white text-xs font-mono font-bold rounded-lg hover:bg-[#FF572E] transition-colors"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Pause' : 'Animate Fork'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setForkProgress(3);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#171717]/15 hover:border-[#171717] text-[#171717] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Visual Replication Track */}
      <div className="p-6 bg-[#FAF6F0] rounded-xl border border-[#171717]/10 mb-6 overflow-x-auto">
        <div className="min-w-[550px]">
          {/* Leading Daughter Strand (Synthesized 5' -> 3') */}
          <div className="mb-2">
            <div className="text-[10px] font-mono font-bold text-[#FF572E] mb-1">
              Daughter Leading Strand (5' → 3' Continuous):
            </div>
            <div className="flex items-center gap-2">
              {TEMPLATE_BASES.map((base, idx) => {
                const isSynthesized = idx < forkProgress;
                const daughterBase = COMPLEMENTS[base];
                return (
                  <div
                    key={`lead-${idx}`}
                    className={`w-9 h-8 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${
                      isSynthesized ? getBaseColor(daughterBase) : 'border-dashed border-gray-300 opacity-20'
                    }`}
                  >
                    {isSynthesized ? daughterBase : '·'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parental Template Top Strand */}
          <div className="mb-4">
            <div className="text-[10px] font-mono text-[#171717]/60 mb-1">Parental Strand 1 (3' → 5'):</div>
            <div className="flex items-center gap-2">
              {TEMPLATE_BASES.map((base, idx) => (
                <div
                  key={`parent1-${idx}`}
                  className={`w-9 h-8 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${getBaseColor(
                    base
                  )}`}
                >
                  {base}
                </div>
              ))}
            </div>
          </div>

          {/* Helicase Unzipping Marker */}
          <div className="relative py-1 my-1">
            <div className="h-0.5 bg-gray-300 w-full" />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#FF572E] text-white text-[10px] font-mono font-bold rounded-full shadow-xs"
              style={{ left: `${(forkProgress / TEMPLATE_BASES.length) * 100}%` }}
            >
              Helicase Fork ({forkProgress}/{TEMPLATE_BASES.length} bp)
            </div>
          </div>

          {/* Parental Template Bottom Strand */}
          <div className="mt-4 mb-2">
            <div className="text-[10px] font-mono text-[#171717]/60 mb-1">Parental Strand 2 (5' → 3'):</div>
            <div className="flex items-center gap-2">
              {TEMPLATE_BASES.map((base, idx) => {
                const comp = COMPLEMENTS[base];
                return (
                  <div
                    key={`parent2-${idx}`}
                    className={`w-9 h-8 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${getBaseColor(
                      comp
                    )}`}
                  >
                    {comp}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lagging Daughter Strand (Okazaki Discontinuous) */}
          <div>
            <div className="text-[10px] font-mono font-bold text-blue-700 mb-1">
              Daughter Lagging Strand (Okazaki Fragments):
            </div>
            <div className="flex items-center gap-2">
              {TEMPLATE_BASES.map((base, idx) => {
                const isSynthesized = idx < Math.floor(forkProgress / 3) * 3;
                return (
                  <div
                    key={`lag-${idx}`}
                    className={`w-9 h-8 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${
                      isSynthesized ? getBaseColor(base) : 'border-dashed border-gray-300 opacity-20'
                    }`}
                  >
                    {isSynthesized ? base : '·'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Control Sliders & Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Replication Fork Position:</span>
            <span className="text-[#FF572E]">{forkProgress} / 12 Base Pairs</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={forkProgress}
            onChange={(e) => setForkProgress(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 flex items-center justify-between">
          <div>
            <div className="font-bold text-[#171717] mb-0.5">Chargaff's Base-Pair Rules:</div>
            <div className="text-[#171717]/70 text-[11px]">
              <span className="text-red-600 font-bold">A</span> pairs with{' '}
              <span className="text-blue-600 font-bold">T</span> (2 H-Bonds) ·{' '}
              <span className="text-emerald-600 font-bold">C</span> pairs with{' '}
              <span className="text-amber-600 font-bold">G</span> (3 H-Bonds)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
