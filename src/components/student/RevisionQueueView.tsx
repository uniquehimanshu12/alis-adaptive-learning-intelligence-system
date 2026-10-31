import React, { useState } from 'react';
import { LearnerProfile, SpacedRepetitionItem } from '../../types/physics';
import { Clock, Calendar, CheckCircle2, RotateCcw, ArrowRight, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface RevisionQueueViewProps {
  learnerProfile: LearnerProfile;
  onPracticeConcept: (conceptId: string) => void;
  onStartLearning: () => void;
}

export const RevisionQueueView: React.FC<RevisionQueueViewProps> = ({
  learnerProfile,
  onPracticeConcept,
  onStartLearning,
}) => {
  const [activeTab, setActiveTab] = useState<'DUE_TODAY' | 'UPCOMING' | 'ALL'>('DUE_TODAY');

  const queue: SpacedRepetitionItem[] = learnerProfile.spacedRepetitionQueue || [
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
  ];

  const dueTodayItems = queue.filter((item) => item.status === 'DUE_TODAY' || new Date(item.dueDate) <= new Date());
  const upcomingItems = queue.filter((item) => item.status === 'UPCOMING' && new Date(item.dueDate) > new Date());

  const displayedItems = activeTab === 'DUE_TODAY' ? dueTodayItems : activeTab === 'UPCOMING' ? upcomingItems : queue;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#171717]/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF572E] flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>SuperMemo Spaced Repetition Engine</span>
          </span>
          <h1 className="text-3xl font-bold font-display text-[#171717] mt-1">
            Personalized Revision Queue
          </h1>
          <p className="text-sm text-[#171717]/70 mt-1 max-w-2xl">
            Concepts reappear right before memory decay occurs. Correct responses expand review intervals (1d → 3d → 7d → 16d → 30d).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-xl border border-[#171717]/10 flex items-center gap-3 text-xs font-mono font-bold">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-[#FF572E]">{dueTodayItems.length}</div>
              <div className="text-[10px] text-[#171717]/60 uppercase">Due Today</div>
            </div>
            <div className="w-px h-8 bg-[#171717]/10" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-[#10B981]">{upcomingItems.length}</div>
              <div className="text-[10px] text-[#171717]/60 uppercase">Scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-[#171717]/10 pb-3">
        <button
          onClick={() => setActiveTab('DUE_TODAY')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'DUE_TODAY'
              ? 'bg-[#FF572E] text-white shadow-xs'
              : 'bg-white text-[#171717]/70 hover:bg-[#171717]/10 border border-[#171717]/10'
          }`}
        >
          Due Today ({dueTodayItems.length})
        </button>
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'UPCOMING'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'bg-white text-[#171717]/70 hover:bg-[#171717]/10 border border-[#171717]/10'
          }`}
        >
          Upcoming Revision ({upcomingItems.length})
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'bg-white text-[#171717]/70 hover:bg-[#171717]/10 border border-[#171717]/10'
          }`}
        >
          All Scheduled ({queue.length})
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => {
            const isDueNow = item.status === 'DUE_TODAY' || new Date(item.dueDate) <= new Date();

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md ${
                  isDueNow ? 'border-[#FF572E] ring-1 ring-[#FF572E]/30 bg-white' : 'border-[#171717]/10'
                }`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717]/50">
                    <span>{item.chapter}</span>
                    <span>·</span>
                    <span className="text-[#FF572E]">Interval: {item.intervalDays} Days</span>
                    <span>·</span>
                    <span className="font-mono">Repetition #{item.repetitionCount}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#171717]">{item.conceptName}</h3>

                  <p className="text-xs text-[#171717]/70 leading-relaxed bg-[#F5F0E7]/60 p-2.5 rounded-lg border border-[#171717]/5">
                    <strong className="text-[#171717]">Scheduling Trigger:</strong> {item.reason}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold font-mono text-[#171717]">
                      {isDueNow ? 'Due Right Now' : `Due in ${item.intervalDays}d`}
                    </div>
                    <div className="text-[10px] text-[#171717]/50">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => onPracticeConcept(item.conceptId)}
                    className={`px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isDueNow
                        ? 'bg-[#FF572E] text-white hover:bg-[#FF572E]/90'
                        : 'bg-[#171717] text-white hover:bg-[#171717]/80'
                    }`}
                  >
                    <span>{isDueNow ? 'Revise Concept Now' : 'Early Practice'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#171717]/10 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
            <h3 className="text-lg font-bold text-[#171717]">All Due Revisions Completed!</h3>
            <p className="text-sm text-[#171717]/60 max-w-md mx-auto">
              Your memory retention curve is currently optimal. Practice new concepts or explore the Class 10 Physics question bank.
            </p>
            <button
              onClick={onStartLearning}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#FF572E] rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Question Bank</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
