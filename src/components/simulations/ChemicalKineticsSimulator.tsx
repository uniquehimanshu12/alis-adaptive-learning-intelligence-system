import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Flame, Sparkles } from 'lucide-react';

interface ChemicalKineticsSimulatorProps {
  initialTemp?: number; // Kelvin
  initialEa?: number; // kJ/mol
  standalone?: boolean;
}

export const ChemicalKineticsSimulator: React.FC<ChemicalKineticsSimulatorProps> = ({
  initialTemp = 300,
  initialEa = 50,
  standalone = true,
}) => {
  const [temperature, setTemperature] = useState<number>(initialTemp);
  const [ea, setEa] = useState<number>(initialEa);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gas constant R = 8.314 J/(mol·K) = 0.008314 kJ/(mol·K)
  const R = 0.008314;
  // Boltzmann fraction exceeding barrier = exp(-Ea / (R * T))
  const exponent = -ea / (R * temperature);
  const reactiveFraction = Math.exp(exponent);
  // Frequency factor A ~ 10^7
  const rateConstant = 1e7 * reactiveFraction;

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
    const plotW = w - paddingLeft - 20;
    const plotH = h - paddingBottom - 30;

    // Grid
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.06)';
    ctx.lineWidth = 1;
    for (let x = paddingLeft; x <= w - 20; x += plotW / 6) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - paddingBottom);
      ctx.stroke();
    }
    for (let y = 20; y <= h - paddingBottom; y += plotH / 4) {
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, 20);
    ctx.lineTo(paddingLeft, h - paddingBottom);
    ctx.lineTo(w - 20, h - paddingBottom);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#171717';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Molecular Kinetic Energy E (kJ/mol)', paddingLeft + plotW / 2, h - 12);

    ctx.save();
    ctx.translate(18, 20 + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Fraction of Molecules f(E)', 0, 0);
    ctx.restore();

    // Maxwell-Boltzmann Curve: f(E) ~ sqrt(E) * exp(-E / (RT))
    // We scale max energy to 150 kJ/mol
    const maxEnergy = 140;
    const points: { x: number; y: number; energy: number }[] = [];

    // Calculate normalizer
    const kT = R * temperature;
    let peakY = 0;

    for (let E = 0; E <= maxEnergy; E += 1) {
      const val = Math.sqrt(E) * Math.exp(-E / kT);
      if (val > peakY) peakY = val;
    }

    for (let E = 0; E <= maxEnergy; E += 1) {
      const val = Math.sqrt(E) * Math.exp(-E / kT);
      const normY = val / (peakY || 1);
      const px = paddingLeft + (E / maxEnergy) * plotW;
      const py = h - paddingBottom - normY * (plotH * 0.9);
      points.push({ x: px, y: py, energy: E });
    }

    // Activation Energy line position
    const eaPx = paddingLeft + (ea / maxEnergy) * plotW;

    // Fill area where E >= Ea (Reactive molecules)
    ctx.fillStyle = 'rgba(255, 87, 46, 0.35)';
    ctx.beginPath();
    ctx.moveTo(eaPx, h - paddingBottom);

    for (const pt of points) {
      if (pt.energy >= ea) {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    const lastPt = points[points.length - 1];
    ctx.lineTo(lastPt.x, h - paddingBottom);
    ctx.closePath();
    ctx.fill();

    // Draw Main Maxwell-Boltzmann Curve
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Activation Energy Barrier Line (Dashed red line)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(eaPx, 25);
    ctx.lineTo(eaPx, h - paddingBottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Barrier label
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Activation Energy Ea = ${ea} kJ`, eaPx, 20);

    // Reactive area tag
    if (eaPx < w - 100) {
      ctx.fillStyle = '#FF572E';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Reacting Molecules (E ≥ Ea)`, eaPx + 8, h - paddingBottom - 35);
    }
  }, [temperature, ea, R]);

  return (
    <div className={`p-6 bg-[#FFFCF6] rounded-2xl border border-[#171717]/15 ${standalone ? 'shadow-sm' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#171717]/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10B981] uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>Chemical Kinetics & Collision Theory</span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#171717]">
            Maxwell-Boltzmann Energy Distribution & Arrhenius Simulator
          </h3>
        </div>

        <button
          onClick={() => {
            setTemperature(300);
            setEa(50);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#171717]/15 hover:border-[#171717] text-[#171717] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Canvas */}
      <div className="w-full bg-[#FAF6F0] rounded-xl border border-[#171717]/10 overflow-hidden mb-6 relative">
        <canvas ref={canvasRef} width={640} height={250} className="w-full h-auto block" />

        {/* Readout overlay */}
        <div className="absolute top-3 right-3 bg-[#FFFCF6]/95 backdrop-blur-xs p-3 rounded-xl border border-[#171717]/15 text-xs font-mono text-right shadow-2xs">
          <div className="text-[10px] text-[#171717]/50 uppercase font-bold">
            Boltzmann Reactive Fraction
          </div>
          <div className="text-[#FF572E] font-black text-sm">
            f = e^(-Ea/RT) = {reactiveFraction.toExponential(3)}
          </div>
          <div className="text-[11px] text-[#171717]/70 mt-0.5">
            Reaction Rate Constant k ~ {rateConstant.toFixed(1)} s⁻¹
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
        {/* Temperature Slider */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Temperature T:</span>
            <span className="text-[#FF572E] font-bold">
              {temperature} K ({temperature - 273}°C)
            </span>
          </div>
          <input
            type="range"
            min={250}
            max={650}
            step={10}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>250 K (Cold)</span>
            <span>300 K (Room)</span>
            <span>650 K (Hot)</span>
          </div>
        </div>

        {/* Activation Energy Slider */}
        <div className="p-3.5 rounded-xl bg-[#F5F0E7] border border-[#171717]/10">
          <div className="flex justify-between font-bold mb-2">
            <span>Activation Energy Barrier Ea:</span>
            <span className="text-[#10B981] font-bold">{ea} kJ/mol</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={ea}
            onChange={(e) => setEa(Number(e.target.value))}
            className="w-full accent-[#10B981]"
          />
          <div className="flex justify-between text-[10px] text-[#171717]/50 mt-1">
            <span>20 kJ (Catalyzed / Low)</span>
            <span>100 kJ (High Barrier)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
