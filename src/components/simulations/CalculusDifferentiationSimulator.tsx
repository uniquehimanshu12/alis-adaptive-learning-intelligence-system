import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, FunctionSquare, Compass } from 'lucide-react';

interface CalculusDifferentiationSimulatorProps {
  initialFunc?: 'sin_x2' | 'x2_sin' | 'x3';
  initialX?: number;
  initialDeltaX?: number;
  standalone?: boolean;
}

export const CalculusDifferentiationSimulator: React.FC<CalculusDifferentiationSimulatorProps> = ({
  initialFunc = 'sin_x2',
  initialX = 1.0,
  initialDeltaX = 0.5,
  standalone = true,
}) => {
  const [selectedFunc, setSelectedFunc] = useState<'sin_x2' | 'x2_sin' | 'x3'>(initialFunc);
  const [xVal, setXVal] = useState<number>(initialX);
  const [deltaX, setDeltaX] = useState<number>(initialDeltaX);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mathematical definitions
  const evalFunc = (x: number) => {
    switch (selectedFunc) {
      case 'sin_x2':
        return Math.sin(x * x);
      case 'x2_sin':
        return x * x * Math.sin(x);
      case 'x3':
        return 0.25 * (x * x * x - 3 * x);
      default:
        return Math.sin(x * x);
    }
  };

  const evalExactDerivative = (x: number) => {
    switch (selectedFunc) {
      case 'sin_x2':
        // d/dx [sin(x^2)] = 2x cos(x^2)
        return 2 * x * Math.cos(x * x);
      case 'x2_sin':
        // d/dx [x^2 sin(x)] = 2x sin(x) + x^2 cos(x)
        return 2 * x * Math.sin(x) + x * x * Math.cos(x);
      case 'x3':
        return 0.25 * (3 * x * x - 3);
      default:
        return 2 * x * Math.cos(x * x);
    }
  };

  const yVal = evalFunc(xVal);
  const yValDelta = evalFunc(xVal + deltaX);
  const secantSlope = (yValDelta - yVal) / deltaX;
  const exactTangentSlope = evalExactDerivative(xVal);
  const slopeError = Math.abs(secantSlope - exactTangentSlope);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const originX = w / 2;
    const originY = h / 2;
    const scaleX = 70; // pixels per unit
    const scaleY = 70;

    // Grid
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.06)';
    ctx.lineWidth = 1;
    for (let x = originX % scaleX; x < w; x += scaleX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = originY % scaleY; y < h; y += scaleY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(w, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, h);
    ctx.stroke();

    // Draw Function Curve
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < w; px += 2) {
      const mathX = (px - originX) / scaleX;
      const mathY = evalFunc(mathX);
      const py = originY - mathY * scaleY;

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Coordinates of Point A (x, f(x)) and Point B (x+Δx, f(x+Δx))
    const pxA = originX + xVal * scaleX;
    const pyA = originY - yVal * scaleY;
    const pxB = originX + (xVal + deltaX) * scaleX;
    const pyB = originY - yValDelta * scaleY;

    // Secant Line (Blue dashed)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    const secantExt = 2.0;
    const pxS1 = pxA - secantExt * scaleX;
    const pyS1 = pyA + secantExt * secantSlope * scaleY;
    const pxS2 = pxB + secantExt * scaleX;
    const pyS2 = pyB - secantExt * secantSlope * scaleY;

    ctx.beginPath();
    ctx.moveTo(pxS1, pyS1);
    ctx.lineTo(pxS2, pyS2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tangent Line (Coral red solid)
    ctx.strokeStyle = '#FF572E';
    ctx.lineWidth = 2.5;
    const tanExt = 1.8;
    const pxT1 = pxA - tanExt * scaleX;
    const pyT1 = pyA + tanExt * exactTangentSlope * scaleY;
    const pxT2 = pxA + tanExt * scaleX;
    const pyT2 = pyA - tanExt * exactTangentSlope * scaleY;

    ctx.beginPath();
    ctx.moveTo(pxT1, pyT1);
    ctx.lineTo(pxT2, pyT2);
    ctx.stroke();

    // Draw Point A (x, f(x))
    ctx.beginPath();
    ctx.arc(pxA, pyA, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FF572E';
    ctx.fill();
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Point B (x+Δx, f(x+Δx))
    ctx.beginPath();
    ctx.arc(pxB, pyB, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.stroke();

    // Labels on canvas
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FF572E';
    ctx.textAlign = 'left';
    ctx.fillText(`P(x, f(x))`, pxA + 8, pyA - 8);

    ctx.fillStyle = '#3B82F6';
    ctx.fillText(`Q(x+Δx, f(x+Δx))`, pxB + 8, pyB - 8);
  }, [selectedFunc, xVal, deltaX, yVal, yValDelta, secantSlope, exactTangentSlope]);

  return (
    <div className={`p-6 bg-[#FFFCF6] rounded-2xl border border-[#171717]/15 ${standalone ? 'shadow-sm' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8B5CF6] uppercase">
            <FunctionSquare className="w-3.5 h-3.5" />
            <span>Differential Calculus & Derivative Definition</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#171717]">
            Secant-to-Tangent Derivative Limit Visualizer
          </h3>
        </div>

        {/* Function Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F0E7] rounded-xl text-xs font-mono">
          <button
            onClick={() => setSelectedFunc('sin_x2')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              selectedFunc === 'sin_x2' ? 'bg-[#171717] text-white' : 'text-[#171717]/70'
            }`}
          >
            sin(x²)
          </button>
          <button
            onClick={() => setSelectedFunc('x2_sin')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              selectedFunc === 'x2_sin' ? 'bg-[#171717] text-white' : 'text-[#171717]/70'
            }`}
          >
            x² sin(x)
          </button>
          <button
            onClick={() => setSelectedFunc('x3')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              selectedFunc === 'x3' ? 'bg-[#171717] text-white' : 'text-[#171717]/70'
            }`}
          >
            Polynomial
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full bg-[#FAF6F0] rounded-xl border border-[#171717]/10 overflow-hidden mb-6 relative">
        <canvas ref={canvasRef} width={640} height={260} className="w-full h-auto block" />

        {/* Live Mathematical Readout */}
        <div className="absolute top-3 left-3 bg-[#FFFCF6]/95 backdrop-blur-xs p-3 rounded-xl border border-[#171717]/15 text-xs font-mono shadow-2xs">
          <div className="text-[10px] text-[#171717]/50 uppercase font-bold mb-1">
            Slope Convergence Limit
          </div>
          <div className="text-blue-700 font-bold mb-0.5">
            Secant Slope: Δy / Δx = {secantSlope.toFixed(3)}
          </div>
          <div className="text-[#FF572E] font-bold">
            Tangent Slope: f'(x) = {exactTangentSlope.toFixed(3)}
          </div>
          <div className="text-[11px] text-[#171717]/60 mt-1">
            Difference: {slopeError.toFixed(4)} (→ 0 as Δx → 0)
          </div>
        </div>

        <div className="absolute bottom-3 right-3 bg-[#171717] text-white p-2.5 rounded-lg text-xs font-mono">
          <span>Formula: </span>
          <span className="text-[#C8F169] font-bold">
            {selectedFunc === 'sin_x2'
              ? "d/dx [sin(x²)] = 2x cos(x²)"
              : selectedFunc === 'x2_sin'
              ? "d/dx [x² sin(x)] = 2x sin(x) + x² cos(x)"
              : "d/dx [0.25(x³-3x)] = 0.75(x²-1)"}
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        {/* Point x */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Evaluation Point x:</span>
            <span className="text-[#FF572E] font-bold">{xVal.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={-2.0}
            max={2.0}
            step={0.05}
            value={xVal}
            onChange={(e) => setXVal(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>x = -2.0</span>
            <span>x = 0</span>
            <span>x = +2.0</span>
          </div>
        </div>

        {/* Secant step deltaX */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Secant Interval Δx (Limit Approach):</span>
            <span className="text-blue-700 font-bold">{deltaX.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={0.01}
            max={1.5}
            step={0.01}
            value={deltaX}
            onChange={(e) => setDeltaX(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>Δx → 0 (Infinitesimal)</span>
            <span>Δx = 1.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
