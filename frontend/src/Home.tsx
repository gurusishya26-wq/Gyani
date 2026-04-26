// src/home.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";

import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleTranslate from "./components/GoogleTranslate";


// ==================== TRANSLATIONS ====================
const translations = {
  en: {
    logo: "LearningHub",
    navCourses: "Courses",
    navCategories: "Categories",
    navTeachers: "Teachers",
    joinNow: "Join Now",

    liveNow: "LIVE NOW",
    liveQuizTitle: "SSC Mock Test #12",
    studentsJoined: "2,340 students joined",
    mediumLevel: "Medium Level",
    left: "left",
    joinLiveQuiz: "Join Live Quiz →",

    dailyJobUpdates: "Daily Updates",
    viewAllJobs: "View All Updates",

    heroTitle1: "Master Your Future with",
    heroTitle2: "Expert-Led Learning",
    heroSubtitle: "Join 50,000+ ambitious learners. Live classes, structured courses, test series & doubt solving — all in one place.",
    startFree: "Start Learning Free",
    browseCourses: "Browse Courses",

    exploreLearningPaths: "Explore Learning Paths",
    categories: ["UPSC/IAS", "SSC CGL", "Banking Exams", "Teaching Exams", "Computer Science", "Skill Development"],

    featuredCourses: "Featured Courses",
    exploreAll: "Explore All Courses",

    meetOurExperts: "Meet Our Expert Instructors",
    whyStudentsLove: "Why Students Love LearningHub",
    whySubtitle: "Everything you need to succeed — in one beautiful platform",

    readyToTransform: "Ready to Transform Your Career?",
    joinThousands: "Join thousands of students who are already succeeding with us",
    joinToday: "Join LearningHub Today — It's Free",

    onlineTuition: "Online Tuition Classes",
    chooseSubject: "Choose your subject and class to start learning",
    mathematics: "Mathematics",
    science: "Science",
    english: "English",
    foreignLanguages: "Foreign Languages",
    computerScience: "Computer Science",
    startLearning: "Start Learning",
    exploreCourses: "Explore Language Courses",
    startCoding: "Start Coding Journey",

    empoweringDreams: "Empowering dreams through quality education.",
    platform: "Platform",
    company: "Company",
    legal: "Legal",
    followUs: "Follow Us",
    copyright: "© 2026 LearningHub. All rights reserved.",

    startFreeTrial: "Start Free Trial",
    signIn: "Sign In",
  }
};

function Home() {
  const navigate = useNavigate();

  // For class section (new UI)
const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(null);

const [selectedCompetitiveExam, setSelectedCompetitiveExam] = useState<string | null>(null);

// For modal (self-study)
const [modalClass, setModalClass] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Self-Study Modal States
  const [showSelfStudyModal, setShowSelfStudyModal] = useState(false);
  const [step, setStep] = useState(1);           // 1 = class, 2 = subject
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Higher"];

  const subjects = [
    "Mathematics", "Science", "Physics", "Chemistry", "Biology", 
    "English", "Computer Science", "AI & Robotics", "History", "Geography"
  ];
  // ==================== HANDLERS ====================
  const handleClassSelect = (cls: string) => {
    setModalClass(cls);
    setStep(2);
  };

  const handleSubjectSelect = (subject: string) => {
    if (!modalClass) return;

    // Open courses in new tab with filters
    const url = `/courses?type=self-study&class=${encodeURIComponent(modalClass)}&subject=${encodeURIComponent(subject)}`;
    window.open(url, '_blank');
    
    // Reset modal
    setShowSelfStudyModal(false);
    setStep(1);
    setModalClass(null);
  };

  const closeSelfStudyModal = () => {
    setShowSelfStudyModal(false);
    setStep(1);
    setModalClass(null);
  };

  const t = translations.en;

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ==================== AUTH FUNCTIONS ====================
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await axios.post("http://localhost:5000/api/save-user", {
        name: user.displayName,
        email: user.email
      });

      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email
      }));

      setShowModal(false);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ==================== COURSES DATA ====================
  const courses = [
    { 
      _id: "1", 
      title: "UPSC CSE 2026 - Foundation Batch",
      description: "Complete foundation with daily live classes, answer writing & full test series by ex-IAS officers.",
      coverImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
      isPaid: true, 
      price: 7999, 
      duration: "12 months",
      rating: 4.9,
      studentsEnrolled: 12400
    },
    { 
      _id: "2", 
      title: "SSC CGL 2026 - Complete Preparation",
      description: "Master Quant, English, Reasoning & GS with 500+ hours of expert content.",
      coverImageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80",
      isPaid: true, 
      price: 5499, 
      duration: "8 months",
      rating: 4.8,
      studentsEnrolled: 18500
    },
    { 
      _id: "3", 
      title: "IBPS PO & Clerk 2026 - Banking Excellence",
      description: "Specialized course for Banking Awareness, Speed Math & Current Affairs.",
      coverImageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80",
      isPaid: true, 
      price: 3999, 
      duration: "6 months",
      rating: 4.7,
      studentsEnrolled: 9800
    },
    { 
      _id: "4", 
      title: "CTET & TET Teaching Exams 2026",
      description: "Full preparation for CTET Paper 1 & 2 with focus on Pedagogy.",
      coverImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
      isPaid: false, 
      price: 0,
      duration: "4 months",
      rating: 4.9,
      studentsEnrolled: 15200
    }
  ];

  // ==================== TEACHERS DATA ====================
  const teachers = [
    { 
      _id: "t1", 
      name: "Dr. Arvind Sharma", 
      experience: "18+ years",
      bio: "Former IAS officer. Guided 800+ students into civil services.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: "Polity" }, { name: "Ethics" }] 
    },
    { 
      _id: "t2", 
      name: "Priya Malhotra", 
      experience: "12+ years",
      bio: "Ex-Bank PO and bestselling author for SSC & Banking exams.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: "Quant" }, { name: "Reasoning" }] 
    },
    { 
      _id: "t3", 
      name: "Rahul Verma", 
      experience: "15+ years",
      bio: "Current Affairs expert and popular educator.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: "Current Affairs" }] 
    },
    { 
      _id: "t4", 
      name: "Anjali Kapoor", 
      experience: "9+ years",
      bio: "CTET topper and pedagogy expert.",
      profileImage: "https://images.unsplash.com/photo-1580894732441-8d7d2d4e4e4b?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: "Pedagogy" }] 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LIVE QUIZ STRIP */}
      <div className="bg-white border-b sticky top-0 z-[60] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-inner animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              {t.liveNow}
            </div>
            <span className="font-semibold text-gray-800 text-sm md:text-base">{t.liveQuizTitle}</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <span>👥 {t.studentsJoined}</span>
            <span>🎯 {t.mediumLevel}</span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold text-lg text-red-600">
            <span>{formatTime(timeLeft)}</span>
            <span className="text-xs text-gray-500 font-normal">{t.left}</span>
          </div>

          <button 
            onClick={() => alert("Redirecting to Live Quiz...")} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-2xl font-semibold text-sm transition shadow-md active:scale-95"
          >
            {t.joinLiveQuiz}
          </button>
        </div>
      </div>

      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-[52px] z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-11 h-11 bg-[#5faae0] rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-inner">
              LH
            </div>
            <span className="font-bold text-2xl tracking-tighter text-gray-900">
              {t.logo}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-base font-medium text-gray-700">
            <a href="/courses" className="hover:text-[#5faae0] transition-colors">
              {t.navCourses}
            </a>
            
            <a href="#" className="hover:text-[#5faae0] transition-colors">
              {t.navCategories}
            </a>

            {/* Teachers link - Now scrolls to the section */}
            <a 
              href="#teachers" 
              onClick={(e) => {
                e.preventDefault();           // Prevent default jump
                const teachersSection = document.getElementById('teachers');
                if (teachersSection) {
                  teachersSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              className="hover:text-[#5faae0] transition-colors cursor-pointer"
            >
              {t.navTeachers}
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <GoogleTranslate />

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="bg-white border-2 border-[#5faae0] hover:bg-[#f0f9ff] text-[#5faae0] px-6 py-3 rounded-2xl font-semibold transition active:scale-95 whitespace-nowrap"
              >
                {t.startFreeTrial || "Start Free Trial"}
              </button>

              <button
                onClick={() => {
                  console.log("Sign In clicked");
                  // TODO: Add your Sign In logic (navigate('/login') etc.)
                }}
                className="bg-[#5faae0] hover:bg-[#4a9bd4] text-white px-6 py-3 rounded-2xl font-semibold transition active:scale-95 whitespace-nowrap"
              >
                {t.signIn || "Sign In"}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-3xl text-gray-700"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-5 flex flex-col gap-5 text-base font-medium">
            <a href="/courses" className="hover:text-[#5faae0]"> {t.navCourses}</a>
            <a href="#" className="hover:text-[#5faae0]">{t.navCategories}</a>
            
            {/* Teachers in Mobile Menu */}
            <a 
              href="#teachers"
              onClick={(e) => {
                e.preventDefault();
                const teachersSection = document.getElementById('teachers');
                if (teachersSection) {
                  teachersSection.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);        // Close menu after click
                }
              }}
              className="hover:text-[#5faae0] cursor-pointer"
            >
              {t.navTeachers}
            </a>

            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => { 
                  setShowModal(true); 
                  setIsMenuOpen(false); 
                }}
                className="bg-white border-2 border-[#5faae0] text-[#5faae0] py-3.5 rounded-2xl font-semibold"
              >
                {t.startFreeTrial || "Start Free Trial"}
              </button>

              <button 
                onClick={() => { 
                  // TODO: Add Sign In logic
                  setIsMenuOpen(false); 
                }}
                className="bg-[#5faae0] text-white py-3.5 rounded-2xl font-semibold"
              >
                {t.signIn || "Sign In"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* JOB UPDATES TICKER */}
      <div className="bg-white border-b shadow-sm py-4 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-scroll flex gap-8 text-sm font-medium text-gray-700 whitespace-nowrap">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-6">
                  <span className="font-semibold text-rose-600 whitespace-nowrap">{t.dailyJobUpdates}</span>
                  <span className="text-gray-400">•</span>
                  <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-[#5faae0] transition-colors whitespace-nowrap">SSC भर्ती 2026 – Apply Now</span>
                  <span className="text-gray-400">•</span>
                  <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-[#5faae0] transition-colors whitespace-nowrap">Railway Group D Vacancy</span>
                  <span className="text-gray-400">•</span>
                  <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-[#5faae0] transition-colors whitespace-nowrap">Bank PO 2026 Notification</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/jobs')} className="bg-[#5faae0] hover:bg-[#4a9bd4] text-white px-6 py-2.5 rounded-2xl font-medium text-sm transition active:scale-95 whitespace-nowrap">
            {t.viewAllJobs}
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#5faae0] via-[#4a9bd4] to-[#3b8ac7] text-white pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t.heroTitle1}<br />
              <span className="text-[#e7c33d]">{t.heroTitle2}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-lg">{t.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowModal(true)} 
                className="bg-white text-[#5faae0] font-semibold px-10 py-4 rounded-2xl text-lg shadow-xl hover:scale-105 transition"
              > 
                {t.startFree} 
              </button>
              <button 
                onClick={() => navigate('/courses')} 
                className="border-2 border-white font-semibold px-10 py-4 rounded-2xl text-lg hover:scale-105 transition"
              > 
                {t.browseCourses} 
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" 
              alt="Learning Platform" 
              className="rounded-3xl shadow-2xl border-8 border-white/30" 
            />
          </div>
        </div>
      </section>
      {/* ====================== LEARNING OPTIONS ====================== */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            {t.exploreLearningPaths}
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the learning path that suits you best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Self-Study Card - With Modal Flow */}
          <div 
            onClick={() => setShowSelfStudyModal(true)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer"
          >
            <div className="h-52 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <span className="text-7xl">📖</span>
            </div>
            <div className="p-8">
              <h3 className="font-semibold text-2xl text-gray-800 mb-3">Self-Study</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn at your own pace with comprehensive courses on emerging technologies like AI, Robotics, and more.
              </p>
            </div>
          </div>

          {/* Other cards remain the same (you can add onClick later if needed) */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer">
            <div className="h-52 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <span className="text-7xl">🏛️</span>
            </div>
            <div className="p-8">
              <h3 className="font-semibold text-2xl text-gray-800 mb-3">Government Exams</h3>
              <p className="text-gray-600 leading-relaxed">
                Structured preparation for competitive exams like UPSC, SSC, Banking, and more.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer">
            <div className="h-52 bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
              <span className="text-7xl">💻</span>
            </div>
            <div className="p-8">
              <h3 className="font-semibold text-2xl text-gray-800 mb-3">Online Tuition</h3>
              <p className="text-gray-600 leading-relaxed">
                Live interactive classes with experienced teachers from anywhere.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer">
            <div className="h-52 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <span className="text-7xl">🤝</span>
            </div>
            <div className="p-8">
              <h3 className="font-semibold text-2xl text-gray-800 mb-3">Get Help</h3>
              <p className="text-gray-600 leading-relaxed">
                Need guidance? Our mentors are here to help you choose the right path.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      {/* ====================== SELF STUDY MODAL ====================== */}
      {showSelfStudyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-8 py-5">
              <h3 className="text-2xl font-semibold text-gray-800">Self Study</h3>
              <button 
                onClick={closeSelfStudyModal}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              {step === 1 && (
                <div>
                  <p className="text-gray-600 mb-6 text-lg">Select your Class</p>
                  <div className="grid grid-cols-2 gap-4">
                    {classes.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => handleClassSelect(cls)}
                        className="p-6 text-left border-2 border-gray-200 rounded-2xl hover:border-[#5faae0] hover:bg-blue-50 transition-all active:scale-[0.98] font-medium text-lg"
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && modalClass && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[#5faae0] hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      ← Back
                    </button>
                    <p className="text-gray-600">
                      Class <span className="font-semibold text-gray-800">{modalClass}</span> — Choose Subject
                    </p>
                  </div>

                  <div className="space-y-3">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectSelect(subject)}
                        className="w-full p-5 text-left border border-gray-200 rounded-2xl hover:border-[#5faae0] hover:bg-indigo-50 transition-all flex justify-between items-center group"
                      >
                        <span className="font-medium text-lg">{subject}</span>
                        <span className="text-2xl text-gray-300 group-hover:text-[#5faae0] transition">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================== CLASS BASED LEARNING ====================== */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Choose Your Class
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[8, 9, 10, 11, 12].map((cls) => (
              <div
                key={cls}
                onClick={() => setSelectedClassLevel(cls)}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 active:scale-[0.98]"
              >
                <div className="h-48 bg-gradient-to-br from-[#5faae0] to-[#3b8bc2] relative overflow-hidden">
                  {/* Improved fallback image - educational Indian context */}
                  <img
                    src={`https://picsum.photos/id/${60 + cls}/600/400`}
                    alt={`Class ${cls} students studying`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  
                  <div className="absolute top-4 right-4 bg-white text-[#5faae0] font-bold text-3xl w-14 h-14 flex items-center justify-center rounded-2xl shadow-md">
                    {cls}
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Class {cls}</h3>
                  <p className="text-gray-600 text-sm">
                    Comprehensive courses designed for Class {cls} students
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECT MODAL - Expanded subjects */}
        {selectedClassLevel && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between bg-gray-50 rounded-t-3xl">
                <h3 className="text-2xl font-bold text-gray-800">
                  Subjects for Class {selectedClassLevel}
                </h3>
                <button onClick={() => setSelectedClassLevel(null)} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">
                  ×
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[65vh]">
                {[
                  { name: "Mathematics", icon: "📐" },
                  { name: "Science", icon: "🧪" },
                  { name: "English", icon: "📖" },
                  { name: "Hindi", icon: "🇮🇳" },
                  { name: "Social Science", icon: "🌍" },
                  { name: "Computer Science", icon: "💻" },
                ].map((subject) => (
                  <div
                    key={subject.name}
                    onClick={() => {
                      const url = `/courses?class=${selectedClassLevel}&subject=${subject.name.toLowerCase()}`;
                      window.open(url, "_blank");
                    }}
                    className="flex items-center gap-4 p-5 bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {subject.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800 group-hover:text-emerald-700 transition-colors">
                        {subject.name}
                      </p>
                      <p className="text-sm text-gray-500">Explore courses →</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t bg-gray-50 rounded-b-3xl flex justify-center">
                <button onClick={() => setSelectedClassLevel(null)} className="px-10 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ====================== COMPETITIVE EXAMS ====================== */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Competitive Exams
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Targeted preparation for government and banking exams with expert-curated content
          </p>

          {/* ===== EXAM CATEGORY CARDS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                id: "railway", 
                title: "Railway Exams", 
                image: "https://etimg.etb2bimg.com/photo/111281165.cms", 
                desc: "RRB NTPC, Group D, ALP & Junior Engineer" 
              },
              { 
                id: "ssc", 
                title: "SSC Exams", 
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80", 
                desc: "CGL, CHSL, MTS, CPO & Stenographer" 
              },
              { 
                id: "teaching", 
                title: "Teaching Exams", 
                image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80", 
                desc: "CTET, TET, UPTET, REET & DSSSB" 
              },
              { 
                id: "banking", 
                title: "Banking Exams", 
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDqjCOim8VZp4rNbIAj42viB4zeQuaYwpltw&s", 
                desc: "IBPS PO, Clerk, SBI PO, RBI & LIC" 
              },
            ].map((exam) => (
              <div
                key={exam.id}
                onClick={() => setSelectedCompetitiveExam(exam.id)}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 active:scale-[0.98]"
              >
                {/* Card Background Image */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={exam.image}
                    alt={exam.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold">{exam.title}</h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 text-center">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {exam.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====================== COMPETITIVE EXAM SUBJECT MODAL ====================== */}
        {selectedCompetitiveExam && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
              
              {/* Modal Header */}
              <div className="p-6 border-b flex items-center justify-between bg-gray-50 rounded-t-3xl">
                <h3 className="text-2xl font-bold text-gray-800 capitalize">
                  Subjects for {selectedCompetitiveExam} Exams
                </h3>
                <button
                  onClick={() => setSelectedCompetitiveExam(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Subjects List */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
                {[
                  { name: "English", desc: "Grammar, Vocabulary & Comprehension" },
                  { name: "Verbal Reasoning", desc: "Logical & Analytical Reasoning" },
                  { name: "Non Verbal Reasoning", desc: "Pattern, Series & Figure Analysis" },
                  { name: "Quantitative Aptitude", desc: "Maths & Data Interpretation" },
                  { name: "General Awareness", desc: "Current Affairs & GK" },
                ].map((subject) => (
                  <div
                    key={subject.name}
                    onClick={() => {
                      const url = `/courses?type=competitive&exam=${selectedCompetitiveExam}&subject=${subject.name.toLowerCase().replace(/\s+/g, '-')}`;
                      window.open(url, "_blank");
                    }}
                    className="flex items-center gap-5 p-6 bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-xl text-gray-800 group-hover:text-emerald-700 transition-colors">
                        {subject.name}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">{subject.desc}</p>
                    </div>
                    <span className="text-3xl text-gray-300 group-hover:text-emerald-600 transition">→</span>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t bg-gray-50 rounded-b-3xl text-center">
                <button
                  onClick={() => setSelectedCompetitiveExam(null)}
                  className="px-10 py-3 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      

      {/* ====================== WHY CHOOSE US ====================== */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {t.whyStudentsLove}
          </h2>
          <p className="max-w-md mx-auto text-gray-600 mb-16">{t.whySubtitle}</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎥", title: "Live + Recorded Classes", desc: "Learn in real-time or at your own pace" },
              { icon: "📝", title: "Test Series & Quizzes", desc: "Real exam pattern practice" },
              { icon: "💬", title: "Instant Doubt Solving", desc: "Get answers from experts quickly" },
              { icon: "🏆", title: "Certificates", desc: "Industry-recognized completion certificates" },
              { icon: "📱", title: "Mobile Learning", desc: "Learn anytime, anywhere" },
              { icon: "👥", title: "Community", desc: "Connect with peers and mentors" },
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="text-6xl mb-6">{f.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FINAL CTA ====================== */}
      <section className="bg-gradient-to-r from-[#5faae0] to-[#4a9bd4] py-20 md:py-28 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.readyToTransform}</h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90">{t.joinThousands}</p>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-[#e7c33d] hover:bg-yellow-400 text-gray-900 font-bold text-2xl px-16 py-6 rounded-3xl transition hover:scale-105 shadow-2xl"
          >
            {t.joinToday}
          </button>
        </div>
      </section>

      {/* ====================== ONLINE TUITION CLASSES ====================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.onlineTuition}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.chooseSubject}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Mathematics Card */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">📐</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.mathematics}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((cls) => (
                    <button 
                      key={cls} 
                      className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all"
                    >
                      {cls}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  {t.startLearning} {t.mathematics} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Science Card */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">🧪</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.science}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((cls) => (
                    <button 
                      key={cls} 
                      className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all"
                    >
                      {cls}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  {t.startLearning} {t.science} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* English Card */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">📖</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.english}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((cls) => (
                    <button 
                      key={cls} 
                      className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all"
                    >
                      {cls}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  {t.startLearning} {t.english} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Foreign Languages Card */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">🌍</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.foreignLanguages}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button 
                      key={level} 
                      className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all"
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  {t.exploreCourses} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Computer Science Card */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 lg:col-span-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-3xl">💻</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.computerScience}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Basics", "Programming", "Web Development", "Advanced Topics"].map((topic) => (
                    <button 
                      key={topic} 
                      className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  {t.startCoding} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Competitive Exams Card - Now properly matched */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 lg:col-span-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">🏆</div>
                  <h3 className="text-2xl font-bold text-gray-900">Competitive Exams</h3>
                </div>
                
                <div className="mb-8">
                  <div className="flex flex-wrap gap-3">
                    {["Banking", "SSC", "Railway", "Teaching"].map((exam) => (
                      <button 
                        key={exam}
                        onClick={() => window.open(`/courses?type=competitive&exam=${exam.toLowerCase()}`, "_blank")}
                        className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all"
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  onClick={() => window.open(`/courses?type=competitive`, "_blank")}
                >
                  Explore All Competitive Exams <span className="text-xl">→</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================== TOP INSTRUCTORS ====================== */}
      <section id="teachers" className="max-w-6xl mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          {t.meetOurExperts}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher) => (
            <div 
              key={teacher._id} 
              className="bg-white rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img 
                  src={teacher.profileImage} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-bold text-2xl text-gray-800">{teacher.name}</h3>
              <p className="text-[#5faae0] font-medium">{teacher.experience}</p>
              <p className="text-sm text-gray-500 mt-1">
                {teacher.subjects.map(s => s.name).join(" • ")}
              </p>
              <p className="mt-6 text-gray-600 text-sm line-clamp-3">{teacher.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            <div>
              <h3 className="text-white text-2xl font-bold mb-4">{t.logo}</h3>
              <p className="text-sm">{t.empoweringDreams}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.platform}</h4>
              <ul className="space-y-2 text-sm">
                <li>{t.navCourses}</li>
                <li>Live Classes</li>
                <li>Test Series</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.company}</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.followUs}</h4>
              <div className="flex gap-5 text-2xl">𝕏 📘 📷 ▶️</div>
            </div>
          </div>
          <div className="text-center text-sm mt-16 border-t border-gray-800 pt-8">
            {t.copyright}
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20ba5a] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 z-50"
      >
        <span className="text-3xl">💬</span>
      </a>

      {/* LOGIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Welcome to LearningHub</h2>
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 py-3.5 rounded-2xl font-medium mb-6"
              >
                Continue with Google
              </button>
              <div className="text-center text-sm text-gray-500">
                More login options coming soon...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<div className="p-20 text-center text-3xl">Courses Page Coming Soon...</div>} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;