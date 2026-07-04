import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Courses() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const subject = searchParams.get("subject");

  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, classesRes] = await Promise.all([
          axios.get("https://gyani-vxc9.onrender.com//api/courses"),
          axios.get("https://gyani-vxc9.onrender.com//api/classes")
        ]);

        setCourses(coursesRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getClassNumber = (parentId: string) => {
    const found = classes.find(c => String(c._id) === String(parentId));
    return found ? found.classNumber : "N/A";
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading courses...</div>;

  const filteredCourses = courses.filter(course => {
    const matchClass = !classId || String(course.parentId) === String(classId);
    const matchSubject = !subject || course.subjectName === subject;
    return matchClass && matchSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">
          {classId 
            ? `Class ${getClassNumber(classId)} - ${subject || "All Subjects"}` 
            : "All Courses"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              {/* Course Thumbnail */}
              {course.imageUrl ? (
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-6xl opacity-30">📚</span>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Class {getClassNumber(course.parentId)}
                    </p>
                    <p className="font-medium text-indigo-600">{course.subjectName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {course.price === "0" || course.price === 0 ? "Free" : `₹${course.price}`}
                    </p>
                  </div>
                </div>

                <a 
                  href={`/course/${course._id}`} 
                  className="block mt-6 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-medium transition-colors"
                >
                  View Full Course
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-xl">
            No courses found for this selection.
          </div>
        )}
      </div>
    </div>
  );
}