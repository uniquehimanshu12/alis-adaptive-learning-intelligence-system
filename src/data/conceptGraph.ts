export interface ConceptNode {
  id: string;
  name: string;
  chapter: string;
  chapterId: 'motion' | 'force' | 'gravitation' | 'work_energy' | 'electricity' | 'magnetic' | 'light';
  description: string;
  prerequisites: string[]; // Concept IDs
  dependents: string[]; // Concept IDs
  associatedQuestionIds: string[];
  misconceptions: Array<{
    id: string;
    name: string;
    description: string;
    commonTrapOption: string;
  }>;
  simulations: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  curriculumCategory?: 'SUMMATIVE_EXAM' | 'PREREQUISITE_FOUNDATION' | 'FORMATIVE_TOPIC' | 'ENRICHMENT';
}

export const CLASS10_PHYSICS_CONCEPT_GRAPH: Record<string, ConceptNode> = {
  // CHAPTER 1: MOTION & KINEMATICS
  'c10_dist_displacement': {
    id: 'c10_dist_displacement',
    name: 'Distance vs Displacement',
    chapter: 'Motion & Kinematics',
    chapterId: 'motion',
    description: 'Distance is the scalar total path length traveled. Displacement is the vector shortest distance from initial to final position.',
    prerequisites: [],
    dependents: ['c10_speed_velocity'],
    associatedQuestionIds: ['diag_q1', 'motion_dist_1'],
    misconceptions: [
      {
        id: 'dist-disp-path',
        name: 'Distance equals Displacement Fallacy',
        description: 'Assuming distance and displacement are always numerically equal even along curved paths or closed loops.',
        commonTrapOption: 'Displacement is 400m for a full 400m circular lap'
      }
    ],
    simulations: ['kinematics_graph'],
    difficulty: 'Beginner',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_speed_velocity': {
    id: 'c10_speed_velocity',
    name: 'Speed & Velocity',
    chapter: 'Motion & Kinematics',
    chapterId: 'motion',
    description: 'Speed is rate of distance covered (s = d/t). Velocity is displacement rate per unit time (v = Δx/Δt) with direction.',
    prerequisites: ['c10_dist_displacement'],
    dependents: ['c10_acceleration'],
    associatedQuestionIds: ['diag_q2', 'motion_vel_1'],
    misconceptions: [
      {
        id: 'constant-speed-velocity',
        name: 'Constant Speed implies Constant Velocity',
        description: 'Ignoring directional change in circular motion, assuming speed and velocity are identical.',
        commonTrapOption: 'A car turning a curve at 60 km/h has constant velocity'
      }
    ],
    simulations: ['kinematics_graph'],
    difficulty: 'Beginner',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_acceleration': {
    id: 'c10_acceleration',
    name: 'Acceleration & Equations of Motion',
    chapter: 'Motion & Kinematics',
    chapterId: 'motion',
    description: 'Acceleration is the rate of change of velocity (a = Δv/Δt). Governed by v = u + at, s = ut + 1/2 at², v² = u² + 2as.',
    prerequisites: ['c10_speed_velocity'],
    dependents: ['c10_force_inertia', 'c10_free_fall_g'],
    associatedQuestionIds: ['diag_q3', 'kinematics_constant_velocity'],
    misconceptions: [
      {
        id: 'high-speed-acceleration',
        name: 'High Speed implies High Acceleration',
        description: 'Conflating high uniform velocity with non-zero acceleration.',
        commonTrapOption: 'A race car moving at constant 80 m/s has 8 m/s² acceleration'
      }
    ],
    simulations: ['kinematics_graph'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },

  // CHAPTER 2: FORCE & LAWS OF MOTION
  'c10_force_inertia': {
    id: 'c10_force_inertia',
    name: "Force & Newton's First Law (Inertia)",
    chapter: 'Force & Laws of Motion',
    chapterId: 'force',
    description: 'An object remains at rest or in uniform motion unless acted upon by a net external unbalanced force. Mass measures inertia.',
    prerequisites: ['c10_acceleration'],
    dependents: ['c10_newton_second'],
    associatedQuestionIds: ['diag_q4', 'force_inertia_1'],
    misconceptions: [
      {
        id: 'motion-requires-force',
        name: 'Motion Requires Continuous Force Fallacy',
        description: 'Believing an object needs a continuous force to keep moving at constant velocity.',
        commonTrapOption: 'A spacecraft in deep space needs engine thrust to maintain constant speed'
      }
    ],
    simulations: ['collision'],
    difficulty: 'Beginner',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_newton_second': {
    id: 'c10_newton_second',
    name: "Newton's Second Law (F = ma)",
    chapter: 'Force & Laws of Motion',
    chapterId: 'force',
    description: 'The net force on an object equals the product of mass and acceleration (F = ma), or rate of change of momentum (F = Δp/Δt).',
    prerequisites: ['c10_force_inertia'],
    dependents: ['c10_momentum', 'c10_newton_third', 'c10_universal_gravitation', 'c10_work_mechanical'],
    associatedQuestionIds: ['diag_q5', 'newton_second_law'],
    misconceptions: [
      {
        id: 'force-mass-double-quadruple',
        name: 'Force-Mass Doubling Quadruples Acceleration',
        description: 'Failing to see that doubling both force and mass cancels out in a = 2F / 2m = F/m.',
        commonTrapOption: 'Doubling force and mass quadruples acceleration'
      }
    ],
    simulations: ['collision'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_momentum': {
    id: 'c10_momentum',
    name: 'Momentum & Conservation of Momentum',
    chapter: 'Force & Laws of Motion',
    chapterId: 'force',
    description: 'Momentum p = m v. In an isolated system, total momentum before collision equals total momentum after collision.',
    prerequisites: ['c10_newton_second'],
    dependents: [],
    associatedQuestionIds: ['momentum_q1'],
    misconceptions: [
      {
        id: 'heavier-more-momentum-always',
        name: 'Heavier Object Always Has Greater Momentum',
        description: 'Ignoring velocity when calculating momentum, assuming mass alone determines momentum.',
        commonTrapOption: 'A stationary truck has more momentum than a bullet'
      }
    ],
    simulations: ['collision'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_newton_third': {
    id: 'c10_newton_third',
    name: "Newton's Third Law (Action-Reaction)",
    chapter: 'Force & Laws of Motion',
    chapterId: 'force',
    description: 'To every action force, there is an equal and opposite reaction force (F_12 = -F_21) acting on two distinct bodies.',
    prerequisites: ['c10_newton_second'],
    dependents: [],
    associatedQuestionIds: ['newton-collision'],
    misconceptions: [
      {
        id: 'bigger-object-exerts-more-force',
        name: 'Bigger Object Exerts Greater Contact Force',
        description: 'Believing a heavy truck hits a small car with greater force than the car exerts on the truck.',
        commonTrapOption: 'The truck exerts a greater impact force than the small car'
      }
    ],
    simulations: ['collision'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },

  // CHAPTER 3: GRAVITATION
  'c10_universal_gravitation': {
    id: 'c10_universal_gravitation',
    name: 'Universal Law of Gravitation',
    chapter: 'Gravitation & Free Fall',
    chapterId: 'gravitation',
    description: 'Every mass attracts every other mass with force F = G (m1 m2) / r², obeying the inverse-square law.',
    prerequisites: ['c10_newton_second'],
    dependents: ['c10_free_fall_g'],
    associatedQuestionIds: ['coulomb_law', 'grav_q1'],
    misconceptions: [
      {
        id: 'inverse-square-linear-decay',
        name: 'Inverse-Square Linear Decay Fallacy',
        description: 'Thinking force drops by half when distance doubles, rather than dropping to 1/4th.',
        commonTrapOption: 'Gravitational force drops by 50% when distance is doubled'
      }
    ],
    simulations: ['orbit'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_free_fall_g': {
    id: 'c10_free_fall_g',
    name: 'Free Fall & Acceleration due to Gravity (g)',
    chapter: 'Gravitation & Free Fall',
    chapterId: 'gravitation',
    description: 'Objects falling under gravity accelerate at g = G M / R² ≈ 9.8 m/s² independently of mass in vacuum.',
    prerequisites: ['c10_universal_gravitation', 'c10_acceleration'],
    dependents: ['c10_pot_energy'],
    associatedQuestionIds: ['gravity-freefall'],
    misconceptions: [
      {
        id: 'heavier-falls-faster',
        name: 'Heavier Objects Fall Faster in Vacuum',
        description: 'Conflating gravitational force (F=mg) with acceleration (a=g=F/m), assuming heavier items land first in vacuum.',
        commonTrapOption: 'A 50kg sphere falls faster in vacuum than a 0.05kg feather'
      }
    ],
    simulations: ['freefall'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },

  // CHAPTER 4: WORK, ENERGY & POWER
  'c10_work_mechanical': {
    id: 'c10_work_mechanical',
    name: 'Mechanical Work (W = F d cos θ)',
    chapter: 'Work, Energy & Power',
    chapterId: 'work_energy',
    description: 'Work is done when force causes displacement in its direction: W = F d cos(θ). Zero work occurs when force is perpendicular to displacement.',
    prerequisites: ['c10_newton_second'],
    dependents: ['c10_kinetic_energy', 'c10_pot_energy'],
    associatedQuestionIds: ['diag_q6', 'work-carrying'],
    misconceptions: [
      {
        id: 'physiological-effort-mechanical-work',
        name: 'Physiological Burn equals Mechanical Work',
        description: 'Thinking holding a heavy weight stationary or carrying a box horizontally does mechanical work.',
        commonTrapOption: 'Carrying a 20kg box across a flat floor does 200J of mechanical work'
      }
    ],
    simulations: ['work_vector'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_kinetic_energy': {
    id: 'c10_kinetic_energy',
    name: 'Kinetic Energy (Ek = 1/2 m v²)',
    chapter: 'Work, Energy & Power',
    chapterId: 'work_energy',
    description: 'Energy possessed by an object due to motion: Ek = 1/2 m v². Doubling speed quadruples kinetic energy.',
    prerequisites: ['c10_work_mechanical'],
    dependents: ['c10_conservation_energy'],
    associatedQuestionIds: ['work_ke_1'],
    misconceptions: [
      {
        id: 'speed-double-energy-double',
        name: 'Doubling Speed Doubles Kinetic Energy',
        description: 'Linear speed scaling trap, missing the v² quadratic exponent.',
        commonTrapOption: 'Doubling speed doubles kinetic energy'
      }
    ],
    simulations: ['incline'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_pot_energy': {
    id: 'c10_pot_energy',
    name: 'Gravitational Potential Energy (Ep = mgh)',
    chapter: 'Work, Energy & Power',
    chapterId: 'work_energy',
    description: 'Energy stored due to an object height in a gravitational field: Ep = mgh.',
    prerequisites: ['c10_work_mechanical', 'c10_free_fall_g'],
    dependents: ['c10_conservation_energy'],
    associatedQuestionIds: ['work_pe_1'],
    misconceptions: [
      {
        id: 'pe-depends-on-path',
        name: 'Potential Energy Depends on Ramp Path Length',
        description: 'Believing potential energy depends on the length of an inclined plane rather than vertical height h.',
        commonTrapOption: 'A longer ramp produces greater potential energy at the top'
      }
    ],
    simulations: ['incline'],
    difficulty: 'Intermediate',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },
  'c10_conservation_energy': {
    id: 'c10_conservation_energy',
    name: 'Law of Conservation of Energy',
    chapter: 'Work, Energy & Power',
    chapterId: 'work_energy',
    description: 'Energy cannot be created or destroyed, only transformed: E_total = Ek + Ep = Constant.',
    prerequisites: ['c10_kinetic_energy', 'c10_pot_energy'],
    dependents: [],
    associatedQuestionIds: ['diag_q7', 'energy_cons_1'],
    misconceptions: [
      {
        id: 'energy-destroyed-friction',
        name: 'Friction Destroys Energy',
        description: 'Assuming mechanical energy lost to friction disappears rather than converting into thermal energy.',
        commonTrapOption: 'Frictional stopping destroys energy permanently'
      }
    ],
    simulations: ['incline'],
    difficulty: 'Advanced',
    curriculumCategory: 'PREREQUISITE_FOUNDATION'
  },

  // CHAPTER 5: ELECTRICITY
  'c10_electric_current': {
    id: 'c10_electric_current',
    name: 'Electric Current & Charge (I = Q/t)',
    chapter: 'Electricity & Circuits',
    chapterId: 'electricity',
    description: 'Electric current is the flow of electric charge per unit time: I = Q/t (Amperes = Coulombs / second).',
    prerequisites: [],
    dependents: ['c10_pot_difference'],
    associatedQuestionIds: ['diag_q8', 'elec_current_1'],
    misconceptions: [
      {
        id: 'current-consumed-in-resistor',
        name: 'Current is Consumed by Resistors',
        description: 'Believing current decreases after passing through a bulb or resistor.',
        commonTrapOption: 'Current leaving a lightbulb is less than current entering it'
      }
    ],
    simulations: [],
    difficulty: 'Beginner',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_pot_difference': {
    id: 'c10_pot_difference',
    name: 'Electric Potential & Voltage (V = W/Q)',
    chapter: 'Electricity & Circuits',
    chapterId: 'electricity',
    description: 'Potential difference (Voltage) is work done per unit charge moving between two points: V = W/Q (Volts = Joules / Coulomb).',
    prerequisites: ['c10_electric_current'],
    dependents: ['c10_ohms_law'],
    associatedQuestionIds: ['elec_voltage_1'],
    misconceptions: [
      {
        id: 'voltage-flows-in-circuit',
        name: 'Voltage Flows Through Wires',
        description: 'Conflating voltage (potential push across points) with current (charge flow through wire).',
        commonTrapOption: 'Voltage flows through the circuit like water in a pipe'
      }
    ],
    simulations: [],
    difficulty: 'Intermediate',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_ohms_law': {
    id: 'c10_ohms_law',
    name: "Ohm's Law & Resistance (V = IR)",
    chapter: 'Electricity & Circuits',
    chapterId: 'electricity',
    description: 'At constant temperature, current through a conductor is directly proportional to potential difference across it: V = I R.',
    prerequisites: ['c10_pot_difference'],
    dependents: ['c10_resistance_factors', 'c10_joule_heating'],
    associatedQuestionIds: ['diag_q9', 'elec_ohms_law_1'],
    misconceptions: [
      {
        id: 'resistance-depends-on-voltage',
        name: 'Resistance Changes when Voltage Changes',
        description: 'Thinking increasing voltage increases the material resistance R = V/I.',
        commonTrapOption: 'Doubling voltage doubles resistor resistance'
      }
    ],
    simulations: ['ohms_law_graph'],
    difficulty: 'Intermediate',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_resistance_factors': {
    id: 'c10_resistance_factors',
    name: 'Resistivity & Circuit Combinations',
    chapter: 'Electricity & Circuits',
    chapterId: 'electricity',
    description: 'Resistance depends on length, area, material (R = ρ L / A). Series R_eq = R1 + R2; Parallel 1/R_eq = 1/R1 + 1/R2.',
    prerequisites: ['c10_ohms_law'],
    dependents: ['c10_joule_heating'],
    associatedQuestionIds: ['elec_circuits_1'],
    misconceptions: [
      {
        id: 'parallel-resistance-increases',
        name: 'Adding Parallel Resistors Increases Total Resistance',
        description: 'Believing adding another parallel branch increases net circuit resistance.',
        commonTrapOption: 'Adding a 10 ohm resistor in parallel increases total equivalent resistance'
      }
    ],
    simulations: [],
    difficulty: 'Advanced',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_joule_heating': {
    id: 'c10_joule_heating',
    name: 'Joule Heating & Electric Power (P = VI)',
    chapter: 'Electricity & Circuits',
    chapterId: 'electricity',
    description: 'Heat generated in a resistor is H = I² R t. Electric power P = V I = I² R = V² / R.',
    prerequisites: ['c10_ohms_law', 'c10_resistance_factors'],
    dependents: [],
    associatedQuestionIds: ['elec_power_1'],
    misconceptions: [
      {
        id: 'thicker-wire-more-heat',
        name: 'Thicker Wires Generate More Heat at Constant Current',
        description: 'Ignoring lower resistance of thick wire (H = I² R t), assuming bigger wire heats more.',
        commonTrapOption: 'Thicker copper wire heats up faster than thin wire for same current'
      }
    ],
    simulations: [],
    difficulty: 'Advanced',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },

  // CHAPTER 6: MAGNETIC EFFECTS OF ELECTRIC CURRENT
  'c10_magnetic_field': {
    id: 'c10_magnetic_field',
    name: 'Magnetic Fields & Lines of Force',
    chapter: 'Magnetic Effects',
    chapterId: 'magnetic',
    description: 'Magnetic fields are vector regions where magnetic force acts. Lines form continuous closed loops from North to South externally.',
    prerequisites: ['c10_electric_current'],
    dependents: ['c10_electromagnetic_induction'],
    associatedQuestionIds: ['mag_field_1'],
    misconceptions: [
      {
        id: 'field-lines-cross',
        name: 'Magnetic Field Lines Can Intersect',
        description: 'Failing to realize intersecting field lines would imply two compass needle directions at one point.',
        commonTrapOption: 'Field lines intersect near strong magnet poles'
      }
    ],
    simulations: [],
    difficulty: 'Beginner',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_electromagnetic_induction': {
    id: 'c10_electromagnetic_induction',
    name: "Oersted's Rule & Right Hand Thumb Rule",
    chapter: 'Magnetic Effects',
    chapterId: 'magnetic',
    description: 'Electric current flowing through a straight conductor generates a concentric circular magnetic field governed by Right-Hand Thumb Rule.',
    prerequisites: ['c10_magnetic_field'],
    dependents: [],
    associatedQuestionIds: ['mag_ind_1'],
    misconceptions: [
      {
        id: 'field-direction-parallel-current',
        name: 'Magnetic Field Lines Run Parallel to Wire',
        description: 'Thinking magnetic field lines travel along the wire instead of wrapping circularly around it.',
        commonTrapOption: 'Magnetic field lines run straight along the current wire'
      }
    ],
    simulations: [],
    difficulty: 'Intermediate',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },

  // CHAPTER 7: LIGHT: REFLECTION & REFRACTION
  'c10_light_reflection': {
    id: 'c10_light_reflection',
    name: 'Reflection & Spherical Mirrors',
    chapter: 'Light: Reflection & Refraction',
    chapterId: 'light',
    description: 'Laws of reflection: angle of incidence equals angle of reflection (i = r). Concave and Convex mirror formula 1/f = 1/v + 1/u.',
    prerequisites: [],
    dependents: ['c10_light_refraction'],
    associatedQuestionIds: ['diag_q10', 'light_refl_1'],
    misconceptions: [
      {
        id: 'virtual-image-screen',
        name: 'Virtual Images Can Be Caught on Screen',
        description: 'Believing virtual images formed behind mirrors can be projected on a physical paper screen.',
        commonTrapOption: 'Virtual images formed by convex mirrors appear on a paper screen'
      }
    ],
    simulations: ['optics_ray'],
    difficulty: 'Beginner',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_light_refraction': {
    id: 'c10_light_refraction',
    name: "Refraction & Snell's Law (n = sin i / sin r)",
    chapter: 'Light: Reflection & Refraction',
    chapterId: 'light',
    description: 'Bending of light passing between media of different optical densities: n1 sin(i) = n2 sin(r). Apparent depth and prism dispersion.',
    prerequisites: ['c10_light_reflection'],
    dependents: ['c10_lens_formula'],
    associatedQuestionIds: ['light_refr_1'],
    misconceptions: [
      {
        id: 'denser-medium-faster-light',
        name: 'Light Travels Faster in Optically Dense Media',
        description: 'Conflating mass density with optical density, expecting light to speed up in glass.',
        commonTrapOption: 'Light speeds up when entering optically dense glass from air'
      }
    ],
    simulations: ['optics_ray'],
    difficulty: 'Intermediate',
    curriculumCategory: 'SUMMATIVE_EXAM'
  },
  'c10_lens_formula': {
    id: 'c10_lens_formula',
    name: 'Lens Formula & Power of Lens (P = 1/f)',
    chapter: 'Light: Reflection & Refraction',
    chapterId: 'light',
    description: 'Thin lens equation: 1/f = 1/v - 1/u. Power of lens P = 1/f (in meters, measured in Dioptres D).',
    prerequisites: ['c10_light_refraction'],
    dependents: [],
    associatedQuestionIds: ['light_lens_1'],
    misconceptions: [
      {
        id: 'positive-power-myopia',
        name: 'Positive Dioptre Lenses Correct Myopia (Nearsightedness)',
        description: 'Confusing convex (+ power) lenses with concave (- power) divergence lenses used for myopia correction.',
        commonTrapOption: 'Myopia is corrected using a +2.5 D convex lens'
      }
    ],
    simulations: ['optics_ray'],
    difficulty: 'Advanced',
    curriculumCategory: 'SUMMATIVE_EXAM'
  }
};
