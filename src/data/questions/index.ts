import { PhysicsQuestion, PhysicsTopic, QuestionDifficulty, AcademicSubject } from '../../types/physics';
import { NEWTONS_LAWS_QUESTIONS } from './newtonsLaws';
import { GRAVITATION_QUESTIONS } from './gravitation';
import { WORK_ENERGY_QUESTIONS } from './workEnergy';
import { ADDITIONAL_CHAPTER_QUESTIONS } from './additionalChapters';
import { MATHEMATICS_QUESTIONS } from './mathematicsQuestions';
import { CHEMISTRY_QUESTIONS } from './chemistryQuestions';
import { BIOLOGY_QUESTIONS } from './biologyQuestions';
import { COMPUTER_SCIENCE_QUESTIONS } from './computerScienceQuestions';

// Attach explicit 'Physics' subject to the classic physics sets
const PHYSICS_QUESTIONS_TAGGED: PhysicsQuestion[] = [
  ...NEWTONS_LAWS_QUESTIONS.map((q) => ({ ...q, subject: 'Physics' as AcademicSubject })),
  ...GRAVITATION_QUESTIONS.map((q) => ({ ...q, subject: 'Physics' as AcademicSubject })),
  ...WORK_ENERGY_QUESTIONS.map((q) => ({ ...q, subject: 'Physics' as AcademicSubject })),
  ...ADDITIONAL_CHAPTER_QUESTIONS.map((q) => ({ ...q, subject: 'Physics' as AcademicSubject })),
];

export const ALL_QUESTIONS: PhysicsQuestion[] = [
  ...PHYSICS_QUESTIONS_TAGGED,
  ...MATHEMATICS_QUESTIONS,
  ...CHEMISTRY_QUESTIONS,
  ...BIOLOGY_QUESTIONS,
  ...COMPUTER_SCIENCE_QUESTIONS,
];

export interface ChapterInfo {
  id: string;
  subject: AcademicSubject | 'ALL';
  title: string;
  count: number;
  description: string;
  accent: string;
}

export const CHAPTERS_INFO: ChapterInfo[] = [
  {
    id: 'ALL',
    subject: 'ALL',
    title: 'All Multi-Disciplinary Curriculum',
    count: ALL_QUESTIONS.length,
    description: 'Comprehensive cross-subject evaluation across Physics, Mathematics, Chemistry, Biology, and Computer Science.',
    accent: '#FF572E',
  },
  // Physics Chapters
  {
    id: 'NEWTONS_LAWS',
    subject: 'Physics',
    title: "Newton's Laws of Motion",
    count: NEWTONS_LAWS_QUESTIONS.length,
    description: 'Inertia, dynamic equilibrium, third law interaction pairs, friction, incline planes, and coupled bodies.',
    accent: '#FF572E',
  },
  {
    id: 'GRAVITATION',
    subject: 'Physics',
    title: 'Gravitation & Celestial Mechanics',
    count: GRAVITATION_QUESTIONS.length,
    description: 'Inverse-square attraction, orbital and escape velocity, Keplerian harmonics, and field potentials.',
    accent: '#10B981',
  },
  {
    id: 'WORK_AND_ENERGY',
    subject: 'Physics',
    title: 'Work, Energy and Power',
    count: WORK_ENERGY_QUESTIONS.length,
    description: 'Vector dot products, potential and kinetic transformation, non-conservative loss, Hooke springs, and impulse.',
    accent: '#F59E0B',
  },
  {
    id: 'KINEMATICS_PROJECTILE',
    subject: 'Physics',
    title: 'Kinematics & Projectiles',
    count: ADDITIONAL_CHAPTER_QUESTIONS.filter((q) => q.topic === 'KINEMATICS_PROJECTILE').length,
    description: 'Orthogonal vector independence, parabolic flight paths, and uniform accelerated trajectories.',
    accent: '#8B5CF6',
  },
  {
    id: 'CIRCULAR_ROTATIONAL',
    subject: 'Physics',
    title: 'Circular & Rotational Motion',
    count: ADDITIONAL_CHAPTER_QUESTIONS.filter((q) => q.topic === 'CIRCULAR_ROTATIONAL').length,
    description: 'Centripetal constraints, moment of inertia, rolling without slip, and torque equilibrium.',
    accent: '#EC4899',
  },
  {
    id: 'OSCILLATIONS_WAVES',
    subject: 'Physics',
    title: 'Oscillations & Resonance',
    count: ADDITIONAL_CHAPTER_QUESTIONS.filter((q) => q.topic === 'OSCILLATIONS_WAVES').length,
    description: 'Simple harmonic motion, isochronous pendulums, elastic restoring forces, and driven resonance.',
    accent: '#3B82F6',
  },
  {
    id: 'THERMODYNAMICS',
    subject: 'Physics',
    title: 'Thermodynamics & Kinetic Theory',
    count: ADDITIONAL_CHAPTER_QUESTIONS.filter((q) => q.topic === 'THERMODYNAMICS').length,
    description: 'First law of thermodynamics, adiabatic expansion, work done by expanding gases, and heat transfer.',
    accent: '#EF4444',
  },
  {
    id: 'ELECTROSTATICS_CURRENT',
    subject: 'Physics',
    title: 'Electrostatics & Electric Fields',
    count: ADDITIONAL_CHAPTER_QUESTIONS.filter((q) => q.topic === 'ELECTROSTATICS_CURRENT').length,
    description: "Coulomb's law, electric field vectors, Faraday cage electrostatic shielding, and charge distribution.",
    accent: '#06B6D4',
  },
  // Mathematics Chapters
  {
    id: 'CALCULUS_DIFFERENTIATION',
    subject: 'Mathematics',
    title: 'Differential Calculus',
    count: MATHEMATICS_QUESTIONS.filter((q) => q.topic === 'CALCULUS_DIFFERENTIATION').length,
    description: 'Chain rule, product rule, geometric tangent limits, and rates of change.',
    accent: '#8B5CF6',
  },
  {
    id: 'ALGEBRA_QUADRATICS',
    subject: 'Mathematics',
    title: 'Algebra & Quadratic Equations',
    count: MATHEMATICS_QUESTIONS.filter((q) => q.topic === 'ALGEBRA_QUADRATICS').length,
    description: 'Discriminant properties, complex conjugates, and parabolic roots.',
    accent: '#6366F1',
  },
  {
    id: 'TRIGONOMETRY_VECTORS',
    subject: 'Mathematics',
    title: 'Trigonometry & Vectors',
    count: MATHEMATICS_QUESTIONS.filter((q) => q.topic === 'TRIGONOMETRY_VECTORS').length,
    description: 'Dot products, orthogonality conditions, and periodic waveforms.',
    accent: '#A855F7',
  },
  // Chemistry Chapters
  {
    id: 'CHEMICAL_KINETICS',
    subject: 'Chemistry',
    title: 'Chemical Kinetics',
    count: CHEMISTRY_QUESTIONS.filter((q) => q.topic === 'CHEMICAL_KINETICS').length,
    description: 'Arrhenius equation, Maxwell-Boltzmann kinetic energy distribution, and collision theory.',
    accent: '#10B981',
  },
  {
    id: 'SOLUTIONS_MOLARITY',
    subject: 'Chemistry',
    title: 'Solutions & Solubility',
    count: CHEMISTRY_QUESTIONS.filter((q) => q.topic === 'SOLUTIONS_MOLARITY').length,
    description: 'Ion-dipole hydration, polar solvents, and molar concentration.',
    accent: '#059669',
  },
  {
    id: 'GAS_LAWS',
    subject: 'Chemistry',
    title: 'States of Matter & Gas Laws',
    count: CHEMISTRY_QUESTIONS.filter((q) => q.topic === 'GAS_LAWS').length,
    description: "Boyle's law, ideal gas equation PV = nRT, and isothermal compression.",
    accent: '#14B8A6',
  },
  // Biology Chapters
  {
    id: 'MOLECULAR_GENETICS',
    subject: 'Biology',
    title: 'Molecular Genetics & DNA',
    count: BIOLOGY_QUESTIONS.filter((q) => q.topic === 'MOLECULAR_GENETICS').length,
    description: 'Semi-conservative DNA replication, Helicase, and Okazaki lagging fragments.',
    accent: '#F59E0B',
  },
  {
    id: 'CELL_BIOLOGY',
    subject: 'Biology',
    title: 'Cell Division: Mitosis & Meiosis',
    count: BIOLOGY_QUESTIONS.filter((q) => q.topic === 'CELL_BIOLOGY').length,
    description: 'Diploid somatic mitosis vs. haploid gamete meiosis and genetic crossing over.',
    accent: '#D97706',
  },
  {
    id: 'EVOLUTION_POPULATION',
    subject: 'Biology',
    title: 'Evolution & Natural Selection',
    count: BIOLOGY_QUESTIONS.filter((q) => q.topic === 'EVOLUTION_POPULATION').length,
    description: 'Industrial melanism, allele frequency dynamics, and differential reproductive fitness.',
    accent: '#B45309',
  },
  // Computer Science Chapters
  {
    id: 'PROGRAMMING_RECURSION',
    subject: 'Computer Science',
    title: 'Programming & Recursion',
    count: COMPUTER_SCIENCE_QUESTIONS.filter((q) => q.topic === 'PROGRAMMING_RECURSION').length,
    description: 'Base case termination, call stack frames, and recursive problem decomposition.',
    accent: '#06B6D4',
  },
  {
    id: 'ALGORITHMS_SEARCH',
    subject: 'Computer Science',
    title: 'Algorithms & Search Complexity',
    count: COMPUTER_SCIENCE_QUESTIONS.filter((q) => q.topic === 'ALGORITHMS_SEARCH').length,
    description: 'Binary search logarithmic reduction O(log n) vs. linear search O(n).',
    accent: '#0891B2',
  },
  {
    id: 'DATA_STRUCTURES',
    subject: 'Computer Science',
    title: 'Data Structures: Stack & Queue',
    count: COMPUTER_SCIENCE_QUESTIONS.filter((q) => q.topic === 'DATA_STRUCTURES').length,
    description: 'LIFO stack behavior vs. FIFO queue processing.',
    accent: '#0E7490',
  },
];

export function getQuestionsByFilter(
  subjectFilter: AcademicSubject | 'ALL' = 'ALL',
  chapter: string = 'ALL',
  difficulty: QuestionDifficulty | 'all' = 'all',
  searchQuery: string = ''
): PhysicsQuestion[] {
  return ALL_QUESTIONS.filter((q) => {
    const matchesSubject = subjectFilter === 'ALL' || q.subject === subjectFilter;
    const matchesChapter = chapter === 'ALL' || q.topic === chapter;
    const matchesDifficulty = difficulty === 'all' || q.difficulty === difficulty;
    const matchesSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subtopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.physicalLawName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesChapter && matchesDifficulty && matchesSearch;
  });
}

export function getRandomizedQuestions(
  subjectFilter: AcademicSubject | 'ALL' = 'ALL',
  chapter: string = 'ALL',
  difficulty: QuestionDifficulty | 'all' = 'all',
  count: number = 10
): PhysicsQuestion[] {
  const filtered = getQuestionsByFilter(subjectFilter, chapter, difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
