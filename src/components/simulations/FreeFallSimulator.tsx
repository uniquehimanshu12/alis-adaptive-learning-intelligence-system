import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Wind } from 'lucide-react';

interface FreeFallSimulatorProps {
  standalone?: boolean;
  initialAirResistance?: number;
}

export const FreeFallSimulator: React.FC<FreeFallSimulatorProps> = ({
  standalone = true,
  initialAirResistance = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVacuum, setIsVacuum] = useState(initialAirResistance === 0);
  const [dropHeightMeters, setDropHeightMeters] = useState(50);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Physical parameters
  // Cannonball: 10 kg, low drag
  // Feather: 0.01 kg, high drag area
  const stateRef = useRef({
    y1: 40,
    y2: 40,
    v1: 0,
    v2: 0,
    landed1: false,
    landed2: false,
    time: 0,
  });

  const resetDrop = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    stateRef.current = {
      y1: 40,
      y2: 40,
      v1: 0,
      v2: 0,
      landed1: false,
      landed2: false,
      time: 0,
    };
  };

  useEffect(() => {
    resetDrop();
  }, [isVacuum, dropHeightMeters]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const s = stateRef.current;
      const groundY = 260;
      const g = 9.81;
      const dt = 0.03;

      if (isPlaying) {
        s.time += dt;
        setElapsedTime(Number(s.time.toFixed(2)));

        // Body 1: 10 kg Cannonball
        if (!s.landed1) {
          const drag1 = isVacuum ? 0 : 0.002 * s.v1 * s.v1;
          const a1 = g - drag1 / 10;
          s.v1 += a1 * dt;
          s.y1 += s.v1 * dt * 24;

          if (s.y1 >= groundY) {
            s.y1 = groundY;
            s.landed1 = true;
          }
        }

        // Body 2: 0.01 kg Songbird Feather
        if (!s.landed2) {
          // Feather has massive drag relative to its microscopic 0.01kg mass
          const drag2 = isVacuum ? 0 : 0.12 * s.v2 * s.v2;
          const a2 = Math.max(0, g - drag2 / 0.01);
          s.v2 += a2 * dt;
          s.y2 += s.v2 * dt * 24;

          if (s.y2 >= groundY) {
            s.y2 = groundY;
            s.landed2 = true;
          }
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vacuum chamber frame
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 2;
      ctx.strokeRect(120, 20, canvas.width - 240, groundY);

      // Ground
      ctx.fillStyle = '#171717';
      ctx.fillRect(100, groundY + 14, canvas.width - 200, 40);

      // Vacuum Indicator
      ctx.fillStyle = isVacuum ? '#10B981' : '#6B7280';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(isVacuum ? 'VACUUM ENCLOSURE (AIR DRAG: 0.00)' : 'AIR RESISTANCE ACTIVE (ATMOSPHERIC DRAG)', 135, 42);

      // Height scale lines
      for (let y = 60; y <= groundY; y += 40) {
        ctx.strokeStyle = 'rgba(23, 23, 23, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(120, y);
        ctx.lineTo(canvas.width - 120, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(23, 23, 23, 0.4)';
        ctx.font = '10px "JetBrains Mono", monospace';
        const metersRemaining = Math.round(((groundY - y) / (groundY - 40)) * dropHeightMeters);
        ctx.fillText(`${metersRemaining}m`, 85, y + 4);
      }

      // Drop Line 1: Cannonball (x = 240)
      const x1 = 260;
      ctx.fillStyle = '#171717';
      ctx.beginPath();
      ctx.arc(x1, s.y1, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#171717';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('10 kg Cannonball', x1 - 50, s.y1 - 18);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`v = ${(s.v1 * 3.6).toFixed(1)} km/h`, x1 - 40, s.y1 + 28);

      // Drop Line 2: Feather (x = 480)
      const x2 = 500;
      ctx.fillStyle = '#FF572E';
      // Draw delicate feather silhouette
      ctx.beginPath();
      ctx.ellipse(x2, s.y2, 16, 6, isVacuum ? 0 : Math.sin(s.y2 * 0.1) * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FF572E';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('0.01 kg Feather', x2 - 45, s.y2 - 18);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`v = ${(s.v2 * 3.6).toFixed(1)} km/h`, x2 - 35, s.y2 + 24);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isVacuum, dropHeightMeters]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />

        {/* Telemetry status overlay */}
        <div className="absolute top-4 right-4 bg-[#FFFCF6]/95 border border-[#171717]/10 rounded-xl p-3 shadow-xs pointer-events-none font-mono text-xs">
          <div className="text-[10px] text-[#171717]/60 uppercase mb-1">Elapsed Time:</div>
          <div className="text-xl font-bold tabular-nums text-[#171717]">{elapsedTime}s</div>

          {stateRef.current.landed1 && stateRef.current.landed2 && isVacuum && (
            <div className="mt-2 text-[11px] text-[#10B981] font-semibold border-t border-[#171717]/10 pt-1.5">
              ✓ Landed at the exact same instant!
            </div>
          )}
        </div>
      </div>

      {standalone && (
        <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(true)}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#FF572E] text-white hover:bg-[#e0451e] transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              Release Drop
            </button>
            <button
              onClick={resetDrop}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[#171717]/15 hover:bg-[#171717]/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsVacuum(!isVacuum)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                isVacuum
                  ? 'bg-[#10B981] text-white border-[#10B981]'
                  : 'bg-transparent text-[#171717] border-[#171717]/20 hover:bg-[#171717]/5'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              {isVacuum ? 'Vacuum Chamber Active (Drag = 0)' : 'Atmospheric Air Resistance (ON)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
