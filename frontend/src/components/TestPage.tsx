import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get("courseId");
  const testType = searchParams.get("type"); // lesson, chapter, final
  const chapterIndex = parseInt(searchParams.get("chapter") || "0");
  const lessonIndex = parseInt(searchParams.get("lesson") || "0");

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`https://gyani-vxc9.onrender.com//api/courses/${courseId}`);
        setCourse(res.data);

        let selectedQuestions = [];

        if (testType === "lesson") {
          selectedQuestions = res.data.chapters?.[chapterIndex]?.lessons?.[lessonIndex]?.test?.questions || [];
        } else if (testType === "chapter") {
          selectedQuestions = res.data.chapters?.[chapterIndex]?.test?.questions || [];
        } else if (testType === "final") {
          selectedQuestions = res.data.test?.questions || [];
        }

        setQuestions(selectedQuestions);
        setAnswers(new Array(selectedQuestions.length).fill(-1));
      } catch (err) {
        console.error(err);
      }
    };

    if (courseId) fetchTest();
  }, [courseId, testType, chapterIndex, lessonIndex]);

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
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
      window.opener?.postMessage({ action: "refreshCourse" }, "*"); // Optional: refresh course page
      window.location.href = `/course/${courseId}`;
    } else {
      window.close();
    }
  };

  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Test Completed!</h2>

          <div className="text-8xl font-bold text-emerald-600 mb-2">{percentage}%</div>
          <p className="text-2xl text-gray-700 mb-8">{score} / {questions.length} Correct</p>

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
        <h1 className="text-3xl font-bold mb-8 text-center capitalize">
          {testType} Test
        </h1>

        <div className="space-y-10">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-3xl p-8 shadow">
              <p className="font-medium text-lg mb-6">Q{qIndex + 1}. {q.question}</p>

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