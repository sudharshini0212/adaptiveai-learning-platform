import React, { useState } from 'react';
import { 
  UserProfile, 
  StudyTask, 
  TopicMastery, 
  Course, 
  NoteArtifact 
} from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  Upload, 
  Brain, 
  Camera, 
  RefreshCw,
  Award,
  ChevronRight,
  Flame,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  userProfile: UserProfile;
  studyTasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  topicMasteryList: TopicMastery[];
  enrolledCourses: Course[];
  noteArtifacts: NoteArtifact[];
  onNavigateTab: (tab: string) => void;
  onSelectTopicForTutor: (topic: string, subject: string) => void;
  onSelectNote: (noteId: string) => void;
  onTriggerAdaptiveReplan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  studyTasks,
  onToggleTask,
  topicMasteryList,
  enrolledCourses,
  noteArtifacts,
  onNavigateTab,
  onSelectTopicForTutor,
  onSelectNote,
  onTriggerAdaptiveReplan,
}) => {
  const [replanLoading, setReplanLoading] = useState(false);

  const todayTasks = studyTasks.slice(0, 4);
  const completedTodayCount = todayTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTodayCount / Math.max(1, todayTasks.length)) * 100);

  const weakTopics = topicMasteryList.filter(
    (t) => t.status === 'Critical Prerequisite Gap' || t.status === 'Needs Attention'
  );

  const handleTaskClick = (task: StudyTask) => {
    onToggleTask(task.id);
    if (!task.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleReplanClick = () => {
    setReplanLoading(true);
    setTimeout(() => {
      onTriggerAdaptiveReplan();
      setReplanLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Sleek Hero Banner: Today's Focus */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg shadow-indigo-200/50">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Today's Focus: AVL Trees & Normalization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good evening, {userProfile.name}
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold text-white">{userProfile.institution}</span> • {userProfile.degree} ({userProfile.semester})
          </p>
          <p className="text-indigo-100 text-sm leading-relaxed">
            You're <span className="font-bold text-white">{progressPercent}%</span> through your daily target. 
            Semester exams start in <span className="font-bold text-amber-200">20 days</span>. 
            Schedule automatically rebalanced around your AVL Tree gap.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('focus')}
              className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Start Focus Timer</span>
            </button>
            <button
              onClick={() => onNavigateTab('group')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-white" />
              <span>Group Study Hub</span>
            </button>
            <button
              id="btn-replan-adaptive"
              onClick={handleReplanClick}
              disabled={replanLoading}
              className="px-3.5 py-2 bg-indigo-800/40 hover:bg-indigo-800/60 text-white rounded-xl text-xs sm:text-sm font-semibold border border-indigo-400/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${replanLoading ? 'animate-spin' : ''}`} />
              <span>{replanLoading ? 'Recalibrating...' : 'Re-Adapt'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 self-center md:self-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-8 border-white/20 flex flex-col items-center justify-center relative shrink-0 shadow-inner">
            <div className="text-xl sm:text-2xl font-black text-white">{progressPercent}%</div>
            <div className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider">Completed</div>
          </div>
        </div>
      </div>

      {/* Main Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Today's Tasks & Prerequisite Remediation */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Today's Tasks Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Next Tasks</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic priority based on {userProfile.availableHoursDaily}h daily capacity
                </p>
              </div>
              <button 
                onClick={() => onNavigateTab('planner')}
                className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task Item List */}
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`group flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50/70 border-slate-100 text-slate-400'
                      : task.priority === 'Urgent'
                      ? 'bg-rose-50/80 border-rose-200 text-slate-800 hover:border-rose-300'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-100 text-slate-800 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button className="mt-0.5 text-slate-400 group-hover:text-indigo-600 transition">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs sm:text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                        {task.priority === 'Urgent' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                            Prerequisite Fix
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="text-slate-700 font-medium">{task.subject}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{task.timeSlot}</span>
                        <span>•</span>
                        <span>{task.durationMinutes} mins</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">+20 XP</span>
                      </div>

                      {task.reason && (
                        <p className="text-[11px] text-rose-700 italic bg-rose-100/60 px-2 py-0.5 rounded border border-rose-200/60 inline-block mt-1">
                          Reason: {task.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 pl-2">
                    {task.noteId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNote(task.noteId!);
                          onNavigateTab('notes');
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border border-indigo-100 transition whitespace-nowrap"
                      >
                        Notes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Prerequisite & Weak Topic Remediation */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>AI Prerequisite & Root-Cause Remediation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instead of generic repetition, AdaptiveAI identifies upstream foundational blockers.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('mastery')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>Full Graph</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {weakTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {topic.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">
                        {topic.topic}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-rose-600">
                        {topic.masteryPercentage}%
                      </span>
                      <p className="text-[10px] text-rose-600 font-bold uppercase">
                        {topic.status}
                      </p>
                    </div>
                  </div>

                  {/* Remediation Flow Steps */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                    <p className="font-semibold text-indigo-900 flex items-center space-x-1.5">
                      <Brain className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Adaptive Learning Step-by-Step Path:</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-700">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
                        1. Revise {topic.prerequisites.join(' & ')}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                        2. Drill Rotation Mechanics
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                        3. Retake Assessment
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <p className="text-xs text-slate-500 italic">
                      {topic.recommendedAction}
                    </p>
                    <button
                      onClick={() => {
                        onSelectTopicForTutor(topic.topic, topic.subject);
                        onNavigateTab('tutor');
                      }}
                      className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Learn with AI Tutor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right Column (5 Cols): AI Insights, Topic Mastery & Quick Hub */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* AI Insights Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-indigo-600 text-lg">🪄</span>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">AI Insights & Remediation</h3>
            </div>
            
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1.5">Weakness Detected</p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  'Binary Search Trees' performance dropped by 15% in last quiz. Re-study prerequisites?
                </p>
                <button 
                  onClick={() => {
                    onSelectTopicForTutor('AVL Trees & Self-Balancing Rotations', 'Data Structures & Algorithms');
                    onNavigateTab('tutor');
                  }}
                  className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  Show Path to Mastery
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1.5">New Content Processed</p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Your uploaded 'Operating-Systems-Unit3.pdf' is ready. AI has generated a Mind Map and Flashcard deck.
                </p>
                <button 
                  onClick={() => onNavigateTab('notes')}
                  className="mt-3 w-full py-2 bg-white hover:bg-amber-100/50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold transition"
                >
                  View Mind Map & Flashcards
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Next Physical Reward</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xl shrink-0">
                    🎒
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-[70%] h-full bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 font-medium">70% to Physical Welcome Kit (4,850/6,000 XP)</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('tutor')}
              className="mt-4 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Ask AI Tutor</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          {/* Topic Mastery Pulse */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-base">Topic Mastery Pulse</h3>
              <span className="text-xs text-slate-400 font-medium">B.E. CSE Sem 5</span>
            </div>

            <div className="space-y-3.5">
              {topicMasteryList.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-semibold">{item.topic}</span>
                    <span className={`font-bold ${
                      item.masteryPercentage >= 80 ? 'text-emerald-600' :
                      item.masteryPercentage >= 50 ? 'text-indigo-600' : 'text-amber-600'
                    }`}>
                      {item.masteryPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.masteryPercentage >= 80 ? 'bg-emerald-500' :
                        item.masteryPercentage >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.masteryPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Action Hub
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateTab('syllabus')}
                className="flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition group text-left cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:scale-105 transition mb-2">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Upload Syllabus</span>
                <span className="text-[10px] text-slate-400">PDF / Text breakdown</span>
              </button>

              <button
                onClick={() => onNavigateTab('notes')}
                className="flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition group text-left cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-105 transition mb-2">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Notes Studio</span>
                <span className="text-[10px] text-slate-400">Mind Maps & Flashcards</span>
              </button>

              <button
                onClick={() => onNavigateTab('android')}
                className="flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition group text-left cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-105 transition mb-2">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Scan My Notes</span>
                <span className="text-[10px] text-slate-400">Android Camera OCR</span>
              </button>

              <button
                onClick={() => onNavigateTab('rewards')}
                className="flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition group text-left cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-105 transition mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Claim Rewards</span>
                <span className="text-[10px] text-slate-400">Welcome Kit & Cheats</span>
              </button>
            </div>
          </div>

        </section>

      </div>

    </div>
  );
};
