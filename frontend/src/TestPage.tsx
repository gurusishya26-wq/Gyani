import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { testType, courseTitle, chapterId } = location.state || {};

  useEffect(() => {
    // If no data is passed, show error
    if (!testType) {
      console.error("No test data received");
    }
  }, [testType]);

  if (!testType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Invalid Test Link</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the test you're looking for.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 flex items-center gap-2 hover:text-blue-700"
        >
          ← Back to Course
        </button>

        <div className="bg-white rounded-2xl shadow p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{testType}</h1>
          <p className="text-gray-600 mb-8">{courseTitle}</p>

          <div className="border rounded-xl p-8 text-center">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-semibold mb-4">Ready to take the test?</h2>
            <p className="text-gray-600 mb-8">
              This is a placeholder for <strong>{testType}</strong>
            </p>
            
            <button className="bg-green-600 text-white px-10 py-4 rounded-2xl text-lg font-medium hover:bg-green-700">
              Start Test
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Test ID: {chapterId || 'Full Syllabus'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;