import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Compass, Activity, Orbit, Zap } from 'lucide-react';
import { NewtonLawsSimulator } from '../simulations/NewtonLawsSimulator';
import { GravitationSimulator } from '../simulations/GravitationSimulator';
import { WorkEnergySimulator } from '../simulations/WorkEnergySimulator';

interface PhysicsLabShowcaseProps {
  onEnterLabTopic: (topic: string) => void;
}

export const PhysicsLabShowcase: React.FC<PhysicsLabShowcaseProps> = ({ onEnterLabTopic }) => {
  const [activeDepartment, setActiveDepartment] = useState<'newton' | 'gravitation' | 'work_energy'>('newton');

  const departments = [
    {
      id: 'newton',
      title: "Newton's Laws & Mechanics",
      plateNumber: 'Plate 04',
      summary:
        'Force resolution, mass inertia, action-reaction pairs, and momentum transfer during dynamic collisions.',
      principles: [
        'Dynamic equilibrium & net vector summation: ΣF = ma',
        'Strict action-reaction symmetry: F_12 = -F_21',
        'Frictional boundaries & impulse transfer: J = ∫F dt',
      ],
      interactiveComponent: <NewtonLawsSimulator standalone={true} />,
    },
    {
      id: 'gravitation',
      title: 'Gravitation & Celestial Mechanics',
      plateNumber: 'Plate 14',
      summary:
        'Inverse-square attraction, celestial geodesic curvature, orbital insertion velocities, and the equivalence principle.',
      principles: [
        'Universal inverse-square force: F = G(m1 m2) / r²',
        'Equivalence of gravitational and inertial mass',
        'Orbital trajectories as continuous unresisted freefall',
      ],
      interactiveComponent: <GravitationSimulator standalone={true} />,
    },
    {
      id: 'work_energy',
      title: 'Work, Vectors & Energy Conservation',
      plateNumber: 'Plate 21',
      summary:
        'Vector inner products, positive and negative work, phase transitions between potential and kinetic energy along arbitrary geometry.',
      principles: [
        'Inner product work formulation: W = F · d · cos(θ)',
        'Perpendicular force orthogonality: W_normal = 0',
        'Conservative mechanical energy: E_tot = PE + KE + Q',
      ],
      interactiveComponent: <WorkEnergySimulator standalone={true} />,
    },
  ];

  const current = departments.find((d) => d.id === activeDepartment)!;

  return (
    <section className="py-24 px-6 bg-[#F5F0E7] border-b border-[#171717]/10" id="physics-lab">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#171717]/10 pb-8"
        >
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF572E] mb-3">
              Section 03 · Empirical Laboratory
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#171717]">
              EXPLORE THE PHYSICS LAB
            </h2>
          </div>
          <p className="text-sm font-sans text-[#171717]/70 max-w-md">
            Three comprehensive experimental departments. Every theoretical equation is grounded in an interactive sandbox.
          </p>
        </motion.div>

        {/* Department Switcher Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          {departments.map((dept) => (
            <motion.button
              key={dept.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveDepartment(dept.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                activeDepartment === dept.id
                  ? 'bg-[#171717] text-[#FFFCF6] shadow-sm scale-[1.02]'
                  : 'bg-[#FFFCF6] text-[#171717]/70 border border-[#171717]/15 hover:border-[#171717]'
              }`}
            >
              <span className="font-mono opacity-50 text-[10px]">{dept.plateNumber}</span>
              <span>{dept.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Department Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Principles & First Principles */}
          <motion.div
            key={`dept-left-${current.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="p-8 rounded-2xl bg-[#FFFCF6] border border-[#171717]/15 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono text-[#FF572E] font-bold mb-3">
                <span>{current.plateNumber}</span>
                <span>Interactive Department</span>
              </div>

              <h3 className="text-2xl font-bold font-display text-[#171717] mb-3 leading-snug">
                {current.title}
              </h3>

              <p className="text-sm font-sans text-[#171717]/80 leading-relaxed mb-6">
                {current.summary}
              </p>

              <div className="border-t border-[#171717]/10 pt-4 mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-[#171717]/60 font-bold mb-3">
                  Core Invariants Tested:
                </div>
                <ul className="space-y-2 text-xs font-mono text-[#171717]">
                  {current.principles.map((pr, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FF572E] font-bold">✓</span>
                      <span>{pr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterLabTopic(current.id)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FF572E] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0451e] transition-colors cursor-pointer shadow-2xs"
              >
                <span>Launch Department Questions</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column: Live Simulator */}
          <motion.div
            key={`dept-right-${current.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="p-1 rounded-2xl bg-[#171717]/5 border border-[#171717]/15 shadow-sm">
              {current.interactiveComponent}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
