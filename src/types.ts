export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  authProvider?: 'google' | 'apple' | 'email' | 'phone' | 'guest';
  institution: string;
  rollNumber?: string;
  degree: string;
  semester: string;
  branch: string;
  targetGoal: string;
  availableHoursDaily: number;
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'intuitive';
  examDates: { subject: string; date: string; daysLeft: number }[];
  streak: number;
  lastActiveDate: string;
  points: number;
  level: number;
  enrolledCourseIds: string[];
  totalFocusMinutes?: number;
}

export interface FocusSession {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  timestamp: string;
  notes?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatarBg: string;
  college: string;
  degree: string;
  isHost: boolean;
  isFocusing: boolean;
  currentTopic: string;
  streak: number;
}

export interface GroupDoubt {
  id: string;
  authorName: string;
  college: string;
  topic: string;
  question: string;
  timestamp: string;
  upvotes: number;
  resolved: boolean;
  replies: {
    id: string;
    authorName: string;
    text: string;
    timestamp: string;
    isTutor?: boolean;
  }[];
}

export interface GroupStudyRoom {
  id: string;
  roomCode: string;
  title: string;
  subject: string;
  targetExam: string;
  hostName: string;
  college: string;
  members: GroupMember[];
  isTimerRunning: boolean;
  timerSecondsRemaining: number;
  timerTotalDuration: number; // in seconds
  timerMode: 'focus' | 'break';
  sharedNotes: string;
  doubts: GroupDoubt[];
  createdAt: string;
}

export interface SyllabusItem {
  id: string;
  subject: string;
  code?: string;
  units: {
    unitNumber: number;
    unitTitle: string;
    topics: {
      id: string;
      title: string;
      subtopics: string[];
      mastery: number; // 0-100
      prerequisites: string[];
      importance: 'High' | 'Medium' | 'Low';
    }[];
  }[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  modules: {
    id: string;
    title: string;
    duration: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      completed: boolean;
      contentType: 'video' | 'article' | 'quiz';
      summary: string;
    }[];
  }[];
}

export interface NoteArtifact {
  id: string;
  title: string;
  subject: string;
  sourceType: 'pdf' | 'ppt' | 'text' | 'scanned_image';
  createdAt: string;
  rawContent: string;
  easyNotes: string;
  mindMap: MindMapNode;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  quickRevision: string[];
  importantPoints: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  children?: MindMapNode[];
  color?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  topic: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  completed: boolean;
  priority: 'Urgent' | 'High' | 'Normal';
  source: 'course' | 'syllabus' | 'personal_note' | 'weak_topic_remedy';
  noteId?: string;
  reason?: string;
}

export interface TopicMastery {
  topic: string;
  subject: string;
  masteryPercentage: number;
  status: 'Mastered' | 'In Progress' | 'Needs Attention' | 'Critical Prerequisite Gap';
  prerequisites: string[];
  recommendedAction: string;
  lastPracticed?: string;
}

export interface TutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  modeUsed?: string;
  suggestedFollowUps?: string[];
  codeSnippet?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  type: 'badge' | 'resource' | 'physical_kit';
  pointsCost: number;
  unlocked: boolean;
  icon: string;
  description: string;
  category: string;
}
