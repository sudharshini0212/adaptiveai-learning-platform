import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Headphones, 
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import { UserProfile, FocusSession, StudyTask } from '../types';
import confetti from 'canvas-confetti';

interface FocusTimerViewProps {
  userProfile: UserProfile;
  studyTasks: StudyTask[];
  onSessionComplete: (minutes: number, subject: string, topic: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  userProfile,
  studyTasks,
  onSessionComplete,
  onNavigateTab,
}) => {
  // Timer Presets in minutes
  const presets = [
    { label: 'Pomodoro', minutes: 25, type: 'focus', desc: 'Classic 25m Focus' },
    { label: 'College Deep Dive', minutes: 50, type: 'focus', desc: '50m Exam Prep' },
    { label: 'Quick Sprint', minutes: 15, type: 'focus', desc: '15m Revision' },
    { label: 'Short Break', minutes: 5, type: 'break', desc: '5m Rest' },
    { label: 'Long Break', minutes: 15, type: 'break', desc: '15m Reset' },
  ];

  const collegeSubjects = [
    'Data Structures & Algorithms',
    'Operating Systems',
    'Database Management Systems',
    'Computer Networks',
    'Theory of Computation',
    'Software Engineering',
    'Mathematics & Discrete Structures',
    'General College Prep'
  ];

  const [selectedPreset, setSelectedPreset] = useState<number>(25);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Data Structures & Algorithms');
  const [customTopic, setCustomTopic] = useState<string>('AVL Tree Rotations & Balance Factor');
  const [ambientSound, setAmbientSound] = useState<'none' | 'whitenoise' | 'rain' | 'alpha'>('none');
  const [volume, setVolume] = useState<number>(0.4);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  
  // Historical sessions in state (with sample initial history)
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([
    {
      id: 'fs_1',
      subject: 'Operating Systems',
      topic: 'Virtual Memory & Page Replacement',
      durationMinutes: 50,
      timestamp: 'Today, 10:30 AM',
    },
    {
      id: 'fs_2',
      subject: 'Data Structures & Algorithms',
      topic: 'Dijkstra Shortest Path Implementation',
      durationMinutes: 25,
      timestamp: 'Yesterday, 4:15 PM',
    }
  ]);

  // Audio Context Ref for Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Initialize or update sound engine
  const stopAmbientSound = () => {
    try {
      if (noiseSourceRef.current) {
        (noiseSourceRef.current as any).stop?.();
        noiseSourceRef.current.disconnect();
        noiseSourceRef.current = null;
      }
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
    } catch (_e) {
      // safe cleanup
    }
  };

  const playCompletionChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;

      // Play pleasant two-tone chime (E5 -> G#5 -> B5)
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playTone(659.25, now, 0.4); // E5
      playTone(830.61, now + 0.15, 0.5); // G#5
      playTone(987.77, now + 0.3, 0.8); // B5
    } catch (_e) {
      // audio disabled/blocked
    }
  };

  const startAmbientSound = (soundType: string) => {
    stopAmbientSound();
    if (soundType === 'none') return;

    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (soundType === 'alpha') {
        // 432 Hz Binaural Relaxation / Focus Tone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        osc.connect(masterGain);
        osc.start();
        oscRef.current = osc;
      } else {
        // Generate Pink/White Noise Buffer for Rain or Study Noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (soundType === 'rain') {
            // Low-pass filtered pink noise (sounds like soft rain)
            lastOut = (lastOut * 0.95) + (white * 0.05);
            data[i] = lastOut * 3;
          } else {
            // White noise
            data[i] = white * 0.25;
          }
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Bandpass filter for comfortable listening
        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(soundType === 'rain' ? 800 : 1200, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        noiseSourceRef.current = noise;
      }
    } catch (_e) {
      // Audio autoplay policy handled
    }
  };

  // Change sound effect
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      startAmbientSound(ambientSound);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
    };
  }, [ambientSound, isRunning]);

  // Volume slider update
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Main Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      // Timer finished!
      setIsRunning(false);
      stopAmbientSound();
      playCompletionChime();

      if (timerMode === 'focus') {
        const finishedMinutes = Math.round(totalSeconds / 60);
        confetti({ particleCount: 70, spread: 80 });

        const newSession: FocusSession = {
          id: 'fs_' + Date.now(),
          subject: selectedSubject,
          topic: customTopic || 'Focused Study Sprint',
          durationMinutes: finishedMinutes,
          timestamp: 'Just now',
        };

        setRecentSessions((prev) => [newSession, ...prev]);
        onSessionComplete(finishedMinutes, selectedSubject, customTopic);

        // Offer break
        setTimerMode('break');
        setSelectedPreset(5);
        setTotalSeconds(5 * 60);
        setSecondsRemaining(5 * 60);
      } else {
        // Break finished, return to focus
        setTimerMode('focus');
        setSelectedPreset(25);
        setTotalSeconds(25 * 60);
        setSecondsRemaining(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleSelectPreset = (minutes: number, mode: 'focus' | 'break') => {
    setIsRunning(false);
    setSelectedPreset(minutes);
    setTimerMode(mode);
    setTotalSeconds(minutes * 60);
    setSecondsRemaining(minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    stopAmbientSound();
    setSecondsRemaining(totalSeconds);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100;

  return (
    <div className={`space-y-6 ${isZenMode ? 'fixed inset-0 z-50 bg-slate-950 text-white p-6 sm:p-12 overflow-y-auto flex flex-col justify-between' : ''}`}>
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs border border-indigo-200">
              College Focus Engine
            </span>
            <span className="text-xs font-medium text-slate-500">
              {userProfile.institution || 'University Prep'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Deep Work & Pomodoro Timer</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Block distractions, master syllabus topics in intervals, and build your semester study streak.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs cursor-pointer transition"
          >
            {isZenMode ? <Minimize2 className="w-4 h-4 text-indigo-600" /> : <Maximize2 className="w-4 h-4 text-slate-500" />}
            <span>{isZenMode ? 'Exit Zen Mode' : 'Zen Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center: Interactive Circular Timer */}
        <div className={`lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative shadow-xs ${isZenMode ? 'bg-slate-900/90 border-slate-800' : ''}`}>
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {presets.map((preset) => {
              const active = selectedPreset === preset.minutes && timerMode === preset.type;
              return (
                <button
                  key={`${preset.label}-${preset.minutes}`}
                  onClick={() => handleSelectPreset(preset.minutes, preset.type as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset.label} ({preset.minutes}m)
                </button>
              );
            })}
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                className={`${timerMode === 'focus' ? 'text-indigo-600' : 'text-emerald-500'} transition-all duration-1000 ease-linear`}
                strokeWidth="10"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Centered Time Display */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${isZenMode ? 'text-white' : 'text-slate-900'}`}>
                {formatTime(secondsRemaining)}
              </span>
              <span className={`text-xs uppercase font-bold tracking-widest mt-1 ${timerMode === 'focus' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                {timerMode === 'focus' ? '🔥 Deep Focus' : '☕ Recovery Break'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[170px] truncate">
                {customTopic || selectedSubject}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition cursor-pointer"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Ambient Soundbar */}
          <div className="mt-8 pt-6 border-t border-slate-100 w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-700">Audio Scape:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'none', label: 'Off' },
                  { id: 'rain', label: '🌧️ Rain' },
                  { id: 'whitenoise', label: '💨 Noise' },
                  { id: 'alpha', label: '🧠 432Hz' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setAmbientSound(s.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      ambientSound === s.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {ambientSound !== 'none' && (
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-indigo-600 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: College Subject & Goal Configuration */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active College Task Config */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Focus Objective</span>
              </h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                +25 XP / Session
              </span>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                College Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {collegeSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Topic */}
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Specific Topic / Problem Set
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., AVL Single Rotations, Page Fault Algorithms..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Link from Study Planner Tasks */}
            {studyTasks.filter(t => !t.completed).length > 0 && (
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Pick from Today's Scheduled Tasks:
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {studyTasks
                    .filter((t) => !t.completed)
                    .slice(0, 3)
                    .map((task) => (
                      <button
                        key={task.id}
                        onClick={() => {
                          setSelectedSubject(task.subject);
                          setCustomTopic(task.topic);
                        }}
                        className="w-full text-left p-2 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 rounded-lg text-[11px] text-slate-700 transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate pr-2 font-medium">{task.title}</span>
                        <span className="text-[10px] text-indigo-600 shrink-0 font-bold">{task.durationMinutes}m</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Focus Metrics Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                Student Focus Stats
              </span>
              <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full font-bold border border-indigo-400/20">
                {userProfile.semester || 'Semester 5'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-semibold">Today's Minutes</p>
                <p className="text-2xl font-black mt-0.5">{userProfile.totalFocusMinutes || 75}m</p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-semibold">Active Streak</p>
                <p className="text-2xl font-black mt-0.5 text-amber-300 flex items-center gap-1">
                  <span>{userProfile.streak}</span>
                  <span className="text-sm font-normal text-white">days</span>
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300">
              💡 <span className="font-semibold text-white">College Study Tip:</span> Research shows 50 minutes of deep concept derivation followed by a 10-minute walk boosts retention by 42%.
            </p>
          </div>

          {/* Recent Focus Log */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Completed Sessions</span>
              <span className="text-[10px] text-slate-400">{recentSessions.length} total</span>
            </h4>

            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{session.topic}</p>
                    <p className="text-[10px] text-slate-500 truncate">{session.subject} • {session.timestamp}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                    +{session.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
