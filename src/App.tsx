import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/navigation/Navbar';
import { LandingHero } from './components/landing/LandingHero';
import { TraditionalVsAlis } from './components/landing/TraditionalVsAlis';
import { PhysicsLabShowcase } from './components/landing/PhysicsLabShowcase';
import { AdaptiveIntelligenceShowcase } from './components/landing/AdaptiveIntelligenceShowcase';
import { LandingCtaAndFooter } from './components/landing/LandingCtaAndFooter';
import { StudentLearningInterface } from './components/student/StudentLearningInterface';
import { StudentDashboard } from './components/student/StudentDashboard';
import { OpenPhysicsSandbox } from './components/sandbox/OpenPhysicsSandbox';
import { AskAlisAssistant } from './components/assistant/AskAlisAssistant';
import { DiagnosticAssessment } from './components/diagnostic/DiagnosticAssessment';
import { ConceptGraphView } from './components/concept/ConceptGraphView';
import { RevisionQueueView } from './components/student/RevisionQueueView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { LearnerProfile, PhysicsTopic } from './types/physics';

const INITIAL_PROFILE: LearnerProfile = {
  studentName: 'Alex Mercer',
  studentId: 'alex_mercer_10a',
  diagnosticCompleted: false,
  diagnosticBaselineAt: null,
  conceptMastery: {},
  masteryScores: {
    NEWTONS_LAWS: 74,
    GRAVITATION: 68,
    WORK_AND_ENERGY: 62,
    KINEMATICS_PROJECTILE: 81,
    CIRCULAR_ROTATIONAL: 55,
    OSCILLATIONS_WAVES: 60,
  },
  questionsAttempted: 14,
  questionsMastered: 11,
  activeMisconceptions: [
    {
      id: 'work-carrying',
      title: 'Physiological Burn vs Mechanical Work',
      conceptId: 'c10_work_mechanical',
      topic: 'WORK_AND_ENERGY',
      detectedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      resolved: false,
      counterProofDone: true,
      evidenceText: 'Selected option stating carrying a heavy box flat does 200J mechanical work.',
    },
    {
      id: 'orbit-gravity',
      title: 'Zero-Gravity in Orbit Fallacy',
      conceptId: 'c10_universal_gravitation',
      topic: 'GRAVITATION',
      detectedAt: new Date(Date.now() - 86400000).toISOString(),
      resolved: false,
      counterProofDone: false,
      evidenceText: 'Stated gravity is zero in orbit.',
    },
  ],
  spacedRepetitionQueue: [
    {
      id: 'sr_1',
      conceptId: 'c10_acceleration',
      conceptName: 'Acceleration & Equations of Motion',
      chapter: 'Motion & Kinematics',
      dueDate: new Date().toISOString(),
      intervalDays: 1,
      repetitionCount: 2,
      status: 'DUE_TODAY',
      reason: 'Incorrect diagnostic reasoning response recorded 24h ago.',
    },
    {
      id: 'sr_2',
      conceptId: 'c10_work_mechanical',
      conceptName: 'Mechanical Work (W = F d cos θ)',
      chapter: 'Work, Energy & Power',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      intervalDays: 3,
      repetitionCount: 1,
      status: 'UPCOMING',
      reason: 'Scheduled for 3-day retention check after counter-proof verification.',
    },
    {
      id: 'sr_3',
      conceptId: 'c10_ohms_law',
      conceptName: "Ohm's Law & Resistance (V = IR)",
      chapter: 'Electricity & Circuits',
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      intervalDays: 7,
      repetitionCount: 3,
      status: 'UPCOMING',
      reason: 'Interval expanded to 7 days after consecutive correct transfer responses.',
    },
  ],
  assistantHistory: [
    {
      query: 'Why does the normal reaction decrease on a steep ramp?',
      subject: 'Physics',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      topic: 'Inclined Plane Normal Force',
    },
  ],
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedTopic, setSelectedTopic] = useState<PhysicsTopic | 'ALL'>('ALL');
  const [activeSandboxLab, setActiveSandboxLab] = useState<string>('gravitation');
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string>('');

  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(() => {
    const saved = localStorage.getItem('alis_learner_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('alis_learner_profile', JSON.stringify(learnerProfile));
  }, [learnerProfile]);

  const handleStartLearning = (topic?: PhysicsTopic) => {
    if (topic) {
      setSelectedTopic(topic);
    }
    setCurrentView('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreExperiments = (labKey?: string) => {
    if (labKey) {
      setActiveSandboxLab(labKey);
    }
    setCurrentView('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterLabTopic = (topicId: string) => {
    if (topicId === 'newton') {
      setSelectedTopic('NEWTONS_LAWS');
      setActiveSandboxLab('newton');
    } else if (topicId === 'gravitation') {
      setSelectedTopic('GRAVITATION');
      setActiveSandboxLab('gravitation');
    } else if (topicId === 'work_energy') {
      setSelectedTopic('WORK_AND_ENERGY');
      setActiveSandboxLab('work_energy');
    }
    setCurrentView('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeConcept = (conceptId: string) => {
    setSelectedTopic('ALL');
    setCurrentView('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreSimulation = (simType: string) => {
    const s = (simType || '').toLowerCase();
    if (s.includes('newton') || s.includes('collision')) {
      setActiveSandboxLab('newton');
    } else if (s.includes('gravit') || s.includes('orbit')) {
      setActiveSandboxLab('gravitation');
    } else if (s.includes('work') || s.includes('energy')) {
      setActiveSandboxLab('work_energy');
    } else if (s.includes('freefall') || s.includes('vacuum')) {
      setActiveSandboxLab('freefall');
    } else {
      setActiveSandboxLab('gravitation');
    }
    setCurrentView('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAlisAboutTopic = (topic: string) => {
    setAssistantInitialQuery(`Explain the fundamental principles and common pitfalls in ${topic}`);
    setCurrentView('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#171717] selection:bg-[#FF572E] selection:text-white">
      {/* Universal Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        masteryScore={Math.round(
          Object.values(learnerProfile.masteryScores || {}).reduce((a, b) => a + b, 0) /
            Math.max(1, Object.values(learnerProfile.masteryScores || {}).length)
        )}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <div>
            <LandingHero
              onStartLearning={() => setCurrentView('diagnostic')}
              onExploreExperiments={() => handleExploreExperiments()}
            />
            <TraditionalVsAlis />
            <PhysicsLabShowcase onEnterLabTopic={handleEnterLabTopic} />
            <AdaptiveIntelligenceShowcase />
            <LandingCtaAndFooter
              onStartLearning={() => setCurrentView('diagnostic')}
              onExploreExperiments={() => handleExploreExperiments()}
            />
          </div>
        )}

        {currentView === 'diagnostic' && (
          <DiagnosticAssessment
            learnerProfile={learnerProfile}
            onUpdateLearnerProfile={setLearnerProfile}
            onCompleteDiagnostic={() => {
              setCurrentView('concept-graph');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenConceptGraph={() => {
              setCurrentView('concept-graph');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'concept-graph' && (
          <ConceptGraphView
            learnerProfile={learnerProfile}
            onPracticeConcept={(cId) => handlePracticeConcept(cId)}
            onLaunchSimulation={(sId) => handleExploreSimulation(sId)}
          />
        )}

        {currentView === 'learning' && (
          <StudentLearningInterface
            initialTopic={selectedTopic}
            learnerProfile={learnerProfile}
            onUpdateLearnerProfile={setLearnerProfile}
            onOpenDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAskAlisAboutTopic={handleAskAlisAboutTopic}
          />
        )}

        {currentView === 'assistant' && (
          <AskAlisAssistant
            initialQuery={assistantInitialQuery}
            onPracticeConcept={(cId) => handlePracticeConcept(cId)}
            onExploreSimulation={handleExploreSimulation}
            learnerProfile={learnerProfile}
            onUpdateLearnerProfile={setLearnerProfile}
          />
        )}

        {currentView === 'revision' && (
          <RevisionQueueView
            learnerProfile={learnerProfile}
            onPracticeConcept={(cId) => handlePracticeConcept(cId)}
            onStartLearning={() => handleStartLearning()}
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            learnerProfile={learnerProfile}
            onResumeLearning={() => handleStartLearning()}
            onExploreSandbox={() => handleExploreExperiments()}
            onOpenAskAlis={() => {
              setCurrentView('assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'sandbox' && (
          <OpenPhysicsSandbox
            initialLab={activeSandboxLab}
            onBackToOverview={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartLearning={() => handleStartLearning()}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard currentLearnerProfile={learnerProfile} />
        )}
      </main>
    </div>
  );
}
