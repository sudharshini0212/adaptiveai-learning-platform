import React, { useState } from 'react';
import { StudyTask, UserProfile, TopicMastery } from '../types';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Zap, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  FileText,
  Sliders,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdaptivePlannerViewProps {
  userProfile: UserProfile;
  studyTasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: StudyTask) => void;
  topicMasteryList: TopicMastery[];
  onTriggerAdaptiveReplan: () => void;
}

export const AdaptivePlannerView: React.FC<AdaptivePlannerViewProps> = ({
  userProfile,
  studyTasks,
  onToggleTask,
  onAddTask,
  topicMasteryList,
  onTriggerAdaptiveReplan,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Today');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    'Initial Schedule calibrated around 3h daily study limit and CS8391 exam date (Sept 15).',
    'Low quiz score (32%) detected on AVL Trees. Prerequisite remediation for BST properties prioritized.',
  ]);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Data Structures & Algorithms');
  const [newTaskSlot, setNewTaskSlot] = useState('07:00 PM - 07:45 PM');

  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];

  const handleSimulateQuizFailure = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onTriggerAdaptiveReplan();
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] ⚠️ SIMULATED DIAGNOSTIC: Student scored 30% on AVL Rotations. Rebalance triggered.`,
        `[${new Date().toLocaleTimeString()}] 🧠 ADAPTIVE RE-ROUTE: De-prioritized Graph Traversal. Inserted 45m deep-dive on Binary Search Tree Invariants & Pointer Rotation Mechanics.`,
        ...prev,
      ]);
      setIsSimulating(false);
      confetti({ particleCount: 30, spread: 50 });
    }, 600);
  };

  const handleSimulateMissedTask = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] ⏰ SIMULATED MISSED TASK: "DBMS Normalization 3NF/BCNF" was not completed by 09:15 PM.`,
        `[${new Date().toLocaleTimeString()}] 🔄 AUTO-REDISTRIBUTION: Shifted Normalization task to tomorrow's 06:00 PM prime slot without exceeding 3-hour daily threshold.`,
        ...prev,
      ]);
      setIsSimulating(false);
    }, 600);
  };

  const handleSimulateFastMastery = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] 🚀 SIMULATED MASTERY ACCELERATION: Student scored 95% on Sliding Window & Two Pointers.`,
        `[${new Date().toLocaleTimeString()}] 📈 FAST-FORWARD: Skipped redundant linear array drills; promoted schedule directly to Graph BFS/DFS cycle detection.`,
        ...prev,
      ]);
      setIsSimulating(false);
      confetti({ particleCount: 60, spread: 70 });
    }, 600);
  };

  const handleCreateCustomTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: StudyTask = {
      id: 'task_custom_' + Date.now(),
      title: newTaskTitle,
      subject: newTaskSubject,
      topic: newTaskTitle,
      date: selectedDay,
      timeSlot: newTaskSlot,
      durationMinutes: 45,
      completed: false,
      priority: 'Normal',
      source: 'personal_note',
    };
    onAddTask(task);
    setShowAddTaskModal(false);
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Continuous Dynamic Study Planner</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Adaptive Daily Schedule & Auto-Catchup Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Unlike static calendars, AdaptiveAI monitors quiz outcomes, missed sessions, and exam deadlines to dynamically rebuild your daily timetable.
            </p>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Slot</span>
          </button>
        </div>

        {/* Interactive Hackathon Simulation Sandbox */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold text-indigo-700 flex items-center space-x-1.5 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Live Hackathon Simulation Triggers (Test the Adaptive Core)</span>
            </span>
            <span className="text-[11px] text-slate-400">Click any trigger to see real-time plan rebalancing</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleSimulateQuizFailure}
              disabled={isSimulating}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Low Quiz Score in AVL Trees (30%)</span>
            </button>

            <button
              onClick={handleSimulateMissedTask}
              disabled={isSimulating}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Missed Study Session</span>
            </button>

            <button
              onClick={handleSimulateFastMastery}
              disabled={isSimulating}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate Rapid Topic Mastery (95%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Interactive Schedule Calendar */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {/* Day Selector */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex space-x-2 overflow-x-auto">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedDay === d
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <span className="text-xs font-semibold text-slate-500 hidden sm:block">
                Daily Budget: <strong className="text-slate-800">{userProfile.availableHoursDaily} Hours</strong>
              </span>
            </div>

            {/* Task Timeline */}
            <div className="space-y-3.5">
              {studyTasks.map((task, idx) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between ${
                    task.completed
                      ? 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-80'
                      : task.priority === 'Urgent'
                      ? 'bg-rose-50/60 border-rose-200 text-slate-800 hover:border-rose-300 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button className="mt-0.5 text-slate-400 cursor-pointer">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className={`text-xs sm:text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                        {task.priority === 'Urgent' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                            Prerequisite Drill
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                          {task.source.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
                        <span className="text-slate-700 font-bold">{task.subject}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-semibold">{task.timeSlot}</span>
                        <span>•</span>
                        <span>{task.durationMinutes} mins</span>
                      </div>

                      {task.reason && (
                        <p className="text-[11px] text-rose-700 italic bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mt-1">
                          Adaptive Insight: {task.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    task.completed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {task.completed ? 'Done (+20 XP)' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column (4 cols): Live Adaptive Audit Log & Upcoming Exam Countdown */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Exam Countdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Upcoming Exam Milestones</span>
            </h3>

            <div className="space-y-2.5">
              {userProfile.examDates.map((exam, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{exam.subject}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{exam.date}</p>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {exam.daysLeft}d left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive AI Reasoning Audit Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Adaptive Reasoning Audit Log</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Live chronological stream of why AdaptiveAI reconfigured the study trajectory:
            </p>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {simulationLog.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Add Custom Study Session</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task / Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 5 LeetCode BST questions"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newTaskSlot}
                  onChange={(e) => setNewTaskSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomTask}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save to Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
