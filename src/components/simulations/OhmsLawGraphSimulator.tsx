import React, { useEffect, useRef, useState } from 'react';
import { Zap, Sliders, Activity } from 'lucide-react';

interface OhmsLawGraphSimulatorProps {
  standalone?: boolean;
}

export const OhmsLawGraphSimulator: React.FC<OhmsLawGraphSimulatorProps> = ({ standalone = true }) => {
  const [resistance, setResistance] = useState<number>(10); // Ohms
  const [voltage, setVoltage] = useState<number>(12); // Volts (max)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const current = voltage / resistance; // Amperes

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

    // Grid
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
    ctx.lineTo(w - padding, h - padding); // X axis (Current I in Amperes)
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding); // Y axis (Voltage V in Volts)
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Electric Current I (Amperes)', w / 2, h - 15);

    ctx.save();
    ctx.translate(18, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Potential Difference V (Volts)', 0, 0);
    ctx.restore();

    // Max scales
    const maxI = 3.0; // Max Amperes on X
    const maxV = 24.0; // Max Volts on Y

    // Ohm's Law V-I Characteristic Line: V = I * R (Slope = Resistance R)
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    const x0 = padding;
    const y0 = h - padding;
    const x1 = padding + (maxI / maxI) * graphW;
    const y1 = (h - padding) - ((maxI * resistance) / maxV) * graphH;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, Math.max(padding, y1));
    ctx.stroke();

    // Operating point (V, I)
    const opX = padding + (current / maxI) * graphW;
    const opY = (h - padding) - (voltage / maxV) * graphH;

    ctx.fillStyle = '#FF572E';
    ctx.beginPath();
    ctx.arc(opX, opY, 7, 0, Math.PI * 2);
    ctx.fill();

    // Dashed coordinate pointers
    ctx.strokeStyle = '#FF572E';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(opX, opY);
    ctx.lineTo(opX, h - padding);
    ctx.moveTo(opX, opY);
    ctx.lineTo(padding, opY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ticks & values
    ctx.fillStyle = 'rgba(23, 23, 23, 0.6)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= maxI; i += 0.5) {
      const px = padding + (i / maxI) * graphW;
      ctx.fillText(`${i.toFixed(1)}A`, px, h - padding + 16);
    }

    ctx.textAlign = 'right';
    for (let v = 0; v <= maxV; v += 6) {
      const py = (h - padding) - (v / maxV) * graphH;
      ctx.fillText(`${v}V`, padding - 8, py + 4);
    }
  }, [resistance, voltage, current]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-[#F5F0E7] border-b border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#0284C7]" />
          <span className="font-display font-bold text-sm text-[#171717]">
            Class X Electricity: Ohm's Law V-I Characteristic Graph
          </span>
        </div>

        <div className="text-xs font-mono font-bold text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-[#171717]/10">
          Slope (Resistance R) = {resistance} Ω
        </div>
      </div>

      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />
      </div>

      <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Resistance R: {resistance} Ω
          </label>
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full accent-[#0284C7]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Applied Voltage V: {voltage} V (Current I = {current.toFixed(2)} A)
          </label>
          <input
            type="range"
            min={2}
            max={24}
            step={1}
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full accent-[#0284C7]"
          />
        </div>
      </div>
    </div>
  );
};
