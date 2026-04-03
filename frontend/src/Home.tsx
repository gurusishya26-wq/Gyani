// src/home.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";

import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";


type Course = {
  _id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  isPaid: boolean;
  price?: number;
  duration?: string;
  rating?: number;
};

type Teacher = {
  _id: string;
  name: string;
  experience: string;
  bio: string;
  profileImage?: string;
  subjects: { name: string }[];
};



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
    viewAllJobs: "View All Jobs",

    heroTitle1: "Master Your Future with",
    heroTitle2: "Expert-Led Learning",
    heroSubtitle: "Join 50,000+ ambitious learners. Live classes, structured courses, test series & doubt solving — all in one place.",
    startFree: "Start Learning Free",
    browseCourses: "Browse Courses",

    exploreLearningPaths: "Explore Learning Paths",
    categories: ["UPSC/IAS", "SSC CGL", "Banking Exams", "Teaching Exams", "Computer Science", "Skill Development"],

    featuredCourses: "Featured Courses",
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
  },

  hi: {
    logo: "लर्निंगहब",
    navCourses: "कोर्स",
    navCategories: "श्रेणियाँ",
    navTeachers: "शिक्षक",
    joinNow: "अभी जुड़ें",

    liveNow: "लाइव",
    liveQuizTitle: "SSC मॉक टेस्ट #12",
    studentsJoined: "2,340 छात्र जुड़े",
    mediumLevel: "मध्यम स्तर",
    left: "बाकी",
    joinLiveQuiz: "लाइव क्विज़ में शामिल हों →",

    dailyJobUpdates: "दैनिक नौकरी अपडेट्स",
    viewAllJobs: "सभी नौकरियाँ देखें",

    heroTitle1: "अपने भविष्य को",
    heroTitle2: "विशेषज्ञ शिक्षण के साथ संवारें",
    heroSubtitle: "50,000+ महत्वाकांक्षी छात्रों के साथ जुड़ें। लाइव क्लासेस, संरचित कोर्स, टेस्ट सीरीज़ और डाउट सॉल्विंग — सब एक जगह।",
    startFree: "मुफ्त सीखना शुरू करें",
    browseCourses: "कोर्स ब्राउज़ करें",

    exploreLearningPaths: "लर्निंग पाथ्स एक्सप्लोर करें",
    categories: ["UPSC/IAS", "SSC CGL", "बैंकिंग परीक्षाएँ", "टीचिंग परीक्षाएँ", "कंप्यूटर साइंस", "स्किल डेवलपमेंट"],

    featuredCourses: "फीचर्ड कोर्स",
    meetOurExperts: "हमारे विशेषज्ञ शिक्षकों से मिलें",
    whyStudentsLove: "छात्र LearningHub को क्यों पसंद करते हैं",
    whySubtitle: "सफलता के लिए आपको जो कुछ भी चाहिए — एक ही खूबसूरत प्लेटफॉर्म में",

    readyToTransform: "अपनी करियर को बदलने के लिए तैयार हैं?",
    joinThousands: "हजारों छात्रों के साथ जुड़ें जो पहले से ही सफल हो रहे हैं",
    joinToday: "आज ही LearningHub जॉइन करें — यह फ्री है",

    onlineTuition: "ऑनलाइन ट्यूशन क्लासेस",
    chooseSubject: "अपना विषय और क्लास चुनें और सीखना शुरू करें",
    mathematics: "गणित",
    science: "विज्ञान",
    english: "अंग्रेजी",
    foreignLanguages: "विदेशी भाषाएँ",
    computerScience: "कंप्यूटर साइंस",
    startLearning: "सीखना शुरू करें",
    exploreCourses: "भाषा कोर्स एक्सप्लोर करें",
    startCoding: "कोडिंग यात्रा शुरू करें",

    empoweringDreams: "गुणवत्तापूर्ण शिक्षा के माध्यम से सपनों को सशक्त बनाना।",
    platform: "प्लेटफॉर्म",
    company: "कंपनी",
    legal: "कानूनी",
    followUs: "हमें फॉलो करें",
    copyright: "© 2026 LearningHub. सर्वाधिकार सुरक्षित।",
  }
};

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const t = translations[language];

  // ✅ FUNCTION GOES HERE (inside component)
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

    // 🚀 REDIRECT
    navigate("/dashboard");

  } catch (error: any) {
    alert(error.message);
  }
};


  const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/login", {
      email,
      password
    });

    // Save token (optional)
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login successful");

    setShowModal(false);

    // 🚀 REDIRECT
    navigate("/dashboard");

  } catch (error: any) {
    alert(error.response?.data?.msg || "Login failed");
  }
};

const handleRegister = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/register", {
      name,
      email,
      password
    });

    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Registration successful");

    setShowModal(false);

    // 🚀 REDIRECT
    navigate("/dashboard");

  } catch (error: any) {
    alert(error.response?.data?.msg || "Register failed");
  }
};


  // Countdown
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

  const courses: Course[] = [
    { _id: "1", title: language === 'en' ? "UPSC CSE 2026 - Foundation Batch" : "UPSC CSE 2026 - फाउंडेशन बैच",
      description: language === 'en' ? "Complete foundation with daily live classes, answer writing & full test series." : "दैनिक लाइव क्लासेस, उत्तर लेखन और पूर्ण टेस्ट सीरीज़ के साथ पूरा फाउंडेशन।",
      coverImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80", isPaid: true, price: 7999, duration: language === 'en' ? "12 months" : "12 महीने", rating: 4.9 },
    { _id: "2", title: language === 'en' ? "SSC CGL 2026 - Complete Preparation" : "SSC CGL 2026 - पूर्ण तैयारी",
      description: language === 'en' ? "Master Quant, English, Reasoning & GS with 500+ hours of expert content." : "क्वांट, इंग्लिश, रीजनिंग और GS में महारत हासिल करें।",
      coverImageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80", isPaid: true, price: 5499, duration: language === 'en' ? "8 months" : "8 महीने", rating: 4.8 },
    { _id: "3", title: language === 'en' ? "Banking Awareness + IBPS PO/Clerk" : "बैंकिंग अवेयरनेस + IBPS PO/Clerk",
      description: language === 'en' ? "Specialized course for current banking news and speed mathematics." : "वर्तमान बैंकिंग न्यूज़ और स्पीड गणित के लिए विशेष कोर्स।",
      coverImageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80", isPaid: true, price: 3999, duration: language === 'en' ? "6 months" : "6 महीने", rating: 4.7 },
    { _id: "4", title: language === 'en' ? "CTET & TET Teaching Exams 2026" : "CTET & TET टीचिंग एग्जाम 2026",
      description: language === 'en' ? "Full preparation for CTET Paper 1 & 2 with pedagogy focus." : "CTET पेपर 1 और 2 की पूरी तैयारी।",
      coverImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80", isPaid: false, duration: language === 'en' ? "4 months" : "4 महीने", rating: 4.9 },
  ];

  const teachers: Teacher[] = [
    { _id: "t1", name: "Dr. Arvind Sharma", experience: language === 'en' ? "18+ years" : "18+ वर्ष",
      bio: language === 'en' ? "Former IAS officer. Guided 800+ students into civil services." : "पूर्व IAS अधिकारी। 800+ छात्रों को सिविल सर्विसेज में सफलता दिलाई।",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: language === 'en' ? "Polity" : "राजनीति" }, { name: language === 'en' ? "Ethics" : "नैतिकता" }] },
    { _id: "t2", name: "Priya Malhotra", experience: language === 'en' ? "12+ years" : "12+ वर्ष",
      bio: language === 'en' ? "Ex-Bank PO and bestselling author for SSC & Banking exams." : "पूर्व बैंक PO और SSC एवं बैंकिंग परीक्षाओं की बेस्टसेलिंग लेखिका।",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: language === 'en' ? "Quant" : "क्वांट" }, { name: language === 'en' ? "Reasoning" : "रीजनिंग" }] },
    { _id: "t3", name: "Rahul Verma", experience: language === 'en' ? "15+ years" : "15+ वर्ष",
      bio: language === 'en' ? "Current Affairs expert and popular educator." : "करंट अफेयर्स विशेषज्ञ और लोकप्रिय शिक्षक।",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: language === 'en' ? "Current Affairs" : "करंट अफेयर्स" }] },
    { _id: "t4", name: "Anjali Kapoor", experience: language === 'en' ? "9+ years" : "9+ वर्ष",
      bio: language === 'en' ? "CTET topper and pedagogy expert." : "CTET टॉपर और पेडागॉजी विशेषज्ञ।",
      profileImage: "https://images.unsplash.com/photo-1580894732441-8d7d2d4e4e4b?auto=format&fit=crop&q=80&w=400",
      subjects: [{ name: language === 'en' ? "Pedagogy" : "शिक्षाशास्त्र" }] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ====================== LIVE QUIZ STRIP ====================== */}
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

      {/* ====================== HEADER ====================== */}
      <header className="bg-white shadow-sm sticky top-[52px] z-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 bg-[#5faae0] rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-inner">LH</div>
            <span className="font-bold text-2xl tracking-tighter text-gray-900">{t.logo}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-base font-medium text-gray-700">
            <a href="/courses" className="hover:text-[#5faae0] transition">{t.navCourses}</a>
            <a href="#" className="hover:text-[#5faae0] transition">{t.navCategories}</a>
            <a href="#" className="hover:text-[#5faae0] transition">{t.navTeachers}</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex border border-gray-300 rounded-2xl overflow-hidden text-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 transition ${language === 'en' ? 'bg-[#5faae0] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-4 py-2 transition ${language === 'hi' ? 'bg-[#5faae0] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                हिंदी
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="hidden md:block bg-[#5faae0] hover:bg-[#4a9bd4] text-white px-8 py-3 rounded-2xl font-semibold transition active:scale-95"
            >
              {t.joinNow}
            </button>

            {/* Mobile Menu Button */}
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
            <a href="/courses" className="hover:text-[#5faae0]">{t.navCourses}</a>
            <a href="#" className="hover:text-[#5faae0]">{t.navCategories}</a>
            <a href="#" className="hover:text-[#5faae0]">{t.navTeachers}</a>
            <button 
              onClick={() => { setShowModal(true); setIsMenuOpen(false); }}
              className="bg-[#5faae0] text-white py-3.5 rounded-2xl font-semibold mt-2"
            >
              {t.joinNow}
            </button>
          </div>
        )}
      </header>

      {/* ====================== JOB UPDATES TICKER ====================== */}
      <div className="bg-white border-b shadow-sm py-4 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-scroll flex gap-8 text-sm font-medium text-gray-700 whitespace-nowrap">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-6">
                  <span className="font-semibold text-gray-800 whitespace-nowrap">{t.dailyJobUpdates}</span>
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
          <button
            onClick={() => navigate('/jobs')}
            className="bg-[#5faae0] hover:bg-[#4a9bd4] text-white px-6 py-2.5 rounded-2xl font-medium text-sm transition active:scale-95 whitespace-nowrap"
          >
            {t.viewAllJobs}
          </button>
        </div>
      </div>

      {/* ====================== HERO SECTION ====================== */}
      <section className="bg-gradient-to-br from-[#5faae0] via-[#4a9bd4] to-[#3b8ac7] text-white pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t.heroTitle1}<br />
              <span className="text-[#e7c33d]">{t.heroTitle2}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-lg">{t.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowModal(true)} className="bg-white text-[#5faae0] font-semibold px-10 py-4 rounded-2xl text-lg shadow-xl hover:scale-105 transition"> {t.startFree} </button>
              <button onClick={() => navigate('/courses')} className="border-2 border-white font-semibold px-10 py-4 rounded-2xl text-lg hover:scale-105 transition"> {t.browseCourses} </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" alt="Learning Platform" className="rounded-3xl shadow-2xl border-8 border-white/30" />
          </div>
        </div>
      </section>

      {/* ====================== CATEGORIES ====================== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">{t.exploreLearningPaths}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {t.categories.map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border border-gray-100">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="font-semibold text-xl text-gray-800">{cat}</h3>
              <p className="text-gray-500 mt-2">50+ {language === 'en' ? 'courses' : 'कोर्स'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== FEATURED COURSES ====================== */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">{t.featuredCourses}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, i) => (
              <div 
                key={course._id} 
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div className="relative h-52">
                  <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className={`absolute top-4 right-4 px-4 py-1 text-xs font-bold rounded-2xl ${course.isPaid ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {course.isPaid ? `₹${course.price}` : language === 'en' ? 'FREE' : 'मुफ्त'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl line-clamp-2 mb-3">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-5">{course.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-amber-500">★ {course.rating}</div>
                    <span className="text-gray-500">{course.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== TOP INSTRUCTORS ====================== */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">{t.meetOurExperts}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, i) => (
            <div key={teacher._id} className="bg-white rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img src={teacher.profileImage} alt={teacher.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-2xl text-gray-800">{teacher.name}</h3>
              <p className="text-[#5faae0] font-medium">{teacher.experience}</p>
              <p className="text-sm text-gray-500 mt-1">{teacher.subjects.map(s => s.name).join(" • ")}</p>
              <p className="mt-6 text-gray-600 text-sm line-clamp-3">{teacher.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== WHY CHOOSE US ====================== */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{t.whyStudentsLove}</h2>
          <p className="max-w-md mx-auto text-gray-600 mb-16">{t.whySubtitle}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎥", title: language === 'en' ? "Live + Recorded Classes" : "लाइव + रिकॉर्डेड क्लासेस", desc: language === 'en' ? "Learn in real-time or at your own pace" : "रियल-टाइम या अपनी गति से सीखें" },
              { icon: "📝", title: language === 'en' ? "Test Series & Quizzes" : "टेस्ट सीरीज़ और क्विज़", desc: language === 'en' ? "Real exam pattern practice" : "वास्तविक परीक्षा पैटर्न का अभ्यास" },
              { icon: "💬", title: language === 'en' ? "Instant Doubt Solving" : "तुरंत डाउट सॉल्विंग", desc: language === 'en' ? "Get answers from experts quickly" : "विशेषज्ञों से तुरंत जवाब पाएं" },
              { icon: "🏆", title: language === 'en' ? "Certificates" : "सर्टिफिकेट", desc: language === 'en' ? "Industry-recognized completion certificates" : "उद्योग मान्यता प्राप्त सर्टिफिकेट" },
              { icon: "📱", title: language === 'en' ? "Mobile Learning" : "मोबाइल लर्निंग", desc: language === 'en' ? "Learn anytime, anywhere" : "कहीं भी, कभी भी सीखें" },
              { icon: "👥", title: language === 'en' ? "Community" : "समुदाय", desc: language === 'en' ? "Connect with peers and mentors" : "साथियों और मेंटर्स से जुड़ें" },
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
          <button onClick={() => setShowModal(true)} className="bg-[#e7c33d] hover:bg-yellow-400 text-gray-900 font-bold text-2xl px-16 py-6 rounded-3xl transition hover:scale-105 shadow-2xl">
            {t.joinToday}
          </button>
        </div>
      </section>

      {/* ====================== ONLINE TUITION CLASSES - COMPLETE ====================== */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{t.onlineTuition}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.chooseSubject}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mathematics */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">📐</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.mathematics}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Competitive Exams"].map((cls) => (
                    <button key={cls} className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all">
                      {cls}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                  {t.startLearning} {t.mathematics} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Science */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">🧪</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.science}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Competitive Exams"].map((cls) => (
                    <button key={cls} className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all">
                      {cls}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                  {t.startLearning} {t.science} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* English */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">📖</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.english}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Competitive Exams"].map((cls) => (
                    <button key={cls} className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all">
                      {cls}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                  {t.startLearning} {t.english} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Foreign Languages */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">🌍</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.foreignLanguages}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button key={level} className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all">
                      {level}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                  {t.exploreCourses} <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Computer Science */}
            <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <div className="h-2 bg-gradient-to-r from-[#5faae0] to-[#4a9bd4]"></div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-3xl">💻</div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.computerScience}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Basics", "Programming", "Web Development", "Advanced Topics"].map((topic) => (
                    <button key={topic} className="px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-[#5faae0] hover:text-white text-gray-700 rounded-full transition-all">
                      {topic}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                  {t.startCoding} <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </div>
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
              <ul className="space-y-2 text-sm"><li>{t.navCourses}</li><li>Live Classes</li><li>Test Series</li></ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.company}</h4>
              <ul className="space-y-2 text-sm"><li>About Us</li><li>Careers</li><li>Contact</li></ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t.legal}</h4>
              <ul className="space-y-2 text-sm"><li>Privacy</li><li>Terms</li></ul>
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

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20ba5a] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 z-50">
        <span className="text-3xl">💬</span>
      </a>

      
      {/* ====================== LOGIN / REGISTER MODAL ====================== */}
    {showModal && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scaleIn">
        
        {/* Tabs */}
        <div className="flex border-b">
            <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-5 text-lg font-semibold transition ${
                activeTab === 'login'
                ? 'text-[#5faae0] border-b-4 border-[#5faae0]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            >
            {language === 'en' ? 'Login' : 'लॉगिन'}
            </button>
            <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-5 text-lg font-semibold transition ${
                activeTab === 'register'
                ? 'text-[#5faae0] border-b-4 border-[#5faae0]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            >
            {language === 'en' ? 'Register' : 'रजिस्टर'}
            </button>
        </div>

        <div className="p-8">
            {activeTab === 'login' ? (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center">
                {language === 'en' ? 'Welcome Back' : 'वापस स्वागत है'}
                </h3>

                {/* Google Login */}
                <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 px-5 border border-gray-300 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.2-.99 2.23-2.08 2.9v3.02h3.37c1.97-1.81 3.1-4.48 3.1-7.68z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.37-2.6c-.93.63-2.12 1-3.91 1-3 0-5.55-2.03-6.46-4.75H1.93v2.98C3.74 20.87 7.6 23 12 23z" />
                    <path fill="#FBBC05" d="M5.54 13.99c-.3-.9-.47-1.85-.47-2.83s.17-1.93.47-2.83V7.18H1.93C1.34 8.66.99 10.3.99 12s.35 3.34.94 4.82l3.61-2.83z" />
                    <path fill="#EA4335" d="M12 4.5c1.69 0 3.22.59 4.42 1.74l3.3-3.3C17.46 1.68 14.97.99 12 .99 7.6.99 3.74 3.12 1.93 7.18L5.54 9.99c.91-2.72 3.46-4.75 6.46-4.75z" />
                </svg>
                <span>{language === 'en' ? 'Continue with Google' : 'गूगल से जारी रखें'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-400 font-medium">
                    {language === 'en' ? 'or' : 'या'}
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Email Login */}
                <div className="space-y-4">
                <input
                type="email"
                placeholder={language === 'en' ? "Email Address" : "ईमेल पता"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#5faae0] text-base"
                />

                <input
                type="password"
                placeholder={language === 'en' ? "Password" : "पासवर्ड"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#5faae0] text-base"
                />
                <button
                onClick={handleLogin}
                className="w-full bg-[#5faae0] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-[#4a9bd4] transition"
                >
                {language === 'en' ? 'Login' : 'लॉगिन करें'}
                </button>
                </div>
            </div>
            ) : (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center">
                {language === 'en' ? 'Create New Account' : 'नया खाता बनाएँ'}
                </h3>

                {/* Sign up with email */}
                <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Sign up with email' : 'ईमेल से साइन अप करें'}
                </p>

                <input
                type="text"
                placeholder={language === 'en' ? "Full Name" : "पूरा नाम"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300"
                />

                <input
                type="email"
                placeholder={language === 'en' ? "Email Address" : "ईमेल पता"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300"
                />

                <input
                type="password"
                placeholder={language === 'en' ? "Password" : "पासवर्ड"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300"
                />

                <button
                onClick={handleRegister}
                className="w-full bg-[#5faae0] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-[#4a9bd4] transition"
                >
                {language === 'en' ? 'Continue' : 'जारी रखें'}
                </button>
                </div>

                {/* Other sign up options */}
                <div>
                <p className="text-center text-sm font-medium text-gray-400 mb-3">
                    {language === 'en' ? 'Other sign up options' : 'अन्य साइन अप विकल्प'}
                </p>

                <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 px-5 border border-gray-300 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors"
                > 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.2-.99 2.23-2.08 2.9v3.02h3.37c1.97-1.81 3.1-4.48 3.1-7.68z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.37-2.6c-.93.63-2.12 1-3.91 1-3 0-5.55-2.03-6.46-4.75H1.93v2.98C3.74 20.87 7.6 23 12 23z" />
                    <path fill="#FBBC05" d="M5.54 13.99c-.3-.9-.47-1.85-.47-2.83s.17-1.93.47-2.83V7.18H1.93C1.34 8.66.99 10.3.99 12s.35 3.34.94 4.82l3.61-2.83z" />
                    <path fill="#EA4335" d="M12 4.5c1.69 0 3.22.59 4.42 1.74l3.3-3.3C17.46 1.68 14.97.99 12 .99 7.6.99 3.74 3.12 1.93 7.18L5.54 9.99c.91-2.72 3.46-4.75 6.46-4.75z" />
                    </svg>
                    <span>{language === 'en' ? 'Google' : 'गूगल'}</span>
                </button>
                </div>

                {/* Terms */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t">
                {language === 'en' 
                    ? 'By signing up, you agree to our Terms of Use and Privacy Policy.'
                    : 'साइन अप करके, आप हमारे उपयोग की शर्तों और गोपनीयता नीति से सहमत होते हैं।'
                }
                <br />
                <span className="mt-3 block">
                    {language === 'en' ? 'Already have an account?' : 'पहले से ही खाता है?'}{' '}
                    <button
                    onClick={() => setActiveTab('login')}
                    className="text-[#5faae0] font-semibold hover:underline"
                    >
                    {language === 'en' ? 'Log in' : 'लॉगिन करें'}
                    </button>
                </span>
                </div>
            </div>
            )}
        </div>

        {/* Close Button */}
        <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600 transition"
        >
            ✕
        </button>
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