import React, { useState } from 'react';
import { Compass, Orbit, Activity, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import { NewtonLawsSimulator } from '../simulations/NewtonLawsSimulator';
import { GravitationSimulator } from '../simulations/GravitationSimulator';
import { WorkEnergySimulator } from '../simulations/WorkEnergySimulator';
import { FreeFallSimulator } from '../simulations/FreeFallSimulator';
import { InclineSimulator } from '../simulations/InclineSimulator';

interface OpenPhysicsSandboxProps {
  onBackToOverview: () => void;
  onStartLearning: () => void;
  initialLab?: 'gravitation' | 'newton' | 'work_energy' | 'freefall' | 'incline' | string;
}

export const OpenPhysicsSandbox: React.FC<OpenPhysicsSandboxProps> = ({
  onBackToOverview,
  onStartLearning,
  initialLab,
}) => {
  const [activeLab, setActiveLab] = useState<
    'gravitation' | 'newton' | 'work_energy' | 'freefall' | 'incline'
  >(() => {
    if (initialLab && ['gravitation', 'newton', 'work_energy', 'freefall', 'incline'].includes(initialLab)) {
      return initialLab as any;
    }
    return 'gravitation';
  });

  React.useEffect(() => {
    if (initialLab && ['gravitation', 'newton', 'work_energy', 'freefall', 'incline'].includes(initialLab)) {
      setActiveLab(initialLab as any);
    }
  }, [initialLab]);

  const labList = [
    {
      id: 'gravitation',
      title: 'Gravitation & Multi-Body Orbits',
      formula: 'F_g = G \\frac{m_1 m_2}{r^2}',
      description:
        'Sling celestial bodies into orbit, adjust planetary masses, and explore relativistic gravitational curvature.',
      icon: <Orbit className="w-4 h-4 text-[#FF572E]" />,
    },
    {
      id: 'newton',
      title: "Newton's Third Law & Collision Mechanics",
      formula: 'F_{12} = -F_{21} \\quad J = \\Delta p',
      description:
        'Collide unequal masses with variable friction and restitution to verify action-reaction force symmetry.',
      icon: <Activity className="w-4 h-4 text-[#10B981]" />,
    },
    {
      id: 'work_energy',
      title: 'Conservation of Mechanical Energy & Vectors',
      formula: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta',
      description:
        'Inspect potential to kinetic energy exchange on roller coaster tracks and test vector force orthogonality.',
      icon: <Zap className="w-4 h-4 text-[#FF572E]" />,
    },
    {
      id: 'freefall',
      title: 'Vacuum Tower & Free Fall Equivalence',
      formula: 'a = \\frac{F_g}{m} = g',
      description:
        'Drop a cannonball and feather simultaneously with or without atmospheric drag to observe mass cancellation.',
      icon: <Compass className="w-4 h-4 text-[#C8F169]" />,
    },
    {
      id: 'incline',
      title: 'Ramp Incline Normal Force Decomposition',
      formula: 'N = m g \\cos\\theta',
      description:
        'Tilt ramp angles from 0° to 85° and watch the perpendicular normal reaction force vector dynamically decrease.',
      icon: <Compass className="w-4 h-4 text-[#10B981]" />,
    },
  ];

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-[#171717]/10">
        <div>
          <button
            onClick={onBackToOverview}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#171717]/60 hover:text-[#171717] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Overview
          </button>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#171717]">
            OPEN PHYSICS LABORATORY
          </h1>
        </div>

        <button
          onClick={onStartLearning}
          className="px-5 py-2.5 bg-[#FF572E] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-colors"
        >
          Test Intuition with Questions →
        </button>
      </div>

      {/* Lab Module Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {labList.map((lab) => (
          <button
            key={lab.id}
            onClick={() => setActiveLab(lab.id as any)}
            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
              activeLab === lab.id
                ? 'bg-[#171717] text-[#FFFCF6] border-[#171717] shadow-sm'
                : 'bg-[#FFFCF6] text-[#171717] border-[#171717]/15 hover:border-[#171717]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {lab.icon}
              <span className="font-display font-bold text-xs leading-tight">{lab.title}</span>
            </div>
            <span
              className={`font-mono text-[10px] ${
                activeLab === lab.id ? 'text-[#C8F169]' : 'text-[#171717]/50'
              }`}
            >
              {lab.formula}
            </span>
          </button>
        ))}
      </div>

      {/* Main Simulation Stage */}
      <div className="bg-[#FFFCF6] border border-[#171717]/15 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#171717]/10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#FF572E] mb-1">
              Active Physics Experiment
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#171717]">
              {labList.find((l) => l.id === activeLab)?.title}
            </h2>
          </div>
          <p className="text-xs font-sans text-[#171717]/70 max-w-md">
            {labList.find((l) => l.id === activeLab)?.description}
          </p>
        </div>

        {activeLab === 'gravitation' && <GravitationSimulator standalone={true} />}
        {activeLab === 'newton' && <NewtonLawsSimulator standalone={true} />}
        {activeLab === 'work_energy' && <WorkEnergySimulator standalone={true} />}
        {activeLab === 'freefall' && <FreeFallSimulator standalone={true} />}
        {activeLab === 'incline' && <InclineSimulator standalone={true} />}
      </div>
    </div>
  );
};
