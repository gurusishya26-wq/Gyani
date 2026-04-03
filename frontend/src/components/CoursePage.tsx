'use client';

import React, { useState, useEffect } from "react";
import { 
  PlayCircle, Clock, Users, Award, Download, 
  ChevronLeft, CheckCircle, BookOpen, X, 
  Pause, Volume2, Maximize, MessageCircle, ChevronDown, ChevronUp 
} from "lucide-react";

export default function CourseDetailPage() {
  
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'notes' | 'doubts'>('overview');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(42);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1, 2, 3, 4]); // All chapters open by default

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Store all answers
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Sample Questions (You can replace with real data later)
  const questions = [
    {
      question: "What is the SI unit of electric field intensity?",
      options: ["Newton/Coulomb", "Volt/Meter", "Both A and B", "Joule/Coulomb"],
      correct: 2
    },
    {
      question: "Coulomb's law is valid for:",
      options: ["Point charges only", "Any shape of charges", "Only for conductors", "Only for insulators"],
      correct: 0
    },
    {
      question: "The electric field inside a conductor is:",
      options: ["Zero", "Infinite", "Depends on charge", "Equal to surface charge"],
      correct: 0
    },
    {
      question: "Which of the following is a scalar quantity?",
      options: ["Electric field", "Electric potential", "Electric flux", "Force"],
      correct: 1
    }
  ];
  const course = {
    id: 1,
    title: "Class 12 Physics",
    subject: "Physics",
    instructor: "Dr. Rajesh Sharma",
    instructorTitle: "PhD in Quantum Mechanics, 15+ years experience",
    rating: 4.8,
    totalStudents: 1240,
    duration: "6 weeks",
    progress: 78,
    completedLessons: 37,
    totalLessons: 48,
    thumbnail: "⚡",
    color: "from-blue-600 via-indigo-600 to-purple-600",
    description: "Master Class 12 Physics with deep conceptual clarity, rigorous problem-solving techniques, and complete preparation for CBSE Board + JEE/NEET.",
    tags: ["NCERT", "JEE Main", "JEE Advanced", "NEET", "Mechanics", "Electromagnetism"]
  };

  const chapters = [
    {
      id: 1,
      title: "Chapter 1: Electric Charges and Fields",
      lessons: [
        { id: 11, title: "Introduction to Electric Charges", duration: "28 min", completed: true, type: "video" },
        { id: 12, title: "Coulomb's Law & Electric Field", duration: "35 min", completed: true, type: "video" },
        { id: 13, title: "Electric Field Lines", duration: "22 min", completed: true, type: "video" },
      ],
      notes: [
      { id: 101, title: "Electric Charges - Formula Sheet", size: "1.2 MB", type: "PDF" },
      { id: 102, title: "Important Derivations - Chapter 1", size: "2.8 MB", type: "PDF" },
    ],
      tests: [
        { id: 101, title: "Chapter 1 Practice Test", duration: "30 min", completed: false, type: "test" }
      ]
    },
    {
      id: 2,
      title: "Chapter 2: Electrostatic Potential and Capacitance",
      lessons: [
        { id: 21, title: "Electric Potential & Potential Difference", duration: "40 min", completed: true, type: "video" },
        { id: 22, title: "Equipotential Surfaces", duration: "25 min", completed: false, type: "video" },
        { id: 23, title: "Capacitors & Capacitance", duration: "45 min", completed: false, type: "video" },
      ],
      notes: [
      { id: 103, title: "Capacitance Formula Sheet", size: "1.5 MB", type: "PDF" },
      { id: 104, title: "Numerical Problems - Chapter 2", size: "3.1 MB", type: "PDF" },
    ],
      tests: [
        { id: 102, title: "Chapter 2 Practice Test", duration: "30 min", completed: false, type: "test" }
      ]
    },
    {
      id: 3,
      title: "Chapter 3: Current Electricity",
      lessons: [
        { id: 31, title: "Ohm's Law & Resistance", duration: "32 min", completed: false, type: "video" },
        { id: 32, title: "Kirchhoff's Laws", duration: "38 min", completed: false, type: "video" },
        { id: 33, title: "Wheatstone Bridge & Potentiometer", duration: "50 min", completed: false, type: "video" },
      ],
      notes: [
      { id: 105, title: "Current Electricity Quick Revision", size: "2.4 MB", type: "PDF" },
    ],
      tests: [
        { id: 103, title: "Chapter 3 Practice Test", duration: "30 min", completed: false, type: "test" }
      ]
    },
    {
      id: 4,
      title: "Chapter 4: Moving Charges and Magnetism",
      lessons: [
        { id: 41, title: "Magnetic Field due to Current", duration: "42 min", completed: false, type: "video" },
        { id: 42, title: "Biot-Savart Law & Ampere's Law", duration: "55 min", completed: false, type: "video" },
      ],
      notes: [
      { id: 106, title: "Magnetism Formula Sheet", size: "1.8 MB", type: "PDF" },
      { id: 107, title: "Important Graphs & Diagrams", size: "4.2 MB", type: "PDF" },
    ],
      tests: [
        { id: 104, title: "Chapter 4 Practice Test", duration: "30 min", completed: false, type: "test" }
      ]
    }
  ];

  const notes = [
    { title: "Electrostatics Formula Sheet", size: "2.4 MB", type: "PDF" },
    { title: "Important Derivations - Magnetism", size: "1.8 MB", type: "PDF" },
    { title: "Previous 10 Years JEE Questions", size: "3.1 MB", type: "PDF" },
    { title: "Numerical Problems Solutions", size: "1.2 MB", type: "PDF" },
  ];

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const openVideo = (lesson: any) => {
    setCurrentLesson(lesson);
    setIsVideoModalOpen(true);
    setIsPlaying(true);
    setVideoProgress(lesson.completed ? 100 : 35);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const markLessonComplete = () => {
    alert("✅ Lesson marked as complete!");
    closeVideoModal();
  };

  // Timer Countdown
useEffect(() => {
  if (!isTestModalOpen || isSubmitted || timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        submitTest(true); // Auto-submit when time runs out
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [isTestModalOpen, isSubmitted, timeLeft]);

const openTest = (test: any) => {
  setCurrentTest(test);
  setIsTestModalOpen(true);
  setCurrentQuestion(0);
  setSelectedAnswers(new Array(questions.length).fill(-1));
  setTimeLeft(1800);
  setIsSubmitted(false);
  setScore(0);
};

const closeTestModal = () => {
  setIsTestModalOpen(false);
  setIsSubmitted(false);
};

const handleOptionSelect = (index: number) => {
  const newAnswers = [...selectedAnswers];
  newAnswers[currentQuestion] = index;
  setSelectedAnswers(newAnswers);
};

const nextQuestion = () => {
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  }
};

const prevQuestion = () => {
  if (currentQuestion > 0) {
    setCurrentQuestion(currentQuestion - 1);
  }
};

const submitTest = (autoSubmit = false) => {
  let correctCount = 0;
  selectedAnswers.forEach((answer, index) => {
    if (answer === questions[index].correct) correctCount++;
  });

  setScore(correctCount);
  setIsSubmitted(true);
  if (autoSubmit) {
    alert("⏰ Time's up! Your test has been auto-submitted.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => window.history.back()}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
            <div>
              <p className="text-xs text-gray-500">Class 12 • Science</p>
              <h1 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white">{course.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-end">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-2xl text-sm font-medium">
              <CheckCircle className="w-5 h-5" />
              {course.progress}% Complete
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all active:scale-95 whitespace-nowrap">
              <PlayCircle className="w-5 h-5" />
              Continue Learning
            </button>
          </div>
        </div>

        {/* Tabs - Responsive */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-4 sm:gap-10 text-sm font-medium overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'chapters', label: 'Chapters' },
              { id: 'notes', label: 'Notes & Resources' },
              { id: 'doubts', label: 'Ask Doubts' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 sm:py-5 border-b-2 whitespace-nowrap transition-all text-base sm:text-sm ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600 font-semibold' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 lg:space-y-12">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <div className={`h-64 sm:h-80 lg:h-96 rounded-3xl bg-gradient-to-br ${course.color} relative overflow-hidden flex items-center justify-center shadow-xl`}>
                  <div className="text-8xl sm:text-[160px] opacity-30">{course.thumbnail}</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => openVideo(chapters[0].lessons[0])}
                      className="bg-white hover:bg-gray-100 text-black px-8 sm:px-10 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 shadow-2xl transition-all hover:scale-105"
                    >
                      <PlayCircle className="w-8 h-8" />
                      Watch Preview
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.tags.map((tag, i) => (
                      <span key={i} className="bg-white dark:bg-gray-900 px-4 py-2 rounded-full text-xs border border-gray-200 dark:border-gray-700 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{course.title}</h1>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400 text-xl">★★★★☆</div>
                      <span className="font-medium">{course.rating} • {course.totalStudents} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      👨‍🏫 by {course.instructor}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" /> {course.duration}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Chapters Tab */}
{activeTab === 'chapters' && (
  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-4 sm:p-8">
    <h2 className="text-2xl sm:text-3xl font-semibold mb-8 px-2">Course Content</h2>
    
    <div className="space-y-8">
      {chapters.map((chapter) => {
        const isExpanded = expandedChapters.includes(chapter.id);
        
        return (
          <div key={chapter.id} className="border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-bold text-xl">
                  {chapter.id}
                </div>
                <h3 className="font-semibold text-xl">{chapter.title}</h3>
              </div>
              {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
            </button>

            {/* Chapter Content */}
            {isExpanded && (
              <div className="px-6 pb-8 border-t border-gray-100 dark:border-gray-700">
                
                {/* LESSONS */}
                <div className="mt-8">
                  <p className="uppercase text-xs font-medium text-gray-500 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    VIDEO LESSONS
                  </p>
                  <div className="space-y-3">
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => openVideo(lesson)}
                        className="group flex items-center justify-between p-5 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer border border-transparent hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                            ${lesson.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 dark:bg-blue-900'}`}>
                            <PlayCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-blue-600 transition-colors">{lesson.title}</p>
                            <p className="text-sm text-gray-500">{lesson.duration}</p>
                          </div>
                        </div>
                        {lesson.completed && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF NOTES - NEW SECTION */}
                {chapter.notes && chapter.notes.length > 0 && (
                  <div className="mt-10">
                    <p className="uppercase text-xs font-medium text-gray-500 mb-4 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      PDF NOTES & STUDY MATERIAL
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {chapter.notes.map((note) => (
                        <div 
                          key={note.id}
                          className="group border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-md transition-all hover:border-blue-200 flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            📄
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {note.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{note.type} • {note.size}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`📥 Downloading: ${note.title}`);
                              // In future: window.open(actual PDF URL)
                            }}
                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition-all"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TESTS */}
                <div className="mt-10">
                  <p className="uppercase text-xs font-medium text-gray-500 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    PRACTICE TESTS
                  </p>
                  <div className="space-y-4">
                    {chapter.tests.map((test) => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-5 rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-900 text-orange-600 flex items-center justify-center">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium">{test.title}</p>
                            <p className="text-sm text-gray-500">{test.duration}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => openTest(test)}
                          className="text-sm font-medium text-orange-600 hover:text-orange-700 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-orange-300 hover:border-orange-400 transition-all"
                        >
                          Start Test
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-semibold">Notes & Study Materials</h2>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <Download className="w-5 h-5" /> Download All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {notes.map((note, i) => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">{note.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{note.type} • {note.size}</p>
                        </div>
                        <Download className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doubts Tab */}
            {activeTab === 'doubts' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-200 dark:border-gray-800 text-center">
                <MessageCircle className="w-16 h-16 mx-auto text-blue-500 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Ask Your Doubt</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Get instant help from your teacher or community. Teachers usually reply within 2 hours.
                </p>
                <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all">
                  Post a New Doubt
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Progress */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 sticky top-6 lg:top-24">
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center w-28 h-28 mx-auto">
                  <div className="w-28 h-28 rounded-full border-[12px] border-blue-100 dark:border-blue-950" />
                  <div className="absolute text-6xl font-bold text-blue-600">{course.progress}</div>
                  <div className="absolute text-2xl text-blue-400 bottom-7 right-2">%</div>
                </div>
                <p className="text-sm text-gray-500 mt-6 font-medium">Overall Progress</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lessons Completed</span>
                  <span className="font-semibold">{course.completedLessons}/{course.totalLessons}</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <button 
                  onClick={() => {
                    const firstIncomplete = chapters.flatMap(c => c.lessons).find(l => !l.completed);
                    if (firstIncomplete) openVideo(firstIncomplete);
                  }}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all active:scale-[0.98]"
                >
                  Continue Learning
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                <p className="font-medium mb-4">Your Instructor</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl">
                    👨‍🏫
                  </div>
                  <div>
                    <p className="font-semibold">{course.instructor}</p>
                    <p className="text-sm text-gray-500">{course.instructorTitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== VIDEO PLAYER MODAL ====================== */}
      {isVideoModalOpen && currentLesson && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-800">
              <div className="min-w-0">
                <p className="text-blue-400 text-sm">Lesson</p>
                <h3 className="text-white text-lg sm:text-2xl font-semibold truncate">
                  {currentLesson.title}
                </h3>
              </div>
              <button 
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-white p-3 rounded-full hover:bg-zinc-800 transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black group" id="video-container">
              <video
                id="course-video"
                className="w-full h-full"
                controls={false}
                autoPlay
                src="https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4"
                onTimeUpdate={(e) => {
                  const progress = (e.currentTarget.currentTime / e.currentTarget.duration) * 100 || 0;
                  setVideoProgress(Math.floor(progress));
                }}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 sm:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3 sm:gap-6">

                  {/* Backward 10s */}
                  <button 
                    onClick={() => {
                      const video = document.getElementById('course-video') as HTMLVideoElement;
                      if (video) video.currentTime = Math.max(0, video.currentTime - 10);
                    }}
                    className="text-white p-3 hover:bg-white/20 rounded-full transition-all"
                    title="Rewind 10s"
                  >
                    <div className="flex items-center gap-1">
                      <ChevronLeft className="w-6 h-6" />
                      <span className="text-xs font-mono -ml-0.5">10</span>
                    </div>
                  </button>

                  {/* Play/Pause */}
                  <button 
                    onClick={() => {
                      const video = document.getElementById('course-video') as HTMLVideoElement;
                      if (video) {
                        isPlaying ? video.pause() : video.play();
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="text-white p-4 hover:bg-white/20 rounded-full transition-all"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
                  </button>

                  {/* Forward 10s */}
                  <button 
                    onClick={() => {
                      const video = document.getElementById('course-video') as HTMLVideoElement;
                      if (video) video.currentTime = Math.min(video.duration || 9999, video.currentTime + 10);
                    }}
                    className="text-white p-3 hover:bg-white/20 rounded-full transition-all"
                    title="Forward 10s"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono">10</span>
                      <ChevronLeft className="w-6 h-6 rotate-180" />
                    </div>
                  </button>

                  {/* Progress Bar */}
                  <div 
                    className="flex-1 h-1.5 bg-zinc-700 rounded-full relative cursor-pointer mx-3"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = ((e.clientX - rect.left) / rect.width) * 100;
                      const video = document.getElementById('course-video') as HTMLVideoElement;
                      if (video && video.duration) {
                        video.currentTime = (percent / 100) * video.duration;
                      }
                    }}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  <div className="text-white font-mono text-sm hidden sm:block min-w-[48px] text-right">
                    {Math.floor(videoProgress)}%
                  </div>

                  {/* ===== VOLUME CONTROL ===== */}
                  <div className="flex items-center gap-2 group/volume">
                    <button 
                      onClick={() => {
                        const video = document.getElementById('course-video') as HTMLVideoElement;
                        if (video) {
                          video.muted = !video.muted;
                        }
                      }}
                      className="text-white p-3 hover:bg-white/20 rounded-full transition-all"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                    
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      defaultValue="1"
                      onInput={(e) => {
                        const video = document.getElementById('course-video') as HTMLVideoElement;
                        if (video) {
                          video.volume = parseFloat((e.target as HTMLInputElement).value);
                        }
                      }}
                      className="w-24 accent-blue-500 cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-all"
                    />
                  </div>

                  {/* ===== FULLSCREEN ===== */}
                  <button 
                    onClick={() => {
                      const container = document.getElementById('video-container') as HTMLElement;
                      if (!document.fullscreenElement) {
                        container.requestFullscreen().catch(console.error);
                      } else {
                        document.exitFullscreen();
                      }
                    }}
                    className="text-white p-3 hover:bg-white/20 rounded-full transition-all"
                    title="Toggle Fullscreen"
                  >
                    <Maximize className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-6 bg-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm">Next Lesson</p>
                <p className="font-medium">Coulomb's Law &amp; Electric Field</p>
              </div>

              <button 
                onClick={markLessonComplete}
                className="bg-white text-black px-8 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ====================== TEST MODAL ====================== */}
      {isTestModalOpen && currentTest && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
            
            {/* Header */}
            <div className="px-6 sm:px-10 py-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">CHAPTER TEST</p>
                <h3 className="text-2xl font-semibold">{currentTest.title}</h3>
              </div>
              
              {!isSubmitted && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <p className={`text-2xl font-mono font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-orange-600'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              )}
              
              <button onClick={closeTestModal} className="text-gray-400 hover:text-gray-600 p-2">
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              {!isSubmitted ? (
                <>
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-3">
                      <span>Question {currentQuestion + 1} of {questions.length}</span>
                      <span className="font-medium">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Done</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-full transition-all"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <p className="text-2xl font-medium leading-relaxed mb-10">
                    {questions[currentQuestion].question}
                  </p>

                  {/* Options */}
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full text-left p-5 rounded-2xl border-2 text-lg transition-all
                          ${selectedAnswers[currentQuestion] === index 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                      >
                        <span className="font-medium text-blue-600 mr-4">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                /* ==================== REVIEW SCREEN ==================== */
                <div>
                  <div className="text-center mb-10">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-4xl font-bold mb-2">Test Completed!</h2>
                    <p className="text-5xl font-semibold text-orange-600">
                      {score} / {questions.length}
                    </p>
                    <p className="text-gray-500 mt-2">
                      {Math.round((score / questions.length) * 100)}% Score
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold mb-6">Review Your Answers</h3>
                  
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="mb-8 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <p className="font-medium mb-4">{q.question}</p>
                      <div className="space-y-3">
                        {q.options.map((option, oIndex) => {
                          const isSelected = selectedAnswers[qIndex] === oIndex;
                          const isCorrect = oIndex === q.correct;
                          
                          return (
                            <div
                              key={oIndex}
                              className={`p-4 rounded-xl flex items-center gap-3 text-lg
                                ${isCorrect ? 'bg-emerald-100 dark:bg-emerald-900 border border-emerald-500' : ''}
                                ${isSelected && !isCorrect ? 'bg-red-100 dark:bg-red-900 border border-red-500' : ''}
                                ${!isSelected && !isCorrect ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + oIndex)}.
                              </span>
                              {option}
                              {isCorrect && <CheckCircle className="w-6 h-6 text-emerald-600 ml-auto" />}
                              {isSelected && !isCorrect && <X className="w-6 h-6 text-red-600 ml-auto" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isSubmitted ? (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:px-10 flex gap-4">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex-1 py-4 border rounded-2xl font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Previous
                </button>
                
                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={() => submitTest()}
                    className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-semibold text-lg hover:brightness-110"
                  >
                    Submit Test
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>
            ) : (
              <div className="border-t p-6 flex justify-center">
                <button
                  onClick={closeTestModal}
                  className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700"
                >
                  Close & Continue Learning
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}