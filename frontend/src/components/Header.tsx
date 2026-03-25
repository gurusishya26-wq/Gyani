// src/components/Header.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-[#5faae0] rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-inner">
            LH
          </div>
          <span className="font-bold text-2xl tracking-tighter text-gray-900 dark:text-white">LearningHub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
          <a href="/" className="hover:text-[#5faae0] transition-colors">Home</a>
          <a href="/courses" className="hover:text-[#5faae0] transition-colors">Courses</a>
          <a href="#" className="hover:text-[#5faae0] transition-colors">Categories</a>
          <a href="#" className="hover:text-[#5faae0] transition-colors">Teachers</a>
          <a href="#" className="hover:text-[#5faae0] transition-colors">About</a>
        </nav>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-md mx-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses, exams, skills..."
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-5 pl-12 focus:outline-none focus:border-[#5faae0] text-sm"
            />
            <span className="absolute left-5 top-4 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/login')}
            className="hidden md:block px-6 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:text-[#5faae0] transition"
          >
            Log in
          </button>
          
          <button
            onClick={() => navigate('/teacher/signup')}
            className="bg-[#5faae0] hover:bg-[#4a9bd4] text-white px-8 py-2.5 rounded-2xl font-semibold transition shadow-sm"
          >
            Sign up free
          </button>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-3xl text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t px-6 py-8 space-y-6 text-lg">
          <a href="/" className="block py-2">Home</a>
          <a href="/courses" className="block py-2">Courses</a>
          <a href="#" className="block py-2">Categories</a>
          <a href="#" className="block py-2">Teachers</a>
          <a href="#" className="block py-2">About</a>
          <div className="pt-6 border-t">
            <button onClick={() => navigate('/admin/login')} className="block w-full py-3 text-left">Log in</button>
            <button 
              onClick={() => navigate('/teacher/signup')}
              className="w-full bg-[#5faae0] text-white py-4 rounded-2xl font-semibold mt-3"
            >
              Sign up free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}