export type PhysicsTopic =
  | 'NEWTONS_LAWS'
  | 'GRAVITATION'
  | 'WORK_AND_ENERGY'
  | 'MOMENTUM_COLLISIONS'
  | 'KINEMATICS_PROJECTILE'
  | 'CIRCULAR_ROTATIONAL'
  | 'OSCILLATIONS_WAVES'
  | 'ELECTROSTATICS_CURRENT'
  | 'THERMODYNAMICS';

export type AcademicSubject =
  | 'Physics'
  | 'Mathematics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'General Science';

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuestionCategory =
  | 'conceptual'
  | 'numerical'
  | 'real_world'
  | 'misconception'
  | 'prediction'
  | 'assertion_reasoning'
  | 'multi_step';

export interface PredictionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionTag?: string;
  misconceptionLabel?: string;
  intuitiveReasoningSummary: string;
}

export type SimulationType =
  | 'collision'
  | 'freefall'
  | 'work_vector'
  | 'orbit'
  | 'incline'
  | 'projectile'
  | 'harmonic_spring'
  | 'circular_motion'
  | 'coulomb_law'
  | 'math_quadratic'
  | 'math_trig'
  | 'math_differentiation'
  | 'chem_concentration'
  | 'chem_ideal_gas'
  | 'chem_kinetics'
  | 'bio_natural_selection'
  | 'bio_enzyme'
  | 'bio_dna_replication'
  | 'bio_mitosis'
  | 'cs_binary_search'
  | 'cs_sorting'
  | 'cs_recursion'
  | 'kinematics_graph'
  | 'ohms_law_graph'
  | 'optics_ray';

export interface QuestionSimulationConfig {
  type: SimulationType;
  initialParams: Record<string, number | boolean | string>;
  labels: {
    x?: string;
    y?: string;
    controlA?: string;
    controlB?: string;
  };
}

export interface PhysicsQuestion {
  id: string;
  subject?: AcademicSubject;
  topic: PhysicsTopic | string;
  chapterTitle: string;
  subtopic: string;
  difficulty: QuestionDifficulty;
  category: QuestionCategory;
  title: string;
  subtitle: string;
  scenario: string;
  questionText: string;
  options: PredictionOption[];
  simulationConfig: QuestionSimulationConfig;
  physicalLawFormula: string;
  physicalLawName: string;
  counterExperimentPrompt: string;
  recommendedParamsForProof: Record<string, number | boolean | string>;
  hint?: string;
}

export interface CognitiveDiagnosis {
  isCorrect: boolean;
  scientificAccuracyScore: number;
  detectedMisconception: string;
  cognitiveExplanation: string;
  keyInsight: string;
  counterExperimentRecommendation: string;
  recommendedNextConcept: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: AcademicSubject;
  topic?: string;
  explanationLevel?: 'simple' | 'detailed' | 'advanced';
  explanationSimple?: string;
  explanationDetailed?: string;
  explanationAdvanced?: string;
  keyFormula?: string;
  stepByStepSolution?: string[];
  numericalSolution?: {
    given?: string;
    toCalculate?: string;
    formulaPrinciple?: string;
    substitutionCalculation?: string;
    finalAnswer?: string;
    interpretation?: string;
  };
  commonMisconceptions?: string[];
  realWorldExample?: string;
  suggestedFollowUps?: string[];
  hint?: string;
  checkUnderstanding?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  practiceProblems?: {
    question: string;
    hint: string;
    solution: string;
  }[];
  ambiguityNote?: string;
  isRateLimited?: boolean;
  hasInteractiveSimulation?: boolean;
  simulationType?: SimulationType | null;
  simulationParams?: Record<string, any>;
  recommendedPracticeConcept?: string;
  recommendedTopicKey?: PhysicsTopic | string;
  questionSessionId?: string;
  transferLearningQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    contextDescription: string;
  };
}

export interface ConceptMasteryData {
  conceptId: string;
  conceptName: string;
  chapter: string;
  questionsAttempted: number;
  correctCount: number;
  incorrectCount: number;
  masteryPct: number; // 0 to 100
  masteryLevel: 'NOT_ASSESSED' | 'WEAK' | 'DEVELOPING' | 'STRONG' | 'MASTERED';
  reasoningQualityAvg: number; // 0 to 100
  lastPracticedAt: string;
  nextRevisionAt: string;
  revisionIntervalDays: number;
  revisionHistory: {
    date: string;
    isCorrect: boolean;
    reasoningScore: number;
  }[];
}

export interface TopicEvidence {
  topicKey: string;
  attemptsCount: number;
  firstTryCorrect: boolean;
  misconceptionsDetected: string[];
  misconceptionsResolved: string[];
  counterproofsCompleted: string[];
  transferQuestionsPassed: string[];
  masteryLevel: 'UNATTEMPTED' | 'ATTEMPTED' | 'DEVELOPING' | 'COUNTERPROOF_VERIFIED' | 'TRANSFER_MASTERED';
  calculatedScore: number;
  evaluatedAttemptIds: string[];
}

export interface SpacedRepetitionItem {
  id: string;
  conceptId: string;
  conceptName: string;
  chapter: string;
  dueDate: string;
  intervalDays: number;
  repetitionCount: number;
  status: 'DUE_TODAY' | 'UPCOMING' | 'OVERDUE';
  reason: string;
}

export interface LearnerProfile {
  studentName: string;
  studentId?: string;
  masteryScores: Record<string, number>; // 0 - 100
  questionsAttempted: number;
  questionsMastered: number;
  diagnosticCompleted: boolean;
  diagnosticBaselineAt?: string | null;
  conceptMastery: Record<string, ConceptMasteryData>;
  activeMisconceptions: {
    id: string;
    title: string;
    conceptId: string;
    topic: string;
    detectedAt: string;
    resolved: boolean;
    counterProofDone: boolean;
    evidenceText?: string;
  }[];
  spacedRepetitionQueue: SpacedRepetitionItem[];
  assistantHistory?: {
    query: string;
    subject: AcademicSubject;
    timestamp: string;
    topic: string;
  }[];
  topicEvidenceLedger?: Record<string, TopicEvidence>;
  evaluatedAttemptIds?: string[];
}

export interface ReasoningAnalysisResult {
  isCorrect: boolean;
  reasoningQualityScore: number;
  errorType: 'CONCEPTUAL_MISCONCEPTION' | 'CARELESS_CALCULATION_ERROR' | 'NONE';
  detectedMisconception: string | null;
  evidenceFromExplanation: string;
  correctExplanation: string;
  recommendedIntervention: string;
  confidenceScore: number;
}

