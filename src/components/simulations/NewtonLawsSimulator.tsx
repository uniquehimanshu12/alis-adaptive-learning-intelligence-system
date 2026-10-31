import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Activity, ArrowRight, Gauge } from 'lucide-react';

interface NewtonLawsSimulatorProps {
  standalone?: boolean;
  initialTruckMass?: number;
  initialCarMass?: number;
  onCollisionTested?: (data: { forceEqual: boolean; a1: number; a2: number }) => void;
}

export const NewtonLawsSimulator: React.FC<NewtonLawsSimulatorProps> = ({
  standalone = true,
  initialTruckMass = 4000,
  initialCarMass = 800,
  onCollisionTested,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [m1, setM1] = useState(initialTruckMass);
  const [m2, setM2] = useState(initialCarMass);
  const [v1Init, setV1Init] = useState(20);
  const [frictionCoeff, setFrictionCoeff] = useState(0.05);
  const [elasticity, setElasticity] = useState(0.2); // semi-inelastic
  const [isPlaying, setIsPlaying] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [showVectors, setShowVectors] = useState(true);

  // Live telemetry states
  const [impactForce, setImpactForce] = useState<number | null>(null);
  const [a1Peak, setA1Peak] = useState<number | null>(null);
  const [a2Peak, setA2Peak] = useState<number | null>(null);

  // Simulation physics state
  const stateRef = useRef({
    x1: 100,
    x2: 450,
    w1: 90,
    w2: 50,
    v1: 20,
    v2: 0,
    collided: false,
    impactTimer: 0,
    f12: 0,
    f21: 0,
  });

  const resetSimulation = () => {
    setIsPlaying(false);
    setImpactForce(null);
    setA1Peak(null);
    setA2Peak(null);
    stateRef.current = {
      x1: 100,
      x2: 460,
      w1: Math.max(60, Math.min(110, 50 + (m1 / 5000) * 50)),
      w2: Math.max(45, Math.min(80, 40 + (m2 / 2000) * 40)),
      v1: v1Init,
      v2: 0,
      collided: false,
      impactTimer: 0,
      f12: 0,
      f21: 0,
    };
  };

  useEffect(() => {
    resetSimulation();
  }, [m1, m2, v1Init]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const s = stateRef.current;
      const groundY = 240;
      const dt = slowMo ? 0.04 : 0.16;

      if (isPlaying) {
        // Friction deceleration
        const g = 9.81;
        const aFriction = frictionCoeff * g;

        if (Math.abs(s.v1) > 0.05) {
          s.v1 -= Math.sign(s.v1) * aFriction * dt;
        } else {
          s.v1 = 0;
        }

        if (Math.abs(s.v2) > 0.05) {
          s.v2 -= Math.sign(s.v2) * aFriction * dt;
        } else {
          s.v2 = 0;
        }

        s.x1 += s.v1 * dt * 10;
        s.x2 += s.v2 * dt * 10;

        // Collision detection between right edge of body 1 and left edge of body 2
        const right1 = s.x1 + s.w1;
        const left2 = s.x2;

        if (right1 >= left2 && !s.collided) {
          s.collided = true;
          s.impactTimer = 18;

          // Conservation of linear momentum & coefficient of restitution:
          // v1' = (m1*v1 + m2*v2 - m2*e*(v1 - v2)) / (m1 + m2)
          // v2' = (m1*v1 + m2*v2 + m1*e*(v1 - v2)) / (m1 + m2)
          const u1 = s.v1;
          const u2 = s.v2;
          const totalMass = m1 + m2;
          const v1New = (m1 * u1 + m2 * u2 - m2 * elasticity * (u1 - u2)) / totalMass;
          const v2New = (m1 * u1 + m2 * u2 + m1 * elasticity * (u1 - u2)) / totalMass;

          // Momentum change (Impulse J = m2 * Δv2 = -m1 * Δv1)
          const impulse = m2 * Math.abs(v2New - u2);
          const collisionDurationSec = 0.08;
          const peakForceKn = Math.round((impulse / collisionDurationSec) / 1000);

          s.f12 = peakForceKn;
          s.f21 = peakForceKn; // Strictly equal!

          const a1 = Number(((peakForceKn * 1000) / m1).toFixed(1));
          const a2 = Number(((peakForceKn * 1000) / m2).toFixed(1));

          setImpactForce(peakForceKn);
          setA1Peak(a1);
          setA2Peak(a2);

          s.v1 = v1New;
          s.v2 = v2New;

          if (onCollisionTested) {
            onCollisionTested({
              forceEqual: true,
              a1,
              a2,
            });
          }
        }

        if (s.impactTimer > 0) {
          s.impactTimer--;
        }
      }

      // Draw Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor & Friction Surface
      ctx.fillStyle = '#E8E2D5';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      // Ground Surface Line
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // Measurement hash marks on floor
      for (let x = 20; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x, groundY + 6);
        ctx.strokeStyle = 'rgba(23, 23, 23, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Body 1 (Truck / Massive object)
      const h1 = 58;
      const y1 = groundY - h1;
      ctx.fillStyle = '#171717';
      ctx.fillRect(s.x1, y1, s.w1, h1);

      // Wheels 1
      ctx.fillStyle = '#FF572E';
      ctx.beginPath();
      ctx.arc(s.x1 + 18, groundY, 7, 0, Math.PI * 2);
      ctx.arc(s.x1 + s.w1 - 18, groundY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Body 1 Label
      ctx.fillStyle = '#FFFCF6';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`M₁: ${m1}kg`, s.x1 + 8, y1 + 24);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`v: ${s.v1.toFixed(1)}m/s`, s.x1 + 8, y1 + 42);

      // Body 2 (Car / Smaller object)
      const h2 = 42;
      const y2 = groundY - h2;
      ctx.fillStyle = '#FF572E';
      ctx.fillRect(s.x2, y2, s.w2, h2);

      // Wheels 2
      ctx.fillStyle = '#171717';
      ctx.beginPath();
      ctx.arc(s.x2 + 12, groundY, 6, 0, Math.PI * 2);
      ctx.arc(s.x2 + s.w2 - 12, groundY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Body 2 Label
      ctx.fillStyle = '#FFFCF6';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`M₂: ${m2}kg`, s.x2 + 6, y2 + 20);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`v: ${s.v2.toFixed(1)}m/s`, s.x2 + 6, y2 + 34);

      // Impact Shockwave & Contact Interface Visualization
      if (s.impactTimer > 0) {
        const contactX = (s.x1 + s.w1 + s.x2) / 2;
        ctx.save();
        ctx.strokeStyle = '#C8F169';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(contactX, groundY - 30, 24 + (18 - s.impactTimer) * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Contact Force Pair Vectors (Action-Reaction)
        ctx.fillStyle = '#171717';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText(`F_12 = ${s.f12} kN →`, contactX + 16, groundY - 70);
        ctx.fillText(`← F_21 = ${s.f21} kN`, contactX - 140, groundY - 70);
        ctx.restore();
      }

      // Live Free-Body Vectors
      if (showVectors) {
        ctx.save();
        // Body 1 Normal & Weight
        const c1X = s.x1 + s.w1 / 2;
        const c1Y = y1 + h1 / 2;

        // Normal Force (Up)
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c1X, y1);
        ctx.lineTo(c1X, y1 - 24);
        ctx.stroke();

        // Weight (Down)
        ctx.strokeStyle = '#6B7280';
        ctx.beginPath();
        ctx.moveTo(c1X, groundY);
        ctx.lineTo(c1X, groundY + 24);
        ctx.stroke();

        // Body 2 Normal & Weight
        const c2X = s.x2 + s.w2 / 2;
        ctx.strokeStyle = '#10B981';
        ctx.beginPath();
        ctx.moveTo(c2X, y2);
        ctx.lineTo(c2X, y2 - 20);
        ctx.stroke();

        ctx.strokeStyle = '#6B7280';
        ctx.beginPath();
        ctx.moveTo(c2X, groundY);
        ctx.lineTo(c2X, groundY + 20);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, slowMo, frictionCoeff, elasticity, m1, m2, showVectors]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Simulation Stage */}
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        {/* Real-time Newton's 3rd Law Invariant HUD */}
        <div className="absolute top-4 left-4 bg-[#FFFCF6]/95 border border-[#171717]/10 rounded-xl p-3 shadow-xs pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-[#FF572E]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/70">
              Third Law Dynamic Proof
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <span className="text-[#171717]/50 text-[10px] block">Force on M₂ (Car):</span>
              <span className="text-base font-bold tabular-nums text-[#FF572E]">
                {impactForce !== null ? `${impactForce} kN` : '0.0 kN'}
              </span>
              <span className="text-[10px] text-[#171717]/60 block mt-0.5">
                a₂ = {a2Peak !== null ? `${a2Peak} m/s²` : '0 m/s²'}
              </span>
            </div>

            <div>
              <span className="text-[#171717]/50 text-[10px] block">Force on M₁ (Truck):</span>
              <span className="text-base font-bold tabular-nums text-[#171717]">
                {impactForce !== null ? `${impactForce} kN` : '0.0 kN'}
              </span>
              <span className="text-[10px] text-[#171717]/60 block mt-0.5">
                a₁ = {a1Peak !== null ? `${a1Peak} m/s²` : '0 m/s²'}
              </span>
            </div>
          </div>

          {impactForce !== null && (
            <div className="mt-2.5 pt-2 border-t border-[#171717]/10 text-[11px] font-mono text-[#10B981] flex items-center gap-1">
              ✓ Forces are 100% identical: F₁₂ = -F₂₁
            </div>
          )}
        </div>
      </div>

      {/* Control Deck */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(true)}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#FF572E] text-white hover:bg-[#e0451e] transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Launch Collision
            </button>
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[#171717]/15 hover:bg-[#171717]/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => setSlowMo(!slowMo)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                slowMo ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#171717]/15 text-[#171717]'
              }`}
            >
              Slow-Mo 0.25x
            </button>
          </div>

          {/* Mass & Friction Sliders */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Truck (M₁):</span>
              <input
                type="range"
                min="1000"
                max="8000"
                step="500"
                value={m1}
                onChange={(e) => setM1(Number(e.target.value))}
                className="w-20 accent-[#171717]"
              />
              <span className="font-mono text-[11px] tabular-nums">{m1}kg</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Car (M₂):</span>
              <input
                type="range"
                min="400"
                max="3000"
                step="200"
                value={m2}
                onChange={(e) => setM2(Number(e.target.value))}
                className="w-20 accent-[#FF572E]"
              />
              <span className="font-mono text-[11px] tabular-nums">{m2}kg</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Friction (μ):</span>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.02"
                value={frictionCoeff}
                onChange={(e) => setFrictionCoeff(Number(e.target.value))}
                className="w-16 accent-[#FF572E]"
              />
              <span className="font-mono text-[11px] tabular-nums">{frictionCoeff.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
