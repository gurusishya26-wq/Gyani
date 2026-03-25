import { useEffect, useState } from "react";
import axios from "axios";

type Course = {
  _id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  isPaid: boolean;
  price?: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-10">Loading courses...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-10">All Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={course.coverImageUrl}
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">
                {course.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {course.description}
              </p>

              <span className="font-semibold">
                {course.isPaid ? `₹${course.price}` : "Free"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
