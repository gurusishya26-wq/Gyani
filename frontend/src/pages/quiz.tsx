// src/pages/QuizCreator.tsx
import { useState } from "react";
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

const QuizCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      questionImage: "",
      options: [
        { text: "", image: "" },
        { text: "", image: "" },
        { text: "", image: "" },
        { text: "", image: "" },
      ],
      correctAnswerIndex: 0,
    },
  ]);

  const [uploading, setUploading] = useState<{ q: number; opt?: number } | null>(null);

  // ────────────────────────────────────────────────
  //                Image Upload to Cloudinary
  // ────────────────────────────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "course_upload"); // ← change if needed

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvlbqsfyu/image/upload",
      formData
    );

    return res.data.secure_url;
  };

  const handleQuestionImage = async (e: React.ChangeEvent<HTMLInputElement>, qIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ q: qIndex });
    try {
      const url = await uploadImage(file);
      setQuestions((prev) => {
        const next = [...prev];
        next[qIndex].questionImage = url;
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload question image");
    } finally {
      setUploading(null);
    }
  };

  const handleOptionImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    qIndex: number,
    optIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ q: qIndex, opt: optIndex });
    try {
      const url = await uploadImage(file);
      setQuestions((prev) => {
        const next = [...prev];
        next[qIndex].options[optIndex].image = url;
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload option image");
    } finally {
      setUploading(null);
    }
  };

  // ────────────────────────────────────────────────
  //                   State Updaters
  // ────────────────────────────────────────────────
  const updateQuestionText = (qIndex: number, value: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].questionText = value;
      return next;
    });
  };

  const updateOptionText = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options[optIndex].text = value;
      return next;
    });
  };

  const setCorrectAnswer = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].correctAnswerIndex = optIndex;
      return next;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        questionImage: "",
        options: [
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
        ],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length === 1) {
      alert("At least one question is required.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex].options.push({ text: "", image: "" });
      return next;
    });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (next[qIndex].options.length <= 2) {
        alert("Minimum 2 options required per question.");
        return prev;
      }

      next[qIndex].options.splice(optIndex, 1);

      // Fix correct index if needed
      if (next[qIndex].correctAnswerIndex === optIndex) {
        next[qIndex].correctAnswerIndex = Math.max(0, optIndex - 1);
      } else if (next[qIndex].correctAnswerIndex > optIndex) {
        next[qIndex].correctAnswerIndex -= 1;
      }

      return next;
    });
  };

  // ────────────────────────────────────────────────
  //                      Submit
  // ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    for (let qIdx = 0; qIdx < questions.length; qIdx++) {
      const q = questions[qIdx];

      // Question needs text OR image
      if (!q.questionText.trim() && !q.questionImage) {
        alert(`Question ${qIdx + 1} must have text or an image.`);
        return;
      }

      for (let oIdx = 0; oIdx < q.options.length; oIdx++) {
        const opt = q.options[oIdx];
        if (!opt.text.trim() && !opt.image) {
          alert(`Question ${qIdx + 1} → Option ${oIdx + 1} must have text or an image.`);
          return;
        }
      }
    }

    try {
      await axios.post("http://localhost:5000/api/quiz/create", {
        title,
        description,
        questions,
      });
      alert("Quiz created successfully!");
      // Optional: reset form here
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz. Check console for details.");
    }
  };

  // ────────────────────────────────────────────────
  //                        UI
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Create Quiz</h1>
        <p className="text-gray-600 mb-8">Add title, description and your questions below</p>

        {/* Title + Description */}
        <div className="bg-white shadow rounded-xl border border-gray-200 p-6 mb-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quiz Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. World Flags Quiz • Chemistry Basics • Guess the Meme"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description (optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instructions, time limit, theme, etc..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-12">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Question {qIndex + 1}
                </h2>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove question
                </button>
              </div>

              <div className="p-6 space-y-7">
                {/* Question content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {q.questionImage ? "Question Image" : "Question Text or Image"}{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      placeholder="What is the capital of Brazil? (optional when image is used)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                      {q.questionImage
                        ? "Image is set → text is optional"
                        : "Provide text, image, or both"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Question Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQuestionImage(e, qIndex)}
                      disabled={uploading?.q === qIndex && uploading.opt === undefined}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4 file:rounded-lg
                        file:border-0 file:text-sm file:font-medium
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
                    />
                    {uploading?.q === qIndex && uploading.opt === undefined && (
                      <p className="mt-2 text-sm text-indigo-600">Uploading…</p>
                    )}
                    {q.questionImage && (
                      <div className="mt-4">
                        <img
                          src={q.questionImage}
                          alt="Question preview"
                          className="max-h-40 w-auto object-contain rounded border border-gray-200 bg-gray-50"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-5">
                  <div className="flex items-baseline justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Options <span className="text-red-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      + Add option
                    </button>
                  </div>

                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-4 rounded-lg border transition ${
                        q.correctAnswerIndex === optIndex
                          ? "border-green-500 bg-green-50/60"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-4 flex-wrap">
                        <div className="flex items-center gap-2 pt-1.5">
                          <input
                            type="radio"
                            name={`correct-q${qIndex}`}
                            checked={q.correctAnswerIndex === optIndex}
                            onChange={() => setCorrectAnswer(qIndex, optIndex)}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">Correct</span>
                        </div>

                        <div className="flex-1 min-w-[220px]">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) =>
                              updateOptionText(qIndex, optIndex, e.target.value)
                            }
                            placeholder={`Option ${optIndex + 1} text (optional if image)`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <p className="mt-1.5 text-xs text-gray-500">
                            {opt.image
                              ? "Image uploaded → text optional"
                              : "Text or image required"}
                          </p>
                        </div>

                        <div className="min-w-[180px]">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImage(e, qIndex, optIndex)}
                            disabled={uploading?.q === qIndex && uploading.opt === optIndex}
                            className="block w-full text-sm text-gray-500
                              file:mr-3 file:py-2 file:px-3 file:rounded
                              file:border-0 file:text-xs file:font-medium
                              file:bg-gray-100 file:text-gray-700
                              hover:file:bg-gray-200 cursor-pointer disabled:opacity-50"
                          />
                          {uploading?.q === qIndex && uploading.opt === optIndex && (
                            <p className="mt-1.5 text-xs text-indigo-600">Uploading…</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, optIndex)}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1.5 rounded hover:bg-red-50 mt-1"
                        >
                          Remove
                        </button>
                      </div>

                      {opt.image && (
                        <div className="mt-4 ml-[140px] md:ml-0">
                          <img
                            src={opt.image}
                            alt={`Option ${optIndex + 1} preview`}
                            className="max-h-32 w-auto object-contain rounded border border-gray-200 bg-gray-50"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition"
          >
            + Add New Question
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-md"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;