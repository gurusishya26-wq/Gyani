// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // adjust path if needed
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  FaHome,
  FaVideo,
  FaBook,
  FaQuestionCircle,
  FaHistory,
  FaGraduationCap,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Checking authentication...
        </div>
      </div>
    );
  }

  // Redirect to home if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/dashboard' },
    { name: 'Live Classes', icon: FaVideo, path: '/dashboard/live-classes' },
    { name: 'Test Series', icon: FaBook, path: '/dashboard/tests' },
    { name: 'Free Quizzes', icon: FaQuestionCircle, path: '/dashboard/free-quizzes' },
    { name: 'Attempted Tests', icon: FaHistory, path: '/dashboard/attempted-tests' },
    { name: 'Exam', icon: FaGraduationCap, path: '/dashboard/exam' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar – Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Site Name */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                LearningHub
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Education Platform
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="text-xl" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout at bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-700 dark:text-gray-300"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Overlay when sidebar is open on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 lg:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Welcome to Dashboard
          </h1>

          {/* Example dashboard content – replace with your real components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
                Upcoming Live Classes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No classes scheduled yet.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">
                Recent Test Results
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start a free quiz to see your performance.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-400">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/attempt')}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Start Free Quiz
                </button>
                <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                  View All Tests
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}