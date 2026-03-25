import { NavLink } from 'react-router-dom';
import { BookOpen, FileText, Video, LayoutDashboard, LogOut } from 'lucide-react'; // npm install lucide-react

const TeacherSidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transform transition-transform lg:translate-x-0">
      <div className="flex h-16 items-center justify-center border-b dark:border-gray-800">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Teacher Panel
        </h1>
      </div>

      <nav className="mt-6 px-4 space-y-1">
        <NavLink
          to="/teacher/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition ${
              isActive ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium' : ''
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard Overview
        </NavLink>

        <NavLink
          to="/admin/create-course"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition ${
              isActive ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium' : ''
            }`
          }
        >
          <BookOpen className="w-5 h-5 mr-3" />
          Create New Course
        </NavLink>

        <NavLink
          to="/create-test"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition ${
              isActive ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium' : ''
            }`
          }
        >
          <FileText className="w-5 h-5 mr-3" />
          Create Test / Quiz
        </NavLink>

        <NavLink
          to="/teacher/conduct-class"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition ${
              isActive ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium' : ''
            }`
          }
        >
          <Video className="w-5 h-5 mr-3" />
          Conduct Online Class
        </NavLink>
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <button className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;