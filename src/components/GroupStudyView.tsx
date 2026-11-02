import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Clock, 
  ThumbsUp, 
  Flame, 
  Coffee, 
  QrCode, 
  X, 
  BookOpen, 
  ShieldCheck, 
  GraduationCap,
  Bell,
  Play,
  Pause,
  Plus
} from 'lucide-react';
import { UserProfile, GroupStudyRoom, GroupMember, GroupDoubt } from '../types';
import confetti from 'canvas-confetti';

interface GroupStudyViewProps {
  userProfile: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

export const GroupStudyView: React.FC<GroupStudyViewProps> = ({
  userProfile,
  onNavigateTab,
}) => {
  // Pre-seeded college study rooms
  const initialRooms: GroupStudyRoom[] = [
    {
      id: 'room_1',
      roomCode: 'CSE-8391-DSA',
      title: 'CS8391: DSA Unit 2 AVL & B-Tree Marathon',
      subject: 'Data Structures & Algorithms',
      targetExam: 'Nov 2026 Semester End-Term',
      hostName: 'Rahul Sundaram',
      college: userProfile.institution || 'Anna University',
      isTimerRunning: true,
      timerSecondsRemaining: 34 * 60 + 20,
      timerTotalDuration: 50 * 60,
      timerMode: 'focus',
      sharedNotes: `• AVL Tree Rotation Rules:
  - Left-Left (LL) -> Single Right Rotation
  - Right-Right (RR) -> Single Left Rotation
  - Left-Right (LR) -> Left rotate left child, then Right rotate node
  - Right-Left (RL) -> Right rotate right child, then Left rotate node
• Invariant balance factor: |Height(L) - Height(R)| <= 1`,
      members: [
        {
          id: 'mem_1',
          name: 'Rahul Sundaram',
          avatarBg: 'bg-emerald-500',
          college: 'Anna University',
          degree: 'B.Tech CSE Sem 5',
          isHost: true,
          isFocusing: true,
          currentTopic: 'AVL Tree Double Rotations',
          streak: 12,
        },
        {
          id: 'mem_2',
          name: 'Priya Sharma',
          avatarBg: 'bg-indigo-500',
          college: 'Anna University',
          degree: 'B.Tech IT Sem 5',
          isHost: false,
          isFocusing: true,
          currentTopic: 'B-Tree Splitting Index Keys',
          streak: 8,
        },
        {
          id: 'mem_3',
          name: 'Aditya Varma',
          avatarBg: 'bg-amber-500',
          college: 'IIT Madras',
          degree: 'Dual Degree CSE',
          isHost: false,
          isFocusing: false,
          currentTopic: '5 min hydration break',
          streak: 19,
        },
        {
          id: 'mem_4',
          name: userProfile.name || 'You',
          avatarBg: 'bg-purple-600',
          college: userProfile.institution,
          degree: `${userProfile.degree} ${userProfile.semester}`,
          isHost: false,
          isFocusing: true,
          currentTopic: 'Solving Unit 2 Past Questions',
          streak: userProfile.streak || 5,
        }
      ],
      doubts: [
        {
          id: 'dbt_1',
          authorName: 'Priya Sharma',
          college: 'Anna University',
          topic: 'B-Trees vs B+ Trees',
          question: 'In B+ trees, why are data records strictly kept in leaf nodes? Is range query performance the only reason?',
          timestamp: '15m ago',
          upvotes: 4,
          resolved: true,
          replies: [
            {
              id: 'rep_1',
              authorName: 'Rahul Sundaram',
              text: 'Yes! Leaf nodes are doubly linked sequentially, making range queries O(log N + k) without tree traversals, plus internal nodes store more keys because there are no data pointers.',
              timestamp: '12m ago',
            },
            {
              id: 'rep_2',
              authorName: 'Adaptive AI Tutor',
              text: 'Exactly right Rahul. Also note: since internal nodes only contain index keys, more keys fit per disk block (higher branching factor / fanout), which minimizes disk I/O reads drastically.',
              timestamp: '10m ago',
              isTutor: true,
            }
          ]
        },
        {
          id: 'dbt_2',
          authorName: 'Aditya Varma',
          college: 'IIT Madras',
          topic: 'AVL Rotations',
          question: 'When doing an RL rotation at root k1, which node ends up as the new root?',
          timestamp: '8m ago',
          upvotes: 2,
          resolved: false,
          replies: [
            {
              id: 'rep_3',
              authorName: userProfile.name || 'You',
              text: 'The grand-child node k2 (the left child of the right child) becomes the new root!',
              timestamp: 'Just now',
            }
          ]
        }
      ],
      createdAt: 'Today, 04:00 PM',
    },
    {
      id: 'room_2',
      roomCode: 'OS-SEMESTER-5',
      title: 'Operating Systems: Page Replacement & Virtual Memory',
      subject: 'Operating Systems',
      targetExam: 'Dec 2026 University Finals',
      hostName: 'Sneha Patel',
      college: 'Delhi Technological Univ',
      isTimerRunning: true,
      timerSecondsRemaining: 21 * 60 + 10,
      timerTotalDuration: 50 * 60,
      timerMode: 'focus',
      sharedNotes: '• Belady’s Anomaly: FIFO page replacement can cause MORE page faults when given MORE frames.\n• LRU and Optimal are stack algorithms, so they never suffer Belady’s anomaly.',
      members: [
        {
          id: 'mem_201',
          name: 'Sneha Patel',
          avatarBg: 'bg-rose-500',
          college: 'DTU',
          degree: 'B.Tech IT Sem 5',
          isHost: true,
          isFocusing: true,
          currentTopic: 'LRU Cache implementation',
          streak: 15,
        }
      ],
      doubts: [],
      createdAt: 'Today, 05:30 PM',
    }
  ];

  const [rooms, setRooms] = useState<GroupStudyRoom[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<string>(initialRooms[0].id);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');

  // New doubt input
  const [newDoubtTopic, setNewDoubtTopic] = useState('');
  const [newDoubtQuestion, setNewDoubtQuestion] = useState('');
  const [showDoubtForm, setShowDoubtForm] = useState(false);

  // New reply input for specific doubt
  const [replyTextMap, setReplyTextMap] = useState<{ [doubtId: string]: string }>({});

  // Active room data
  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  // Room creation state
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState('Data Structures & Algorithms');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Synchronized countdown for active room
  useEffect(() => {
    const timer = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((r) => {
          if (r.id === activeRoomId && r.isTimerRunning && r.timerSecondsRemaining > 0) {
            return { ...r, timerSecondsRemaining: r.timerSecondsRemaining - 1 };
          }
          return r;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [activeRoomId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRoom.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `https://adaptiveai.edu/study-room?code=${currentRoom.roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;

    setInviteSuccessMsg(`Invite link dispatched to ${inviteInput.trim()}!`);
    setInviteInput('');
    confetti({ particleCount: 30, spread: 60 });
    setTimeout(() => setInviteSuccessMsg(''), 4000);
  };

  const handleSendPeerNudge = (memberName: string, emoji: string, message: string) => {
    confetti({ particleCount: 20, spread: 40 });
    alert(`Sent "${emoji} ${message}" to ${memberName}!`);
  };

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubtQuestion.trim()) return;

    const newDoubt: GroupDoubt = {
      id: 'dbt_' + Date.now(),
      authorName: userProfile.name || 'You',
      college: userProfile.institution || 'College',
      topic: newDoubtTopic.trim() || currentRoom.subject,
      question: newDoubtQuestion.trim(),
      timestamp: 'Just now',
      upvotes: 1,
      resolved: false,
      replies: [],
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id === currentRoom.id
          ? { ...r, doubts: [newDoubt, ...r.doubts] }
          : r
      )
    );

    setNewDoubtTopic('');
    setNewDoubtQuestion('');
    setShowDoubtForm(false);
  };

  const handleAddReply = (doubtId: string) => {
    const text = replyTextMap[doubtId]?.trim();
    if (!text) return;

    const newReply = {
      id: 'rep_' + Date.now(),
      authorName: userProfile.name || 'You',
      text,
      timestamp: 'Just now',
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id === currentRoom.id
          ? {
              ...r,
              doubts: r.doubts.map((d) =>
                d.id === doubtId ? { ...d, replies: [...d.replies, newReply] } : d
              ),
            }
          : r
      )
    );

    setReplyTextMap((prev) => ({ ...prev, [doubtId]: '' }));
  };

  const handleUpvoteDoubt = (doubtId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === currentRoom.id
          ? {
              ...r,
              doubts: r.doubts.map((d) =>
                d.id === doubtId ? { ...d, upvotes: d.upvotes + 1 } : d
              ),
            }
          : r
      )
    );
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    const generatedCode = `CAMPUS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom: GroupStudyRoom = {
      id: 'room_' + Date.now(),
      roomCode: generatedCode,
      title: newRoomTitle.trim(),
      subject: newRoomSubject,
      targetExam: `${userProfile.semester} Semester Finals`,
      hostName: userProfile.name,
      college: userProfile.institution || 'University',
      isTimerRunning: true,
      timerSecondsRemaining: 50 * 60,
      timerTotalDuration: 50 * 60,
      timerMode: 'focus',
      sharedNotes: '• Shared formulas and group takeaways will appear here.',
      members: [
        {
          id: 'mem_me_' + Date.now(),
          name: userProfile.name,
          avatarBg: 'bg-indigo-600',
          college: userProfile.institution,
          degree: `${userProfile.degree} ${userProfile.semester}`,
          isHost: true,
          isFocusing: true,
          currentTopic: 'Starting Group Study Session',
          streak: userProfile.streak,
        }
      ],
      doubts: [],
      createdAt: 'Just now',
    };

    setRooms([newRoom, ...rooms]);
    setActiveRoomId(newRoom.id);
    setShowCreateModal(false);
    setNewRoomTitle('');
    confetti({ particleCount: 50, spread: 70 });
  };

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    const found = rooms.find((r) => r.roomCode.toUpperCase() === cleanCode);
    if (found) {
      setActiveRoomId(found.id);
      setJoinCodeInput('');
    } else {
      alert(`Room code "${cleanCode}" not found. Try joining CSE-8391-DSA or create your own room!`);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Room Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs border border-emerald-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Campus Study Circles</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {userProfile.institution || 'University Network'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Group Study & Peer Doubts Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Invite classmates, sync 50m pomodoro study timers, post questions, and prepare for semester exams together.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Classmates</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </button>
        </div>
      </div>

      {/* Room Quick Switcher Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {rooms.map((room) => {
            const isActive = room.id === activeRoomId;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="max-w-[200px] truncate">{room.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  {room.members.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Join by Code Input */}
        <form onSubmit={handleJoinWithCode} className="flex items-center gap-1.5 shrink-0">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="Enter Room Code..."
            className="w-36 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Join
          </button>
        </form>
      </div>

      {/* Main Room Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (8 cols): Room Header, Synced Focus Timer, Doubts & Shared Notes */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Room Card & Synced Timer */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-bold">
                    {currentRoom.subject}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">{currentRoom.targetExam}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{currentRoom.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hosted by <span className="font-semibold text-slate-700">{currentRoom.hostName}</span> ({currentRoom.college})
                </p>
              </div>

              {/* Room Code & Copy Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200/80 rounded-xl p-2">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400">Invite Code</p>
                  <p className="text-xs font-mono font-bold text-indigo-600">{currentRoom.roomCode}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition cursor-pointer"
                  title="Copy Room Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition cursor-pointer"
                  title="Copy Shareable Link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Synchronized Group Focus Strip */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-mono text-2xl font-bold text-indigo-200 border border-white/10">
                  {formatTimer(currentRoom.timerSecondsRemaining)}
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                      Live Synchronized Focus Sprint
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {currentRoom.members.filter((m) => m.isFocusing).length} of {currentRoom.members.length} classmates currently in deep focus
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert('You gave a Group High-Five! ✋');
                    confetti({ particleCount: 30, spread: 50 });
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>✋ High Five All</span>
                </button>
              </div>
            </div>

            {/* Shared Notes Scratchpad */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Room Shared Scratchpad & Exam Key Points</span>
                </span>
                <span className="text-[10px] text-slate-400">Live collaborative notes</span>
              </div>
              <textarea
                value={currentRoom.sharedNotes}
                onChange={(e) => {
                  const val = e.target.value;
                  setRooms((prev) =>
                    prev.map((r) => (r.id === currentRoom.id ? { ...r, sharedNotes: val } : r))
                  );
                }}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type formulas, exam questions, or shared pointers for everyone in the room..."
              />
            </div>
          </div>

          {/* Group Doubts & Q&A Stream */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Classmate Doubts & Discussion</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ask confusing concepts; classmates and the Gemini AI Tutor assist in real-time.
                </p>
              </div>

              <button
                onClick={() => setShowDoubtForm(!showDoubtForm)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ask a Doubt</span>
              </button>
            </div>

            {/* Post Doubt Collapsible Form */}
            {showDoubtForm && (
              <form onSubmit={handlePostDoubt} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-800">Ask Your Question to the Group</h4>
                <div>
                  <input
                    type="text"
                    value={newDoubtTopic}
                    onChange={(e) => setNewDoubtTopic(e.target.value)}
                    placeholder="Topic tag (e.g., AVL Rotations, Belady Anomaly, B+ Trees)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <textarea
                    value={newDoubtQuestion}
                    onChange={(e) => setNewDoubtQuestion(e.target.value)}
                    placeholder="Describe your doubt in detail..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDoubtForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Post to Room
                  </button>
                </div>
              </form>
            )}

            {/* Doubts List */}
            <div className="space-y-4">
              {currentRoom.doubts.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No doubts posted yet in this room.</p>
                  <p className="text-[11px] text-slate-400">Be the first to post a question for your study group!</p>
                </div>
              ) : (
                currentRoom.doubts.map((doubt) => (
                  <div key={doubt.id} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md">
                            {doubt.topic}
                          </span>
                          <span className="text-[11px] text-slate-400">• {doubt.timestamp}</span>
                          {doubt.resolved && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Solved</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{doubt.question}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Asked by <span className="font-semibold text-slate-700">{doubt.authorName}</span> ({doubt.college})
                        </p>
                      </div>

                      <button
                        onClick={() => handleUpvoteDoubt(doubt.id)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 transition cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{doubt.upvotes}</span>
                      </button>
                    </div>

                    {/* Replies Stream */}
                    {doubt.replies.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {doubt.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-2.5 rounded-xl text-xs ${
                              reply.isTutor
                                ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-950'
                                : 'bg-slate-50 text-slate-700 border border-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold flex items-center gap-1 text-[11px]">
                                {reply.isTutor && <Sparkles className="w-3 h-3 text-indigo-600" />}
                                <span>{reply.authorName}</span>
                              </span>
                              <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Reply Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={replyTextMap[doubt.id] || ''}
                        onChange={(e) =>
                          setReplyTextMap({ ...replyTextMap, [doubt.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddReply(doubt.id);
                          }
                        }}
                        placeholder="Write a solution or hint for your classmate..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleAddReply(doubt.id)}
                        className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Col (4 cols): Active Classmates / Study Buddies List */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Classmates in Room */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Study Buddies ({currentRoom.members.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400">Live active in room</p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Invite</span>
              </button>
            </div>

            {/* Member List */}
            <div className="space-y-3">
              {currentRoom.members.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-full ${member.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                        {member.isHost && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                            Host
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{member.college} • {member.degree}</p>
                      <p className="text-[10px] text-indigo-600 truncate font-medium mt-0.5">
                        {member.isFocusing ? `🔥 ${member.currentTopic}` : `☕ ${member.currentTopic}`}
                      </p>
                    </div>
                  </div>

                  {/* Nudge Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleSendPeerNudge(member.name, '✋', 'High five sent!')}
                      className="p-1 hover:bg-slate-200 rounded-lg text-xs cursor-pointer"
                      title="Send High Five"
                    >
                      ✋
                    </button>
                    <button
                      onClick={() => handleSendPeerNudge(member.name, '☕', 'Coffee break nudge!')}
                      className="p-1 hover:bg-slate-200 rounded-lg text-xs cursor-pointer"
                      title="Send Coffee"
                    >
                      ☕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Invite Campus Action */}
            <div className="pt-2">
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp / Campus Link</span>
              </button>
            </div>
          </div>

          {/* College Exam Group Rules */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-300">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Group Study Code</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• Keep microphones muted during the 50m focus countdown.</li>
              <li>• Post questions in the Doubts stream with the specific topic name.</li>
              <li>• Share helpful code derivations and previous year question hints in the shared scratchpad.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Invite College Friends</h3>
                  <p className="text-[11px] text-slate-500">Share room code or send direct invites</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Room Code Quick Box */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-indigo-600">Room Code</p>
                <p className="text-base font-mono font-extrabold text-indigo-900">{currentRoom.roomCode}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Direct Send Form (Email / Phone) */}
            <form onSubmit={handleSendInvite} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Send Direct Invite (College Email or Phone Number)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="e.g. friend@university.edu or +91 9876543210"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Send
                </button>
              </div>
              {inviteSuccessMsg && (
                <p className="text-xs text-emerald-600 font-semibold">{inviteSuccessMsg}</p>
              )}
            </form>

            {/* QR Code Simulation for Android Phone Scanner in Library */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
              <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>Instant Android QR Scan</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Hold your phone camera or Android Companion App to join instantly:
              </p>
              
              {/* Clean SVG QR code representation */}
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
                <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  {/* Top-left position marker */}
                  <rect x="10" y="10" width="24" height="24" rx="2" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" />
                  {/* Top-right position marker */}
                  <rect x="66" y="10" width="24" height="24" rx="2" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" />
                  {/* Bottom-left position marker */}
                  <rect x="10" y="66" width="24" height="24" rx="2" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" />
                  {/* Pseudo random data blocks */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="18" width="6" height="6" />
                  <rect x="42" y="28" width="6" height="6" />
                  <rect x="12" y="44" width="6" height="6" />
                  <rect x="22" y="52" width="6" height="6" />
                  <rect x="40" y="44" width="18" height="18" />
                  <rect x="44" y="48" width="10" height="10" fill="white" />
                  <rect x="48" y="52" width="2" height="2" />
                  <rect x="66" y="44" width="6" height="6" />
                  <rect x="76" y="52" width="6" height="6" />
                  <rect x="84" y="44" width="6" height="6" />
                  <rect x="66" y="66" width="6" height="6" />
                  <rect x="76" y="76" width="12" height="6" />
                  <rect x="84" y="84" width="6" height="6" />
                </svg>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                {copiedLink ? 'Link Copied to Clipboard!' : 'Copy Direct Web Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Create New Campus Study Room</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Room Title</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g., Anna Univ CSE: Algorithms Exam Prep"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newRoomSubject}
                  onChange={(e) => setNewRoomSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Theory of Computation">Theory of Computation</option>
                  <option value="General College Prep">General College Prep</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Launch Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
