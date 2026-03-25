import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Option {
  text: string;
  image: string;
}

interface Question {
  type: "objective" | "subjective";
  questionText: string;
  questionImage: string;
  options?: Option[];
  correctAnswerIndex?: number;
  marks?: number;
}

interface Test {
  _id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
}

const AttemptTest = () => {
  const { id } = useParams<{ id: string }>();

  const [test, setTest] = useState<Test | null>(null);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<(number | string | null)[]>([]);

  const [score, setScore] = useState(0);
  const [totalMCQ, setTotalMCQ] = useState(0);

  // Fetch test data
  useEffect(() => {
    if (!id) return;

    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/test/${id}`);
        setTest(res.data);
        setTimeLeft(res.data.durationMinutes * 60);
        setAnswers(new Array(res.data.questions.length).fill(null));
      } catch (err) {
        console.error("Failed to load test", err);
      }
    };

    fetchTest();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, submitted, timeLeft]);

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSubmit = (auto = false) => {
    if (!test || submitted) return;

    let correct = 0;
    let mcqCount = 0;

    test.questions.forEach((q, idx) => {
      if (q.type === "objective") {
        mcqCount++;
        if (answers[idx] === q.correctAnswerIndex) {
          correct++;
        }
      }
    });

    setScore(correct);
    setTotalMCQ(mcqCount);
    setSubmitted(true);

    if (auto) {
      alert("Time's up! Your test has been auto-submitted.");
    }
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading test...</p>
        </div>
      </div>
    );
  }

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const timeWarning = timeLeft > 0 && timeLeft <= 300; // 5 minutes left

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ─── Pre-start / Welcome ─── */}
        {!started ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {test.title}
            </h1>

            {test.description && (
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {test.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-left max-w-md mx-auto">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-600">Duration</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {test.durationMinutes} minutes
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-600">Questions</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {test.questions.length}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg rounded-xl transition shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Start Test
            </button>

            <p className="mt-6 text-sm text-gray-500">
              Once you start, the timer cannot be paused.
            </p>
          </div>
        ) : submitted ? (
          /* ─── Result Screen ─── */
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Test Completed
            </h1>

            {totalMCQ > 0 ? (
              <>
                <div className="text-6xl font-bold text-indigo-600 mb-2">
                  {((score / totalMCQ) * 100).toFixed(0)}%
                </div>

                <p className="text-xl text-gray-700 mb-8">
                  {score} correct out of {totalMCQ} objective questions
                </p>

                <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-medium mb-6">
                  MCQ Score: {score} / {totalMCQ}
                </div>

                <p className="text-gray-600">
                  Subjective answers will be evaluated manually by the instructor.
                </p>
              </>
            ) : (
              <p className="text-xl text-gray-700">
                This test contains only subjective questions.<br />
                Your answers have been recorded and will be evaluated manually.
              </p>
            )}

            <button
              onClick={() => window.location.href = "/tests"} // or use navigate
              className="mt-10 px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition"
            >
              Back to All Tests
            </button>
          </div>
        ) : (
          /* ─── Test In Progress ─── */
          <>
            {/* Timer Bar */}
            <div
              className={`sticky top-0 z-10 bg-white shadow-md p-4 mb-8 border-b ${
                timeWarning ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            >
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 truncate max-w-[60%]">
                  {test.title}
                </h2>

                <div
                  className={`text-xl font-mono font-bold ${
                    timeWarning ? "text-red-600 animate-pulse" : "text-indigo-700"
                  }`}
                >
                  {formatTime()}
                </div>
              </div>
            </div>

            <div className="space-y-8 pb-20">
              {test.questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium">
                        {qIndex + 1}
                      </span>
                      <span>
                        {q.questionText || (
                          <span className="text-gray-500 italic">Image-based question</span>
                        )}
                      </span>
                    </h3>
                  </div>

                  {q.questionImage && (
                    <div className="px-6 pt-5">
                      <img
                        src={q.questionImage}
                        alt="Question illustration"
                        className="max-h-64 w-full object-contain rounded-lg border border-gray-200 bg-white mx-auto"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {q.type === "objective" && q.options ? (
                      <div className="space-y-4">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = answers[qIndex] === optIndex;

                          return (
                            <label
                              key={optIndex}
                              className={`
                                flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all border
                                ${
                                  isSelected
                                    ? "bg-indigo-50 border-indigo-400"
                                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name={`q-${qIndex}`}
                                checked={isSelected}
                                onChange={() => {
                                  const updated = [...answers];
                                  updated[qIndex] = optIndex;
                                  setAnswers(updated);
                                }}
                                className="mt-1.5 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                              />

                              <div className="flex-1">
                                {opt.text && <p className="text-gray-800">{opt.text}</p>}

                                {opt.image && (
                                  <img
                                    src={opt.image}
                                    alt={`Option ${optIndex + 1}`}
                                    className="mt-3 max-h-40 w-auto object-contain rounded border border-gray-200 bg-white"
                                  />
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your answer
                        </label>
                        <textarea
                          rows={6}
                          value={(answers[qIndex] as string) || ""}
                          onChange={(e) => {
                            const updated = [...answers];
                            updated[qIndex] = e.target.value;
                            setAnswers(updated);
                          }}
                          placeholder="Write your detailed answer here..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y min-h-[140px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Floating submit button on mobile */}
            <div className="fixed bottom-6 left-0 right-0 px-4 md:static md:mt-12 md:text-center z-20">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to submit?")) {
                    handleSubmit();
                  }
                }}
                className="w-full md:w-auto px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Submit Test
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttemptTest;