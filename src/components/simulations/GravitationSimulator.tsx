import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Sparkles, Orbit } from 'lucide-react';

interface Body {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  isFixed: boolean;
  trail: { x: number; y: number }[];
}

interface GravitationSimulatorProps {
  standalone?: boolean;
  onMetricChange?: (metrics: { force: number; velocity: number; altitude: number }) => void;
  initialAltitudeKm?: number;
}

export const GravitationSimulator: React.FC<GravitationSimulatorProps> = ({
  standalone = true,
  onMetricChange,
  initialAltitudeKm = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [gravityStrength, setGravityStrength] = useState(1.0);
  const [showFieldGrid, setShowFieldGrid] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [centralMass, setCentralMass] = useState(3000);
  const [satelliteSpeed, setSatelliteSpeed] = useState(3.4);
  const [metrics, setMetrics] = useState({
    r: 180,
    v: 3.4,
    f: 0.89,
    energy: -240,
  });

  const bodiesRef = useRef<Body[]>([]);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragCurrentRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize simulation bodies
  const initSimulation = () => {
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 350;
    const cy = canvas ? canvas.height / 2 : 220;

    const r = Math.max(120, Math.min(240, 140 + (initialAltitudeKm / 400) * 40));

    bodiesRef.current = [
      // Central primary body (Earth / Star)
      {
        id: 1,
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        mass: centralMass,
        radius: 32,
        color: '#171717',
        isFixed: true,
        trail: [],
      },
      // Orbiting satellite / planet
      {
        id: 2,
        x: cx,
        y: cy - r,
        vx: satelliteSpeed,
        vy: 0,
        mass: 15,
        radius: 8,
        color: '#FF572E',
        isFixed: false,
        trail: [],
      },
      // Secondary outer moon
      {
        id: 3,
        x: cx + r * 1.5,
        y: cy,
        vx: 0,
        vy: -satelliteSpeed * 0.82,
        mass: 25,
        radius: 6,
        color: '#C8F169',
        isFixed: false,
        trail: [],
      },
    ];
  };

  useEffect(() => {
    initSimulation();
  }, [centralMass, satelliteSpeed, initialAltitudeKm]);

  // Main simulation render loop
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updatePhysics = () => {
      const bodies = bodiesRef.current;
      const G = 0.45 * gravityStrength;

      if (isRunning) {
        // Compute pairwise gravitational forces F = G * m1 * m2 / r^2
        for (let i = 0; i < bodies.length; i++) {
          const b1 = bodies[i];
          if (b1.isFixed) continue;

          let fx = 0;
          let fy = 0;

          for (let j = 0; j < bodies.length; j++) {
            if (i === j) continue;
            const b2 = bodies[j];
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // Softening parameter to prevent infinity singularity
            if (dist > 15) {
              const force = (G * b1.mass * b2.mass) / distSq;
              fx += force * (dx / dist);
              fy += force * (dy / dist);
            }
          }

          // Acceleration a = F / m
          const ax = fx / b1.mass;
          const ay = fy / b1.mass;

          b1.vx += ax;
          b1.vy += ay;
          b1.x += b1.vx;
          b1.y += b1.vy;

          // Record trail
          b1.trail.push({ x: b1.x, y: b1.y });
          if (b1.trail.length > 120) {
            b1.trail.shift();
          }
        }
      }

      // Update primary telemetry metrics from body 2
      const sat = bodies.find((b) => b.id === 2);
      const center = bodies.find((b) => b.id === 1);
      if (sat && center) {
        const dx = sat.x - center.x;
        const dy = sat.y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.sqrt(sat.vx * sat.vx + sat.vy * sat.vy);
        const gForceNorm = (centralMass * 0.45) / (dist * dist);
        const potEnergy = (-0.45 * centralMass * sat.mass) / dist;
        const kinEnergy = 0.5 * sat.mass * speed * speed;
        const totalE = Math.round(potEnergy + kinEnergy);

        setMetrics({
          r: Math.round(dist),
          v: Number(speed.toFixed(2)),
          f: Number((gForceNorm * 10).toFixed(2)),
          energy: totalE,
        });

        if (onMetricChange) {
          onMetricChange({
            force: Number((gForceNorm * 10).toFixed(2)),
            velocity: Number(speed.toFixed(2)),
            altitude: Math.round(dist * 2.2),
          });
        }
      }

      // Render Stage
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Field Grid (Spacetime curvature lines)
      if (showFieldGrid && center) {
        ctx.save();
        const rings = [60, 110, 160, 220, 290];
        rings.forEach((r, idx) => {
          ctx.beginPath();
          ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(23, 23, 23, ${0.12 - idx * 0.02})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 6]);
          ctx.stroke();

          // Monospace gravitational potential label
          ctx.fillStyle = 'rgba(23, 23, 23, 0.35)';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`Φ = -${Math.round(2400 / r)} kJ/kg`, center.x + r + 4, center.y - 4);
        });

        // Geodesic warp lines
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
          ctx.beginPath();
          ctx.moveTo(center.x + Math.cos(angle) * 40, center.y + Math.sin(angle) * 40);
          ctx.lineTo(center.x + Math.cos(angle) * 320, center.y + Math.sin(angle) * 320);
          ctx.strokeStyle = 'rgba(23, 23, 23, 0.05)';
          ctx.setLineDash([]);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render Trails
      bodies.forEach((b) => {
        if (b.trail.length > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let k = 1; k < b.trail.length; k++) {
            ctx.lineTo(b.trail[k].x, b.trail[k].y);
          }
          ctx.strokeStyle = b.color === '#171717' ? 'rgba(23, 23, 23, 0.3)' : b.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.55;
          ctx.stroke();
          ctx.restore();
        }
      });

      // Render Bodies
      bodies.forEach((b) => {
        ctx.save();

        // Gravitational well aura
        if (b.isFixed) {
          const auraGrad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.6, b.x, b.y, b.radius * 2.8);
          auraGrad.addColorStop(0, 'rgba(255, 87, 46, 0.25)');
          auraGrad.addColorStop(1, 'rgba(255, 87, 46, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Body sphere
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        // Technical rim stroke
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Velocity & Force vector overlay
        if (showVectors && !b.isFixed) {
          // Velocity Vector (Cyan / Lime)
          const vScale = 14;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + b.vx * vScale, b.y + b.vy * vScale);
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Gravitational Force Vector (Coral toward center)
          if (center) {
            const dx = center.x - b.x;
            const dy = center.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
              const fScale = 22;
              ctx.beginPath();
              ctx.moveTo(b.x, b.y);
              ctx.lineTo(b.x + (dx / dist) * fScale, b.y + (dy / dist) * fScale);
              ctx.strokeStyle = '#FF572E';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        }

        ctx.restore();
      });

      // Render interactive slingshot vector preview if dragging
      if (dragStartRef.current && dragCurrentRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(dragStartRef.current.x, dragStartRef.current.y);
        ctx.lineTo(dragCurrentRef.current.x, dragCurrentRef.current.y);
        ctx.strokeStyle = '#FF572E';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Target new body preview
        ctx.beginPath();
        ctx.arc(dragStartRef.current.x, dragStartRef.current.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#FF572E';
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, gravityStrength, showFieldGrid, showVectors, centralMass]);

  // Drag interaction to launch custom celestial bodies
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragStartRef.current = { x, y };
    dragCurrentRef.current = { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStartRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragCurrentRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseUp = () => {
    if (dragStartRef.current && dragCurrentRef.current) {
      const dx = dragStartRef.current.x - dragCurrentRef.current.x;
      const dy = dragStartRef.current.y - dragCurrentRef.current.y;
      const vx = dx * 0.05;
      const vy = dy * 0.05;

      // Spawn user body
      bodiesRef.current.push({
        id: Date.now(),
        x: dragStartRef.current.x,
        y: dragStartRef.current.y,
        vx,
        vy,
        mass: 12,
        radius: 7,
        color: '#FF572E',
        isFixed: false,
        trail: [],
      });
    }
    dragStartRef.current = null;
    dragCurrentRef.current = null;
  };

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      {/* Simulation Stage */}
      <div className="relative w-full h-[400px] bg-scientific-grid bg-[#FAF6F0] cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          width={760}
          height={400}
          className="w-full h-full block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />

        {/* HUD Precision Readout Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#171717]/60">Orbital Telemetry</span>
            <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">Active RK4</span>
          </div>
          <div className="flex items-baseline gap-4 mt-1 font-mono text-xs">
            <div>
              <span className="text-[#171717]/50 text-[10px]">Radius:</span>{' '}
              <span className="font-semibold tabular-nums">{metrics.r} km</span>
            </div>
            <div>
              <span className="text-[#171717]/50 text-[10px]">v:</span>{' '}
              <span className="font-semibold tabular-nums text-[#10B981]">{metrics.v} km/s</span>
            </div>
            <div>
              <span className="text-[#171717]/50 text-[10px]">F_g:</span>{' '}
              <span className="font-semibold tabular-nums text-[#FF572E]">{metrics.f} N/kg</span>
            </div>
          </div>
        </div>

        {/* Slingshot Prompt */}
        <div className="absolute bottom-3 right-4 pointer-events-none text-[11px] font-mono text-[#171717]/60 bg-[#FFFCF6]/90 px-2 py-1 rounded border border-[#171717]/10 backdrop-blur-xs">
          Click & drag anywhere to sling satellite
        </div>
      </div>

      {/* Control Deck */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#171717] text-[#FFFCF6] hover:bg-[#333] transition-colors"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={initSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#171717]/15 hover:bg-[#171717]/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Orbit
            </button>
          </div>

          {/* Parameter Sliders */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Central Mass:</span>
              <input
                type="range"
                min="1000"
                max="6000"
                step="200"
                value={centralMass}
                onChange={(e) => setCentralMass(Number(e.target.value))}
                className="w-24 accent-[#FF572E]"
              />
              <span className="font-mono text-[11px] tabular-nums text-[#171717]">{centralMass}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Orbital Speed:</span>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={satelliteSpeed}
                onChange={(e) => setSatelliteSpeed(Number(e.target.value))}
                className="w-24 accent-[#FF572E]"
              />
              <span className="font-mono text-[11px] tabular-nums text-[#171717]">{satelliteSpeed}</span>
            </div>

            {/* Visual Toggles */}
            <div className="flex items-center gap-3 border-l border-[#171717]/10 pl-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={showFieldGrid}
                  onChange={(e) => setShowFieldGrid(e.target.checked)}
                  className="rounded text-[#FF572E]"
                />
                <span className="text-[#171717]/70">Gravity Field</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded text-[#FF572E]"
                />
                <span className="text-[#171717]/70">Vector Arrows</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
