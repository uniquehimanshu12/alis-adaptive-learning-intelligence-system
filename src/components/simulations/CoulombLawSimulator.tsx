import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface CoulombLawSimulatorProps {
  initialQ1?: number; // in microCoulombs (μC)
  initialQ2?: number; // in microCoulombs (μC)
  initialDistance?: number; // in meters (m)
  standalone?: boolean;
}

export const CoulombLawSimulator: React.FC<CoulombLawSimulatorProps> = ({
  initialQ1 = 4,
  initialQ2 = -6,
  initialDistance = 1.5,
  standalone = true,
}) => {
  const [q1, setQ1] = useState<number>(initialQ1);
  const [q2, setQ2] = useState<number>(initialQ2);
  const [distance, setDistance] = useState<number>(initialDistance);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Coulomb's constant k = 8.98755 × 10^9 N·m²/C²
  const k = 8.988e9;
  // Convert μC to C: 1 μC = 10^-6 C
  const q1Coulombs = q1 * 1e-6;
  const q2Coulombs = q2 * 1e-6;
  const forceMagnitude = Math.abs((k * q1Coulombs * q2Coulombs) / (distance * distance));
  const isAttractive = q1 * q2 < 0;
  const isNeutral = q1 === 0 || q2 === 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const centerY = h / 2;

    // Grid pattern
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Positions based on distance slider
    // distance is 0.5m to 4.0m, map to canvas pixel separation
    const minPixelDist = 120;
    const maxPixelDist = w - 160;
    const pixelDist = minPixelDist + ((distance - 0.5) / 3.5) * (maxPixelDist - minPixelDist);

    const x1 = w / 2 - pixelDist / 2;
    const x2 = w / 2 + pixelDist / 2;

    // Draw distance line & measurement
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.3)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, centerY + 55);
    ctx.lineTo(x2, centerY + 55);
    ctx.stroke();
    ctx.setLineDash([]);

    // End ticks
    ctx.beginPath();
    ctx.moveTo(x1, centerY + 45);
    ctx.lineTo(x1, centerY + 65);
    ctx.moveTo(x2, centerY + 45);
    ctx.lineTo(x2, centerY + 65);
    ctx.stroke();

    // Distance label
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`r = ${distance.toFixed(2)} m`, (x1 + x2) / 2, centerY + 75);

    // Electric Field Lines representation between charges
    const fieldLines = 7;
    for (let i = 0; i < fieldLines; i++) {
      const offset = (i - (fieldLines - 1) / 2) * 20;
      ctx.beginPath();
      ctx.strokeStyle = isAttractive
        ? 'rgba(255, 87, 46, 0.35)'
        : 'rgba(59, 130, 246, 0.35)';
      ctx.lineWidth = 1.5;

      if (isAttractive) {
        // Curve inward connecting charges
        ctx.moveTo(x1 + 25, centerY + offset * 0.4);
        ctx.bezierCurveTo(
          (x1 + x2) / 2,
          centerY + offset * 1.5,
          (x1 + x2) / 2,
          centerY + offset * 1.5,
          x2 - 25,
          centerY + offset * 0.4
        );
      } else {
        // Flaring outward (repelling)
        ctx.moveTo(x1, centerY + offset);
        ctx.quadraticCurveTo(x1 - 40, centerY + offset * 1.8, x1 - 80, centerY + offset * 2.2);
        ctx.moveTo(x2, centerY + offset);
        ctx.quadraticCurveTo(x2 + 40, centerY + offset * 1.8, x2 + 80, centerY + offset * 2.2);
      }
      ctx.stroke();
    }

    // Force Vectors on Charge 1 and Charge 2
    if (!isNeutral) {
      const vectorLen = Math.min(Math.max(forceMagnitude * 15, 25), 80);
      ctx.lineWidth = 3;

      // Force on Q1
      const dir1 = isAttractive ? 1 : -1;
      const targetX1 = x1 + dir1 * vectorLen;
      ctx.strokeStyle = '#FF572E';
      ctx.fillStyle = '#FF572E';
      ctx.beginPath();
      ctx.moveTo(x1, centerY);
      ctx.lineTo(targetX1, centerY);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(targetX1, centerY);
      ctx.lineTo(targetX1 - dir1 * 8, centerY - 5);
      ctx.lineTo(targetX1 - dir1 * 8, centerY + 5);
      ctx.fill();

      // Force on Q2
      const dir2 = isAttractive ? -1 : 1;
      const targetX2 = x2 + dir2 * vectorLen;
      ctx.beginPath();
      ctx.moveTo(x2, centerY);
      ctx.lineTo(targetX2, centerY);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(targetX2, centerY);
      ctx.lineTo(targetX2 - dir2 * 8, centerY - 5);
      ctx.lineTo(targetX2 - dir2 * 8, centerY + 5);
      ctx.fill();

      // Vector labels
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`F₁₂`, x1, centerY - 38);
      ctx.fillText(`F₂₁`, x2, centerY - 38);
    }

    // Draw Charge 1 Sphere
    const r1 = Math.max(Math.min(Math.abs(q1) * 2 + 16, 32), 16);
    ctx.beginPath();
    ctx.arc(x1, centerY, r1, 0, Math.PI * 2);
    ctx.fillStyle = q1 > 0 ? '#EF4444' : q1 < 0 ? '#3B82F6' : '#9CA3AF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#171717';
    ctx.stroke();

    // Q1 label & sign
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(q1 > 0 ? `+${q1}` : `${q1}`, x1, centerY);

    // Draw Charge 2 Sphere
    const r2 = Math.max(Math.min(Math.abs(q2) * 2 + 16, 32), 16);
    ctx.beginPath();
    ctx.arc(x2, centerY, r2, 0, Math.PI * 2);
    ctx.fillStyle = q2 > 0 ? '#EF4444' : q2 < 0 ? '#3B82F6' : '#9CA3AF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#171717';
    ctx.stroke();

    // Q2 label & sign
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(q2 > 0 ? `+${q2}` : `${q2}`, x2, centerY);
  }, [q1, q2, distance, forceMagnitude, isAttractive, isNeutral]);

  return (
    <div className={`p-6 bg-[#FFFCF6] rounded-2xl border border-[#171717]/15 ${standalone ? 'shadow-sm' : ''}`}>
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF572E] uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>Coulomb's Law & Electrostatic Interaction</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#171717]">
            Electric Force Vector Simulator
          </h3>
        </div>

        <button
          onClick={() => {
            setQ1(4);
            setQ2(-6);
            setDistance(1.5);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#171717]/15 hover:border-[#171717] text-[#171717] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Canvas Display */}
      <div className="w-full bg-[#FAF6F0] rounded-xl border border-[#171717]/10 overflow-hidden mb-6 relative">
        <canvas ref={canvasRef} width={640} height={240} className="w-full h-auto block" />

        {/* Live Vector Feedback Overlay */}
        <div className="absolute top-3 left-3 bg-[#FFFCF6]/90 backdrop-blur-xs p-2.5 rounded-lg border border-[#171717]/10 text-xs font-mono">
          <div className="font-bold text-[#171717]">
            Force:{' '}
            <span className="text-[#FF572E] font-black text-sm">
              {forceMagnitude < 0.001
                ? `${(forceMagnitude * 1000).toFixed(3)} mN`
                : `${forceMagnitude.toFixed(3)} N`}
            </span>
          </div>
          <div className="text-[11px] text-[#171717]/70">
            Interaction:{' '}
            <span className={`font-bold ${isAttractive ? 'text-emerald-700' : 'text-blue-700'}`}>
              {isNeutral ? 'Neutral (0 N)' : isAttractive ? 'Attraction (Opposite Signs)' : 'Repulsion (Like Signs)'}
            </span>
          </div>
        </div>

        <div className="absolute top-3 right-3 bg-[#FFFCF6]/90 backdrop-blur-xs p-2.5 rounded-lg border border-[#171717]/10 text-xs font-mono text-right">
          <div className="text-[10px] text-[#171717]/50 uppercase font-bold">Scaling Ratio</div>
          <div className="font-bold text-[#171717]">
            F ∝ 1 / r² = 1 / {(distance * distance).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
        {/* Charge 1 */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Charge q₁:</span>
            <span className={q1 > 0 ? 'text-red-600' : q1 < 0 ? 'text-blue-600' : 'text-gray-600'}>
              {q1 > 0 ? `+${q1}` : q1} μC
            </span>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={q1}
            onChange={(e) => setQ1(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>-10 μC</span>
            <span>0</span>
            <span>+10 μC</span>
          </div>
        </div>

        {/* Charge 2 */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Charge q₂:</span>
            <span className={q2 > 0 ? 'text-red-600' : q2 < 0 ? 'text-blue-600' : 'text-gray-600'}>
              {q2 > 0 ? `+${q2}` : q2} μC
            </span>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={q2}
            onChange={(e) => setQ2(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>-10 μC</span>
            <span>0</span>
            <span>+10 μC</span>
          </div>
        </div>

        {/* Separation Distance */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Separation Distance r:</span>
            <span className="text-[#FF572E]">{distance.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={4.0}
            step={0.1}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>0.5 m (Near)</span>
            <span>4.0 m (Far)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
