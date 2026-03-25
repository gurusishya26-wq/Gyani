import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Test {
  _id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: any[];
  createdAt: string;
}

const AllTests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/test/all");
        setTests(res.data);
      } catch (err) {
        console.error("Failed to load tests:", err);
        setError("Could not load available tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading available tests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Available Tests
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose a test to start practicing or evaluating your knowledge
          </p>
        </div>

        {/* Test Grid / List */}
        {tests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tests available yet
            </h3>
            <p className="text-gray-500 mb-6">
              New tests will appear here once they are created.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {test.title}
                  </h3>

                  {test.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                      {test.description}
                    </p>
                  )}

                  <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{test.durationMinutes} min</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span>{test.questions.length} questions</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/attempt-test/${test._id}`)}
                      className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Start Test
                    </button>
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

export default AllTests;