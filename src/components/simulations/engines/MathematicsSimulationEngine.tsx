import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, FunctionSquare, Sparkles } from 'lucide-react';

interface MathematicsSimulationEngineProps {
  template?: 'quadratic' | 'trig';
  initialParams?: Record<string, any>;
  standalone?: boolean;
}

export const MathematicsSimulationEngine: React.FC<MathematicsSimulationEngineProps> = ({
  template = 'quadratic',
  initialParams = {},
  standalone = true,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<'quadratic' | 'trig'>(template);

  // Quadratic parameters: y = a x^2 + b x + c
  const [a, setA] = useState<number>(Number(initialParams.a) || 1);
  const [b, setB] = useState<number>(Number(initialParams.b) || -2);
  const [c, setC] = useState<number>(Number(initialParams.c) || -3);

  // Trig parameters: y = A sin(ω x + φ)
  const [amplitude, setAmplitude] = useState<number>(Number(initialParams.amplitude) || 2);
  const [freq, setFreq] = useState<number>(Number(initialParams.freq) || 1);
  const [phase, setPhase] = useState<number>(Number(initialParams.phase) || 0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quadratic calculations
  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);
  let root1: number | null = null;
  let root2: number | null = null;
  if (discriminant >= 0 && a !== 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  }

  // Render graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const scale = 25; // pixels per unit

    // Grid lines
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.08)';
    ctx.lineWidth = 1;

    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis tick numbers
    ctx.fillStyle = 'rgba(23, 23, 23, 0.5)';
    ctx.font = '10px "JetBrains Mono", monospace';
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        ctx.fillText(`${i}`, originX + i * scale - 6, originY + 14);
        ctx.fillText(`${-i}`, originX + 6, originY + i * scale + 4);
      }
    }

    if (activeTemplate === 'quadratic') {
      // Plot y = ax^2 + bx + c
      ctx.strokeStyle = '#FF572E';
      ctx.lineWidth = 3;
      ctx.beginPath();

      let started = false;
      for (let px = 0; px < width; px += 2) {
        const x = (px - originX) / scale;
        const y = a * x * x + b * x + c;
        const py = originY - y * scale;

        if (py >= -100 && py <= height + 100) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();

      // Draw Vertex Point
      const pVertexX = originX + vertexX * scale;
      const pVertexY = originY - vertexY * scale;
      if (pVertexX >= 0 && pVertexX <= width && pVertexY >= 0 && pVertexY <= height) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(pVertexX, pVertexY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFCF6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#171717';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText(`Vertex (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`, pVertexX + 10, pVertexY - 8);
      }

      // Draw Roots (X-intercepts)
      if (root1 !== null && root2 !== null) {
        const pr1 = originX + root1 * scale;
        const pr2 = originX + root2 * scale;

        ctx.fillStyle = '#171717';
        [pr1, pr2].forEach((pr, idx) => {
          ctx.beginPath();
          ctx.arc(pr, originY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          const val = idx === 0 ? root1! : root2!;
          ctx.fillText(`x = ${val.toFixed(2)}`, pr - 14, originY + 22);
        });
      }
    } else {
      // Plot y = A sin(ω x + φ)
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();

      let started = false;
      for (let px = 0; px < width; px += 2) {
        const x = (px - originX) / scale;
        const y = amplitude * Math.sin(freq * x + phase);
        const py = originY - y * scale;

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
  }, [activeTemplate, a, b, c, amplitude, freq, phase, vertexX, vertexY, root1, root2]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/15 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F5F0E7] border-b border-[#171717]/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTemplate('quadratic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'quadratic'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Quadratic Graph (y = ax² + bx + c)
          </button>
          <button
            onClick={() => setActiveTemplate('trig')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'trig'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Trigonometric Wave (y = A·sin(ωx))
          </button>
        </div>

        <span className="text-xs font-mono font-bold text-[#FF572E]">
          {activeTemplate === 'quadratic'
            ? `y = ${a !== 0 ? `${a}x²` : ''} ${b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`} ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`
            : `y = ${amplitude} · sin(${freq}x + ${phase.toFixed(2)})`}
        </span>
      </div>

      {/* Main Canvas Stage */}
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        {/* Telemetry Box */}
        <div className="absolute top-3 right-3 bg-[#FFFCF6]/95 border border-[#171717]/15 rounded-xl p-3 text-xs font-mono shadow-xs pointer-events-none min-w-[180px]">
          {activeTemplate === 'quadratic' ? (
            <>
              <div className="text-[10px] uppercase text-[#171717]/60 mb-1 font-bold">
                Analytical Roots & Vertex:
              </div>
              <div className="text-[#171717] font-semibold">
                Discriminant Δ: <span className="tabular-nums font-bold text-[#FF572E]">{discriminant.toFixed(1)}</span>
              </div>
              <div className="text-[11px] text-[#171717]/80 mt-1">
                {discriminant > 0
                  ? '2 Distinct Real Roots'
                  : discriminant === 0
                  ? '1 Repeated Real Root'
                  : 'No Real Roots (Complex)'}
              </div>
              {discriminant >= 0 && root1 !== null && (
                <div className="text-[11px] text-[#10B981] font-semibold mt-1">
                  x₁ = {root1.toFixed(2)}, x₂ = {root2?.toFixed(2)}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-[10px] uppercase text-[#171717]/60 mb-1 font-bold">Wave Parameters:</div>
              <div className="text-[#171717]">
                Amplitude A: <span className="font-bold text-[#10B981]">{amplitude}</span>
              </div>
              <div className="text-[#171717]">
                Wavelength λ: <span className="font-bold">{(2 * Math.PI / Math.max(0.1, freq)).toFixed(2)} units</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control Sliders */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          {activeTemplate === 'quadratic' ? (
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">a:</span>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.2"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-24 accent-[#FF572E]"
                />
                <span className="tabular-nums w-8">{a}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">b:</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-24 accent-[#FF572E]"
                />
                <span className="tabular-nums w-8">{b}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">c:</span>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-24 accent-[#FF572E]"
                />
                <span className="tabular-nums w-8">{c}</span>
              </div>

              <button
                onClick={() => {
                  setA(1);
                  setB(-2);
                  setC(-3);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#171717]/15 hover:bg-[#171717]/5"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Amplitude (A):</span>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.25"
                  value={amplitude}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                  className="w-24 accent-[#10B981]"
                />
                <span className="tabular-nums w-8">{amplitude}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Frequency (ω):</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.25"
                  value={freq}
                  onChange={(e) => setFreq(Number(e.target.value))}
                  className="w-24 accent-[#10B981]"
                />
                <span className="tabular-nums w-8">{freq}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
