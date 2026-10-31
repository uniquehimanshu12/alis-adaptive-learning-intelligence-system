import React, { useState } from 'react';
import { RotateCcw, ArrowDown, ArrowUp, Terminal, Layers } from 'lucide-react';

interface RecursionStackSimulatorProps {
  standalone?: boolean;
}

interface StackFrame {
  callNumber: number;
  n: number;
  status: 'active' | 'waiting' | 'base_case' | 'returned';
  expression: string;
  returnValue?: number;
}

export const RecursionStackSimulator: React.FC<RecursionStackSimulatorProps> = ({
  standalone = true,
}) => {
  const [targetN, setTargetN] = useState<number>(4);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Pre-generate execution trace for factorial(targetN)
  // Step 0: Initial call
  // Steps 1..N: Pushing stack frames
  // Step N+1: Base case reached
  // Steps N+2..2N+1: Unwinding and returning
  const generateTrace = (n: number) => {
    const trace: { frames: StackFrame[]; log: string }[] = [];

    // Initial state
    trace.push({
      frames: [],
      log: `Ready to call factorial(${n}). Base case is n <= 1 (returns 1).`,
    });

    const activeStack: StackFrame[] = [];

    // Winding phase (Pushing onto stack)
    for (let i = n; i >= 1; i--) {
      const isBase = i === 1;
      const frame: StackFrame = {
        callNumber: n - i + 1,
        n: i,
        status: isBase ? 'base_case' : 'waiting',
        expression: isBase ? `factorial(1) -> returns 1 [BASE CASE]` : `${i} * factorial(${i - 1})`,
      };
      activeStack.unshift(frame); // top of stack is at index 0
      trace.push({
        frames: JSON.parse(JSON.stringify(activeStack)),
        log: isBase
          ? `Base Case reached: factorial(1) terminates recursion and returns 1 immediately!`
          : `PUSH Call #${n - i + 1}: factorial(${i}) suspended, waiting for factorial(${i - 1}).`,
      });
    }

    // Unwinding phase (Popping from stack)
    let currentVal = 1;
    for (let i = 1; i <= n; i++) {
      if (i > 1) {
        currentVal = i * currentVal;
      }
      const updated = activeStack.map((f) => {
        if (f.n === i) {
          return { ...f, status: 'returned' as const, returnValue: currentVal };
        }
        return f;
      });

      trace.push({
        frames: JSON.parse(JSON.stringify(updated)),
        log:
          i === 1
            ? `POP: Base case returns 1 to caller factorial(2).`
            : `POP: factorial(${i}) computes ${i} * ${currentVal / i} = ${currentVal} and unwinds.`,
      });
    }

    // Final answer state
    trace.push({
      frames: [],
      log: `Execution Complete: factorial(${n}) = ${currentVal}. Call stack completely unwound!`,
    });

    return trace;
  };

  const trace = generateTrace(targetN);
  const safeStep = Math.min(currentStep, trace.length - 1);
  const currentSnapshot = trace[safeStep];

  const handleStepForward = () => {
    if (currentStep < trace.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className={`p-6 bg-[#FFFCF6] rounded-2xl border border-[#171717]/15 ${standalone ? 'shadow-sm' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#06B6D4] uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Computer Science & Algorithmic Runtime</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#171717]">
            Recursion Call Stack & Base Case Execution Visualizer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#171717]/15 hover:border-[#171717] text-[#171717] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Execution Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Call Stack Tower (Left 7 Cols) */}
        <div className="lg:col-span-7 p-5 bg-[#FAF6F0] rounded-xl border border-[#171717]/10">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#171717] mb-3 pb-2 border-b border-[#171717]/10">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#06B6D4]" />
              Active System Call Stack (LIFO: Last In, First Out)
            </span>
            <span className="text-[10px] text-[#171717]/50">Top of Stack ↑</span>
          </div>

          {currentSnapshot.frames.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs font-mono text-[#171717]/40 border-2 border-dashed border-[#171717]/15 rounded-lg">
              Stack is currently empty. Click "Step Forward" to push activation frames.
            </div>
          ) : (
            <div className="space-y-2 min-h-48 flex flex-col justify-end">
              {currentSnapshot.frames.map((frame, idx) => {
                const isTop = idx === 0;
                let bg = 'bg-[#FFFCF6] border-[#171717]/20 text-[#171717]';
                if (frame.status === 'base_case') {
                  bg = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                } else if (frame.status === 'returned') {
                  bg = 'bg-cyan-50 border-cyan-500 text-cyan-950';
                }

                return (
                  <div
                    key={frame.n}
                    className={`p-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between shadow-2xs ${bg}`}
                  >
                    <div>
                      <span className="font-bold text-[#06B6D4] mr-2">
                        [Frame #{frame.callNumber}]
                      </span>
                      <span>factorial({frame.n})</span>
                      <span className="text-[11px] opacity-70 ml-2">({frame.expression})</span>
                    </div>

                    <div className="text-right">
                      {frame.returnValue !== undefined ? (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                          Returns {frame.returnValue}
                        </span>
                      ) : isTop && frame.status === 'base_case' ? (
                        <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold">
                          Base Case
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#171717]/50">Waiting</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Code & Step Trace (Right 5 Cols) */}
        <div className="lg:col-span-5 p-5 bg-[#171717] text-white rounded-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#06B6D4] font-bold mb-2">
              Python Algorithm:
            </div>
            <pre className="text-xs font-mono text-[#C8F169] bg-black/40 p-3 rounded-lg leading-relaxed mb-4">
              {`def factorial(n):
    if n <= 1:
        return 1   # Base Case
    return n * factorial(n - 1)`}
            </pre>

            <div className="text-[10px] font-mono uppercase text-[#FF572E] font-bold mb-1">
              Execution Log:
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-xs font-mono text-white/90 leading-relaxed min-h-16">
              {currentSnapshot.log}
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-4">
            <button
              onClick={handleStepBack}
              disabled={safeStep === 0}
              className="flex-1 py-2 px-3 rounded-lg border border-white/20 text-xs font-mono disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              ← Step Back
            </button>
            <span className="text-xs font-mono text-white/60">
              {safeStep + 1} / {trace.length}
            </span>
            <button
              onClick={handleStepForward}
              disabled={safeStep >= trace.length - 1}
              className="flex-1 py-2 px-3 rounded-lg bg-[#FF572E] text-white text-xs font-mono font-bold disabled:opacity-30 hover:bg-[#e0451e] transition-colors"
            >
              Step Forward →
            </button>
          </div>
        </div>
      </div>

      {/* Target N Selector */}
      <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="font-bold text-[#171717]">Select Input N to Trace:</div>
        <div className="flex items-center gap-2">
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => {
                setTargetN(num);
                setCurrentStep(0);
              }}
              className={`px-3 py-1 rounded-md border font-bold transition-all ${
                targetN === num
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-[#FFFCF6] text-[#171717] border-[#171717]/15 hover:border-[#171717]'
              }`}
            >
              n = {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
