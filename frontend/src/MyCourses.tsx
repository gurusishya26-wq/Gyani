import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchMyCourses = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        localStorage.setItem("returnUrl", "/my-courses");
        navigate("/auth");
        return;
      }

      setUserName(user.name || "Student");

      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/my-courses/${user._id}`);
        setCourses(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("returnUrl");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">My Courses</h1>
            <p className="text-gray-600 mt-1">Welcome, {userName}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700"
            >
              Browse More Courses
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow">
            <p className="text-2xl text-gray-600 mb-6">
              You haven't purchased any courses yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <div
                key={course._id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {course.title?.charAt(0)}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {course.subjectName || "General"}
                    </span>
                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                      Purchased
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}