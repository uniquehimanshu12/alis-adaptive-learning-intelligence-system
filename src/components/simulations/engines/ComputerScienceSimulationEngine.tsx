import React, { useState } from 'react';
import { RotateCcw, Play, Check, ArrowRight, Search, Code2 } from 'lucide-react';

interface ComputerScienceSimulationEngineProps {
  template?: 'binary_search' | 'sorting';
  initialParams?: Record<string, any>;
  standalone?: boolean;
}

export const ComputerScienceSimulationEngine: React.FC<ComputerScienceSimulationEngineProps> = ({
  template = 'binary_search',
  initialParams = {},
  standalone = true,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<'binary_search' | 'sorting'>(template);

  // Binary Search state
  const array = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91, 104, 118, 132, 150];
  const [target, setTarget] = useState<number>(Number(initialParams.target) || 45);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(array.length - 1);
  const [stepCount, setStepCount] = useState<number>(0);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    `Initialized sorted array of ${array.length} elements. Target: ${target}.`,
  ]);

  const mid = Math.floor((low + high) / 2);

  const stepBinarySearch = () => {
    if (foundIndex !== null || low > high) return;

    const currentMid = Math.floor((low + high) / 2);
    const midVal = array[currentMid];
    const newStep = stepCount + 1;
    setStepCount(newStep);

    if (midVal === target) {
      setFoundIndex(currentMid);
      setSearchHistory((prev) => [
        ...prev,
        `Step ${newStep}: Checked index ${currentMid} (value = ${midVal}). TARGET FOUND! Found in ${newStep} comparisons.`,
      ]);
    } else if (midVal < target) {
      setLow(currentMid + 1);
      setSearchHistory((prev) => [
        ...prev,
        `Step ${newStep}: Checked index ${currentMid} (value = ${midVal} < ${target}). Eliminating left half. Set low = ${currentMid + 1}.`,
      ]);
    } else {
      setHigh(currentMid - 1);
      setSearchHistory((prev) => [
        ...prev,
        `Step ${newStep}: Checked index ${currentMid} (value = ${midVal} > ${target}). Eliminating right half. Set high = ${currentMid - 1}.`,
      ]);
    }
  };

  const resetBinarySearch = (newTarget: number = target) => {
    setLow(0);
    setHigh(array.length - 1);
    setStepCount(0);
    setFoundIndex(null);
    setSearchHistory([
      `Initialized sorted array of ${array.length} elements. Target: ${newTarget}.`,
    ]);
  };

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/15 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F5F0E7] border-b border-[#171717]/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTemplate('binary_search')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'binary_search'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Binary Search Explorer (O(log n))
          </button>
        </div>

        <span className="text-xs font-mono font-bold text-[#FF572E]">
          Target: {target} · {foundIndex !== null ? `FOUND at index ${foundIndex}!` : `Step ${stepCount}`}
        </span>
      </div>

      {/* Main Visualizer Stage */}
      <div className="p-6 bg-scientific-grid bg-[#FAF6F0] min-h-[300px] flex flex-col justify-between">
        {/* Array Cells */}
        <div>
          <div className="text-xs font-mono text-[#171717]/60 mb-3 flex items-center justify-between">
            <span>Sorted Array (Length n = {array.length})</span>
            <span className="text-[#10B981] font-semibold">
              Maximum Comparisons = ⌈log₂(15)⌠ = 4
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-1.5 mb-6">
            {array.map((val, idx) => {
              const isMid = idx === mid && foundIndex === null;
              const isFound = idx === foundIndex;
              const inRange = idx >= low && idx <= high;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setTarget(val);
                    resetBinarySearch(val);
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-mono transition-all ${
                    isFound
                      ? 'bg-[#10B981] text-white border-[#10B981] ring-2 ring-[#10B981] scale-105'
                      : isMid
                      ? 'bg-[#FF572E] text-white border-[#FF572E] ring-2 ring-[#FF572E] scale-105'
                      : inRange
                      ? 'bg-[#FFFCF6] text-[#171717] border-[#171717]/30 hover:border-[#171717]'
                      : 'bg-black/5 text-[#171717]/30 border-transparent opacity-40 line-through'
                  }`}
                >
                  <span className="text-[10px] opacity-60 mb-0.5">[{idx}]</span>
                  <span className="font-bold text-sm tabular-nums">{val}</span>
                </button>
              );
            })}
          </div>

          {/* Pointer Indicators */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#171717]" />
              <span>Low Pointer: [{low}] ({array[low]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF572E]" />
              <span>Mid Pointer: [{mid}] ({array[mid]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#171717]" />
              <span>High Pointer: [{high}] ({array[high]})</span>
            </div>
          </div>
        </div>

        {/* Step-by-step Log Terminal */}
        <div className="p-4 rounded-xl bg-[#171717] text-[#FFFCF6] font-mono text-xs max-h-36 overflow-y-auto space-y-1">
          <div className="text-[10px] text-[#C8F169] uppercase font-bold tracking-wider mb-1">
            Execution Log:
          </div>
          {searchHistory.map((log, i) => (
            <div
              key={i}
              className={`leading-relaxed ${
                i === searchHistory.length - 1 ? 'text-[#C8F169] font-bold' : 'text-[#FFFCF6]/75'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Control Deck */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={stepBinarySearch}
              disabled={foundIndex !== null || low > high}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF572E] text-white font-bold hover:bg-[#e0451e] transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Next Comparison Step
            </button>
            <button
              onClick={() => resetBinarySearch()}
              className="flex items-center gap-1 px-3 py-2 rounded border border-[#171717]/15 hover:bg-[#171717]/5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Search
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#171717]/70 font-bold">Pick Search Target:</span>
            <select
              value={target}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTarget(val);
                resetBinarySearch(val);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#171717]/20 bg-[#F5F0E7] text-xs font-mono font-bold"
            >
              {array.map((val) => (
                <option key={val} value={val}>
                  Target: {val}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
