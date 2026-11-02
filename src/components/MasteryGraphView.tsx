import React, { useState } from 'react';
import { TopicMastery } from '../types';
import { 
  Network, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Brain, 
  Zap, 
  Layers,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Award,
  BarChart3,
  Flame,
  ArrowUpRight,
  Filter,
  PlusCircle,
  Clock,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import confetti from 'canvas-confetti';

interface MasteryGraphViewProps {
  topicMasteryList: TopicMastery[];
  onSelectTopicForTutor: (topic: string, subject: string) => void;
  onNavigateTab?: (tab: any) => void;
}

// Historical mastery tracking data point structure
interface MasteryHistoryPoint {
  date: string;
  label: string;
  dsa: number;
  dbms: number;
  networks: number;
  javaSpring: number;
  average: number;
  event?: string;
  subjectEvent?: string;
}

// Initial 8-week semester timeline
const INITIAL_TIMELINE_DATA: MasteryHistoryPoint[] = [
  {
    date: '2026-07-06',
    label: 'Week 1',
    dsa: 36,
    dbms: 40,
    networks: 28,
    javaSpring: 42,
    average: 36.5,
    event: 'Semester Kickoff & Baseline Diagnostic',
    subjectEvent: 'Initial syllabus diagnostic tests completed',
  },
  {
    date: '2026-07-13',
    label: 'Week 2',
    dsa: 44,
    dbms: 48,
    networks: 35,
    javaSpring: 50,
    average: 44.2,
    event: 'Linear Structures Mastered',
    subjectEvent: 'Arrays & Two-Pointers unit completed at 92%',
  },
  {
    date: '2026-07-20',
    label: 'Week 3',
    dsa: 52,
    dbms: 56,
    networks: 42,
    javaSpring: 59,
    average: 52.2,
    event: 'SQL Mastery Milestone',
    subjectEvent: 'Complex SQL Joins & Subqueries scored 88%',
  },
  {
    date: '2026-07-27',
    label: 'Week 4',
    dsa: 58,
    dbms: 62,
    networks: 49,
    javaSpring: 67,
    average: 59.0,
    event: 'Binary Trees & BFS Complete',
    subjectEvent: 'Floyd Cycle & BST search mastered',
  },
  {
    date: '2026-08-03',
    label: 'Week 5',
    dsa: 56, // Slight dip due to AVL Tree gap detection
    dbms: 60, // Slight dip on Normalization
    networks: 58,
    javaSpring: 74,
    average: 62.0,
    event: 'Diagnostic Flag: AVL & 3NF Gaps',
    subjectEvent: 'Adaptive trigger detected prerequisite blockers',
  },
  {
    date: '2026-08-10',
    label: 'Week 6',
    dsa: 64, // Recovery after remediation
    dbms: 68,
    networks: 65,
    javaSpring: 79,
    average: 69.0,
    event: 'Remediation Sprints Complete',
    subjectEvent: 'Tree rotation mechanics revised with AI Tutor',
  },
  {
    date: '2026-08-17',
    label: 'Week 7',
    dsa: 71,
    dbms: 73,
    networks: 70,
    javaSpring: 83,
    average: 74.2,
    event: 'Pre-Midterm Simulation',
    subjectEvent: 'Mock exam passed above university distinction line',
  },
  {
    date: '2026-08-24',
    label: 'Week 8 (Now)',
    dsa: 76,
    dbms: 78,
    networks: 74,
    javaSpring: 87,
    average: 78.8,
    event: 'Current University Standings',
    subjectEvent: 'Tier-1 placement benchmark nearing for Java & DSA',
  },
];

// 14-day high-frequency daily tracking
const DAILY_TIMELINE_DATA: MasteryHistoryPoint[] = [
  { date: 'Aug 14', label: 'Day 1', dsa: 68, dbms: 70, networks: 67, javaSpring: 81, average: 71.5 },
  { date: 'Aug 15', label: 'Day 2', dsa: 69, dbms: 71, networks: 68, javaSpring: 82, average: 72.5 },
  { date: 'Aug 16', label: 'Day 3', dsa: 70, dbms: 71, networks: 68, javaSpring: 82, average: 72.8 },
  { date: 'Aug 17', label: 'Day 4', dsa: 71, dbms: 72, networks: 69, javaSpring: 83, average: 73.8 },
  { date: 'Aug 18', label: 'Day 5', dsa: 71, dbms: 73, networks: 70, javaSpring: 83, average: 74.2 },
  { date: 'Aug 19', label: 'Day 6', dsa: 73, dbms: 74, networks: 71, javaSpring: 84, average: 75.5, event: 'Group Study Focus Sprints' },
  { date: 'Aug 20', label: 'Day 7', dsa: 74, dbms: 75, networks: 71, javaSpring: 84, average: 76.0 },
  { date: 'Aug 21', label: 'Day 8', dsa: 74, dbms: 76, networks: 72, javaSpring: 85, average: 76.8 },
  { date: 'Aug 22', label: 'Day 9', dsa: 75, dbms: 76, networks: 73, javaSpring: 86, average: 77.5 },
  { date: 'Aug 23', label: 'Day 10', dsa: 75, dbms: 77, networks: 73, javaSpring: 86, average: 77.8 },
  { date: 'Aug 24', label: 'Day 11', dsa: 76, dbms: 78, networks: 74, javaSpring: 87, average: 78.8, event: 'Current Standing' },
];

export const MasteryGraphView: React.FC<MasteryGraphViewProps> = ({
  topicMasteryList,
  onSelectTopicForTutor,
  onNavigateTab,
}) => {
  // View mode: 'all' or specific subject
  const [activeSubject, setActiveSubject] = useState<'all' | 'dsa' | 'dbms' | 'networks' | 'javaSpring'>('all');
  const [timeHorizon, setTimeHorizon] = useState<'8weeks' | '14days'>('8weeks');
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(true);
  const [timelineData, setTimelineData] = useState<MasteryHistoryPoint[]>(INITIAL_TIMELINE_DATA);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [selectedBranch, setSelectedBranch] = useState<'trees' | 'dbms' | 'graphs'>('trees');
  const [activeTab, setActiveTab] = useState<'trend' | 'prereq'>('trend');
  const [isSimulating, setIsSimulating] = useState(false);

  const currentDataset = timeHorizon === '8weeks' ? timelineData : DAILY_TIMELINE_DATA;

  // Subject metadata with colors and targets
  const subjectsMeta = {
    dsa: {
      name: 'Data Structures & Algorithms',
      shortName: 'DSA (CS8391)',
      color: '#4F46E5', // Indigo
      secondaryColor: '#818CF8',
      current: currentDataset[currentDataset.length - 1].dsa,
      start: currentDataset[0].dsa,
      target: 85,
      code: 'CS8391',
    },
    dbms: {
      name: 'Database Management Systems',
      shortName: 'DBMS (CS8492)',
      color: '#059669', // Emerald
      secondaryColor: '#34D399',
      current: currentDataset[currentDataset.length - 1].dbms,
      start: currentDataset[0].dbms,
      target: 80,
      code: 'CS8492',
    },
    networks: {
      name: 'Computer Networks',
      shortName: 'Networks (CS8591)',
      color: '#D97706', // Amber
      secondaryColor: '#FBBF24',
      current: currentDataset[currentDataset.length - 1].networks,
      start: currentDataset[0].networks,
      target: 75,
      code: 'CS8591',
    },
    javaSpring: {
      name: 'Java & Backend Engineering',
      shortName: 'Java / Spring',
      color: '#7C3AED', // Violet
      secondaryColor: '#A78BFA',
      current: currentDataset[currentDataset.length - 1].javaSpring,
      start: currentDataset[0].javaSpring,
      target: 90,
      code: 'JAVA-CORE',
    },
  };

  // Interactive Knowledge Chains
  const knowledgeChains = {
    trees: {
      title: 'Hierarchical & Self-Balancing Trees Pipeline',
      subject: 'Data Structures & Algorithms',
      nodes: [
        { id: 'rec', name: 'Recursion & Call Stack', mastery: 85, status: 'Mastered', desc: 'Base cases & subtree call stack frames' },
        { id: 'bt', name: 'Binary Trees & Traversals', mastery: 65, status: 'In Progress', desc: 'Inorder, Preorder, Postorder & Level Order BFS' },
        { id: 'bst', name: 'Binary Search Trees (BST)', mastery: 58, status: 'Needs Attention', desc: 'Search invariant (Left < Root < Right) & Node Deletion' },
        { id: 'rot', name: 'Tree Rotation Mechanics', mastery: 40, status: 'Critical Gap', desc: 'Pointer relinking during Left & Right Rotations' },
        { id: 'avl', name: 'AVL Trees (Self-Balancing)', mastery: 32, status: 'Critical Gap', desc: 'Balance Factor |hL - hR| <= 1 with 4 rotation cases' },
        { id: 'rb', name: 'Red-Black Trees', mastery: 15, status: 'Locked', desc: 'Color invariants, recoloring & rotation bounds' },
      ],
    },
    dbms: {
      title: 'Database Normalization & Dependency Pipeline',
      subject: 'Database Management Systems',
      nodes: [
        { id: 'rel', name: 'Relational Model & Schema', mastery: 90, status: 'Mastered', desc: 'Tuples, attributes & domain constraints' },
        { id: 'fd', name: 'Functional Dependencies (FDs)', mastery: 75, status: 'In Progress', desc: 'Determinants and Armstrong axioms' },
        { id: 'closure', name: 'Attribute Closure (X+)', mastery: 62, status: 'Needs Attention', desc: 'Closure algorithm to deduce all implied attributes' },
        { id: 'ck', name: 'Candidate Key Computation', mastery: 48, status: 'Needs Attention', desc: 'Minimal superkeys with zero redundant attributes' },
        { id: 'norm3', name: '3NF vs BCNF Decomposition', mastery: 38, status: 'Critical Gap', desc: 'Lossless join vs dependency preservation tradeoffs' },
      ],
    },
    graphs: {
      title: 'Graph Traversal & Shortest Path Pipeline',
      subject: 'Data Structures & Algorithms',
      nodes: [
        { id: 'adj', name: 'Adjacency Representation', mastery: 88, status: 'Mastered', desc: 'Adjacency list vs adjacency matrix memory tradeoffs' },
        { id: 'bfs', name: 'BFS & Shortest Path in Unweighted Graphs', mastery: 70, status: 'In Progress', desc: 'Queue FIFO exploration & level-order tree bounds' },
        { id: 'dfs', name: 'DFS & Cycle Detection', mastery: 60, status: 'Needs Attention', desc: '3-color recursion state for directed cycle detection' },
        { id: 'dijk', name: 'Dijkstra with Min-Heap Priority Queue', mastery: 28, status: 'Critical Gap', desc: 'Greedy relaxation for non-negative weighted graphs' },
      ],
    },
  };

  const currentChain = knowledgeChains[selectedBranch];

  // Quick simulation function to test score improvement
  const handleSimulateQuizGain = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setTimelineData((prev) => {
        const last = prev[prev.length - 1];
        const nextWeekNum = prev.length + 1;
        const newPoint: MasteryHistoryPoint = {
          date: new Date().toISOString().split('T')[0],
          label: `Week ${nextWeekNum} (Simulated)`,
          dsa: Math.min(100, last.dsa + 4),
          dbms: Math.min(100, last.dbms + 3),
          networks: Math.min(100, last.networks + 4),
          javaSpring: Math.min(100, last.javaSpring + 2),
          average: Math.min(100, Math.round((last.dsa + 4 + last.dbms + 3 + last.networks + 4 + last.javaSpring + 2) / 4)),
          event: 'Adaptive Remediation Assessment Passed',
          subjectEvent: '+4% overall gain from AVL Tree rotation mastery',
        };
        return [...prev, newPoint];
      });
      setIsSimulating(false);
      confetti({ particleCount: 45, spread: 60 });
    }, 400);
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as MasteryHistoryPoint;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs min-w-[220px] space-y-2">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
            <span className="font-bold text-slate-200">{dataPoint.label}</span>
            <span className="text-[10px] text-slate-400">{dataPoint.date}</span>
          </div>

          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              if (entry.dataKey === 'average' && activeSubject !== 'all') return null;
              return (
                <div key={`tooltip-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-300 capitalize">{entry.name}:</span>
                  </div>
                  <span className="font-extrabold text-white">{entry.value}%</span>
                </div>
              );
            })}
          </div>

          {dataPoint.event && (
            <div className="pt-1.5 border-t border-slate-700/60 text-[11px] text-amber-300 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 shrink-0 text-amber-400" />
              <span className="font-medium truncate">{dataPoint.event}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate velocity and overall gain
  const latestPoint = currentDataset[currentDataset.length - 1];
  const firstPoint = currentDataset[0];
  const totalGain = Math.round(latestPoint.average - firstPoint.average);
  const weeklyVelocity = (totalGain / Math.max(1, currentDataset.length - 1)).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Syllabus Mastery Analytics & Diagnostic Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Subject Mastery Improvement Over Time
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Track how your mastery has evolved across all university subjects from semester kickoff to today. 
              The AI dynamically calibrates this curve following every quiz, flashcard drill, and note revision session.
            </p>
          </div>

          {/* Tab Switcher: Trend Chart vs Prerequisite Root-Cause */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start lg:self-center border border-slate-200">
            <button
              onClick={() => setActiveTab('trend')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'trend'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Mastery Trend Line</span>
            </button>
            <button
              onClick={() => setActiveTab('prereq')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'prereq'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Prerequisite Chains</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'trend' && (
        <>
          {/* Top Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Current Avg Mastery</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-slate-800">{latestPoint.average}%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  +{totalGain}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">From {firstPoint.average}% at kickoff</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Learning Velocity</span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-slate-800">+{weeklyVelocity}%</span>
                <span className="text-xs font-semibold text-slate-500">/ week</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Accelerated 1.4x this month</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Top Growth Subject</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-slate-800">
                  +{subjectsMeta.javaSpring.current - subjectsMeta.javaSpring.start}%
                </span>
                <span className="text-xs font-bold text-violet-600 truncate max-w-[80px]">Java Spring</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">87% placement ready</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Exam Target Readiness</span>
                <Target className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-slate-800">20 Days</span>
                <span className="text-xs font-bold text-indigo-600">to Anna Univ</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Predicted GPA: 8.9 / 10</p>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
            
            {/* Chart Toolbar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              
              {/* Subject Selectors */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveSubject('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeSubject === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>All Subjects</span>
                </button>

                <button
                  onClick={() => setActiveSubject('dsa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeSubject === 'dsa'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>DSA ({subjectsMeta.dsa.current}%)</span>
                </button>

                <button
                  onClick={() => setActiveSubject('dbms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeSubject === 'dbms'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>DBMS ({subjectsMeta.dbms.current}%)</span>
                </button>

                <button
                  onClick={() => setActiveSubject('networks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeSubject === 'networks'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Networks ({subjectsMeta.networks.current}%)</span>
                </button>

                <button
                  onClick={() => setActiveSubject('javaSpring')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                    activeSubject === 'javaSpring'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  <span>Java / Spring ({subjectsMeta.javaSpring.current}%)</span>
                </button>
              </div>

              {/* View options & Horizon */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                {/* Benchmark Line Toggle */}
                <button
                  onClick={() => setShowBenchmarks(!showBenchmarks)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center space-x-1 ${
                    showBenchmarks
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                  title="Toggle 75% Distinction & 85% Placement Benchmarks"
                >
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Benchmarks</span>
                </button>

                {/* Horizon Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setTimeHorizon('8weeks')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      timeHorizon === '8weeks' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    8 Weeks
                  </button>
                  <button
                    onClick={() => setTimeHorizon('14days')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      timeHorizon === '14days' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Daily
                  </button>
                </div>

                {/* Chart Style Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      chartType === 'line' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Lines
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-2 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      chartType === 'area' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Area
                  </button>
                </div>
              </div>

            </div>

            {/* Recharts Render Canvas */}
            <div className="h-72 sm:h-84 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={currentDataset} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="label"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <YAxis
                      domain={[20, 100]}
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontWeight: 600 }}
                    />

                    {/* Benchmark lines */}
                    {showBenchmarks && (
                      <ReferenceLine
                        y={85}
                        stroke="#10B981"
                        strokeDasharray="4 4"
                        label={{
                          value: '85% SDE Tier-1 Target',
                          fill: '#059669',
                          fontSize: 10,
                          position: 'insideTopRight',
                          fontWeight: 700,
                        }}
                      />
                    )}
                    {showBenchmarks && (
                      <ReferenceLine
                        y={75}
                        stroke="#6366F1"
                        strokeDasharray="4 4"
                        label={{
                          value: '75% Distinction Cutoff',
                          fill: '#4F46E5',
                          fontSize: 10,
                          position: 'insideBottomRight',
                          fontWeight: 700,
                        }}
                      />
                    )}

                    {/* Lines based on active filter */}
                    {(activeSubject === 'all' || activeSubject === 'dsa') && (
                      <Line
                        type="monotone"
                        dataKey="dsa"
                        name="Data Structures & Algorithms"
                        stroke={subjectsMeta.dsa.color}
                        strokeWidth={activeSubject === 'dsa' ? 3.5 : 2.5}
                        dot={{ r: 3.5, strokeWidth: 1.5, fill: '#fff', stroke: subjectsMeta.dsa.color }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: subjectsMeta.dsa.color }}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'dbms') && (
                      <Line
                        type="monotone"
                        dataKey="dbms"
                        name="Database Management Systems"
                        stroke={subjectsMeta.dbms.color}
                        strokeWidth={activeSubject === 'dbms' ? 3.5 : 2.5}
                        dot={{ r: 3.5, strokeWidth: 1.5, fill: '#fff', stroke: subjectsMeta.dbms.color }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: subjectsMeta.dbms.color }}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'networks') && (
                      <Line
                        type="monotone"
                        dataKey="networks"
                        name="Computer Networks"
                        stroke={subjectsMeta.networks.color}
                        strokeWidth={activeSubject === 'networks' ? 3.5 : 2.5}
                        dot={{ r: 3.5, strokeWidth: 1.5, fill: '#fff', stroke: subjectsMeta.networks.color }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: subjectsMeta.networks.color }}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'javaSpring') && (
                      <Line
                        type="monotone"
                        dataKey="javaSpring"
                        name="Java & Spring Backend"
                        stroke={subjectsMeta.javaSpring.color}
                        strokeWidth={activeSubject === 'javaSpring' ? 3.5 : 2.5}
                        dot={{ r: 3.5, strokeWidth: 1.5, fill: '#fff', stroke: subjectsMeta.javaSpring.color }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: subjectsMeta.javaSpring.color }}
                      />
                    )}

                    {activeSubject === 'all' && (
                      <Line
                        type="monotone"
                        dataKey="average"
                        name="Weighted Average"
                        stroke="#64748B"
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                  </LineChart>
                ) : (
                  <AreaChart data={currentDataset} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDsa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={subjectsMeta.dsa.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={subjectsMeta.dsa.color} stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorDbms" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={subjectsMeta.dbms.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={subjectsMeta.dbms.color} stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorNetworks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={subjectsMeta.networks.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={subjectsMeta.networks.color} stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorJava" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={subjectsMeta.javaSpring.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={subjectsMeta.javaSpring.color} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="label"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                    />
                    <YAxis
                      domain={[20, 100]}
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontWeight: 600 }} />

                    {showBenchmarks && (
                      <ReferenceLine
                        y={85}
                        stroke="#10B981"
                        strokeDasharray="4 4"
                        label={{
                          value: '85% Target',
                          fill: '#059669',
                          fontSize: 10,
                          position: 'insideTopRight',
                          fontWeight: 700,
                        }}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'dsa') && (
                      <Area
                        type="monotone"
                        dataKey="dsa"
                        name="Data Structures & Algorithms"
                        stroke={subjectsMeta.dsa.color}
                        fillOpacity={1}
                        fill="url(#colorDsa)"
                        strokeWidth={2.5}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'dbms') && (
                      <Area
                        type="monotone"
                        dataKey="dbms"
                        name="Database Management Systems"
                        stroke={subjectsMeta.dbms.color}
                        fillOpacity={1}
                        fill="url(#colorDbms)"
                        strokeWidth={2.5}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'networks') && (
                      <Area
                        type="monotone"
                        dataKey="networks"
                        name="Computer Networks"
                        stroke={subjectsMeta.networks.color}
                        fillOpacity={1}
                        fill="url(#colorNetworks)"
                        strokeWidth={2.5}
                      />
                    )}

                    {(activeSubject === 'all' || activeSubject === 'javaSpring') && (
                      <Area
                        type="monotone"
                        dataKey="javaSpring"
                        name="Java & Spring Backend"
                        stroke={subjectsMeta.javaSpring.color}
                        fillOpacity={1}
                        fill="url(#colorJava)"
                        strokeWidth={2.5}
                      />
                    )}
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Bottom Chart Footer Actions & Milestones */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Showing <strong className="text-slate-700">{currentDataset.length} checkpoints</strong> across 4 university curriculum tracks.
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSimulateQuizGain}
                  disabled={isSimulating}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  title="Simulate logging an AVL Tree test to observe real-time trend curve recalibration"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isSimulating ? 'Calibrating...' : 'Simulate Quiz Score (+4%)'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Subject Cards Breakdown with Velocity & Target Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(subjectsMeta).map(([key, subj]) => {
              const delta = subj.current - subj.start;
              const isAhead = subj.current >= subj.target;
              return (
                <div
                  key={key}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 hover:border-indigo-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {subj.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 leading-snug">
                        {subj.shortName}
                      </h4>
                    </div>
                    <span
                      className="w-3 h-3 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: subj.color }}
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xl font-extrabold text-slate-900">{subj.current}%</span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center">
                        <ArrowUpRight className="w-3 h-3" />
                        +{delta}% overall
                      </span>
                    </div>

                    {/* Progress Bar towards Exam Distinction Target */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, subj.current)}%`,
                          backgroundColor: subj.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Start: {subj.start}%</span>
                      <span>Target: {subj.target}%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isAhead
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {isAhead ? 'Target Reached' : `${subj.target - subj.current}% to Goal`}
                    </span>

                    <button
                      onClick={() => onSelectTopicForTutor(subj.name, subj.name)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Drill Topic</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Root Cause Banner linking to Prerequisite Tab */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-bold text-amber-950">
                  Prerequisite Anomaly Detected: AVL Trees (32%) Blocking DSA Growth
                </h3>
                <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
                  While overall DSA mastery has climbed to 76%, tree rotation mechanics remain a critical dependency gap. 
                  View the interactive prerequisite chain to inspect root causes and schedule targeted remediation drills.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('prereq')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <span>Inspect Prerequisite Tree</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {/* Prerequisite Chains & Root-Cause Diagnosis View */}
      {activeTab === 'prereq' && (
        <div className="space-y-6">
          
          {/* Branch Switcher */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Select Prerequisite Dependency Pipeline:
              </h3>
              <p className="text-xs text-slate-500">
                Shows exact knowledge prerequisites and which node is triggering adaptive remedial study tasks.
              </p>
            </div>

            <div className="flex space-x-2">
              {[
                { id: 'trees', label: 'Trees & AVL' },
                { id: 'dbms', label: 'DBMS Normalization' },
                { id: 'graphs', label: 'Graphs & Dijkstra' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBranch(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedBranch === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dependency Pipeline Flow Visualizer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {currentChain.subject}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  {currentChain.title}
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {currentChain.nodes.length} Connected Milestones
              </span>
            </div>

            {/* Visual Step-by-Step Chain */}
            <div className="space-y-3.5">
              {currentChain.nodes.map((node, idx) => {
                const isCritical = node.status === 'Critical Gap';
                const isMastered = node.status === 'Mastered';
                return (
                  <div
                    key={node.id}
                    className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCritical
                        ? 'bg-rose-50/70 border-rose-200 text-slate-800 shadow-xs'
                        : isMastered
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCritical ? 'bg-rose-500 text-white' :
                        isMastered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-800">
                            {node.name}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            isCritical ? 'bg-rose-100 text-rose-700 border-rose-200' :
                            isMastered ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            {node.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {node.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className={`text-sm font-extrabold ${
                          node.mastery >= 75 ? 'text-emerald-600' :
                          node.mastery >= 50 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {node.mastery}%
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">Mastery</p>
                      </div>

                      <button
                        onClick={() => onSelectTopicForTutor(node.name, currentChain.subject)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition cursor-pointer"
                      >
                        <Brain className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Tutor Drill</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Alert Box */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
              <div className="flex items-center space-x-2 font-bold text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>AdaptiveAI Prerequisite Diagnostic Summary</span>
              </div>
              <p className="leading-relaxed text-amber-900/90">
                The student is currently blocked at <strong className="text-amber-950 font-bold">AVL Trees (32%)</strong> because <strong className="text-amber-950 font-bold">Tree Rotation Mechanics (40%)</strong> and <strong className="text-amber-950 font-bold">BST Deletion Invariants (58%)</strong> are unmastered. 
                The system has automatically sequenced a 4-step remediation plan to solidify pointer re-linking before re-testing AVL balance factor computations.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
