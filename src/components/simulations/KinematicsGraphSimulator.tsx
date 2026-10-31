import React, { useEffect, useRef, useState } from 'react';
import { Activity, Sliders, RotateCcw } from 'lucide-react';

interface KinematicsGraphSimulatorProps {
  standalone?: boolean;
  initialType?: 'distance' | 'velocity' | 'acceleration';
}

export const KinematicsGraphSimulator: React.FC<KinematicsGraphSimulatorProps> = ({
  standalone = true,
  initialType = 'velocity',
}) => {
  const [graphType, setGraphType] = useState<'distance' | 'velocity' | 'acceleration'>(initialType);
  const [initialVelocity, setInitialVelocity] = useState<number>(10); // m/s
  const [acceleration, setAcceleration] = useState<number>(2); // m/s^2
  const [timeSpan, setTimeSpan] = useState<number>(10); // seconds
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const padding = 55;
    const graphW = w - padding * 2;
    const graphH = h - padding * 2;

    // Draw grid background
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.08)';
    ctx.lineWidth = 1;
    for (let x = padding; x <= w - padding; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, h - padding);
      ctx.stroke();
    }
    for (let y = padding; y <= h - padding; y += 35) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding); // X axis (Time)
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding); // Y axis
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time t (seconds)', w / 2, h - 15);

    ctx.save();
    ctx.translate(18, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    const yLabel =
      graphType === 'distance'
        ? 'Displacement s (meters)'
        : graphType === 'velocity'
        ? 'Velocity v (m/s)'
        : 'Acceleration a (m/s²)';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Plotting curve
    ctx.strokeStyle = '#FF572E';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const pointsCount = 100;
    let maxY = 10;

    if (graphType === 'distance') {
      // s(t) = ut + 0.5 a t^2
      maxY = Math.max(50, initialVelocity * timeSpan + 0.5 * acceleration * timeSpan * timeSpan);
    } else if (graphType === 'velocity') {
      // v(t) = u + at
      maxY = Math.max(20, initialVelocity + acceleration * timeSpan);
    } else {
      // a(t) = constant = acceleration
      maxY = Math.max(10, Math.abs(acceleration) * 2);
    }

    for (let i = 0; i <= pointsCount; i++) {
      const t = (i / pointsCount) * timeSpan;
      let val = 0;
      if (graphType === 'distance') {
        val = initialVelocity * t + 0.5 * acceleration * t * t;
      } else if (graphType === 'velocity') {
        val = initialVelocity + acceleration * t;
      } else {
        val = acceleration;
      }

      const px = padding + (t / timeSpan) * graphW;
      const py = (h - padding) - (Math.max(0, val) / maxY) * graphH;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Ticks & values
    ctx.fillStyle = 'rgba(23, 23, 23, 0.6)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= timeSpan; t += Math.max(1, Math.round(timeSpan / 5))) {
      const px = padding + (t / timeSpan) * graphW;
      ctx.fillText(`${t}s`, px, h - padding + 16);
    }

    ctx.textAlign = 'right';
    for (let step = 0; step <= 4; step++) {
      const vVal = (maxY / 4) * step;
      const py = (h - padding) - (step / 4) * graphH;
      ctx.fillText(vVal.toFixed(0), padding - 8, py + 4);
    }
  }, [graphType, initialVelocity, acceleration, timeSpan]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-[#F5F0E7] border-b border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FF572E]" />
          <span className="font-display font-bold text-sm text-[#171717]">
            Class X Motion: Kinematics Graph Analyzer
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(['distance', 'velocity', 'acceleration'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setGraphType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                graphType === type
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white text-[#171717]/70 hover:bg-[#171717]/10 border border-[#171717]/10'
              }`}
            >
              {type}-Time Graph
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />
      </div>

      <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Initial Velocity u: {initialVelocity} m/s
          </label>
          <input
            type="range"
            min={0}
            max={25}
            step={1}
            value={initialVelocity}
            onChange={(e) => setInitialVelocity(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Acceleration a: {acceleration} m/s²
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.5}
            value={acceleration}
            onChange={(e) => setAcceleration(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Time Duration: {timeSpan} s
          </label>
          <input
            type="range"
            min={5}
            max={20}
            step={1}
            value={timeSpan}
            onChange={(e) => setTimeSpan(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
        </div>
      </div>
    </div>
  );
};
