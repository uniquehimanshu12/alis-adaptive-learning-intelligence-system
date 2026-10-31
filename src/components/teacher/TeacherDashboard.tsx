import React, { useState } from 'react';
import { LearnerProfile } from '../../types/physics';
import { CLASS10_PHYSICS_CONCEPT_GRAPH } from '../../data/conceptGraph';
import { Users, GraduationCap, AlertTriangle, TrendingUp, CheckCircle2, Search, Filter, ShieldCheck, ArrowUpRight, ChevronRight, Eye, Brain } from 'lucide-react';

interface TeacherDashboardProps {
  currentLearnerProfile: LearnerProfile;
}

interface ClassStudentRecord {
  id: string;
  name: string;
  avatar: string;
  overallMasteryPct: number;
  diagnosticStatus: 'COMPLETED' | 'PENDING';
  riskTier: 'ON_TRACK' | 'DEVELOPING' | 'NEEDS_INTERVENTION';
  weakConcepts: string[];
  activeMisconceptions: string[];
  reasoningScore: number;
  lastActive: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentLearnerProfile }) => {
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingStudent, setInspectingStudent] = useState<ClassStudentRecord | null>(null);

  // Class 10 Physics Demonstration Roster (28 students)
  const classRoster: ClassStudentRecord[] = [
    {
      id: 's_active',
      name: `${currentLearnerProfile.studentName} (Active Session)`,
      avatar: 'AM',
      overallMasteryPct: Math.round(
        Object.values(currentLearnerProfile.masteryScores).reduce((a, b) => a + b, 0) /
          Math.max(1, Object.values(currentLearnerProfile.masteryScores).length)
      ),
      diagnosticStatus: currentLearnerProfile.diagnosticCompleted ? 'COMPLETED' : 'PENDING',
      riskTier: 'DEVELOPING',
      weakConcepts: ['Work, Energy & Power', 'Ohm\'s Law & Resistance'],
      activeMisconceptions: currentLearnerProfile.activeMisconceptions.filter((m) => !m.resolved).map((m) => m.title),
      reasoningScore: 72,
      lastActive: 'Just now',
    },
    {
      id: 's_1',
      name: 'Priya Sharma',
      avatar: 'PS',
      overallMasteryPct: 88,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'ON_TRACK',
      weakConcepts: ['Snell\'s Law Refraction'],
      activeMisconceptions: [],
      reasoningScore: 91,
      lastActive: '10 mins ago',
    },
    {
      id: 's_2',
      name: 'Rohan Gupta',
      avatar: 'RG',
      overallMasteryPct: 42,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'NEEDS_INTERVENTION',
      weakConcepts: ['Motion Requires Force Fallacy', 'Ohm\'s Law V=IR', 'Work Done Standing Still'],
      activeMisconceptions: ['Physiological Burn equals Work', 'Current Consumed in Resistor'],
      reasoningScore: 38,
      lastActive: '1 hour ago',
    },
    {
      id: 's_3',
      name: 'Ananya Verma',
      avatar: 'AV',
      overallMasteryPct: 94,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'ON_TRACK',
      weakConcepts: [],
      activeMisconceptions: [],
      reasoningScore: 96,
      lastActive: '2 hours ago',
    },
    {
      id: 's_4',
      name: 'Devansh Patel',
      avatar: 'DP',
      overallMasteryPct: 56,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'DEVELOPING',
      weakConcepts: ['Universal Gravitation Inverse Square', 'Right Hand Thumb Rule'],
      activeMisconceptions: ['Inverse Square Linear Decay'],
      reasoningScore: 62,
      lastActive: 'Yesterday',
    },
    {
      id: 's_5',
      name: 'Kavya Nair',
      avatar: 'KN',
      overallMasteryPct: 35,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'NEEDS_INTERVENTION',
      weakConcepts: ['Newton\'s Second Law F=ma', 'Kinematic Acceleration', 'Electric Potential'],
      activeMisconceptions: ['Force-Mass Doubling Quadruples Acceleration', 'Voltage Flows Through Wires'],
      reasoningScore: 31,
      lastActive: '3 hours ago',
    },
    {
      id: 's_6',
      name: 'Aarav Mehta',
      avatar: 'AM',
      overallMasteryPct: 79,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'ON_TRACK',
      weakConcepts: ['Lens Power Dioptre'],
      activeMisconceptions: [],
      reasoningScore: 84,
      lastActive: '4 hours ago',
    },
    {
      id: 's_7',
      name: 'Sanya Malhotra',
      avatar: 'SM',
      overallMasteryPct: 61,
      diagnosticStatus: 'COMPLETED',
      riskTier: 'DEVELOPING',
      weakConcepts: ['Joule Heating H=I²Rt', 'Conservation of Momentum'],
      activeMisconceptions: ['Thicker Wire Heats More'],
      reasoningScore: 68,
      lastActive: '5 hours ago',
    },
  ];

  const topMisconceptionsClass = [
    { title: 'Motion Requires Continuous Force Fallacy', count: 11, pct: '39%' },
    { title: 'Current Consumed in Resistor / Bulb', count: 9, pct: '32%' },
    { title: 'Physiological Burn equals Mechanical Work', count: 8, pct: '28%' },
    { title: 'Force-Mass Doubling Quadruples Acceleration', count: 6, pct: '21%' },
    { title: 'Inverse-Square Force Linear Decay Fallacy', count: 5, pct: '18%' },
  ];

  const filteredRoster = classRoster.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'ALL' || student.riskTier === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#171717]/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF572E] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Classroom Intelligence & Diagnostic Dashboard</span>
          </span>
          <h1 className="text-3xl font-bold font-display text-[#171717] mt-1">
            Class 10 Physics — Section A
          </h1>
          <p className="text-sm text-[#171717]/70 mt-1">
            Aggregated diagnostic performance, concept mastery heatmaps, and misconception diagnostics for 28 enrolled students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-bold font-mono bg-white border border-[#171717]/10 rounded-xl text-[#171717]">
            Academic Term 2026
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#171717]/10 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase text-[#171717]/50 flex items-center justify-between">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#FF572E]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#171717]">28</div>
          <div className="text-[11px] text-[#10B981] font-medium">100% Diagnostic Completion</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#171717]/10 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase text-[#171717]/50 flex items-center justify-between">
            <span>Class Avg Diagnostic Score</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#10B981]">68%</div>
          <div className="text-[11px] text-[#171717]/60 font-medium">+12% over 30-day baseline</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#171717]/10 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase text-[#171717]/50 flex items-center justify-between">
            <span>Needs Intervention</span>
            <AlertTriangle className="w-4 h-4 text-[#FF572E]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#FF572E]">2 Students</div>
          <div className="text-[11px] text-[#FF572E] font-medium">Mastery &lt; 45% in 3+ chapters</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#171717]/10 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase text-[#171717]/50 flex items-center justify-between">
            <span>Active Misconceptions</span>
            <Brain className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#D97706]">5 Common Traps</div>
          <div className="text-[11px] text-[#171717]/60 font-medium">Flagged in student reasoning</div>
        </div>
      </div>

      {/* Middle Section: Top Misconceptions + Chapter Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Frequent Misconceptions */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#171717]/10 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF572E]" />
              <span>Most Frequent Class Misconceptions</span>
            </h3>
          </div>

          <div className="space-y-3">
            {topMisconceptionsClass.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#F5F0E7]/60 border border-[#171717]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171717]">{m.title}</span>
                  <span className="text-xs font-mono font-bold text-[#FF572E]">{m.pct}</span>
                </div>
                <div className="w-full bg-[#171717]/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#FF572E] h-full" style={{ width: m.pct }} />
                </div>
                <div className="text-[10px] text-[#171717]/50 font-mono">
                  Affects {m.count} out of 28 students
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Mastery Matrix */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#171717]/10 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              Chapter-Wise Class Mastery Heatmap
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { chapter: 'Motion & Kinematics', avg: 76, status: 'STRONG' },
              { chapter: 'Force & Laws of Motion', avg: 62, status: 'DEVELOPING' },
              { chapter: 'Gravitation & Free Fall', avg: 71, status: 'STRONG' },
              { chapter: 'Work, Energy & Power', avg: 58, status: 'DEVELOPING' },
              { chapter: 'Electricity & Circuits', avg: 49, status: 'WEAK' },
              { chapter: 'Light: Reflection & Refraction', avg: 82, status: 'STRONG' },
            ].map((chap, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#171717]">
                  <span>{chap.chapter}</span>
                  <span className="font-mono">{chap.avg}% Avg</span>
                </div>
                <div className="w-full bg-[#171717]/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      chap.avg >= 75 ? 'bg-[#10B981]' : chap.avg >= 55 ? 'bg-[#D97706]' : 'bg-[#FF572E]'
                    }`}
                    style={{ width: `${chap.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-[#171717]/10 shadow-md overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
          <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF572E]" />
            <span>Class Roster & Individual Profiles</span>
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#171717]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#171717]/15 bg-[#F5F0E7]/40 text-[#171717] focus:outline-none focus:border-[#FF572E]"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1 bg-[#F5F0E7] p-1 rounded-xl">
              <button
                onClick={() => setSelectedRiskFilter('ALL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  selectedRiskFilter === 'ALL' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#171717]/60'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRiskFilter('NEEDS_INTERVENTION')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  selectedRiskFilter === 'NEEDS_INTERVENTION' ? 'bg-[#FF572E] text-white shadow-xs' : 'text-[#171717]/60'
                }`}
              >
                At Risk
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#171717]/10 text-[11px] font-bold uppercase tracking-wider text-[#171717]/50 bg-[#F5F0E7]/40">
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Overall Mastery</th>
                <th className="p-3.5">Reasoning Quality</th>
                <th className="p-3.5">Risk Tier</th>
                <th className="p-3.5">Weak Concepts</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]/10 text-xs">
              {filteredRoster.map((st) => (
                <tr key={st.id} className="hover:bg-[#F5F0E7]/30 transition-colors">
                  <td className="p-3.5 font-bold text-[#171717] flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center font-mono text-[10px] shrink-0">
                      {st.avatar}
                    </span>
                    <span>{st.name}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#171717]">
                    {st.overallMasteryPct}%
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#10B981]">
                    {st.reasoningScore}%
                  </td>
                  <td className="p-3.5">
                    {st.riskTier === 'NEEDS_INTERVENTION' ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#FF572E]/15 text-[#FF572E] border border-[#FF572E]/30">
                        At Risk
                      </span>
                    ) : st.riskTier === 'DEVELOPING' ? (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#D97706]/15 text-[#D97706]">
                        Developing
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#10B981]/15 text-[#10B981]">
                        On Track
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-[#171717]/70">
                    {st.weakConcepts.length > 0 ? st.weakConcepts.join(', ') : 'None'}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setInspectingStudent(st)}
                      className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#171717] bg-[#F5F0E7] hover:bg-[#171717]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Inspector Modal */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#171717]/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#FF572E] text-white flex items-center justify-center font-bold font-mono text-sm">
                  {inspectingStudent.avatar}
                </span>
                <div>
                  <h3 className="text-xl font-bold font-display text-[#171717]">
                    {inspectingStudent.name}
                  </h3>
                  <p className="text-xs text-[#171717]/50">Student Profile & Diagnostic Record</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="text-xs font-bold uppercase px-3 py-1.5 rounded-lg bg-[#F5F0E7] hover:bg-[#171717]/10 text-[#171717]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F5F0E7] space-y-1">
                <div className="text-xs text-[#171717]/60 uppercase font-bold">Overall Mastery</div>
                <div className="text-2xl font-bold font-mono text-[#171717]">{inspectingStudent.overallMasteryPct}%</div>
              </div>
              <div className="p-4 rounded-xl bg-[#10B981]/10 space-y-1">
                <div className="text-xs text-[#10B981] uppercase font-bold">Reasoning Quality</div>
                <div className="text-2xl font-bold font-mono text-[#10B981]">{inspectingStudent.reasoningScore}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">Active Misconceptions Flagged</h4>
              {inspectingStudent.activeMisconceptions.length > 0 ? (
                <ul className="space-y-1.5">
                  {inspectingStudent.activeMisconceptions.map((m, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-[#FF572E]/10 border border-[#FF572E]/20 text-xs font-medium text-[#FF572E]">
                      {m}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#10B981] italic">No active misconceptions flagged.</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">Targeted Weak Concepts</h4>
              <ul className="space-y-1.5">
                {inspectingStudent.weakConcepts.map((wc, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-[#F5F0E7] text-xs font-medium text-[#171717]">
                    {wc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
