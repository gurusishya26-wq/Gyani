import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const TestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get('type') as 'lesson' | 'chapter' | null;
  const id = searchParams.get('id');
  const courseTitle = searchParams.get('courseId') || "Mathematics Foundation for Class 10";

  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Demo Questions (You can later connect to API)
  const allQuestions = {
    lesson: [
      {
        id: 1,
        question: "What is the HCF of 12 and 18?",
        options: ["6", "3", "9", "12"],
        correct: 0,
        explanation: "HCF of 12 and 18 is 6 (Greatest common divisor)."
      },
      {
        id: 2,
        question: "Which of the following is a prime number?",
        options: ["9", "15", "17", "21"],
        correct: 2,
        explanation: "17 is a prime number as it has only two factors: 1 and 17."
      },
      {
        id: 3,
        question: "The decimal expansion of 22/7 is:",
        options: ["Terminating", "Non-terminating repeating", "Non-terminating non-repeating", "None"],
        correct: 1,
        explanation: "22/7 is a non-terminating repeating decimal."
      }
    ],
    chapter: [
      {
        id: 1,
        question: "Euclid’s Division Lemma is used for:",
        options: ["Finding HCF", "Finding LCM", "Finding Square Root", "Finding Cube Root"],
        correct: 0,
        explanation: "Euclid’s Division Lemma is primarily used to find the HCF of two numbers."
      },
      {
        id: 2,
        question: "The Fundamental Theorem of Arithmetic states that:",
        options: [
          "Every composite number can be expressed as a product of primes",
          "Every number is either prime or composite",
          "Prime numbers are infinite",
          "All of the above"
        ],
        correct: 0,
        explanation: "Every composite number can be expressed as a unique product of primes."
      },
      {
        id: 3,
        question: "A polynomial of degree 2 is called:",
        options: ["Linear", "Quadratic", "Cubic", "Constant"],
        correct: 1,
        explanation: "A polynomial of degree 2 is called a quadratic polynomial."
      }
    ]
  };

  useEffect(() => {
    if (type) {
      setQuestions(allQuestions[type]);
      setSelectedAnswers(new Array(allQuestions[type].length).fill(-1));
    }
  }, [type]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) correctCount++;
    });
    setScore(correctCount);
    setShowResults(true);
    setIsSubmitted(true);
  };

  const resetTest = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setIsSubmitted(false);
    setScore(0);
  };

  if (!type) {
    return <div className="p-10 text-center">Invalid Test Link</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => window.close()} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'lesson' ? 'Lesson MCQ Test' : 'Chapter Test'}
            </h1>
            <p className="text-gray-600">{courseTitle}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          {!showResults ? (
            <>
              <div className="space-y-10">
                {questions.map((q, index) => (
                  <div key={q.id} className="border-b pb-8 last:border-none last:pb-0">
                    <p className="font-semibold text-lg mb-5">
                      {index + 1}. {q.question}
                    </p>
                    <div className="grid gap-3">
                      {q.options.map((option: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleAnswerSelect(index, i)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all text-base
                            ${selectedAnswers[index] === i 
                              ? 'border-[#5faae0] bg-blue-50 font-medium' 
                              : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculateScore}
                disabled={selectedAnswers.includes(-1)}
                className="mt-10 w-full bg-[#5faae0] hover:bg-[#4a9bd4] disabled:bg-gray-300 text-white py-4 rounded-2xl font-semibold text-lg transition"
              >
                Submit Test
              </button>
            </>
          ) : (
            /* Results Section */
            <div className="text-center py-12">
              <div className="mb-8">
                {score >= questions.length * 0.7 ? (
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="w-24 h-24 text-orange-500 mx-auto" />
                )}
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {score} / {questions.length}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {score >= questions.length * 0.7 ? "Excellent Work!" : "Keep Practicing!"}
              </p>

              <div className="space-y-6 text-left max-w-md mx-auto">
                {questions.map((q, index) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-2xl">
                    <p className="font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-gray-600">
                      Your Answer: <span className="font-medium">{q.options[selectedAnswers[index]]}</span>
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Correct Answer: {q.options[q.correct]}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center mt-10">
                <button
                  onClick={resetTest}
                  className="px-8 py-3 border border-gray-300 rounded-2xl hover:bg-gray-100"
                >
                  Retake Test
                </button>
                <button
                  onClick={() => window.close()}
                  className="px-8 py-3 bg-[#5faae0] text-white rounded-2xl hover:bg-[#4a9bd4]"
                >
                  Back to Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;