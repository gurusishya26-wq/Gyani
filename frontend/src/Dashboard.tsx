'use client';
import MyCourses from "./components/MyCourses";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { 
  Home, BookOpen, Video, ClipboardList, Award, 
  MessageCircle, User, LogOut, Bell, Calendar,
  PlayCircle, ChevronLeft, ChevronRight 
} from "lucide-react";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [language, setLanguage] = useState<"en" | "hi">("en");

     useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
  // Clear stored data
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Redirect to login page
  navigate("/login");
};

  const translations = {
    en: {
      greeting: (name: string) => `Good Morning, ${name} 👋`,
      welcome: "Here's what's happening with your studies today",
      continueLearning: "Continue Learning",
      upcomingClasses: "Upcoming Classes",
      assignments: "Assignments",
      performance: "Performance",
    },
    hi: {
      greeting: (name: string) => `शुभ प्रभात, ${name} 👋`,
      welcome: "आज आपके अध्ययन में क्या हो रहा है",
      continueLearning: "सीखना जारी रखें",
      upcomingClasses: "आगामी कक्षाएं",
      assignments: "असाइनमेंट्स",
      performance: "प्रदर्शन",
    }
  };

  const t = translations[language];

  const courses = [
    { 
      id: 1, 
      title: "Class 12 Physics", 
      progress: 72, 
      lastAccessed: "2 hours ago",
      thumbnail: "⚡" 
    },
    { 
      id: 2, 
      title: "Class 12 Mathematics", 
      progress: 45, 
      lastAccessed: "Yesterday",
      thumbnail: "📐" 
    },
  ];

  const upcomingClasses = [
    {
      subject: "Chemistry",
      time: "10:30 AM - 11:30 AM",
      teacher: "Mrs. Priya Sharma",
      isLive: true,
      link: "#"
    },
    {
      subject: "English",
      time: "02:00 PM - 03:00 PM",
      teacher: "Mr. Rajesh Kumar",
      isLive: false,
      link: "#"
    },
  ];

  const assignments = [
    { 
      title: "Chemical Reactions Worksheet", 
      subject: "Chemistry", 
      due: "Tomorrow", 
      status: "pending" 
    },
    { 
      title: "Vector Algebra Assignment", 
      subject: "Mathematics", 
      due: "Mar 28", 
      status: "late" 
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            S
          </div>
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-xl">Learning Hub</h2>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { name: "Dashboard", icon: Home, id: "dashboard" },
            { name: "My Courses", icon: BookOpen, id: "courses" },
            { name: "Live Classes", icon: Video, id: "live" },
            { name: "Assignments", icon: ClipboardList, id: "assignments" },
            { name: "Tests & Quizzes", icon: Award, id: "tests" },
            { name: "Results", icon: Award, id: "results" },
            { name: "Messages", icon: MessageCircle, id: "messages" },
            { name: "Certificates", icon: Award, id: "certificates" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                ${activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            🌐 {language === 'en' ? 'हिंदी में देखें' : 'Switch to English'}
          </button>
          
          <button
        onClick={handleLogout}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl text-sm font-medium"
        >
        <LogOut className="w-4 h-4" />
        {sidebarOpen && "Logout"}
        </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navbar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user?.name ? t.greeting(user.name) : "Welcome 👋"}
            </h1>
            <p className="text-gray-500 text-sm">{t.welcome}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-500">
              Thursday, March 26, 2026
            </div>

            <div className="relative">
              <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">
                {user?.name || "Guest User"}
                </p>
                
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto">
        {activeTab === "dashboard" && (
            <>
            {/* YOUR EXISTING DASHBOARD CONTENT HERE */}
            {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Enrolled Courses", value: "6", color: "blue" },
              { label: "Pending Assignments", value: "3", color: "amber" },
              { label: "Upcoming Tests", value: "2", color: "rose" },
              { label: "Attendance", value: "94%", color: "emerald" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className={`text-4xl font-bold mt-3 text-${stat.color}-600`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Continue Learning */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-semibold">{t.continueLearning}</h2>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View all courses →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 hover:shadow-xl transition-all group">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-4xl">
                      {course.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Last accessed {course.lastAccessed}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-medium flex items-center gap-2 w-full justify-center group-hover:scale-105 transition-transform">
                        <PlayCircle className="w-4 h-4" />
                        Resume Learning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes & Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Classes */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                {t.upcomingClasses}
              </h2>
              
              <div className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{cls.subject}</p>
                        <p className="text-gray-500 text-sm">{cls.teacher}</p>
                      </div>
                      <div className={`px-4 py-1 rounded-full text-xs font-medium ${cls.isLive ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {cls.time}
                      </div>
                    </div>
                    
                    <button 
                      className={`mt-6 w-full py-3 rounded-2xl font-medium text-sm transition-all ${cls.isLive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'}`}
                    >
                      {cls.isLive ? "🔴 Join Live Class Now" : "Set Reminder"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">{t.assignments}</h2>
              
              <div className="space-y-4">
                {assignments.map((assignment, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-gray-500">{assignment.subject} • Due {assignment.due}</p>
                    </div>
                    <div className={`px-5 py-2 rounded-2xl text-xs font-medium
                      ${assignment.status === 'late' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {assignment.status === 'late' ? 'Late' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </>
        )}

        {activeTab === "courses" && <MyCourses />}
        </div>
      </div>
    </div>
  );
}