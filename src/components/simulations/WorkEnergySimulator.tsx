import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Compass } from 'lucide-react';

interface WorkEnergySimulatorProps {
  standalone?: boolean;
  initialForceAngle?: number;
  initialDisplacement?: number;
}

export const WorkEnergySimulator: React.FC<WorkEnergySimulatorProps> = ({
  standalone = true,
  initialForceAngle = 90,
  initialDisplacement = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mode: 'rollercoaster' (energy conservation) vs 'work_dot_product' (W = F * d * cos θ)
  const [activeTab, setActiveTab] = useState<'rollercoaster' | 'work_dot_product'>('rollercoaster');

  // Coaster state
  const [isPlaying, setIsPlaying] = useState(true);
  const [mass, setMass] = useState(50); // kg
  const [gravity, setGravity] = useState(9.8);
  const [friction, setFriction] = useState(0.02);

  // Work dot product state
  const [forceAngle, setForceAngle] = useState(initialForceAngle);
  const [forceMag, setForceMag] = useState(250); // N
  const [displacement, setDisplacement] = useState(initialDisplacement); // m

  // Coaster kinematic state
  const coasterRef = useRef({
    s: 0.1, // parametric progress [0..1]
    v: 0,
    pe: 0,
    ke: 0,
    thermal: 0,
  });

  // Track height equation: y(x) = baseline - amplitude * (sin(2π x / L) + ...)
  const getTrackPoint = (s: number, width: number, height: number) => {
    const x = s * width;
    // Two hills and a valley
    const normalizedY =
      0.35 * Math.sin(s * Math.PI * 3.2 - Math.PI / 2) +
      0.15 * Math.cos(s * Math.PI * 2.0);
    const y = height * 0.52 - normalizedY * (height * 0.42);
    // Derivative for tangent slope
    const ds = 0.001;
    const nextY =
      0.35 * Math.sin((s + ds) * Math.PI * 3.2 - Math.PI / 2) +
      0.15 * Math.cos((s + ds) * Math.PI * 2.0);
    const nextYPixel = height * 0.52 - nextY * (height * 0.42);
    const slope = (nextYPixel - y) / (ds * width);
    const angle = Math.atan(slope);

    return { x, y, angle, heightFromGround: (height - y) / 10 };
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeTab === 'rollercoaster') {
        const c = coasterRef.current;
        const w = canvas.width;
        const h = canvas.height;

        if (isPlaying) {
          const pt = getTrackPoint(c.s, w, h);
          // Gravity acceleration along slope: a = g * sin(angle) - friction * g * cos(angle)
          const gComponent = gravity * Math.sin(pt.angle) * 0.00035;
          const frictionLoss = friction * Math.abs(c.v) * 0.02;

          c.v += gComponent - Math.sign(c.v) * frictionLoss;
          c.s += c.v;

          // Bounce at ends
          if (c.s <= 0.02) {
            c.s = 0.02;
            c.v = -c.v * 0.9;
          } else if (c.s >= 0.98) {
            c.s = 0.98;
            c.v = -c.v * 0.9;
          }

          // Energy calculations
          const groundY = h - 20;
          const currentHeightMeters = Math.max(0, (groundY - pt.y) * 0.15);
          c.pe = mass * gravity * currentHeightMeters;
          c.ke = 0.5 * mass * (c.v * 80) * (c.v * 80);
          c.thermal += frictionLoss * 200;
        }

        // Draw Ground Baseline
        ctx.strokeStyle = 'rgba(23, 23, 23, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h - 20);
        ctx.lineTo(w, h - 20);
        ctx.stroke();

        // Draw Rollercoaster Track Rails
        ctx.beginPath();
        for (let s = 0; s <= 1.0; s += 0.005) {
          const pt = getTrackPoint(s, w, h);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Lower support rail
        ctx.beginPath();
        for (let s = 0; s <= 1.0; s += 0.005) {
          const pt = getTrackPoint(s, w, h);
          if (s === 0) ctx.moveTo(pt.x, pt.y + 10);
          else ctx.lineTo(pt.x, pt.y + 10);
        }
        ctx.strokeStyle = 'rgba(23, 23, 23, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vertical support pillars
        for (let s = 0.1; s <= 0.9; s += 0.12) {
          const pt = getTrackPoint(s, w, h);
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y + 10);
          ctx.lineTo(pt.x, h - 20);
          ctx.strokeStyle = 'rgba(23, 23, 23, 0.12)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw Cart at c.s
        const cartPt = getTrackPoint(c.s, w, h);
        ctx.save();
        ctx.translate(cartPt.x, cartPt.y);
        ctx.rotate(cartPt.angle);

        // Cart body
        ctx.fillStyle = '#FF572E';
        ctx.fillRect(-18, -14, 36, 12);

        // Cart wheels
        ctx.fillStyle = '#171717';
        ctx.beginPath();
        ctx.arc(-10, 0, 4, 0, Math.PI * 2);
        ctx.arc(10, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Tangent velocity vector arrow
        ctx.strokeStyle = '#C8F169';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(c.v * 350, -8);
        ctx.stroke();

        ctx.restore();
      } else {
        // Work Dot Product Stage: W = F * d * cos(θ)
        const w = canvas.width;
        const h = canvas.height;
        const centerX = 260;
        const centerY = 190;
        const angleRad = (forceAngle * Math.PI) / 180;

        // Ground line
        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, centerY + 28);
        ctx.lineTo(w - 60, centerY + 28);
        ctx.stroke();

        // Box
        const boxW = 54;
        const boxH = 46;
        ctx.fillStyle = '#171717';
        ctx.fillRect(centerX - boxW / 2, centerY - boxH / 2, boxW, boxH);

        // Displacement vector (Horizontal)
        const dScale = 2.4;
        const dLength = displacement * dScale;
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + dLength, centerY);
        ctx.stroke();

        // Displacement Arrow Head
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.moveTo(centerX + dLength, centerY - 6);
        ctx.lineTo(centerX + dLength + 10, centerY);
        ctx.lineTo(centerX + dLength, centerY + 6);
        ctx.fill();

        // Displacement label
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText(`Displacement d = ${displacement}m`, centerX + dLength / 2 - 40, centerY + 22);

        // Applied Force Vector at angle θ
        const fLength = (forceMag / 300) * 110;
        const fx = centerX + fLength * Math.cos(angleRad);
        const fy = centerY - fLength * Math.sin(angleRad);

        ctx.strokeStyle = '#FF572E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(fx, fy);
        ctx.stroke();

        // Force Arrow Head
        ctx.fillStyle = '#FF572E';
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Angle Arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, 36, -angleRad, 0);
        ctx.strokeStyle = 'rgba(255, 87, 46, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Angle label
        ctx.fillStyle = '#FF572E';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText(`θ = ${forceAngle}°`, centerX + 42, centerY - 14);

        // Vector labels
        ctx.fillText(`F = ${forceMag} N`, fx + 8, fy);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeTab, mass, gravity, friction, forceAngle, forceMag, displacement]);

  // Dot product work computation
  const angleRad = (forceAngle * Math.PI) / 180;
  const cosTheta = Math.cos(angleRad);
  const calculatedWork = forceMag * displacement * cosTheta;

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#F5F0E7] border-b border-[#171717]/10">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('rollercoaster')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'rollercoaster'
                ? 'bg-[#171717] text-[#FFFCF6]'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Track Energy Conservation
          </button>
          <button
            onClick={() => setActiveTab('work_dot_product')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'work_dot_product'
                ? 'bg-[#171717] text-[#FFFCF6]'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Vector Work Analyzer (W = F · d)
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#171717]/60">
          {activeTab === 'rollercoaster' ? 'E_tot = PE + KE = const' : 'W = F·d·cos(θ)'}
        </span>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        {/* Live Energy or Work Bar Gauges */}
        {activeTab === 'rollercoaster' ? (
          <div className="absolute top-3 left-4 bg-[#FFFCF6]/95 border border-[#171717]/10 rounded-xl p-3 shadow-xs pointer-events-none w-56 font-mono text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#171717]/60 uppercase">Potential (PE):</span>
              <span className="font-semibold text-[#171717]">
                {Math.round(coasterRef.current.pe)} J
              </span>
            </div>
            <div className="w-full bg-[#171717]/10 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#171717] h-full transition-all duration-75"
                style={{ width: `${Math.min(100, (coasterRef.current.pe / 2400) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#FF572E] uppercase">Kinetic (KE):</span>
              <span className="font-semibold text-[#FF572E]">
                {Math.round(coasterRef.current.ke)} J
              </span>
            </div>
            <div className="w-full bg-[#171717]/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF572E] h-full transition-all duration-75"
                style={{ width: `${Math.min(100, (coasterRef.current.ke / 2400) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="absolute top-3 right-4 bg-[#FFFCF6]/95 border border-[#171717]/10 rounded-xl p-3 shadow-xs pointer-events-none w-64 font-mono text-xs">
            <div className="text-[10px] text-[#171717]/60 uppercase mb-1">
              Mechanical Work Output:
            </div>
            <div className="text-xl font-bold text-[#FF572E] tabular-nums">
              {calculatedWork.toFixed(1)} Joules
            </div>
            <div className="mt-1 text-[11px] text-[#171717]/70">
              cos({forceAngle}°) = {cosTheta.toFixed(3)}
            </div>
            {forceAngle === 90 && (
              <div className="mt-2 text-[11px] text-[#10B981] font-semibold border-t border-[#171717]/10 pt-1.5">
                ✓ θ = 90° ⇒ cos(90°) = 0 ⇒ Zero mechanical work done!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Deck */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
          {activeTab === 'rollercoaster' ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#171717] text-white hover:bg-[#333] transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    coasterRef.current.s = 0.1;
                    coasterRef.current.v = 0;
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#171717]/15 hover:bg-[#171717]/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Release
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[#171717]/70">Cart Mass:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    className="w-20 accent-[#FF572E]"
                  />
                  <span className="font-mono text-[11px] tabular-nums">{mass}kg</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#171717]/70">Track Friction:</span>
                  <input
                    type="range"
                    min="0"
                    max="0.08"
                    step="0.005"
                    value={friction}
                    onChange={(e) => setFriction(Number(e.target.value))}
                    className="w-20 accent-[#FF572E]"
                  />
                  <span className="font-mono text-[11px] tabular-nums">{friction.toFixed(3)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForceAngle(0)}
                  className="px-2.5 py-1 text-xs font-semibold rounded border border-[#171717]/15 hover:bg-[#171717]/5"
                >
                  Set θ = 0° (Pulling)
                </button>
                <button
                  onClick={() => setForceAngle(90)}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FF572E] text-white hover:bg-[#e0451e]"
                >
                  Set θ = 90° (Carrying / Normal)
                </button>
              </div>

              <div className="flex items-center gap-6 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[#171717]/70">Angle θ (°):</span>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={forceAngle}
                    onChange={(e) => setForceAngle(Number(e.target.value))}
                    className="w-28 accent-[#FF572E]"
                  />
                  <span className="font-mono text-[11px] tabular-nums font-bold">{forceAngle}°</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#171717]/70">Force (N):</span>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={forceMag}
                    onChange={(e) => setForceMag(Number(e.target.value))}
                    className="w-20 accent-[#171717]"
                  />
                  <span className="font-mono text-[11px] tabular-nums">{forceMag}N</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
