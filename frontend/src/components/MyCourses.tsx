'use client';
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { 
  PlayCircle, Clock, Users, Award, 
  Search, Filter, Grid3X3, List 
} from "lucide-react";

export default function MyCourses() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
  const navigate = useNavigate();
  const courses = [
    {
      id: 1,
      title: "Class 12 Physics",
      subject: "Physics",
      instructor: "Dr. Rajesh Sharma",
      progress: 78,
      totalLessons: 48,
      completedLessons: 37,
      duration: "6 weeks",
      thumbnail: "⚡",
      color: "from-blue-500 to-cyan-500",
      lastAccessed: "2 hours ago",
      status: "in-progress"
    },
    {
      id: 2,
      title: "Class 12 Mathematics",
      subject: "Mathematics",
      instructor: "Prof. Anjali Mehta",
      progress: 45,
      totalLessons: 62,
      completedLessons: 28,
      duration: "8 weeks",
      thumbnail: "📐",
      color: "from-purple-500 to-violet-600",
      lastAccessed: "Yesterday",
      status: "in-progress"
    },
    {
      id: 3,
      title: "Class 12 Chemistry",
      subject: "Chemistry",
      instructor: "Mrs. Priya Singh",
      progress: 92,
      totalLessons: 45,
      completedLessons: 41,
      duration: "6 weeks",
      thumbnail: "🧪",
      color: "from-emerald-500 to-teal-600",
      lastAccessed: "3 days ago",
      status: "in-progress"
    },
    {
      id: 4,
      title: "English Literature & Grammar",
      subject: "English",
      instructor: "Mr. Vikram Rao",
      progress: 100,
      totalLessons: 32,
      completedLessons: 32,
      duration: "4 weeks",
      thumbnail: "📖",
      color: "from-amber-500 to-orange-600",
      lastAccessed: "1 week ago",
      status: "completed"
    },
  ];

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || course.status === filter;
      return matchesSearch && matchesFilter;
    });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Continue your learning journey • {filteredCourses.length} courses
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-sm focus:outline-none"
            >
              <option value="all">All Courses</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${viewMode === "grid" ? "bg-blue-100 text-blue-600 dark:bg-blue-950" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${viewMode === "list" ? "bg-blue-100 text-blue-600 dark:bg-blue-950" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className={`h-48 bg-gradient-to-br ${course.color} flex items-center justify-center text-7xl relative`}>
                <span className="drop-shadow-lg">{course.thumbnail}</span>
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Award className="w-4 h-4" /> Completed
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-xl leading-tight">{course.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{course.subject}</p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
                  by {course.instructor}
                </p>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2 font-medium">
                    <span>Progress</span>
                    <span className="text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.completedLessons}/{course.totalLessons} lessons
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <PlayCircle className="w-5 h-5" />
                  {course.progress === 100 ? "Review Course" : "Continue Learning"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`flex items-center gap-6 p-6 border-b border-gray-100 dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors ${index === 0 ? 'rounded-t-3xl' : ''} ${index === filteredCourses.length - 1 ? 'rounded-b-3xl' : ''}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center text-4xl flex-shrink-0`}>
                {course.thumbnail}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                  {course.progress === 100 && <Award className="w-5 h-5 text-emerald-500" />}
                </div>
                <p className="text-gray-500 text-sm">{course.subject} • by {course.instructor}</p>
              </div>

              <div className="hidden md:block w-48">
                <div className="text-xs text-gray-500 mb-1">Progress</div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="text-right text-sm text-gray-500 hidden lg:block w-32">
                {course.completedLessons}/{course.totalLessons} lessons
              </div>

              <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-medium whitespace-nowrap transition-all">
                {course.progress === 100 ? "Review" : "Continue"}
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No courses found</p>
        </div>
      )}
    </div>
  );
}