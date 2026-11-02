import React, { useState } from 'react';
import { TutorMessage, TopicMastery, NoteArtifact } from '../types';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Brain, 
  Code, 
  Layers, 
  Zap, 
  HelpCircle, 
  Baby, 
  GraduationCap, 
  Globe, 
  Layout, 
  RotateCw,
  Clock,
  BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AITutorViewProps {
  initialTopic?: string;
  initialSubject?: string;
  topicMasteryList: TopicMastery[];
  noteArtifacts: NoteArtifact[];
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialTopic = 'AVL Trees & Self-Balancing Rotations',
  initialSubject = 'Data Structures & Algorithms',
  topicMasteryList,
  noteArtifacts,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedMode, setSelectedMode] = useState<string>('explain_like_10');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'msg_1',
      sender: 'tutor',
      text: `Hello Arun! I'm your **AdaptiveAI Tutor**. I've indexed your **Anna University 5th Semester CSE** syllabus and your personal study notes.

I noticed from your recent diagnostics that **AVL Tree Rotations (32% mastery)** is flagged as a critical gap. 

How would you like to explore this topic? Choose one of our multi-perspective modes below or ask any direct question!`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Why does a regular BST degrade to O(N)?',
        'How do I identify whether to use single or double rotation?',
        'Can you trace key insertion 10, 20, 30 step-by-step?',
      ],
    },
  ]);

  const explanationModes = [
    { id: 'explain_like_10', label: "Explain like I'm 10", icon: Baby, color: 'text-amber-400' },
    { id: 'exam_level', label: 'University Exam Level', icon: GraduationCap, color: 'text-indigo-400' },
    { id: 'real_world', label: 'Real-World System Example', icon: Globe, color: 'text-emerald-400' },
    { id: 'with_code', label: 'With Code & Dry Run', icon: Code, color: 'text-cyan-400' },
    { id: 'visual_diagram', label: 'Visual ASCII Diagrams', icon: Layout, color: 'text-rose-400' },
    { id: '30_second_summary', label: 'In 30 Seconds', icon: Zap, color: 'text-purple-400' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const studentMsg: TutorMessage = {
      id: 'msg_student_' + Date.now(),
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modeUsed: selectedMode,
    };

    setMessages((prev) => [...prev, studentMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      // Find relevant note context if any
      const relevantNote = noteArtifacts.find((n) =>
        n.title.toLowerCase().includes(selectedTopic.toLowerCase().slice(0, 5))
      );

      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          mode: selectedMode,
          subject: selectedSubject,
          topic: selectedTopic,
          contextNotes: relevantNote ? relevantNote.rawContent : undefined,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const tutorMsg: TutorMessage = {
          id: 'msg_tutor_' + Date.now(),
          sender: 'tutor',
          text: resData.data.answer || 'Here is the explanation for you.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modeUsed: selectedMode,
          suggestedFollowUps: resData.data.suggestedFollowUps || [],
        };
        setMessages((prev) => [...prev, tutorMsg]);
      }
    } catch (err) {
      console.error('Tutor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Socratic Context-Aware AI Tutor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Explain It Differently: Multi-Perspective AI Mentor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Switch lenses instantly between intuitive children's analogies, university mark-scoring proofs, production code traces, or real-world cloud architectures.
            </p>
          </div>

          {/* Subject & Topic Dropdown Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="AVL Trees & Self-Balancing Rotations">AVL Trees & Rotations (Weak 32%)</option>
              <option value="Functional Dependencies & Normal Forms (3NF/BCNF)">DBMS Normalization 3NF/BCNF (Weak 38%)</option>
              <option value="Dijkstra Shortest Path with Priority Queue">Dijkstra Shortest Path (Weak 28%)</option>
              <option value="Floyd Cycle Finding in Linked Lists">Floyd Cycle Finding (Mastered 84%)</option>
              <option value="Sliding Window & Two Pointer Mechanics">Sliding Window (Mastered 92%)</option>
            </select>
          </div>
        </div>

        {/* 6 "Explain It Differently" Mode Selectors */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex overflow-x-auto gap-2 no-scrollbar">
          {explanationModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : mode.color}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col min-h-[500px] shadow-sm">
        
        {/* Messages Stream */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                msg.sender === 'student'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {msg.sender === 'student' ? 'A' : <Brain className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl rounded-2xl p-5 space-y-3 shadow-xs ${
                msg.sender === 'student'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}>
                
                {msg.modeUsed && msg.sender === 'tutor' && (
                  <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    <span>Mode: {explanationModes.find((m) => m.id === msg.modeUsed)?.label || 'Adaptive'}</span>
                  </div>
                )}

                <div className={`prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'student' ? 'text-white' : 'text-slate-700'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                <div className={`text-[10px] text-right pt-1 ${
                  msg.sender === 'student' ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-700 block">
                      Explore next:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition text-left cursor-pointer shadow-2xs font-medium"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-slate-500 text-xs animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 animate-spin" />
              </div>
              <span>AdaptiveAI is synthesizing {explanationModes.find((m) => m.id === selectedMode)?.label}...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Ask anything about ${selectedTopic} in "${explanationModes.find((m) => m.id === selectedMode)?.label}" style...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Tutor</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
