import React from 'react';
import { QuestionSimulationConfig, SimulationType } from '../../types/physics';
import { NewtonLawsSimulator } from './NewtonLawsSimulator';
import { GravitationSimulator } from './GravitationSimulator';
import { WorkEnergySimulator } from './WorkEnergySimulator';
import { FreeFallSimulator } from './FreeFallSimulator';
import { InclineSimulator } from './InclineSimulator';
import { CoulombLawSimulator } from './CoulombLawSimulator';
import { ProjectileMotionSimulator } from './ProjectileMotionSimulator';
import { CalculusDifferentiationSimulator } from './CalculusDifferentiationSimulator';
import { ChemicalKineticsSimulator } from './ChemicalKineticsSimulator';
import { DnaReplicationSimulator } from './DnaReplicationSimulator';
import { RecursionStackSimulator } from './RecursionStackSimulator';
import { MathematicsSimulationEngine } from './engines/MathematicsSimulationEngine';
import { ChemistrySimulationEngine } from './engines/ChemistrySimulationEngine';
import { BiologySimulationEngine } from './engines/BiologySimulationEngine';
import { ComputerScienceSimulationEngine } from './engines/ComputerScienceSimulationEngine';
import { KinematicsGraphSimulator } from './KinematicsGraphSimulator';
import { OhmsLawGraphSimulator } from './OhmsLawGraphSimulator';
import { OpticsRayDiagramSimulator } from './OpticsRayDiagramSimulator';

interface SimulationHostProps {
  config: QuestionSimulationConfig;
  standalone?: boolean;
}

export const SimulationHost: React.FC<SimulationHostProps> = ({ config, standalone = true }) => {
  const type = config?.type;
  const params = config?.initialParams || {};

  switch (type) {
    case 'coulomb_law' as any:
      return (
        <CoulombLawSimulator
          standalone={standalone}
          initialQ1={Number(params.q1) || 4}
          initialQ2={Number(params.q2) || -6}
          initialDistance={Number(params.distance) || 1.5}
        />
      );

    case 'projectile':
      return (
        <ProjectileMotionSimulator
          standalone={standalone}
          initialAngle={Number(params.launchAngleDeg) || 45}
          initialSpeed={Number(params.v0) || 25}
        />
      );

    case 'math_differentiation' as any:
      return (
        <CalculusDifferentiationSimulator
          standalone={standalone}
          initialX={Number(params.x) || 1.0}
          initialDeltaX={Number(params.deltaX) || 0.5}
        />
      );

    case 'chem_kinetics' as any:
      return (
        <ChemicalKineticsSimulator
          standalone={standalone}
          initialTemp={Number(params.temperatureK) || 300}
          initialEa={Number(params.ea) || 50}
        />
      );

    case 'kinematics_graph' as any:
      return <KinematicsGraphSimulator standalone={standalone} />;

    case 'ohms_law_graph' as any:
      return <OhmsLawGraphSimulator standalone={standalone} />;

    case 'optics_ray' as any:
      return <OpticsRayDiagramSimulator standalone={standalone} />;

    case 'cs_recursion' as any:
      return <RecursionStackSimulator standalone={standalone} />;

    case 'collision':
      return (
        <NewtonLawsSimulator
          standalone={standalone}
          initialTruckMass={Number(params.truckMass) || 4000}
          initialCarMass={Number(params.carMass) || 800}
        />
      );

    case 'orbit':
      return (
        <GravitationSimulator
          standalone={standalone}
          initialAltitudeKm={Number(params.orbitalAltitudeKm) || 400}
        />
      );

    case 'work_vector':
      return (
        <WorkEnergySimulator
          standalone={standalone}
          initialForceAngle={Number(params.forceAngleDeg) || 90}
          initialDisplacement={Number(params.displacement) || 40}
        />
      );

    case 'freefall':
      return (
        <FreeFallSimulator
          standalone={standalone}
          initialAirResistance={Number(params.airResistance) || 0}
        />
      );

    case 'incline':
      return (
        <InclineSimulator
          standalone={standalone}
          initialAngle={Number(params.rampAngleDeg) || 35}
          initialMass={Number(params.massKg) || 10}
        />
      );

    case 'math_quadratic':
      return (
        <MathematicsSimulationEngine
          template="quadratic"
          initialParams={params}
          standalone={standalone}
        />
      );

    case 'math_trig':
      return (
        <MathematicsSimulationEngine
          template="trig"
          initialParams={params}
          standalone={standalone}
        />
      );

    case 'chem_concentration':
      return (
        <ChemistrySimulationEngine
          template="concentration"
          initialParams={params}
          standalone={standalone}
        />
      );

    case 'chem_ideal_gas':
      return (
        <ChemistrySimulationEngine
          template="gas"
          initialParams={params}
          standalone={standalone}
        />
      );

    case 'bio_natural_selection':
      return (
        <BiologySimulationEngine
          template="natural_selection"
          initialParams={params}
          standalone={standalone}
        />
      );

    case 'bio_enzyme':
      return (
        <BiologySimulationEngine
          template="enzyme"
          initialParams={params}
          standalone={standalone}
        />
      );

    case 'cs_binary_search':
    case 'cs_sorting':
      return (
        <ComputerScienceSimulationEngine
          template="binary_search"
          initialParams={params}
          standalone={standalone}
        />
      );

    default:
      // When no matching simulation exists, do NOT force an unrelated Newton's laws simulation!
      return null;
  }
};
