import React, { useState } from 'react';
import { SyllabusItem } from '../types';
import { 
  BookMarked, 
  Upload, 
  Sparkles, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  Brain, 
  FileText, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface SyllabusViewProps {
  syllabusList: SyllabusItem[];
  onAddSyllabus: (syllabus: SyllabusItem) => void;
  onGenerateNotesFromTopic: (topicTitle: string, subject: string) => void;
  onScheduleTopic: (topicTitle: string, subject: string) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  syllabusList,
  onAddSyllabus,
  onGenerateNotesFromTopic,
  onScheduleTopic,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(syllabusList[0]?.id || '');
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [subjectNameInput, setSubjectNameInput] = useState('');
  const [syllabusTextInput, setSyllabusTextInput] = useState('');
  const [parsingLoading, setParsingLoading] = useState(false);

  const currentSyllabus = syllabusList.find((s) => s.id === selectedSubjectId) || syllabusList[0];

  const toggleUnit = (unitNum: number) => {
    setExpandedUnits((prev) => ({ ...prev, [unitNum]: !prev[unitNum] }));
  };

  const handleParseSyllabus = async () => {
    if (!syllabusTextInput.trim()) return;
    setParsingLoading(true);
    try {
      const response = await fetch('/api/ai/parse-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subjectNameInput || 'Uploaded Academic Syllabus',
          syllabusText: syllabusTextInput,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const newSyllabus: SyllabusItem = {
          id: 'syl_' + Date.now(),
          subject: resData.data.subject || subjectNameInput || 'New Subject Syllabus',
          code: resData.data.code || 'ENG-' + Math.floor(100 + Math.random() * 900),
          units: resData.data.units || [],
        };
        onAddSyllabus(newSyllabus);
        setSelectedSubjectId(newSyllabus.id);
        setShowUploadModal(false);
        setSyllabusTextInput('');
        setSubjectNameInput('');
      }
    } catch (err) {
      console.error('Failed to parse syllabus:', err);
    } finally {
      setParsingLoading(false);
    }
  };

  const loadSampleSyllabus = (type: 'os' | 'python') => {
    if (type === 'os') {
      setSubjectNameInput('Operating Systems (CS8493)');
      setSyllabusTextInput(`Unit 1: Processes and Threads - Process concept, process state transitions, PCB, context switching, CPU scheduling algorithms (FCFS, SJF, Round Robin, Multilevel Queue).
Unit 2: Process Synchronization and Deadlocks - Critical Section problem, Peterson algorithm, Semaphores, Monitors, Classic synchronization problems (Dining Philosophers, Producer Consumer), Deadlock characterization, Banker algorithm.
Unit 3: Memory Management - Logical vs Physical address space, Swapping, Contiguous allocation, Paging, Page tables, Segmentation, Virtual memory, Demand paging, Page replacement algorithms (FIFO, LRU, Optimal).
Unit 4: File Systems and I/O - File concept, directory structures, Allocation methods (Contiguous, Linked, Indexed), Disk scheduling (FCFS, SSTF, SCAN, C-LOOK).`);
    } else {
      setSubjectNameInput('Python for Artificial Intelligence & ML');
      setSyllabusTextInput(`Unit 1: NumPy & Vectorized Computations - N-dimensional arrays, Broadcasting, Slicing, Matrix multiplication, Vectorized math operations.
Unit 2: Pandas Data Wrangling - DataFrames, Series, Handling missing values, GroupBy aggregations, Merging & Joining datasets.
Unit 3: Scikit-Learn Model Pipeline - Supervised regression & classification, Train-test split, Cross-validation, Hyperparameter tuning (GridSearchCV).
Unit 4: Deep Learning Foundations - Multi-layer perceptrons, Forward pass, Backpropagation, Gradient descent optimization.`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Academic Syllabus Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            University Syllabus & Structured Knowledge Tree
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Upload your college syllabus PDF or paste text. AdaptiveAI uses Gemini to decompose topics into prerequisite hierarchies and learning checkpoints.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Syllabus</span>
        </button>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1">
        {syllabusList.map((syl) => (
          <button
            key={syl.id}
            onClick={() => setSelectedSubjectId(syl.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              currentSyllabus?.id === syl.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{syl.subject}</span>
          </button>
        ))}
      </div>

      {/* Structured Syllabus Breakdown Tree */}
      {currentSyllabus && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center space-x-2">
              <span>{currentSyllabus.subject}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                {currentSyllabus.code || 'CS-CORE'}
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {currentSyllabus.units.length} Academic Units
            </span>
          </div>

          <div className="space-y-4">
            {currentSyllabus.units.map((unit) => {
              const isExpanded = expandedUnits[unit.unitNumber] ?? true;
              return (
                <div
                  key={unit.unitNumber}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Unit Header */}
                  <div
                    onClick={() => toggleUnit(unit.unitNumber)}
                    className="flex items-center justify-between p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer transition border-b border-slate-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                        U{unit.unitNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {unit.unitTitle}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {unit.topics.length} Key Conceptual Topics
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="text-slate-400 hover:text-slate-700">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Topic Items Inside Unit */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-100">
                      {unit.topics.map((topic) => (
                        <div key={topic.id} className="pt-3 first:pt-0 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                  {topic.title}
                                </span>
                                {topic.importance === 'High' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                    High Exam Yield
                                  </span>
                                )}
                              </div>
                              
                              {/* Prerequisites badge */}
                              {topic.prerequisites && topic.prerequisites.length > 0 && (
                                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                                  <span className="text-slate-500 font-medium">Prerequisites:</span>
                                  <span className="text-indigo-600 font-semibold">{topic.prerequisites.join(', ')}</span>
                                </p>
                              )}
                            </div>

                            {/* Actions & Mastery */}
                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                              <div className="text-right mr-2">
                                <span className="text-xs font-bold text-emerald-600">
                                  {topic.mastery}% Mastery
                                </span>
                              </div>

                              <button
                                onClick={() => onGenerateNotesFromTopic(topic.title, currentSyllabus.subject)}
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 transition cursor-pointer"
                                title="Generate Easy Notes, Mind Map & Flashcards"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Study Studio</span>
                              </button>

                              <button
                                onClick={() => onScheduleTopic(topic.title, currentSyllabus.subject)}
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer"
                                title="Add to Study Plan"
                              >
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>Schedule</span>
                              </button>
                            </div>
                          </div>

                          {/* Subtopics Pills */}
                          <div className="flex flex-wrap gap-1.5 pl-2">
                            {topic.subtopics.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200/80"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Syllabus Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>AI Syllabus Decomposition</span>
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
                  Subject Name & Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems (CS8493)"
                  value={subjectNameInput}
                  onChange={(e) => setSubjectNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Paste Academic Syllabus Text or Course Outline
                  </label>
                  <div className="flex space-x-2 text-[11px]">
                    <span className="text-slate-400">Load sample:</span>
                    <button
                      type="button"
                      onClick={() => loadSampleSyllabus('os')}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Operating Systems
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => loadSampleSyllabus('python')}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Python for AI
                    </button>
                  </div>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste units, topics, and subtopics here..."
                  value={syllabusTextInput}
                  onChange={(e) => setSyllabusTextInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Gemini will extract Units, Topics, Subtopics, Prerequisites, and High-Yield Exam topics into your knowledge tree automatically.
                </p>
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
                onClick={handleParseSyllabus}
                disabled={parsingLoading || !syllabusTextInput.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${parsingLoading ? 'animate-spin' : ''}`} />
                <span>{parsingLoading ? 'Extracting Syllabus with Gemini...' : 'Deconstruct Syllabus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
