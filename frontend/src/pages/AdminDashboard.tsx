// src/pages/AdminDashboard.tsx
import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import {
  FaHome,
  FaBookMedical,
  FaBriefcase,
  FaChalkboardTeacher,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simple auth protection
  if (!auth.currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      name: 'Home',
      icon: FaHome,
      path: '/admin/dashboard',
    },
    {
      name: 'Create Course',
      icon: FaBookMedical,
      path: '/admin/create-course',
    },
    {
      name: 'Add Job Details',
      icon: FaBriefcase,
      path: '/admin/add-job',
    },
    {
      name: 'Course Management',
      icon: FaChalkboardTeacher,
      path: '/admin/courses',
    },
    {
      name: 'Show Teachers',
      icon: FaChalkboardTeacher,
      path: '/admin/teachers',
    },
    {
      name: 'Show Students',
      icon: FaUsers,
      path: '/admin/students',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Site Name */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                LearningHub
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
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

          {/* Logout */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 lg:hidden z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10">
            Admin Dashboard
          </h1>

          {/* Dashboard content cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
                Total Courses
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Create your first course
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">
                Registered Teachers
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Review teacher profiles
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-teal-700 dark:text-teal-400">
                Active Students
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Monitor student activity
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-amber-700 dark:text-amber-400">
                Pending Jobs
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                New job postings waiting
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/admin/create-course"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                Create New Course
              </Link>
              <Link
                to="/admin/add-job"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Add Job Details
              </Link>
              <Link
                to="/admin/courses"
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Manage Courses
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}