import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function TestPage() {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");
  const testType = searchParams.get("type"); // lesson, chapter, final
  const chapterIndex = parseInt(searchParams.get("chapter") || "0");
  const lessonIndex = parseInt(searchParams.get("lesson") || "0");

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchTest = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fixed URL (removed double slash)
        const res = await axios.get(`${API_BASE}/api/courses/${courseId}`);
        const course = res.data;
        setCourseTitle(course.title || "");

        let selectedQuestions: any[] = [];

        if (testType === "lesson") {
          selectedQuestions =
            course.chapters?.[chapterIndex]?.lessons?.[lessonIndex]?.test?.questions || [];
        } else if (testType === "chapter") {
          selectedQuestions =
            course.chapters?.[chapterIndex]?.test?.questions || [];
        } else if (testType === "final") {
          selectedQuestions = course.test?.questions || [];
        }

        setQuestions(selectedQuestions);
        setAnswers(new Array(selectedQuestions.length).fill(-1));
      } catch (err) {
        console.error("Failed to load test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [courseId, testType, chapterIndex, lessonIndex]);

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const submitTest = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const backToCourse = () => {
    if (courseId) {
      window.location.href = `/course/${courseId}`;
    } else {
      window.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading test...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-6">No questions found for this test.</p>
        <button
          onClick={backToCourse}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl"
        >
          Back to Course
        </button>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Test Completed!</h2>
          <div className="text-8xl font-bold text-emerald-600 mb-2">{percentage}%</div>
          <p className="text-2xl text-gray-700 mb-8">
            {score} / {questions.length} Correct
          </p>
          <button
            onClick={backToCourse}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2 text-center capitalize">
          {testType} Test
        </h1>
        {courseTitle && (
          <p className="text-center text-gray-600 mb-10">{courseTitle}</p>
        )}

        <div className="space-y-10">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-3xl p-8 shadow">
              <p className="font-medium text-lg mb-6">
                Q{qIndex + 1}. {q.question}
              </p>

              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt="Question"
                  className="mb-6 max-w-full rounded-xl border"
                />
              )}

              <div className="grid gap-3">
                {q.options.map((option: string, optIndex: number) => (
                  <button
                    key={optIndex}
                    onClick={() => handleOptionSelect(qIndex, optIndex)}
                    className={`p-4 text-left rounded-2xl border transition-all ${
                      answers[qIndex] === optIndex
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submitTest}
          disabled={answers.includes(-1)}
          className="mt-10 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}