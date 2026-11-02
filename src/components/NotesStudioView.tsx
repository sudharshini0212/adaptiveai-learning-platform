import React, { useState } from 'react';
import { NoteArtifact, MindMapNode, Flashcard, QuizQuestion } from '../types';
import { 
  FileText, 
  Sparkles, 
  Network, 
  CreditCard, 
  HelpCircle, 
  Zap, 
  Star, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCw,
  Plus,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';

interface NotesStudioViewProps {
  noteArtifacts: NoteArtifact[];
  activeNoteId: string;
  onSelectNote: (id: string) => void;
  onAddNoteArtifact: (note: NoteArtifact) => void;
  onScheduleNote: (note: NoteArtifact) => void;
  onUpdateQuizScore: (topic: string, subject: string, scorePercent: number) => void;
}

export const NotesStudioView: React.FC<NotesStudioViewProps> = ({
  noteArtifacts,
  activeNoteId,
  onSelectNote,
  onAddNoteArtifact,
  onScheduleNote,
  onUpdateQuizScore,
}) => {
  const [activeFormatTab, setActiveFormatTab] = useState<
    'easy_notes' | 'mind_map' | 'flashcards' | 'quiz' | 'quick_revision' | 'important_points'
  >('easy_notes');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // New Note Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Data Structures & Algorithms');
  const [newRawText, setNewRawText] = useState('');
  const [processingLoading, setProcessingLoading] = useState(false);

  const activeNote = noteArtifacts.find((n) => n.id === activeNoteId) || noteArtifacts[0];

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (activeNote && activeNote.flashcards.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % activeNote.flashcards.length);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (activeNote && activeNote.flashcards.length > 0) {
      setCurrentCardIndex((prev) => (prev - 1 + activeNote.flashcards.length) % activeNote.flashcards.length);
    }
  };

  const handleQuizSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    if (!activeNote || !activeNote.quiz || activeNote.quiz.length === 0) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    activeNote.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / activeNote.quiz.length) * 100);
    onUpdateQuizScore(activeNote.title, activeNote.subject, scorePercent);

    if (scorePercent >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleProcessNewNote = async () => {
    if (!newRawText.trim()) return;
    setProcessingLoading(true);
    try {
      const response = await fetch('/api/ai/process-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle || 'Custom Study Notes',
          subject: newSubject,
          rawContent: newRawText,
          studentLevel: '5th Semester CSE',
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const newArtifact: NoteArtifact = {
          id: 'note_' + Date.now(),
          title: newTitle || 'Personal Study Notes',
          subject: newSubject,
          sourceType: 'text',
          createdAt: new Date().toISOString().split('T')[0],
          rawContent: newRawText,
          easyNotes: resData.data.easyNotes || 'Processed Notes',
          mindMap: resData.data.mindMap || { id: 'root', label: newTitle },
          flashcards: resData.data.flashcards || [],
          quiz: resData.data.quiz || [],
          quickRevision: resData.data.quickRevision || [],
          importantPoints: resData.data.importantPoints || [],
        };
        onAddNoteArtifact(newArtifact);
        onSelectNote(newArtifact.id);
        setShowUploadModal(false);
        setNewTitle('');
        setNewRawText('');
      }
    } catch (err) {
      console.error('Error processing notes:', err);
    } finally {
      setProcessingLoading(false);
    }
  };

  const renderMindMapNode = (node: MindMapNode, depth = 0) => {
    return (
      <div key={node.id} className={`space-y-2 ${depth > 0 ? 'ml-6 pl-4 border-l border-slate-200' : ''}`}>
        <div className="flex items-center space-x-2">
          <div 
            className="w-2.5 h-2.5 rounded-full shrink-0" 
            style={{ backgroundColor: node.color || '#4f46e5' }}
          />
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            depth === 0
              ? 'bg-indigo-50 border-indigo-200 text-indigo-900 text-sm shadow-xs'
              : depth === 1
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-50 border-slate-200 text-slate-600 text-[11px]'
          }`}>
            {node.label}
          </div>
        </div>
        {node.children && node.children.map((child) => renderMindMapNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Artifact Notes Studio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            Upload Personal Notes & Auto-Generate 6 Learning Formats
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Upload raw textbook text, PDF slides, or scanned notes. AdaptiveAI synthesizes Easy Notes, Mind Maps, Flashcards, Quiz, Quick Revision, and Key Points.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Notes</span>
        </button>
      </div>

      {/* Note Selector Strip */}
      <div className="flex overflow-x-auto space-x-3 pb-2">
        {noteArtifacts.map((note) => (
          <button
            key={note.id}
            onClick={() => {
              onSelectNote(note.id);
              setCurrentCardIndex(0);
              setIsFlipped(false);
              setQuizSubmitted(false);
              setSelectedAnswers({});
            }}
            className={`px-4 py-2.5 rounded-xl text-left transition border min-w-[220px] max-w-[280px] shrink-0 cursor-pointer ${
              activeNote?.id === note.id
                ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block truncate">
              {note.subject}
            </span>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
              {note.title}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">
              {note.flashcards.length} Cards • {note.quiz.length} MCQs
            </span>
          </button>
        ))}
      </div>

      {/* 6 AI Format Tabs */}
      {activeNote && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex overflow-x-auto space-x-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
              {[
                { id: 'easy_notes', label: 'Easy Notes', icon: FileText },
                { id: 'mind_map', label: 'Mind Map', icon: Network },
                { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
                { id: 'quiz', label: 'Adaptive Quiz', icon: HelpCircle },
                { id: 'quick_revision', label: 'Quick Revision', icon: Zap },
                { id: 'important_points', label: 'Key Points', icon: Star },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFormatTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFormatTab(tab.id as any)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onScheduleNote(activeNote)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 transition self-start sm:self-auto cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Add to Study Schedule</span>
            </button>
          </div>

          {/* Tab 1: Easy Notes */}
          {activeFormatTab === 'easy_notes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                <ReactMarkdown>{activeNote.easyNotes}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Mind Map */}
          {activeFormatTab === 'mind_map' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                    <Network className="w-5 h-5 text-indigo-600" />
                    <span>Concept Hierarchy & Relationship Graph</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visual knowledge graph generated from your personal study notes.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200 overflow-x-auto">
                {renderMindMapNode(activeNote.mindMap)}
              </div>
            </div>
          )}

          {/* Tab 3: Active Recall Flashcards */}
          {activeFormatTab === 'flashcards' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Card {currentCardIndex + 1} of {activeNote.flashcards.length}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {activeNote.flashcards[currentCardIndex]?.category || 'General'}
                </span>
              </div>

              {/* Flashcard Component with Click to Flip */}
              <div
                onClick={handleFlipCard}
                className={`min-h-[260px] p-8 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-md text-center select-none ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-700 to-indigo-900 border-indigo-600 text-white'
                    : 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-500 text-white'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-200">
                  {isFlipped ? 'Answer & Explanation' : 'Question (Click or Space to Flip)'}
                </span>

                <div className="my-auto py-4">
                  <p className="text-base sm:text-lg font-bold leading-relaxed">
                    {isFlipped
                      ? activeNote.flashcards[currentCardIndex]?.answer
                      : activeNote.flashcards[currentCardIndex]?.question}
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 text-xs text-indigo-200">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click card to reveal {isFlipped ? 'question' : 'answer'}</span>
                </div>
              </div>

              {/* Card Nav Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  Previous Card
                </button>

                <div className="flex items-center space-x-1">
                  {activeNote.flashcards.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentCardIndex ? 'w-5 bg-indigo-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Adaptive Quiz */}
          {activeFormatTab === 'quiz' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    <span>Adaptive Mastery Check Assessment</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your answers directly calibrate topic mastery and trigger prerequisite remediation.
                  </p>
                </div>

                {quizSubmitted && (
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Retake Assessment</span>
                  </button>
                )}
              </div>

              {/* Quiz Question List */}
              <div className="space-y-6">
                {activeNote.quiz.map((q, qIdx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                  return (
                    <div key={q.id} className="p-5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">
                          {qIdx + 1}. {q.question}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase shrink-0 ${
                          q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          let btnStyle = 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-50 border-rose-400 text-rose-800 font-medium';
                            } else {
                              btnStyle = 'opacity-50 border-slate-200 text-slate-400';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-1 ring-indigo-400';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizSelect(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-xs text-left transition flex items-start space-x-2.5 cursor-pointer ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Post-submit explanation */}
                      {quizSubmitted && (
                        <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                          <div className="flex items-center space-x-1.5 font-bold mb-1">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            )}
                            <span>{isCorrect ? 'Correct!' : 'Incorrect (Adaptive Remediation Insight)'}</span>
                          </div>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Submit & Calibrate Topic Mastery</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Quick Revision */}
          {activeFormatTab === 'quick_revision' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-800">
                  2-Minute Rapid-Fire Revision Recap
                </h3>
              </div>
              <ul className="space-y-3 pt-2">
                {activeNote.quickRevision.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 6: Important Points */}
          {activeFormatTab === 'important_points' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Star className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-800">
                  High-Yield Exam Invariants & Traps
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {activeNote.importantPoints.map((point, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      Key Invariant #{idx + 1}
                    </span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Upload Note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Upload Study Material / Notes</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Graph Shortest Path (Dijkstra vs Bellman Ford)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Python for AI">Python for AI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste Study Material Text, PPT Slide Extracts or Lecture Notes
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste concepts, code blocks, or raw notes here..."
                  value={newRawText}
                  onChange={(e) => setNewRawText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessNewNote}
                disabled={processingLoading || !newRawText.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${processingLoading ? 'animate-spin' : ''}`} />
                <span>{processingLoading ? 'Synthesizing with Gemini...' : 'Synthesize 6 Formats'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
