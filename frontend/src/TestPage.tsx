import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { testType, courseTitle, chapterId } = location.state || {};

  // Questions with Image Options
  const questions = [
    {
      id: 1,
      type: "text",
      question: "Who was the first President of India?",
      options: [
        "Jawaharlal Nehru",
        "Dr. Rajendra Prasad",
        "Sardar Vallabhbhai Patel",
        "B.R. Ambedkar"
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: "image_options",
      question: "Which shape is different from the others?",
      options: [
        "https://picsum.photos/id/1015/300/200",  // Triangle
        "https://picsum.photos/id/133/300/200",   // Circle
        "https://picsum.photos/id/201/300/200",   // Square
        "https://picsum.photos/id/180/300/200"    // Triangle (different)
      ],
      optionType: "image",
      correctAnswer: 1, // Index of correct option
    },
    {
      id: 3,
      type: "reasoning",
      question: "If a train travels at 60 km/h for 2 hours and then at 90 km/h for 3 hours, what is the average speed?",
      options: ["70 km/h", "72 km/h", "78 km/h", "75 km/h"],
      correctAnswer: 2,
    },
    {
      id: 4,
      type: "image_options",
      question: "Which animal lives in water?",
      options: [
        "https://picsum.photos/id/237/300/200",   // Dog
        "https://picsum.photos/id/1005/300/200",  // Cat
        "https://picsum.photos/id/1018/300/200",  // Fish
        "https://picsum.photos/id/669/300/200"    // Bird
      ],
      optionType: "image",
      correctAnswer: 2,
    },
    {
      id: 5,
      type: "image",
      question: "Identify the pattern and choose the next image:",
      image: "https://res.cloudinary.com/dvlbqsfyu/image/upload/v1771513630/wu3i7tvtyneyvtjpca2t.png",
      options: [
        "https://res.cloudinary.com/dvlbqsfyu/image/upload/v1771512150/azhyfg0tatv73vctvzwf.png",
        "https://res.cloudinary.com/dvlbqsfyu/image/upload/v1771512160/ipjhhsqocgjgvyc4h2uq.png",
        "https://res.cloudinary.com/dvlbqsfyu/image/upload/v1771512169/bkjjxexbfh9qwxt3hlii.png",
        "https://res.cloudinary.com/dvlbqsfyu/image/upload/v1771512160/ipjhhsqocgjgvyc4h2uq.png"
      ],
      optionType: "image",
      correctAnswer: 1,
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!testType) console.error("No test data received");
  }, [testType]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const calculateScore = () => {
    let finalScore = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) finalScore++;
    });
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 flex items-center gap-2 hover:text-blue-700 font-medium"
        >
          ← Back to Course
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h1 className="text-2xl font-bold">{testType}</h1>
            <p className="text-blue-100">{courseTitle}</p>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-blue-100 mt-2 text-right">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Question Area */}
          {!isSubmitted ? (
            <div className="p-8 md:p-12">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed mb-8">
                {currentQ.question}
              </h2>

              {/* Main Image (if any) */}
              {currentQ.image && (
                <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <img 
                    src={currentQ.image} 
                    alt="Question" 
                    className="w-full h-auto max-h-[280px] object-contain bg-gray-50"
                  />
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center min-h-[140px] hover:shadow-md ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {currentQ.optionType === "image" ? (
                      <img 
                        src={option} 
                        alt={`Option ${String.fromCharCode(65 + index)}`}
                        className="max-h-[130px] w-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex items-start w-full">
                        <span className="inline-block w-8 h-8 bg-blue-100 text-blue-700 rounded-xl text-center leading-8 mr-4 font-semibold flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-lg text-left">{option}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-8 py-3 border border-gray-300 rounded-2xl font-medium disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === -1}
                  className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? "Submit Test" : "Next Question"}
                </button>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="p-12 text-center">
              <div className="text-7xl mb-6">🏆</div>
              <h2 className="text-4xl font-bold text-gray-800">Test Completed!</h2>
              <p className="text-6xl font-bold text-blue-600 my-6">
                {score} / {questions.length}
              </p>

              <button
                onClick={() => navigate(-1)}
                className="bg-green-600 text-white px-10 py-4 rounded-2xl text-lg font-medium hover:bg-green-700"
              >
                Back to Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;