import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Droplets, Thermometer, Wind } from 'lucide-react';

interface ChemistrySimulationEngineProps {
  template?: 'concentration' | 'gas';
  initialParams?: Record<string, any>;
  standalone?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const ChemistrySimulationEngine: React.FC<ChemistrySimulationEngineProps> = ({
  template = 'concentration',
  initialParams = {},
  standalone = true,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<'concentration' | 'gas'>(template);

  // Concentration state: C = n / V
  const [soluteMoles, setSoluteMoles] = useState<number>(Number(initialParams.moles) || 1.5); // mol
  const [volumeLiters, setVolumeLiters] = useState<number>(Number(initialParams.volume) || 1.0); // L

  // Gas state: PV = nRT
  const [gasMoles, setGasMoles] = useState<number>(Number(initialParams.gasMoles) || 1.0);
  const [tempKelvin, setTempKelvin] = useState<number>(Number(initialParams.temp) || 300); // K
  const [pistonVolume, setPistonVolume] = useState<number>(Number(initialParams.pistonVolume) || 5.0); // L

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Calculate concentration Molarity (M = mol / L)
  const molarity = soluteMoles / Math.max(0.1, volumeLiters);

  // Calculate Gas Pressure (P = nRT / V) in atm (R = 0.08206 L·atm/(mol·K))
  const R = 0.08206;
  const gasPressure = (gasMoles * R * tempKelvin) / Math.max(0.5, pistonVolume);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activeTemplate === 'concentration') {
      const count = Math.min(120, Math.round(soluteMoles * 40));
      const newParticles: Particle[] = [];
      const beakerW = 380;
      const beakerH = Math.min(220, volumeLiters * 140);
      const startX = canvas.width / 2 - beakerW / 2 + 10;
      const startY = 260 - beakerH + 10;

      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: startX + Math.random() * (beakerW - 20),
          y: startY + Math.random() * (beakerH - 20),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 4,
          color: '#10B981', // copper sulfate or nickel ion
        });
      }
      particlesRef.current = newParticles;
    } else {
      const count = Math.min(100, Math.round(gasMoles * 50));
      const speedScale = Math.sqrt(tempKelvin / 300) * 3;
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: 180 + Math.random() * (pistonVolume * 60 - 20),
          y: 70 + Math.random() * 180,
          vx: (Math.random() - 0.5) * speedScale,
          vy: (Math.random() - 0.5) * speedScale,
          radius: 3.5,
          color: '#FF572E',
        });
      }
      particlesRef.current = newParticles;
    }
  }, [activeTemplate, soluteMoles, volumeLiters, gasMoles, tempKelvin, pistonVolume]);

  // Main animation render loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      if (activeTemplate === 'concentration') {
        const beakerW = 380;
        const groundY = 270;
        const maxBeakerH = 220;
        const currentWaterH = Math.min(maxBeakerH - 10, volumeLiters * 95);
        const bx = w / 2 - beakerW / 2;
        const by = groundY - maxBeakerH;

        // Draw Laboratory Beaker Outline
        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Left rim and lip
        ctx.moveTo(bx - 10, by);
        ctx.lineTo(bx, by + 10);
        ctx.lineTo(bx, groundY);
        ctx.lineTo(bx + beakerW, groundY);
        ctx.lineTo(bx + beakerW, by + 10);
        ctx.lineTo(bx + beakerW + 10, by);
        ctx.stroke();

        // Measurement volume ticks on beaker side
        ctx.fillStyle = '#171717';
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let v = 0.5; v <= 2.0; v += 0.5) {
          const tickY = groundY - v * 95;
          ctx.beginPath();
          ctx.moveTo(bx, tickY);
          ctx.lineTo(bx + 18, tickY);
          ctx.stroke();
          ctx.fillText(`${v.toFixed(1)} L`, bx + 22, tickY + 3);
        }

        // Draw Liquid with Concentration-Dependent Color Intensity
        // High concentration -> Deep rich cobalt; Low concentration -> Pale transparent wash
        const alpha = Math.min(0.85, Math.max(0.12, molarity * 0.35));
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fillRect(bx + 2, groundY - currentWaterH, beakerW - 4, currentWaterH);

        // Water surface meniscus
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + 2, groundY - currentWaterH);
        ctx.lineTo(bx + beakerW - 2, groundY - currentWaterH);
        ctx.stroke();

        // Animate Dissolved Solute Ions (Brownian diffusion)
        const waterTop = groundY - currentWaterH;
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x <= bx + 8 || p.x >= bx + beakerW - 8) p.vx *= -1;
          if (p.y <= waterTop + 6 || p.y >= groundY - 6) p.vy *= -1;

          ctx.fillStyle = '#065F46';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Ideal Gas Cylinder with Movable Piston Wall
        const leftX = 140;
        const topY = 60;
        const cylinderH = 200;
        const chamberW = pistonVolume * 65; // Dynamic width based on volume

        // Fixed Top, Bottom, and Left Cylinder Walls
        ctx.strokeStyle = '#171717';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(leftX + 450, topY);
        ctx.lineTo(leftX, topY);
        ctx.lineTo(leftX, topY + cylinderH);
        ctx.lineTo(leftX + 450, topY + cylinderH);
        ctx.stroke();

        // Movable Piston Wall (Right barrier)
        ctx.fillStyle = '#171717';
        ctx.fillRect(leftX + chamberW, topY, 18, cylinderH);

        // Piston Rod
        ctx.fillStyle = '#6B7280';
        ctx.fillRect(leftX + chamberW + 18, topY + cylinderH / 2 - 8, 80, 16);

        // Draw Gas Chamber Interior Tint (Hotter = reddish, Cooler = soft)
        const heatHue = Math.min(1.0, Math.max(0.1, (tempKelvin - 100) / 500));
        ctx.fillStyle = `rgba(255, 87, 46, ${heatHue * 0.15})`;
        ctx.fillRect(leftX + 2, topY + 2, chamberW - 2, cylinderH - 4);

        // Animate Gas Molecules Bouncing Off Walls
        const speedMultiplier = Math.sqrt(tempKelvin / 300);
        particlesRef.current.forEach((p) => {
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          // Left wall
          if (p.x <= leftX + p.radius) {
            p.x = leftX + p.radius;
            p.vx = Math.abs(p.vx);
          }
          // Piston wall (movable)
          if (p.x >= leftX + chamberW - p.radius) {
            p.x = leftX + chamberW - p.radius;
            p.vx = -Math.abs(p.vx);
          }
          // Top wall
          if (p.y <= topY + p.radius) {
            p.y = topY + p.radius;
            p.vy = Math.abs(p.vy);
          }
          // Bottom wall
          if (p.y >= topY + cylinderH - p.radius) {
            p.y = topY + cylinderH - p.radius;
            p.vy = -Math.abs(p.vy);
          }

          ctx.fillStyle = '#FF572E';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeTemplate, molarity, volumeLiters, tempKelvin, pistonVolume]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/15 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F5F0E7] border-b border-[#171717]/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTemplate('concentration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'concentration'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Solution Concentration (C = n / V)
          </button>
          <button
            onClick={() => setActiveTemplate('gas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'gas'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Ideal Gas Law (PV = nRT)
          </button>
        </div>

        <span className="text-xs font-mono font-bold text-[#FF572E]">
          {activeTemplate === 'concentration'
            ? `C = ${molarity.toFixed(2)} M (mol/L)`
            : `P = ${gasPressure.toFixed(2)} atm`}
        </span>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        {/* Telemetry Box */}
        <div className="absolute top-3 right-3 bg-[#FFFCF6]/95 border border-[#171717]/15 rounded-xl p-3 text-xs font-mono shadow-xs pointer-events-none min-w-[190px]">
          {activeTemplate === 'concentration' ? (
            <>
              <div className="text-[10px] uppercase text-[#171717]/60 mb-1 font-bold">
                Concentration Readout:
              </div>
              <div className="text-xl font-bold text-[#10B981] tabular-nums">
                {molarity.toFixed(2)} mol/L
              </div>
              <div className="text-[11px] text-[#171717]/70 mt-1">
                Solute: <span className="font-semibold">{soluteMoles.toFixed(2)} mol</span>
              </div>
              <div className="text-[11px] text-[#171717]/70">
                Volume: <span className="font-semibold">{volumeLiters.toFixed(2)} L</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] uppercase text-[#171717]/60 mb-1 font-bold">
                Thermodynamic State:
              </div>
              <div className="text-xl font-bold text-[#FF572E] tabular-nums">
                {gasPressure.toFixed(2)} atm
              </div>
              <div className="text-[11px] text-[#171717]/70 mt-1">
                Temperature T: <span className="font-semibold">{tempKelvin} K</span>
              </div>
              <div className="text-[11px] text-[#171717]/70">
                Chamber Volume V: <span className="font-semibold">{pistonVolume.toFixed(1)} L</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control Deck */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          {activeTemplate === 'concentration' ? (
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Solute (mol):</span>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={soluteMoles}
                  onChange={(e) => setSoluteMoles(Number(e.target.value))}
                  className="w-28 accent-[#10B981]"
                />
                <span className="tabular-nums w-12 font-bold">{soluteMoles.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Volume (L):</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={volumeLiters}
                  onChange={(e) => setVolumeLiters(Number(e.target.value))}
                  className="w-28 accent-[#10B981]"
                />
                <span className="tabular-nums w-12 font-bold">{volumeLiters.toFixed(1)}</span>
              </div>

              <button
                onClick={() => {
                  setSoluteMoles(1.5);
                  setVolumeLiters(1.0);
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
                <span className="font-bold text-[#171717]">Temperature (K):</span>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="25"
                  value={tempKelvin}
                  onChange={(e) => setTempKelvin(Number(e.target.value))}
                  className="w-28 accent-[#FF572E]"
                />
                <span className="tabular-nums w-12 font-bold">{tempKelvin}K</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Piston Volume (L):</span>
                <input
                  type="range"
                  min="2.0"
                  max="6.5"
                  step="0.5"
                  value={pistonVolume}
                  onChange={(e) => setPistonVolume(Number(e.target.value))}
                  className="w-28 accent-[#171717]"
                />
                <span className="tabular-nums w-12 font-bold">{pistonVolume.toFixed(1)}L</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
