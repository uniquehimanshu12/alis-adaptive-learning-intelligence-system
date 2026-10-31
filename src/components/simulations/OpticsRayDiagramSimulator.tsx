import React, { useEffect, useRef, useState } from 'react';
import { Compass, Eye, Sliders } from 'lucide-react';

interface OpticsRayDiagramSimulatorProps {
  standalone?: boolean;
}

export const OpticsRayDiagramSimulator: React.FC<OpticsRayDiagramSimulatorProps> = ({ standalone = true }) => {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(35); // degrees
  const [mediumIndex, setMediumIndex] = useState<number>(1.5); // Refractive index of glass (n2)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const n1 = 1.0; // Air refractive index
  const n2 = mediumIndex;
  const incidentAngleRad = (incidentAngleDeg * Math.PI) / 180;
  // Snell's Law: n1 * sin(i) = n2 * sin(r) => r = asin((n1/n2) * sin(i))
  const sinRefracted = (n1 / n2) * Math.sin(incidentAngleRad);
  const isTotalInternalReflection = sinRefracted > 1.0;
  const refractedAngleRad = isTotalInternalReflection ? Math.PI / 2 : Math.asin(sinRefracted);
  const refractedAngleDeg = (refractedAngleRad * 180) / Math.PI;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2 + 30;

    // Top Medium (Air, n = 1.0)
    ctx.fillStyle = 'rgba(2, 132, 199, 0.04)';
    ctx.fillRect(0, 0, w, centerY);

    // Bottom Medium (Glass / Water, n = n2)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(0, centerY, w, centerY);

    // Interface boundary line
    ctx.strokeStyle = '#171717';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();

    // Normal Line (Perpendicular dashed line)
    ctx.strokeStyle = 'rgba(23, 23, 23, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, 30);
    ctx.lineTo(centerX, h - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Normal label
    ctx.fillStyle = 'rgba(23, 23, 23, 0.6)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Normal (90°)', centerX + 35, 45);

    // Incident Ray (from top-left to interface center)
    const rayLength = 180;
    const startX = centerX - rayLength * Math.sin(incidentAngleRad);
    const startY = centerY - rayLength * Math.cos(incidentAngleRad);

    ctx.strokeStyle = '#FF572E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Arrowhead on incident ray
    ctx.fillStyle = '#FF572E';
    ctx.beginPath();
    ctx.moveTo(centerX - 12 * Math.sin(incidentAngleRad), centerY - 12 * Math.cos(incidentAngleRad));
    ctx.lineTo(centerX - 5 * Math.sin(incidentAngleRad) - 5, centerY - 5 * Math.cos(incidentAngleRad) - 5);
    ctx.lineTo(centerX - 5 * Math.sin(incidentAngleRad) + 5, centerY - 5 * Math.cos(incidentAngleRad) + 5);
    ctx.fill();

    // Incident angle arc & label
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, -Math.PI / 2 - incidentAngleRad, -Math.PI / 2);
    ctx.strokeStyle = '#FF572E';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FF572E';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`i = ${incidentAngleDeg}°`, centerX - 32, centerY - 24);

    if (isTotalInternalReflection) {
      // Reflected Ray (TIR)
      const endX = centerX + rayLength * Math.sin(incidentAngleRad);
      const endY = centerY - rayLength * Math.cos(incidentAngleRad);

      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('TOTAL INTERNAL REFLECTION (TIR)', centerX, centerY + 45);
    } else {
      // Refracted Ray (into bottom medium)
      const endX = centerX + rayLength * Math.sin(refractedAngleRad);
      const endY = centerY + rayLength * Math.cos(refractedAngleRad);

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Refracted angle arc & label
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, Math.PI / 2 - refractedAngleRad, Math.PI / 2);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`r = ${refractedAngleDeg.toFixed(1)}°`, centerX + 38, centerY + 28);
    }
  }, [incidentAngleDeg, mediumIndex, isTotalInternalReflection, refractedAngleDeg, incidentAngleRad, refractedAngleRad, n2]);

  return (
    <div className="flex flex-col bg-[#FFFCF6] border border-[#171717]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-[#F5F0E7] border-b border-[#171717]/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#FF572E]" />
          <span className="font-display font-bold text-sm text-[#171717]">
            Class X Light: Snell's Law Refraction Ray Diagram
          </span>
        </div>

        <div className="text-xs font-mono font-bold text-[#10B981] bg-white px-3 py-1 rounded-lg border border-[#171717]/10">
          Refractive Index n = {mediumIndex}
        </div>
      </div>

      <div className="relative w-full h-[320px] bg-scientific-grid bg-[#FAF6F0] overflow-hidden">
        <canvas ref={canvasRef} width={760} height={320} className="w-full h-full block" />
      </div>

      <div className="p-4 bg-[#FFFCF6] border-t border-[#171717]/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Angle of Incidence i: {incidentAngleDeg}°
          </label>
          <input
            type="range"
            min={10}
            max={75}
            step={1}
            value={incidentAngleDeg}
            onChange={(e) => setIncidentAngleDeg(Number(e.target.value))}
            className="w-full accent-[#FF572E]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#171717]/60 block">
            Medium Refractive Index n₂: {mediumIndex}
          </label>
          <input
            type="range"
            min={1.1}
            max={2.4}
            step={0.05}
            value={mediumIndex}
            onChange={(e) => setMediumIndex(Number(e.target.value))}
            className="w-full accent-[#10B981]"
          />
        </div>
      </div>
    </div>
  );
};
