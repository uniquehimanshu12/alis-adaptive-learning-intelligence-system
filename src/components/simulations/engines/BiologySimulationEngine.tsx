import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Dna, Play, FastForward, Activity } from 'lucide-react';

interface BiologySimulationEngineProps {
  template?: 'natural_selection' | 'enzyme';
  initialParams?: Record<string, any>;
  standalone?: boolean;
}

export const BiologySimulationEngine: React.FC<BiologySimulationEngineProps> = ({
  template = 'natural_selection',
  initialParams = {},
  standalone = true,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<'natural_selection' | 'enzyme'>(template);

  // Natural selection parameters
  const [sootLevel, setSootLevel] = useState<number>(Number(initialParams.sootLevel) || 75); // 0 (pristine light bark) to 100 (heavily soot-darkened)
  const [generation, setGeneration] = useState<number>(1);
  const [lightMorphFreq, setLightMorphFreq] = useState<number>(0.85); // 85% light at gen 1
  const [predationPressure, setPredationPressure] = useState<number>(0.5);

  // Enzyme kinetics parameters
  const [substrateConc, setSubstrateConc] = useState<number>(Number(initialParams.substrateConc) || 20); // mM
  const [vMax, setVMax] = useState<number>(100);
  const [km, setKm] = useState<number>(15); // Michaelis constant

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Enzyme Michaelis-Menten rate
  const reactionVelocity = (vMax * substrateConc) / (km + substrateConc);

  // Step natural selection generations
  const stepGeneration = () => {
    setGeneration((prev) => prev + 1);

    // Fitness calculation:
    // When sootLevel is high (>50), dark morph has higher survival fitness; light morph has lower fitness.
    // When sootLevel is low (<50), light morph has higher survival fitness.
    const darkAdvantage = (sootLevel - 50) / 50; // -1.0 to +1.0
    const selectionDelta = darkAdvantage * predationPressure * 0.12;

    setLightMorphFreq((prev) => {
      const next = prev - selectionDelta;
      return Math.max(0.02, Math.min(0.98, next));
    });
  };

  const resetSelection = () => {
    setGeneration(1);
    setLightMorphFreq(0.85);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    if (activeTemplate === 'natural_selection') {
      // Draw Tree Bark Background (Interpolated between pale birch bark and dark soot)
      const sootR = Math.round(230 - (sootLevel / 100) * 190);
      const sootG = Math.round(220 - (sootLevel / 100) * 185);
      const sootB = Math.round(205 - (sootLevel / 100) * 175);
      ctx.fillStyle = `rgb(${sootR}, ${sootG}, ${sootB})`;
      ctx.fillRect(40, 20, w - 80, 260);

      // Bark texture lines
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 + (sootLevel / 100) * 0.15})`;
      ctx.lineWidth = 2;
      for (let y = 30; y < 270; y += 18) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.bezierCurveTo(w * 0.3, y + (y % 10) - 5, w * 0.7, y - (y % 8) + 4, w - 40, y);
        ctx.stroke();
      }

      // Draw Moth Population Sample (40 individual moths distributed on bark)
      const totalMoths = 36;
      const lightCount = Math.round(totalMoths * lightMorphFreq);
      const darkCount = totalMoths - lightCount;

      // Seed pseudo-random placement
      const moths = [];
      for (let i = 0; i < totalMoths; i++) {
        const isLight = i < lightCount;
        const col = i % 9;
        const row = Math.floor(i / 9);
        const mx = 80 + col * 68 + ((i * 17) % 24);
        const my = 55 + row * 55 + ((i * 23) % 20);
        moths.push({ x: mx, y: my, isLight });
      }

      // Render each moth
      moths.forEach((m) => {
        ctx.save();
        ctx.translate(m.x, m.y);

        if (m.isLight) {
          // Light speckled moth
          ctx.fillStyle = '#FAF6F0';
          ctx.strokeStyle = '#8C8275';
        } else {
          // Carbonaria dark melanic moth
          ctx.fillStyle = '#171717';
          ctx.strokeStyle = '#383838';
        }

        ctx.lineWidth = 1.5;
        // Wings
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-14, -10);
        ctx.lineTo(-10, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(14, -10);
        ctx.lineTo(10, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Moth body
        ctx.fillStyle = m.isLight ? '#D9D2C5' : '#0D0D0D';
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    } else {
      // Enzyme Kinetics: Plot Michaelis-Menten Velocity Curve
      const originX = 90;
      const originY = 240;
      const graphW = w - 180;
      const graphH = 180;

      // Coordinate axes
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + graphW, originY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, originY - graphH);
      ctx.stroke();

      // V_max Asymptote Dashed Line
      ctx.strokeStyle = 'rgba(255, 87, 46, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(originX, originY - graphH * 0.85);
      ctx.lineTo(originX + graphW, originY - graphH * 0.85);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#FF572E';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`V_max = ${vMax} μmol/min`, originX + graphW - 140, originY - graphH * 0.85 - 6);

      // 1/2 V_max Line
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(originX, originY - graphH * 0.425);
      ctx.lineTo(originX + km * 5.5, originY - graphH * 0.425);
      ctx.lineTo(originX + km * 5.5, originY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#10B981';
      ctx.fillText(`Km = ${km} mM (at 1/2 V_max)`, originX + km * 5.5 + 8, originY - graphH * 0.425 + 14);

      // Draw Michaelis-Menten curve
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let s = 0; s <= 90; s += 1) {
        const px = originX + s * 5.5;
        const rate = (vMax * s) / (km + s);
        const py = originY - (rate / vMax) * (graphH * 0.85);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current Operating Point
      const currentPx = originX + substrateConc * 5.5;
      const currentPy = originY - (reactionVelocity / vMax) * (graphH * 0.85);
      ctx.fillStyle = '#FF572E';
      ctx.beginPath();
      ctx.arc(currentPx, currentPy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFCF6';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#171717';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`V = ${reactionVelocity.toFixed(1)}`, currentPx + 10, currentPy - 6);
    }
  }, [activeTemplate, sootLevel, generation, lightMorphFreq, substrateConc, vMax, km, reactionVelocity]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/15 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F5F0E7] border-b border-[#171717]/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTemplate('natural_selection')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'natural_selection'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Natural Selection (Industrial Melanism)
          </button>
          <button
            onClick={() => setActiveTemplate('enzyme')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTemplate === 'enzyme'
                ? 'bg-[#171717] text-white'
                : 'text-[#171717]/70 hover:text-[#171717]'
            }`}
          >
            Enzyme Kinetics (Michaelis-Menten)
          </button>
        </div>

        <span className="text-xs font-mono font-bold text-[#FF572E]">
          {activeTemplate === 'natural_selection'
            ? `Gen ${generation} · Light: ${Math.round(lightMorphFreq * 100)}% | Dark: ${Math.round((1 - lightMorphFreq) * 100)}%`
            : `Rate V = ${reactionVelocity.toFixed(1)} μmol/min`}
        </span>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        {/* Telemetry Card */}
        <div className="absolute top-3 right-3 bg-[#FFFCF6]/95 border border-[#171717]/15 rounded-xl p-3 text-xs font-mono shadow-xs pointer-events-none min-w-[190px]">
          {activeTemplate === 'natural_selection' ? (
            <>
              <div className="text-[10px] uppercase text-[#171717]/60 mb-1 font-bold">
                Allele Frequencies:
              </div>
              <div className="text-sm font-bold text-[#171717]">
                Typica (Light): <span className="text-[#10B981]">{Math.round(lightMorphFreq * 100)}%</span>
              </div>
              <div className="text-sm font-bold text-[#171717]">
                Carbonaria (Dark): <span className="text-[#FF572E]">{Math.round((1 - lightMorphFreq) * 100)}%</span>
              </div>
              <div className="text-[11px] text-[#171717]/70 mt-1">
                Environment: {sootLevel > 50 ? 'Industrial Soot Active' : 'Pristine Lichen Bark'}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] uppercase text-[#171717]/60 mb-1 font-bold">
                Kinetics Equation:
              </div>
              <div className="text-sm font-bold text-[#FF572E]">
                V = V_max [S] / (Km + [S])
              </div>
              <div className="text-[11px] text-[#171717]/70 mt-1">
                Substrate [S]: {substrateConc} mM
              </div>
              <div className="text-[11px] text-[#10B981] font-semibold">
                Saturation: {Math.round((reactionVelocity / vMax) * 100)}% of V_max
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control Deck */}
      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          {activeTemplate === 'natural_selection' ? (
            <div className="flex flex-wrap items-center justify-between w-full gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={stepGeneration}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#171717] text-white font-bold hover:bg-[#333] transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  Next Generation (Gen {generation + 1})
                </button>
                <button
                  onClick={resetSelection}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#171717]/15 hover:bg-[#171717]/5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Gen 1
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171717]">Soot Pollution:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={sootLevel}
                    onChange={(e) => setSootLevel(Number(e.target.value))}
                    className="w-28 accent-[#FF572E]"
                  />
                  <span className="tabular-nums font-bold w-10">{sootLevel}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Substrate [S] (mM):</span>
                <input
                  type="range"
                  min="2"
                  max="80"
                  step="2"
                  value={substrateConc}
                  onChange={(e) => setSubstrateConc(Number(e.target.value))}
                  className="w-32 accent-[#FF572E]"
                />
                <span className="tabular-nums font-bold w-12">{substrateConc} mM</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">Km Constant:</span>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-24 accent-[#10B981]"
                />
                <span className="tabular-nums font-bold w-10">{km}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
