import React, { useEffect, useRef, useState } from 'react';

interface InclineSimulatorProps {
  standalone?: boolean;
  initialAngle?: number;
  initialMass?: number;
}

export const InclineSimulator: React.FC<InclineSimulatorProps> = ({
  standalone = true,
  initialAngle = 35,
  initialMass = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angleDeg, setAngleDeg] = useState(initialAngle);
  const [mass, setMass] = useState(initialMass);

  const angleRad = (angleDeg * Math.PI) / 180;
  const g = 9.81;
  const weight = mass * g; // N
  const normalForce = weight * Math.cos(angleRad);
  const parallelForce = weight * Math.sin(angleRad);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = 140;
    const originY = 260;
    const rampLength = 450;
    const peakX = originX + rampLength * Math.cos(angleRad);
    const peakY = originY - rampLength * Math.sin(angleRad);

    // Ground baseline
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX - 40, originY);
    ctx.lineTo(originX + rampLength + 40, originY);
    ctx.stroke();

    // Ramp Wedge Polygon
    ctx.fillStyle = '#E8E2D5';
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(peakX, originY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Incline Angle Arc
    ctx.beginPath();
    ctx.arc(originX, originY, 50, -angleRad, 0);
    ctx.strokeStyle = '#FF572E';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FF572E';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`θ = ${angleDeg}°`, originX + 60, originY - 14);

    // Block positioned midway up the ramp
    const s = 0.5;
    const blockX = originX + rampLength * s * Math.cos(angleRad);
    const blockY = originY - rampLength * s * Math.sin(angleRad);
    const blockW = 54;
    const blockH = 38;

    ctx.save();
    ctx.translate(blockX, blockY);
    ctx.rotate(-angleRad);

    // Block Rectangle resting flush on surface
    ctx.fillStyle = '#171717';
    ctx.fillRect(-blockW / 2, -blockH, blockW, blockH);

    // Normal Force Vector (Perpendicular to ramp surface: straight UP in rotated frame)
    const nScale = (normalForce / (10 * 9.81)) * 70;
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -blockH);
    ctx.lineTo(0, -blockH - nScale);
    ctx.stroke();

    // Arrow Head Normal
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(-5, -blockH - nScale);
    ctx.lineTo(0, -blockH - nScale - 8);
    ctx.lineTo(5, -blockH - nScale);
    ctx.fill();

    ctx.restore();

    // Weight Vector (Vertical downwards from block center of mass)
    const comX = blockX - (blockH / 2) * Math.sin(angleRad);
    const comY = blockY - (blockH / 2) * Math.cos(angleRad);
    const wScale = (weight / (10 * 9.81)) * 70;

    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(comX, comY);
    ctx.lineTo(comX, comY + wScale);
    ctx.stroke();

    ctx.fillStyle = '#6B7280';
    ctx.beginPath();
    ctx.moveTo(comX - 5, comY + wScale);
    ctx.lineTo(comX, comY + wScale + 8);
    ctx.lineTo(comX + 5, comY + wScale);
    ctx.fill();

    // Vector annotations
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`Normal Force N = ${normalForce.toFixed(1)} N`, 30, 45);

    ctx.fillStyle = '#6B7280';
    ctx.fillText(`Weight W = mg = ${weight.toFixed(1)} N`, 30, 68);

    ctx.fillStyle = '#FF572E';
    ctx.fillText(`Downslope Component F_∥ = mg·sin(θ) = ${parallelForce.toFixed(1)} N`, 30, 91);
  }, [angleDeg, mass, normalForce, weight, parallelForce]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        <div className="absolute top-4 right-4 bg-[#FFFCF6]/95 border border-[#171717]/10 rounded-xl p-3 shadow-xs pointer-events-none font-mono text-xs w-60">
          <div className="text-[10px] text-[#171717]/60 uppercase mb-1">
            Normal Force Identity:
          </div>
          <div className="text-lg font-bold text-[#10B981] tabular-nums">
            N = {normalForce.toFixed(1)} N
          </div>
          <div className="text-[11px] text-[#171717]/60 mt-1">
            {normalForce < weight ? `Strictly less than Weight (${weight.toFixed(1)}N)` : 'Equal to Weight'}
          </div>
        </div>
      </div>

      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAngleDeg(0)}
              className="px-2.5 py-1 text-xs font-semibold rounded border border-[#171717]/15 hover:bg-[#171717]/5"
            >
              Flat (0°)
            </button>
            <button
              onClick={() => setAngleDeg(35)}
              className="px-2.5 py-1 text-xs font-semibold rounded border border-[#171717]/15 hover:bg-[#171717]/5"
            >
              Default (35°)
            </button>
            <button
              onClick={() => setAngleDeg(60)}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FF572E] text-white hover:bg-[#e0451e]"
            >
              Steep (60°)
            </button>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Ramp Angle θ:</span>
              <input
                type="range"
                min="0"
                max="75"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(Number(e.target.value))}
                className="w-28 accent-[#FF572E]"
              />
              <span className="font-mono text-[11px] tabular-nums font-bold">{angleDeg}°</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#171717]/70">Mass (kg):</span>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-20 accent-[#171717]"
              />
              <span className="font-mono text-[11px] tabular-nums">{mass}kg</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
