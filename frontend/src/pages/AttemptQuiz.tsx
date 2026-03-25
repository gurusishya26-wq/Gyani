import { useEffect, useState } from "react";
import axios from "axios";

interface Option {
  text: string;
  image: string;
}

interface Question {
  questionText: string;
  questionImage: string;
  options: Option[];
  correctAnswerIndex: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

const AttemptQuiz = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get("https://gyani-vxc9.onrender.com/api/quiz/latest");
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(-1));
      } catch (err) {
        console.error("Failed to load quiz", err);
      }
    };

    fetchQuiz();
  }, []);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return; // prevent changes after submit
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (!quiz) return;
    if (answers.some((a) => a === -1)) {
      if (!window.confirm("Some questions are unanswered. Submit anyway?")) {
        return;
      }
    }

    let calculatedScore = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) calculatedScore++;
    });

    setScore(calculatedScore);
    setSubmitted(true);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{quiz.description}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {quiz.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className={`bg-white rounded-xl shadow-sm border ${
                submitted && answers[qIndex] === question.correctAnswerIndex
                  ? "border-green-200 bg-green-50/30"
                  : submitted && answers[qIndex] !== -1 && answers[qIndex] !== question.correctAnswerIndex
                  ? "border-red-200 bg-red-50/30"
                  : "border-gray-200"
              } overflow-hidden`}
            >
              {/* Question header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800 flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium">
                    {qIndex + 1}
                  </span>
                  <span>
                    {question.questionText || (
                      <span className="text-gray-500 italic">Image question</span>
                    )}
                  </span>
                </h2>
              </div>

              {/* Question image */}
              {question.questionImage && (
                <div className="px-6 pt-5 pb-2">
                  <img
                    src={question.questionImage}
                    alt="Question visual"
                    className="max-h-64 w-full object-contain rounded-lg border border-gray-200 bg-white mx-auto"
                  />
                </div>
              )}

              {/* Options */}
              <div className="px-6 py-6 space-y-4">
                {question.options.map((option, optIndex) => {
                  const isSelected = answers[qIndex] === optIndex;
                  const isCorrect = submitted && optIndex === question.correctAnswerIndex;
                  const isWrong = submitted && isSelected && !isCorrect;

                  return (
                    <label
                      key={optIndex}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
                        border
                        ${
                          isCorrect
                            ? "bg-green-100 border-green-500"
                            : isWrong
                            ? "bg-red-100 border-red-500"
                            : isSelected
                            ? "bg-indigo-50 border-indigo-400"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }
                        ${submitted ? "cursor-default" : "cursor-pointer"}
                      `}
                      onClick={() => !submitted && handleSelect(qIndex, optIndex)}
                    >
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${
                            isCorrect
                              ? "bg-green-600 border-green-600 text-white"
                              : isWrong
                              ? "bg-red-600 border-red-600 text-white"
                              : isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-gray-400"
                          }
                        `}
                      >
                        {isCorrect && <span className="text-xs">✓</span>}
                        {isWrong && <span className="text-xs">✗</span>}
                      </div>

                      <div className="flex-1">
                        {option.text && (
                          <p className="text-gray-800">{option.text}</p>
                        )}

                        {option.image && (
                          <div className="mt-3">
                            <img
                              src={option.image}
                              alt={`Option ${optIndex + 1}`}
                              className="max-h-32 w-auto object-contain rounded border border-gray-200 bg-white"
                            />
                          </div>
                        )}

                        {submitted && isCorrect && (
                          <p className="mt-1 text-sm text-green-700 font-medium">
                            Correct answer
                          </p>
                        )}
                      </div>

                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={isSelected}
                        readOnly
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit / Result area */}
        <div className="mt-12 text-center">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={answers.every((a) => a === -1)}
              className={`
                px-10 py-4 rounded-xl font-medium text-lg shadow-md transition
                ${
                  answers.every((a) => a === -1)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }
              `}
            >
              Submit Quiz
            </button>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-lg mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Completed!</h2>
              <div className="text-5xl font-bold mb-2">
                {score} <span className="text-2xl text-gray-500">/</span>{" "}
                <span className="text-2xl text-gray-500">{quiz.questions.length}</span>
              </div>
              <p className="text-xl text-gray-600">
                {score === quiz.questions.length
                  ? "Perfect! 🎉"
                  : score! >= quiz.questions.length * 0.7
                  ? "Well done! 👍"
                  : "Keep practicing! 💪"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptQuiz;
