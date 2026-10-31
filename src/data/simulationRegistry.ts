import { AcademicSubject, SimulationType } from '../types/physics';

export interface SimulationMetadata {
  id: SimulationType;
  title: string;
  subject: AcademicSubject;
  chapter: string;
  topic: string;
  formula: string;
  description: string;
  keyControls: string[];
  triggerKeywords: string[];
}

export const SIMULATION_REGISTRY: Record<string, SimulationMetadata> = {
  coulomb_law: {
    id: 'coulomb_law' as any,
    title: "Coulomb's Law & Electric Field Visualizer",
    subject: 'Physics',
    chapter: 'Electrostatics',
    topic: 'Coulomb Interaction & Inverse Square Force',
    formula: 'F = k_e \\frac{|q_1 q_2|}{r^2}',
    description: 'Adjust charge magnitudes q₁ and q₂ and distance r to observe electrostatic attraction/repulsion and vector magnitude.',
    keyControls: ['Charge q₁ (μC)', 'Charge q₂ (μC)', 'Separation Distance r (m)'],
    triggerKeywords: ['coulomb', 'electrostatic', 'electric force', 'point charge', 'q1', 'q2', 'charge doubles', 'electric field'],
  },
  projectile: {
    id: 'projectile',
    title: 'Kinematics & Parabolic Projectile Trajectory',
    subject: 'Physics',
    chapter: 'Kinematics',
    topic: 'Two-Dimensional Projectile Motion',
    formula: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g} \\quad H = \\frac{v_0^2 \\sin^2\\theta}{2g}',
    description: 'Launch projectiles at variable velocity v₀ and angle θ to observe independent vertical and horizontal kinematic vectors.',
    keyControls: ['Launch Velocity v₀ (m/s)', 'Launch Angle θ (deg)', 'Gravity g'],
    triggerKeywords: ['projectile', 'catapult', 'launch angle', 'trajectory', 'bullet drop', 'maximum range', '45 degrees'],
  },
  harmonic_spring: {
    id: 'harmonic_spring',
    title: 'Simple Harmonic Motion (Mass-Spring Oscillator)',
    subject: 'Physics',
    chapter: 'Oscillations & Waves',
    topic: 'Hooke Oscillator & Natural Frequency',
    formula: 'T = 2\\pi \\sqrt{\\frac{m}{k}} \\quad \\omega_0 = \\sqrt{\\frac{k}{m}}',
    description: 'Adjust mass m and spring stiffness k to monitor sinusoidal displacement, velocity, and resonance amplitude.',
    keyControls: ['Mass m (kg)', 'Spring Constant k (N/m)', 'Initial Displacement x (m)'],
    triggerKeywords: ['shm', 'simple harmonic', 'spring constant', 'oscillation', 'resonance', 'pendulum', 'isochronous'],
  },
  collision: {
    id: 'collision',
    title: "Newton's Third Law & Collision Mechanics",
    subject: 'Physics',
    chapter: "Newton's Laws",
    topic: 'Action-Reaction Pairs & Momentum Conservation',
    formula: '\\vec{F}_{12} = -\\vec{F}_{21} \\quad \\Delta p_1 = -\\Delta p_2',
    description: 'Collide unequal masses with variable velocity to verify instantaneous interaction force symmetry.',
    keyControls: ['Truck Mass (kg)', 'Car Mass (kg)', 'Initial Velocities'],
    triggerKeywords: ['newton', 'third law', 'collision', 'truck hits car', 'action reaction', 'impulse', 'momentum'],
  },
  orbit: {
    id: 'orbit',
    title: 'Universal Gravitation & Orbital Motion',
    subject: 'Physics',
    chapter: 'Gravitation',
    topic: 'Newtonian Gravity & Stable Orbits',
    formula: 'v_{\\text{orb}} = \\sqrt{\\frac{G M}{r}} \\quad F_g = G \\frac{M m}{r^2}',
    description: 'Launch orbital bodies into circular and elliptical trajectories around Earth matching curvature in free fall.',
    keyControls: ['Orbital Altitude (km)', 'Orbital Velocity (km/s)'],
    triggerKeywords: ['orbit', 'satellite', 'gravity', 'weightless in space', 'iss', 'escape velocity', 'kepler'],
  },
  work_vector: {
    id: 'work_vector',
    title: 'Mechanical Work & Force Vector Orthogonality',
    subject: 'Physics',
    chapter: 'Work, Energy & Power',
    topic: 'Dot Product & Zero Work Condition',
    formula: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta',
    description: 'Vary force angle from 0° to 180° to observe when mechanical work is positive, negative, or identically zero.',
    keyControls: ['Force Vector Angle θ (deg)', 'Displacement (m)', 'Applied Force (N)'],
    triggerKeywords: ['work', 'dot product', 'carrying crate', 'orthogonal', 'cos theta', 'zero work'],
  },
  freefall: {
    id: 'freefall',
    title: 'Equivalence Principle Vacuum Drop Tower',
    subject: 'Physics',
    chapter: "Newton's Laws & Gravitation",
    topic: 'Mass Independence in Vacuum Fall',
    formula: 'a = \\frac{F_g}{m} = \\frac{m g}{m} = g',
    description: 'Simultaneously release heavy sphere and feather in vacuum and atmosphere to observe air resistance vs mass cancellation.',
    keyControls: ['Vacuum Switch (On/Off)', 'Drop Height (m)'],
    triggerKeywords: ['free fall', 'feather and cannonball', 'vacuum drop', 'drop tower', 'heavier object fall faster'],
  },
  incline: {
    id: 'incline',
    title: 'Inclined Plane Normal Force Decomposition',
    subject: 'Physics',
    chapter: "Newton's Laws",
    topic: 'Vector Resolution on Inclines',
    formula: 'N = m g \\cos\\theta \\quad F_{\\parallel} = m g \\sin\\theta',
    description: 'Tilt ramp angles from 0° to 85° and monitor the perpendicular normal force vector decrease.',
    keyControls: ['Ramp Tilt Angle θ (deg)', 'Block Mass (kg)', 'Friction Coefficient μ'],
    triggerKeywords: ['incline', 'ramp', 'normal force', 'steep ramp', 'mg cos theta', 'friction on ramp'],
  },
  math_differentiation: {
    id: 'math_differentiation' as any,
    title: 'Differential Calculus & Tangent Slope Visualizer',
    subject: 'Mathematics',
    chapter: 'Calculus',
    topic: 'Secant to Tangent Derivative Limit',
    formula: "f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}",
    description: 'Interact with secant line intervals Δx approaching zero to observe the instantaneous tangent slope on sin(x²), x² sin(x), or polynomials.',
    keyControls: ['Evaluation Point x', 'Secant Step Δx', 'Function Selector'],
    triggerKeywords: ['differentiat', 'derivative', 'tangent line', 'slope of curve', 'sin(x^2)', 'product rule', 'secant limit'],
  },
  math_quadratic: {
    id: 'math_quadratic',
    title: 'Quadratic Parabolic Functions & Roots',
    subject: 'Mathematics',
    chapter: 'Algebra',
    topic: 'Standard Parabola & Discriminant Analysis',
    formula: 'y = a x^2 + b x + c \\quad \\Delta = b^2 - 4ac',
    description: 'Adjust quadratic coefficients a, b, and c to track vertex coordinates, axis of symmetry, and real/complex roots.',
    keyControls: ['Quadratic a', 'Linear b', 'Constant c'],
    triggerKeywords: ['quadratic', 'parabola', 'discriminant', 'vertex', 'roots of equation'],
  },
  math_trig: {
    id: 'math_trig',
    title: 'Trigonometric Wave & Harmonic Oscillator',
    subject: 'Mathematics',
    chapter: 'Trigonometry',
    topic: 'Periodic Functions & Phase Shift',
    formula: 'y = A \\sin(\\omega x + \\phi)',
    description: 'Inspect amplitude, angular frequency, and phase shift on trigonometric waves.',
    keyControls: ['Amplitude A', 'Frequency ω', 'Phase Shift φ'],
    triggerKeywords: ['sine wave', 'trig function', 'cosine wave', 'amplitude', 'period of wave'],
  },
  chem_kinetics: {
    id: 'chem_kinetics' as any,
    title: 'Chemical Kinetics & Maxwell-Boltzmann Collision Simulator',
    subject: 'Chemistry',
    chapter: 'Chemical Kinetics',
    topic: 'Arrhenius Equation & Reaction Rates',
    formula: 'k = A \\, e^{-\\frac{E_a}{R T}}',
    description: 'Adjust temperature and reactant concentration to view particle kinetic distribution and rate of successful barrier-clearing collisions.',
    keyControls: ['Temperature T (K)', 'Concentration (M)', 'Activation Energy E_a'],
    triggerKeywords: ['reaction rate', 'temperature increase', 'activation energy', 'arrhenius', 'collision theory', 'maxwell boltzmann'],
  },
  chem_concentration: {
    id: 'chem_concentration',
    title: 'Aqueous Solutions & Molar Concentration',
    subject: 'Chemistry',
    chapter: 'Solutions',
    topic: 'Molarity & Dilution Law',
    formula: 'C = \\frac{n}{V} \\quad M_1 V_1 = M_2 V_2',
    description: 'Add solute moles and dilute with water volume to observe ion concentration and color intensity.',
    keyControls: ['Solute Amount n (moles)', 'Solution Volume V (L)'],
    triggerKeywords: ['molarity', 'concentration', 'dilution', 'dissolve salt', 'moles per liter'],
  },
  chem_ideal_gas: {
    id: 'chem_ideal_gas',
    title: 'Kinetic Gas Theory & Piston Pressure Simulator',
    subject: 'Chemistry',
    chapter: 'States of Matter',
    topic: 'Ideal Gas Law & PVT States',
    formula: 'P V = n R T',
    description: 'Compress piston volume and heat gas to monitor live pressure, temperature, and particle collisions.',
    keyControls: ['Temperature T (K)', 'Piston Volume V (L)'],
    triggerKeywords: ['gas law', 'pv = nrt', 'boyle', 'charles', 'gas pressure', 'piston'],
  },
  bio_dna_replication: {
    id: 'bio_dna_replication' as any,
    title: 'DNA Replication & Complementary Base Pairing',
    subject: 'Biology',
    chapter: 'Molecular Biology',
    topic: 'Semi-Conservative Replication Fork',
    formula: "\\text{Helicase unzips } 5' \\to 3' \\text{ elongation}",
    description: 'Unzip the DNA double helix to observe leading strand continuous synthesis and lagging strand Okazaki fragments with base pairing.',
    keyControls: ['Replication Fork Progress', 'Enzyme Display', 'Base Pair Highlight'],
    triggerKeywords: ['dna replication', 'helicase', 'polymerase', 'okazaki', 'leading strand', 'base pairing', 'adenine thymine'],
  },
  bio_natural_selection: {
    id: 'bio_natural_selection',
    title: 'Natural Selection & Industrial Melanism Simulator',
    subject: 'Biology',
    chapter: 'Evolution',
    topic: 'Differential Predation & Allele Frequency',
    formula: '\\Delta p = \\frac{p q (w_A - w_a)}{\\bar{w}}',
    description: 'Alter industrial soot pollution levels to watch peppered moth survival frequencies shift over generations.',
    keyControls: ['Soot Pollution Level (%)', 'Generation Advance', 'Predator Pressure'],
    triggerKeywords: ['natural selection', 'evolution', 'peppered moth', 'allele frequency', 'darwin', 'adaptation'],
  },
  bio_mitosis: {
    id: 'bio_mitosis' as any,
    title: 'Cell Division & Mitosis Stages Visualizer',
    subject: 'Biology',
    chapter: 'Cell Biology',
    topic: 'Stages of Somatic Cell Division',
    formula: '2n \\to 2n \\quad (\\text{Prophase} \\to \\text{Metaphase} \\to \\text{Anaphase} \\to \\text{Telophase})',
    description: 'Step through the mitotic phases (Prophase, Metaphase, Anaphase, Telophase) watching chromosome condensation and spindle alignment.',
    keyControls: ['Phase Step Button', 'Spindle Fiber Visibility'],
    triggerKeywords: ['mitosis', 'meiosis', 'cell division', 'chromosome', 'anaphase', 'metaphase', 'spindle'],
  },
  cs_recursion: {
    id: 'cs_recursion' as any,
    title: 'Recursion & Call Stack Execution Visualizer',
    subject: 'Computer Science',
    chapter: 'Programming Fundamentals',
    topic: 'Activation Records & Base Case Unwinding',
    formula: 'T(n) = T(n-1) + O(1) \\implies \\text{Call Stack Depth } = n',
    description: 'Watch stack activation frames push onto the execution stack until the base case is reached, then pop and return values.',
    keyControls: ['Input Parameter n', 'Step-by-Step Push/Pop', 'Reset'],
    triggerKeywords: ['recursion', 'recursive', 'call stack', 'base case', 'stack overflow', 'factorial'],
  },
  cs_sorting: {
    id: 'cs_sorting',
    title: 'Bubble Sort & Array Comparison Visualizer',
    subject: 'Computer Science',
    chapter: 'Algorithms',
    topic: 'Adjacent Comparison & In-Place Swap',
    formula: 'T(n) = O(n^2) \\quad \\text{Comparisons} = \\frac{n(n-1)}{2}',
    description: 'Step through bubble sort to inspect active comparisons, swap animations, and sorted boundary advancement.',
    keyControls: ['Step Forward', 'Auto Play/Pause', 'Shuffle Array'],
    triggerKeywords: ['sorting', 'bubble sort', 'algorithm visualizer', 'array swap', 'selection sort'],
  },
  cs_binary_search: {
    id: 'cs_binary_search',
    title: 'Binary Search O(log n) Visualizer',
    subject: 'Computer Science',
    chapter: 'Algorithms',
    topic: 'Divide-and-Conquer Search',
    formula: 'T(n) = O(\\log_2 n)',
    description: 'Track low, mid, and high pointers narrowing a sorted array search space logarithmically.',
    keyControls: ['Target Value', 'Search Step', 'Array Size'],
    triggerKeywords: ['binary search', 'search in sorted array', 'log n', 'divide and conquer'],
  },
};

/**
 * High-precision simulation mapper:
 * Strict matching rule: Only returns a simulation if there is strong, unequivocal topic relevance.
 * Otherwise returns NULL (prevents unrelated simulations from appearing on queries).
 */
export function getStrictSimulationForQuery(query: string, subjectOverride?: string): SimulationMetadata | null {
  const q = query.toLowerCase().trim();

  // Explicit non-simulation queries: greetings, general questions, definitions without quantitative visualization
  if (
    q.length < 10 ||
    q === 'hello' ||
    q === 'hi' ||
    q.startsWith('hello') ||
    q.startsWith('hi ') ||
    q.includes('what can you') ||
    q.includes('capital of') ||
    q.includes('tell me a joke')
  ) {
    return null;
  }

  // Exact topic matching
  if (q.includes('coulomb') || q.includes('electrostatic force') || q.includes('distance between two charges')) {
    return SIMULATION_REGISTRY.coulomb_law;
  }
  if (q.includes('projectile') || q.includes('launch angle') || q.includes('fired vs dropped')) {
    return SIMULATION_REGISTRY.projectile;
  }
  if (q.includes('harmonic') || q.includes('spring constant') || q.includes('resonance')) {
    return SIMULATION_REGISTRY.harmonic_spring;
  }
  if (q.includes('differentiate') || q.includes('derivative of') || q.includes('tangent slope') || q.includes('sin(x^2)') || q.includes('sin(x²)')) {
    return SIMULATION_REGISTRY.math_differentiation;
  }
  if (q.includes('quadratic') || q.includes('parabola') || q.includes('vertex of')) {
    return SIMULATION_REGISTRY.math_quadratic;
  }
  if (q.includes('reaction rate') || q.includes('temperature') && q.includes('reaction') || q.includes('arrhenius')) {
    return SIMULATION_REGISTRY.chem_kinetics;
  }
  if (q.includes('concentration') || q.includes('molarity') || q.includes('dissolve salt') || q.includes('dilution')) {
    return SIMULATION_REGISTRY.chem_concentration;
  }
  if (q.includes('gas law') || q.includes('pv = nrt') || q.includes('piston')) {
    return SIMULATION_REGISTRY.chem_ideal_gas;
  }
  if (q.includes('dna replication') || q.includes('helicase') || q.includes('okazaki') || q.includes('base pairing')) {
    return SIMULATION_REGISTRY.bio_dna_replication;
  }
  if (q.includes('mitosis') || q.includes('meiosis') || q.includes('cell division')) {
    return SIMULATION_REGISTRY.bio_mitosis;
  }
  if (q.includes('natural selection') || q.includes('peppered moth') || q.includes('evolution')) {
    return SIMULATION_REGISTRY.bio_natural_selection;
  }
  if (q.includes('recursion') || q.includes('recursive') || q.includes('call stack')) {
    return SIMULATION_REGISTRY.cs_recursion;
  }
  if (q.includes('binary search') || q.includes('sorted array')) {
    return SIMULATION_REGISTRY.cs_binary_search;
  }
  if (q.includes('bubble sort') || q.includes('sorting algorithm')) {
    return SIMULATION_REGISTRY.cs_sorting;
  }
  if (q.includes('satellite') || q.includes('orbit') || q.includes('iss') || q.includes('weightless in orbit')) {
    return SIMULATION_REGISTRY.orbit;
  }
  if (q.includes('third law') || q.includes('truck hits car') || q.includes('action reaction') || (q.includes('collision') && !q.includes('molecular'))) {
    return SIMULATION_REGISTRY.collision;
  }
  if (q.includes('work') && q.includes('dot product') || q.includes('carrying crate') || q.includes('force perpendicular')) {
    return SIMULATION_REGISTRY.work_vector;
  }
  if (q.includes('vacuum drop') || q.includes('cannonball') && q.includes('feather') || q.includes('freefall')) {
    return SIMULATION_REGISTRY.freefall;
  }
  if (q.includes('ramp') || q.includes('incline') || q.includes('steep ramp')) {
    return SIMULATION_REGISTRY.incline;
  }

  // If no strict match, do not force a simulation!
  return null;
}
