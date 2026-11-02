import React, { useState } from 'react';
import { Course } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseMarketplaceViewProps {
  courses: Course[];
  enrolledCourseIds: string[];
  onEnrollCourse: (courseId: string) => void;
  onSelectTopicForTutor: (topic: string, subject: string) => void;
}

export const CourseMarketplaceView: React.FC<CourseMarketplaceViewProps> = ({
  courses,
  enrolledCourseIds,
  onEnrollCourse,
  onSelectTopicForTutor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0]);
  const [selectedLesson, setSelectedLesson] = useState<any>(courses[0]?.modules[0]?.lessons[0]);

  const categories = ['All', 'Computer Science Core', 'Databases & Backend', 'Full-Stack & Systems'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleEnroll = (courseId: string) => {
    onEnrollCourse(courseId);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Placement & University Course Catalog</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Course Marketplace & Module Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Enroll in university courses and industry tracks. AdaptiveAI syncs these lectures directly with your uploaded notes and academic syllabus.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search courses, e.g. DSA, DBMS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Course Grid + Detail & Lesson Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Course Cards Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Courses ({filteredCourses.length})
          </h2>

          <div className="space-y-3.5">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const isSelected = selectedCourse?.id === course.id;

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedLesson(course.modules[0]?.lessons[0]);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 shadow-xs ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {course.code} • {course.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating}</span>
                      </span>
                      <span className="text-slate-500">{course.duration}</span>
                    </div>

                    {isEnrolled ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnroll(course.id);
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-2xs transition cursor-pointer"
                      >
                        Enroll Free
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Modules & Lesson Viewer Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCourse && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {selectedCourse.code} Module Tracker
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Instructor: {selectedCourse.instructor} • {selectedCourse.level} Level
                  </p>
                </div>

                {!enrolledCourseIds.includes(selectedCourse.id) && (
                  <button
                    onClick={() => handleEnroll(selectedCourse.id)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition self-start sm:self-auto cursor-pointer"
                  >
                    Enroll in this Course
                  </button>
                )}
              </div>

              {/* Active Lesson Display Card */}
              {selectedLesson && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1.5">
                      {selectedLesson.contentType === 'video' ? <PlayCircle className="w-4 h-4" /> :
                       selectedLesson.contentType === 'quiz' ? <HelpCircle className="w-4 h-4" /> :
                       <FileText className="w-4 h-4" />}
                      <span>Current Lesson Focus: {selectedLesson.contentType.toUpperCase()}</span>
                    </span>
                    <span className="text-xs text-slate-400">{selectedLesson.duration}</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-800">
                    {selectedLesson.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedLesson.summary}
                  </p>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => onSelectTopicForTutor(selectedLesson.title, selectedCourse.title)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Learn with AI Tutor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modules & Lessons List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Course Modules & Lessons
                </h4>

                <div className="space-y-4">
                  {selectedCourse.modules.map((mod) => (
                    <div key={mod.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-800">{mod.title}</h5>
                        <span className="text-[11px] text-slate-500">{mod.duration}</span>
                      </div>

                      <div className="space-y-2">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              {lesson.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-slate-400" />
                              )}
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
