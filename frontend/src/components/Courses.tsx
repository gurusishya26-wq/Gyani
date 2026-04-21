// src/pages/Courses.tsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

const Courses = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get('type') || '';
  const selectedClass = searchParams.get('class') || '';
  const selectedSubject = searchParams.get('subject') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // popular, price-low, price-high, rating

  // Sample courses data (you can later fetch from backend)
  const allCourses = [
    {
      _id: "c1",
      title: "Mathematics Mastery for Class 10",
      subject: "Mathematics",
      class: "Class 10",
      description: "Complete coverage of CBSE & State Board syllabus with 300+ practice questions and doubt sessions.",
      coverImageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80",
      price: 2999,
      rating: 4.9,
      studentsEnrolled: 12400,
      duration: "6 months",
      isPaid: true,
      level: "Intermediate"
    },
    {
      _id: "c2",
      title: "Physics for Class 11 & 12 - JEE Foundation",
      subject: "Physics",
      class: "Class 11",
      description: "Build strong concepts for Board exams and JEE with live problem solving.",
      coverImageUrl: "https://images.unsplash.com/photo-1636466762480-9b3b6b0b0b0b?auto=format&fit=crop&q=80",
      price: 4499,
      rating: 4.8,
      studentsEnrolled: 8900,
      duration: "8 months",
      isPaid: true,
      level: "Advanced"
    },
    {
      _id: "c3",
      title: "AI & Robotics for Beginners",
      subject: "AI & Robotics",
      class: "Higher",
      description: "Introduction to Artificial Intelligence, Machine Learning and Robotics with hands-on projects.",
      coverImageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
      price: 1999,
      rating: 4.7,
      studentsEnrolled: 5600,
      duration: "4 months",
      isPaid: true,
      level: "Beginner"
    },
    {
      _id: "c4",
      title: "English Grammar & Comprehension - Class 9",
      subject: "English",
      class: "Class 9",
      description: "Improve your English skills with interactive lessons and weekly tests.",
      coverImageUrl: "https://images.unsplash.com/photo-1453928582365-b7f9d4d2b4e3?auto=format&fit=crop&q=80",
      price: 0,
      rating: 4.6,
      studentsEnrolled: 15200,
      duration: "3 months",
      isPaid: false,
      level: "Intermediate"
    },
    // Add more courses as needed
  ];

  // Filter courses based on query params and search
  const filteredCourses = useMemo(() => {
    let result = [...allCourses];

    // Filter by subject and class from modal
    if (selectedSubject) {
      result = result.filter(course => 
        course.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }
    if (selectedClass && selectedClass !== "Higher") {
      result = result.filter(course => 
        course.class.toLowerCase() === selectedClass.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // popular (default)
      result.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
    }

    return result;
  }, [allCourses, selectedSubject, selectedClass, searchTerm, sortBy]);

  const pageTitle = selectedSubject && selectedClass 
    ? `${selectedSubject} - ${selectedClass}` 
    : "All Self-Study Courses";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="text-2xl hover:scale-110 transition"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500">Self Study • {filteredCourses.length} courses found</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-2xl w-80 focus:outline-none focus:border-[#5faae0]"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#5faae0]"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">😕</p>
            <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600">Try changing your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <div className="relative h-56">
                  <img 
                    src={course.coverImageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-4 py-1.5 text-xs font-bold rounded-2xl shadow-md
                    ${course.isPaid ? 'bg-[#5faae0] text-white' : 'bg-emerald-500 text-white'}`}>
                    {course.isPaid ? `₹${course.price}` : 'FREE'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {course.class}
                    </span>
                    <div className="flex items-center text-amber-500 text-sm">
                      ★ {course.rating}
                    </div>
                  </div>

                  <h3 className="font-semibold text-xl leading-tight mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-5">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      {course.duration}
                    </div>
                    <div className="text-gray-500">
                      👥 {course.studentsEnrolled.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;