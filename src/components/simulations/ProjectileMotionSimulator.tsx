import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Play, Pause, Target } from 'lucide-react';

interface ProjectileMotionSimulatorProps {
  initialAngle?: number;
  initialSpeed?: number;
  standalone?: boolean;
}

export const ProjectileMotionSimulator: React.FC<ProjectileMotionSimulatorProps> = ({
  initialAngle = 45,
  initialSpeed = 25,
  standalone = true,
}) => {
  const [angleDeg, setAngleDeg] = useState<number>(initialAngle);
  const [v0, setV0] = useState<number>(initialSpeed);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animTime, setAnimTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const g = 9.8;
  const angleRad = (angleDeg * Math.PI) / 180;
  const v0x = v0 * Math.cos(angleRad);
  const v0y = v0 * Math.sin(angleRad);

  const totalTime = (2 * v0y) / g;
  const maxHeight = (v0y * v0y) / (2 * g);
  const maxRange = (v0 * v0 * Math.sin(2 * angleRad)) / g;

  // Animation loop
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setAnimTime((prev) => {
        const next = prev + 0.05;
        if (next >= totalTime) {
          setIsSimulating(false);
          return totalTime;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isSimulating, totalTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const paddingLeft = 50;
    const paddingBottom = 40;
    const groundY = h - paddingBottom;
    const maxWorldX = 80; // meters
    const maxWorldY = 40; // meters

    const toPxX = (x: number) => paddingLeft + (x / maxWorldX) * (w - paddingLeft - 30);
    const toPxY = (y: number) => groundY - (y / maxWorldY) * (groundY - 30);

    // Grid
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= maxWorldX; x += 10) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), 20);
      ctx.lineTo(toPxX(x), groundY);
      ctx.stroke();
    }
    for (let y = 0; y <= maxWorldY; y += 10) {
      ctx.beginPath();
      ctx.moveTo(paddingLeft, toPxY(y));
      ctx.lineTo(w - 20, toPxY(y));
      ctx.stroke();
    }

    // Ground line
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, groundY);
    ctx.lineTo(w - 20, groundY);
    ctx.stroke();

    // Axis numbers
    ctx.fillStyle = '#171717';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let x = 0; x <= maxWorldX; x += 20) {
      ctx.fillText(`${x}m`, toPxX(x), groundY + 16);
    }
    ctx.textAlign = 'right';
    for (let y = 10; y <= maxWorldY; y += 10) {
      ctx.fillText(`${y}m`, paddingLeft - 8, toPxY(y) + 4);
    }

    // Full theoretical parabolic trajectory (dashed grey)
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let started = false;
    for (let t = 0; t <= totalTime; t += 0.05) {
      const x = v0x * t;
      const y = v0y * t - 0.5 * g * t * t;
      if (!started) {
        ctx.moveTo(toPxX(x), toPxY(y));
        started = true;
      } else {
        ctx.lineTo(toPxX(x), toPxY(y));
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated trace trajectory up to animTime
    const currentT = isSimulating ? animTime : totalTime;
    ctx.strokeStyle = '#FF572E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    started = false;
    for (let t = 0; t <= currentT; t += 0.03) {
      const x = v0x * t;
      const y = Math.max(v0y * t - 0.5 * g * t * t, 0);
      if (!started) {
        ctx.moveTo(toPxX(x), toPxY(y));
        started = true;
      } else {
        ctx.lineTo(toPxX(x), toPxY(y));
      }
    }
    ctx.stroke();

    // Current projectile sphere
    const curX = v0x * currentT;
    const curY = Math.max(v0y * currentT - 0.5 * g * currentT * currentT, 0);
    const px = toPxX(curX);
    const py = toPxY(curY);

    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#FF572E';
    ctx.fill();
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Peak height indicator
    const peakX = toPxX(maxRange / 2);
    const peakY = toPxY(maxHeight);
    ctx.beginPath();
    ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();
  }, [angleDeg, v0, isSimulating, animTime, totalTime, maxHeight, maxRange, v0x, v0y]);

  return (
    <div className={`p-6 bg-[#FFFCF6] rounded-2xl border border-[#171717]/15 ${standalone ? 'shadow-sm' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF572E] uppercase">
            <Target className="w-3.5 h-3.5" />
            <span>Kinematics & Two-Dimensional Trajectory</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#171717]">
            Parabolic Projectile Motion Simulator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAnimTime(0);
              setIsSimulating(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] text-white text-xs font-mono font-bold rounded-lg hover:bg-[#FF572E] transition-colors"
          >
            {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isSimulating ? 'Animating...' : 'Fire Projectile'}</span>
          </button>
          <button
            onClick={() => {
              setIsSimulating(false);
              setAnimTime(0);
              setAngleDeg(45);
              setV0(25);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#171717]/15 hover:border-[#171717] text-[#171717] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full bg-[#FAF6F0] rounded-xl border border-[#171717]/10 overflow-hidden mb-6 relative">
        <canvas ref={canvasRef} width={640} height={250} className="w-full h-auto block" />

        {/* Live Metrics Overlay */}
        <div className="absolute top-3 right-3 bg-[#FFFCF6]/95 backdrop-blur-xs p-3 rounded-xl border border-[#171717]/15 text-xs font-mono shadow-2xs text-right">
          <div className="text-[#FF572E] font-black text-sm">
            Range R = {maxRange.toFixed(1)} m
          </div>
          <div className="text-emerald-700 font-bold text-xs">
            Max Height H = {maxHeight.toFixed(1)} m
          </div>
          <div className="text-[#171717]/70 text-[11px]">
            Flight Time t = {totalTime.toFixed(2)} s
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Launch Angle θ:</span>
            <span className="text-[#FF572E] font-bold">{angleDeg}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={85}
            step={1}
            value={angleDeg}
            onChange={(e) => {
              setAngleDeg(Number(e.target.value));
              setAnimTime(0);
            }}
            className="w-full accent-[#FF572E]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>15° (Flat)</span>
            <span className="font-bold text-[#FF572E]">45° (Max Range)</span>
            <span>85° (Vertical)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Initial Velocity v₀:</span>
            <span className="text-blue-700 font-bold">{v0} m/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={35}
            step={1}
            value={v0}
            onChange={(e) => {
              setV0(Number(e.target.value));
              setAnimTime(0);
            }}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>10 m/s</span>
            <span>35 m/s (Fast)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
