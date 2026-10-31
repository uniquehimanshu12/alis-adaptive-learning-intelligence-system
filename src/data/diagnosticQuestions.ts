export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  conceptName: string;
  chapter: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'conceptual' | 'numerical' | 'application';
  questionText: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    misconceptionId?: string;
  }[];
  requiresReasoning: boolean;
  reasoningPrompt?: string;
  explanation: string;
}

export const CLASS10_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag_q1',
    conceptId: 'c10_dist_displacement',
    conceptName: 'Distance vs Displacement',
    chapter: 'Motion & Kinematics',
    difficulty: 'Beginner',
    category: 'conceptual',
    questionText: 'An athlete completes one full circular lap around a 400 m track and returns to the exact starting line in 50 seconds. What is the magnitude of the displacement and the total distance covered?',
    options: [
      { id: 'a', text: 'Displacement = 400 m, Distance = 400 m', isCorrect: false, misconceptionId: 'dist-disp-path' },
      { id: 'b', text: 'Displacement = 0 m, Distance = 400 m', isCorrect: true },
      { id: 'c', text: 'Displacement = 0 m, Distance = 0 m', isCorrect: false },
      { id: 'd', text: 'Displacement = 800 m, Distance = 400 m', isCorrect: false }
    ],
    requiresReasoning: true,
    reasoningPrompt: 'Explain why displacement is 0 m even though the runner ran 400 m around the track.',
    explanation: 'Displacement is a vector pointing from initial position to final position. Returning to the starting point yields zero net displacement (0 m), while path length distance is 400 m.'
  },
  {
    id: 'diag_q2',
    conceptId: 'c10_speed_velocity',
    conceptName: 'Speed & Velocity',
    chapter: 'Motion & Kinematics',
    difficulty: 'Beginner',
    category: 'conceptual',
    questionText: 'A car negotiates a circular round-about curve at a constant speedometer reading of 40 km/h. Does the car have constant velocity?',
    options: [
      { id: 'a', text: 'Yes, because the speed is constant at 40 km/h', isCorrect: false, misconceptionId: 'constant-speed-velocity' },
      { id: 'b', text: 'No, because its direction of motion is continuously changing', isCorrect: true },
      { id: 'c', text: 'Yes, because displacement is zero', isCorrect: false },
      { id: 'd', text: 'No, because the car is at rest', isCorrect: false }
    ],
    requiresReasoning: false,
    explanation: 'Velocity is a vector comprising both magnitude (speed) and direction. Turning continuously alters direction, so velocity is changing (accelerating).'
  },
  {
    id: 'diag_q3',
    conceptId: 'c10_acceleration',
    conceptName: 'Acceleration & Equations of Motion',
    chapter: 'Motion & Kinematics',
    difficulty: 'Intermediate',
    category: 'numerical',
    questionText: 'A race car moves along a straight track at a constant velocity of 80 m/s for 10 seconds. What is its acceleration during this interval?',
    options: [
      { id: 'a', text: '8 m/s²', isCorrect: false, misconceptionId: 'high-speed-acceleration' },
      { id: 'b', text: '80 m/s²', isCorrect: false },
      { id: 'c', text: '0 m/s²', isCorrect: true },
      { id: 'd', text: '800 m/s²', isCorrect: false }
    ],
    requiresReasoning: true,
    reasoningPrompt: 'State the formula for acceleration and explain your step-by-step substitution.',
    explanation: 'Acceleration a = Δv / Δt. Because velocity is CONSTANT (80 m/s), Δv = 0, so acceleration is identically 0 m/s².'
  },
  {
    id: 'diag_q4',
    conceptId: 'c10_force_inertia',
    conceptName: "Force & Newton's First Law (Inertia)",
    chapter: 'Force & Laws of Motion',
    difficulty: 'Beginner',
    category: 'conceptual',
    questionText: 'A space probe in deep interstellar space moves at 15,000 m/s with all thrusters turned OFF. Assuming zero gravitational or resistive forces act on it, what will happen to its motion?',
    options: [
      { id: 'a', text: 'It will gradually slow down and come to a complete stop', isCorrect: false, misconceptionId: 'motion-requires-force' },
      { id: 'b', text: 'It will continue moving indefinitely at constant velocity of 15,000 m/s in a straight line', isCorrect: true },
      { id: 'c', text: 'It will immediately fall in a circular orbit', isCorrect: false },
      { id: 'd', text: 'It requires continuous engine thrust to maintain forward speed', isCorrect: false }
    ],
    requiresReasoning: false,
    explanation: "By Newton's First Law (Law of Inertia), an object in motion continues in uniform motion in a straight line unless acted upon by a net external force."
  },
  {
    id: 'diag_q5',
    conceptId: 'c10_newton_second',
    conceptName: "Newton's Second Law (F = ma)",
    chapter: 'Force & Laws of Motion',
    difficulty: 'Intermediate',
    category: 'application',
    questionText: 'If the net force on a cart is doubled (2×) AND the mass of the cart is doubled (2×), what is the new acceleration compared to the original acceleration a₀?',
    options: [
      { id: 'a', text: 'Acceleration quadruples (4 a₀)', isCorrect: false, misconceptionId: 'force-mass-double-quadruple' },
      { id: 'b', text: 'Acceleration stays exactly the same (1 a₀)', isCorrect: true },
      { id: 'c', text: 'Acceleration doubles (2 a₀)', isCorrect: false },
      { id: 'd', text: 'Acceleration drops to zero', isCorrect: false }
    ],
    requiresReasoning: true,
    reasoningPrompt: 'Show mathematically how a = F/m changes when F -> 2F and m -> 2m.',
    explanation: "a' = (2F) / (2m) = F / m = a₀. The factor 2 in numerator and denominator cancels out identically."
  },
  {
    id: 'diag_q6',
    conceptId: 'c10_work_mechanical',
    conceptName: 'Mechanical Work (W = F d cos θ)',
    chapter: 'Work, Energy & Power',
    difficulty: 'Intermediate',
    category: 'conceptual',
    questionText: 'A porter holds a heavy 25 kg suitcase on his head while standing completely still on a railway station platform for 10 minutes. How much mechanical work is done on the suitcase by the porter?',
    options: [
      { id: 'a', text: '2,450 Joules', isCorrect: false, misconceptionId: 'physiological-effort-mechanical-work' },
      { id: 'b', text: '250 Joules', isCorrect: false },
      { id: 'c', text: 'Zero Joules', isCorrect: true },
      { id: 'd', text: '25 Joules', isCorrect: false }
    ],
    requiresReasoning: true,
    reasoningPrompt: 'Explain why holding a heavy suitcase standing still does zero mechanical work despite muscle exertion.',
    explanation: 'Mechanical work W = F d cos(θ). Since the suitcase is stationary, displacement d = 0, so mechanical work done is identically 0 Joules.'
  },
  {
    id: 'diag_q7',
    conceptId: 'c10_conservation_energy',
    conceptName: 'Law of Conservation of Energy',
    chapter: 'Work, Energy & Power',
    difficulty: 'Advanced',
    category: 'application',
    questionText: 'A 2 kg ball is dropped from a height of 20 m. Ignoring air resistance (g = 10 m/s²), what is its kinetic energy right before impact with the ground?',
    options: [
      { id: 'a', text: '20 Joules', isCorrect: false },
      { id: 'b', text: '200 Joules', isCorrect: false },
      { id: 'c', text: '400 Joules', isCorrect: true },
      { id: 'd', text: '800 Joules', isCorrect: false }
    ],
    requiresReasoning: false,
    explanation: 'By conservation of energy, initial Ep = m g h = (2 kg)(10 m/s²)(20 m) = 400 J converts completely into kinetic energy Ek = 400 J before impact.'
  },
  {
    id: 'diag_q8',
    conceptId: 'c10_electric_current',
    conceptName: 'Electric Current & Charge (I = Q/t)',
    chapter: 'Electricity & Circuits',
    difficulty: 'Beginner',
    category: 'conceptual',
    questionText: 'Electric current flows through a light bulb in a simple series circuit. How does the current leaving the bulb compare to the current entering the bulb?',
    options: [
      { id: 'a', text: 'Current leaving is less because energy was consumed', isCorrect: false, misconceptionId: 'current-consumed-in-resistor' },
      { id: 'b', text: 'Current leaving is exactly equal to current entering', isCorrect: true },
      { id: 'c', text: 'Current leaving is zero', isCorrect: false },
      { id: 'd', text: 'Current leaving is double', isCorrect: false }
    ],
    requiresReasoning: true,
    reasoningPrompt: 'Explain the difference between electric charge conservation (current) and energy conversion in a circuit.',
    explanation: 'Electric current is the rate of flow of charge (I = Q/t). Charges are not consumed; they pass through the filament while electrical energy is converted into light and heat.'
  },
  {
    id: 'diag_q9',
    conceptId: 'c10_ohms_law',
    conceptName: "Ohm's Law & Resistance (V = IR)",
    chapter: 'Electricity & Circuits',
    difficulty: 'Intermediate',
    category: 'numerical',
    questionText: 'A resistor is connected across a 12 V battery and draws a current of 3 A. What is its resistance?',
    options: [
      { id: 'a', text: '36 Ohms', isCorrect: false },
      { id: 'b', text: '4 Ohms', isCorrect: true },
      { id: 'c', text: '0.25 Ohms', isCorrect: false },
      { id: 'd', text: '15 Ohms', isCorrect: false }
    ],
    requiresReasoning: false,
    explanation: "By Ohm's Law V = I R, R = V / I = 12 V / 3 A = 4 Ohms."
  },
  {
    id: 'diag_q10',
    conceptId: 'c10_light_reflection',
    conceptName: 'Reflection & Spherical Mirrors',
    chapter: 'Light: Reflection & Refraction',
    difficulty: 'Beginner',
    category: 'conceptual',
    questionText: 'A ray of light strikes a flat plane mirror at an angle of incidence of 35° with the normal. What is the angle of reflection?',
    options: [
      { id: 'a', text: '55°', isCorrect: false },
      { id: 'b', text: '35°', isCorrect: true },
      { id: 'c', text: '90°', isCorrect: false },
      { id: 'd', text: '70°', isCorrect: false }
    ],
    requiresReasoning: false,
    explanation: 'By the Law of Reflection, the angle of reflection equals the angle of incidence (θ_r = θ_i = 35°).'
  }
];
