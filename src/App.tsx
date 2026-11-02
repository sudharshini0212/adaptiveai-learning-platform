import React, { useState } from 'react';
import { 
  UserProfile, 
  Course, 
  SyllabusItem, 
  NoteArtifact, 
  StudyTask, 
  TopicMastery, 
  RewardItem 
} from './types';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_COURSES, 
  INITIAL_SYLLABUS, 
  INITIAL_NOTE_ARTIFACTS, 
  INITIAL_STUDY_TASKS, 
  INITIAL_TOPIC_MASTERY, 
  INITIAL_REWARDS 
} from './data/seedData';
import { Sidebar, TopHeader } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SyllabusView } from './components/SyllabusView';
import { NotesStudioView } from './components/NotesStudioView';
import { AdaptivePlannerView } from './components/AdaptivePlannerView';
import { AITutorView } from './components/AITutorView';
import { MasteryGraphView } from './components/MasteryGraphView';
import { CourseMarketplaceView } from './components/CourseMarketplaceView';
import { RewardsView } from './components/RewardsView';
import { AndroidCompanionView } from './components/AndroidCompanionView';
import { FocusTimerView } from './components/FocusTimerView';
import { GroupStudyView } from './components/GroupStudyView';
import { AuthModal } from './components/AuthModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('adaptive_ai_user_profile');
    if (saved) {
      try {
        return { ...INITIAL_USER_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        // Fallback to initial profile
      }
    }
    return INITIAL_USER_PROFILE;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('adaptive_ai_logged_in') !== 'false';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>(INITIAL_SYLLABUS);
  const [noteArtifacts, setNoteArtifacts] = useState<NoteArtifact[]>(INITIAL_NOTE_ARTIFACTS);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(INITIAL_STUDY_TASKS);
  const [topicMasteryList, setTopicMasteryList] = useState<TopicMastery[]>(INITIAL_TOPIC_MASTERY);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Cross-view selection states
  const [activeNoteId, setActiveNoteId] = useState<string>(INITIAL_NOTE_ARTIFACTS[0]?.id || '');
  const [tutorContextTopic, setTutorContextTopic] = useState<string>('AVL Trees & Self-Balancing Rotations');
  const [tutorContextSubject, setTutorContextSubject] = useState<string>('Data Structures & Algorithms');

  // Task Toggle
  const handleToggleTask = (taskId: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            // Reward points
            setUserProfile((u) => ({ ...u, points: u.points + 20 }));
            confetti({ particleCount: 40, spread: 50 });
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Add Task
  const handleAddTask = (task: StudyTask) => {
    setStudyTasks((prev) => [task, ...prev]);
  };

  // Course Enrollment
  const handleEnrollCourse = (courseId: string) => {
    if (!userProfile.enrolledCourseIds.includes(courseId)) {
      setUserProfile((prev) => ({
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
        points: prev.points + 50,
      }));
    }
  };

  // Add Syllabus
  const handleAddSyllabus = (newSyllabus: SyllabusItem) => {
    setSyllabusList((prev) => [newSyllabus, ...prev]);
    setUserProfile((u) => ({ ...u, points: u.points + 30 }));
  };

  // Add Note Artifact
  const handleAddNoteArtifact = (newNote: NoteArtifact) => {
    setNoteArtifacts((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setUserProfile((u) => ({ ...u, points: u.points + 40 }));
  };

  // Cross-view: Generate Notes from Topic
  const handleGenerateNotesFromTopic = (topicTitle: string, subject: string) => {
    const existing = noteArtifacts.find((n) => n.title.toLowerCase().includes(topicTitle.toLowerCase().slice(0, 6)));
    if (existing) {
      setActiveNoteId(existing.id);
    }
    setCurrentTab('notes');
  };

  // Cross-view: Schedule Topic
  const handleScheduleTopic = (topicTitle: string, subject: string) => {
    const newTask: StudyTask = {
      id: 'task_sched_' + Date.now(),
      title: `Revise: ${topicTitle}`,
      subject,
      topic: topicTitle,
      date: 'Today',
      timeSlot: '08:00 PM - 08:45 PM',
      durationMinutes: 45,
      completed: false,
      priority: 'High',
      source: 'syllabus',
    };
    handleAddTask(newTask);
    setCurrentTab('planner');
  };

  // Cross-view: Schedule Note
  const handleScheduleNote = (note: NoteArtifact) => {
    const newTask: StudyTask = {
      id: 'task_note_' + Date.now(),
      title: `Study Session: ${note.title}`,
      subject: note.subject,
      topic: note.title,
      date: 'Today',
      timeSlot: '09:00 PM - 09:45 PM',
      durationMinutes: 45,
      completed: false,
      priority: 'Normal',
      source: 'personal_note',
    };
    handleAddTask(newTask);
    setCurrentTab('planner');
  };

  // Cross-view: Select Topic for AI Tutor
  const handleSelectTopicForTutor = (topic: string, subject: string) => {
    setTutorContextTopic(topic);
    setTutorContextSubject(subject);
    setCurrentTab('tutor');
  };

  // Quiz Score Update & Adaptive Feedback
  const handleUpdateQuizScore = (topic: string, subject: string, scorePercent: number) => {
    setUserProfile((u) => ({ ...u, points: u.points + 15 }));
    setTopicMasteryList((prev) => {
      const existing = prev.find((t) => t.topic.toLowerCase().includes(topic.toLowerCase().slice(0, 5)));
      if (existing) {
        return prev.map((t) =>
          t.topic === existing.topic
            ? {
                ...t,
                masteryPercentage: scorePercent,
                status: scorePercent >= 75 ? 'Mastered' : scorePercent >= 50 ? 'In Progress' : 'Needs Attention',
                lastPracticed: 'Just now',
              }
            : t
        );
      }
      const newEntry: TopicMastery = {
        subject,
        topic,
        masteryPercentage: scorePercent,
        status: scorePercent >= 75 ? 'Mastered' : scorePercent >= 50 ? 'In Progress' : 'Needs Attention',
        prerequisites: [],
        recommendedAction: scorePercent < 50 ? 'Review Prerequisite Foundations' : 'Practice Advanced Problems',
        lastPracticed: 'Just now',
      };
      return [...prev, newEntry];
    });
  };

  // Adaptive Rebalance Trigger
  const handleTriggerAdaptiveReplan = () => {
    // Insert urgent remedial task for AVL Trees
    const remedialTask: StudyTask = {
      id: 'task_remedial_' + Date.now(),
      title: 'Prerequisite Fix: BST Invariant & Single/Double Pointer Relinking',
      subject: 'Data Structures & Algorithms',
      topic: 'Binary Search Trees & Rotations',
      date: 'Today',
      timeSlot: '06:00 PM - 06:45 PM',
      durationMinutes: 45,
      completed: false,
      priority: 'Urgent',
      source: 'weak_topic_remedy',
      reason: 'Triggered automatically by low score (32%) on AVL Tree Rotations.',
    };

    setStudyTasks((prev) => [remedialTask, ...prev.filter((t) => t.id !== remedialTask.id)]);
  };

  // Reward Unlock
  const handleUnlockReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (reward && userProfile.points >= reward.pointsCost) {
      setUserProfile((u) => ({ ...u, points: u.points - reward.pointsCost }));
      setRewards((prev) =>
        prev.map((r) => (r.id === rewardId ? { ...r, unlocked: true } : r))
      );
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('adaptive_ai_logged_in', 'false');
    // Prompt login modal right away so they can re-login or switch accounts
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setIsLoggedIn(true);
    localStorage.setItem('adaptive_ai_user_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('adaptive_ai_logged_in', 'true');
    setIsAuthModalOpen(false);
    confetti({ particleCount: 60, spread: 70 });
  };

  const handleFocusSessionComplete = (minutes: number, subject: string, topic: string) => {
    const earnedPoints = Math.round(minutes * 2);
    setUserProfile((u) => ({
      ...u,
      points: u.points + earnedPoints,
    }));
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Sleek Dark Navy Sidebar */}
      <Sidebar
        userProfile={userProfile}
        isLoggedIn={isLoggedIn}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenArchitecture={() => setCurrentTab('mastery')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <TopHeader
          userProfile={userProfile}
          isLoggedIn={isLoggedIn}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onNavigateTab={setCurrentTab}
          onOpenArchitecture={() => setCurrentTab('mastery')}
        />

        {/* Main View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              studyTasks={studyTasks}
              onToggleTask={handleToggleTask}
              topicMasteryList={topicMasteryList}
              enrolledCourses={courses.filter((c) => userProfile.enrolledCourseIds.includes(c.id))}
              noteArtifacts={noteArtifacts}
              onNavigateTab={setCurrentTab}
              onTriggerAdaptiveReplan={handleTriggerAdaptiveReplan}
              onSelectTopicForTutor={handleSelectTopicForTutor}
              onSelectNote={setActiveNoteId}
            />
          )}

          {currentTab === 'focus' && (
            <FocusTimerView
              userProfile={userProfile}
              studyTasks={studyTasks}
              onSessionComplete={handleFocusSessionComplete}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'group' && (
            <GroupStudyView
              userProfile={userProfile}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'syllabus' && (
            <SyllabusView
              syllabusList={syllabusList}
              onAddSyllabus={handleAddSyllabus}
              onGenerateNotesFromTopic={handleGenerateNotesFromTopic}
              onScheduleTopic={handleScheduleTopic}
            />
          )}

          {currentTab === 'notes' && (
            <NotesStudioView
              noteArtifacts={noteArtifacts}
              activeNoteId={activeNoteId}
              onSelectNote={setActiveNoteId}
              onAddNoteArtifact={handleAddNoteArtifact}
              onScheduleNote={handleScheduleNote}
              onUpdateQuizScore={handleUpdateQuizScore}
            />
          )}

          {currentTab === 'planner' && (
            <AdaptivePlannerView
              userProfile={userProfile}
              studyTasks={studyTasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              topicMasteryList={topicMasteryList}
              onTriggerAdaptiveReplan={handleTriggerAdaptiveReplan}
            />
          )}

          {currentTab === 'tutor' && (
            <AITutorView
              initialTopic={tutorContextTopic}
              initialSubject={tutorContextSubject}
              topicMasteryList={topicMasteryList}
              noteArtifacts={noteArtifacts}
            />
          )}

          {currentTab === 'mastery' && (
            <MasteryGraphView
              topicMasteryList={topicMasteryList}
              onSelectTopicForTutor={handleSelectTopicForTutor}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'courses' && (
            <CourseMarketplaceView
              courses={courses}
              enrolledCourseIds={userProfile.enrolledCourseIds}
              onEnrollCourse={handleEnrollCourse}
              onSelectTopicForTutor={handleSelectTopicForTutor}
            />
          )}

          {currentTab === 'rewards' && (
            <RewardsView
              userProfile={userProfile}
              rewards={rewards}
              onUnlockReward={handleUnlockReward}
            />
          )}

          {currentTab === 'android' && (
            <AndroidCompanionView
              onAddNoteArtifact={handleAddNoteArtifact}
              onSelectNote={setActiveNoteId}
              onNavigateTab={setCurrentTab}
            />
          )}
        </main>

        {/* Global Student Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentProfile={userProfile}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-indigo-600">AdaptiveAI</span>
              <span>— “Courses are fixed. Learning shouldn't be.”</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Smart Education Hackathon Prototype • Chennai • Powered by Gemini 2.5 Flash
            </p>
          </div>
        </footer>
      </div>

    </div>
  );
}
