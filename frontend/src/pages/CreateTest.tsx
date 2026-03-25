// src/pages/CreateTest.tsx
import { useState } from "react";
import axios from "axios";

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

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [uploading, setUploading] = useState<{ q: number; opt?: number } | null>(null);

  // ────────────────────────────────────────────────
  //                Cloudinary Image Upload
  // ────────────────────────────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    // Replace with your real values
    formData.append("upload_preset", "course_upload");

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
    } catch {
      alert("Image upload failed");
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
        next[qIndex].options![optIndex].image = url;
        return next;
      });
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(null);
    }
  };

  // ────────────────────────────────────────────────
  //                   Question Actions
  // ────────────────────────────────────────────────
  const addObjectiveQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        type: "objective",
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

  const addSubjectiveQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        type: "subjective",
        questionText: "",
        questionImage: "",
        marks: 5,
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
      next[qIndex].options?.push({ text: "", image: "" });
      return next;
    });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      if ((next[qIndex].options?.length || 0) <= 2) {
        alert("Minimum 2 options required for objective questions.");
        return prev;
      }
      next[qIndex].options?.splice(optIndex, 1);

      // Adjust correct index if removed
      const ca = next[qIndex].correctAnswerIndex ?? 0;
      if (ca === optIndex) {
        next[qIndex].correctAnswerIndex = Math.max(0, optIndex - 1);
      } else if (ca > optIndex) {
        next[qIndex].correctAnswerIndex = ca - 1;
      }

      return next;
    });
  };

  // ────────────────────────────────────────────────
  //                      Validation & Submit
  // ────────────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!title.trim()) {
      alert("Test title is required.");
      return false;
    }
    if (durationMinutes < 1) {
      alert("Duration must be at least 1 minute.");
      return false;
    }
    if (questions.length === 0) {
      alert("Add at least one question.");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim() && !q.questionImage) {
        alert(`Question ${i + 1} needs text or an image.`);
        return false;
      }

      if (q.type === "objective") {
        if (!q.options || q.options.length < 2) {
          alert(`Objective Question ${i + 1} needs at least 2 options.`);
          return false;
        }
        for (let j = 0; j < q.options.length; j++) {
          const opt = q.options[j];
          if (!opt.text.trim() && !opt.image) {
            alert(`Q${i + 1} Option ${j + 1} needs text or image.`);
            return false;
          }
        }
      }

      if (q.type === "subjective" && (!q.marks || q.marks < 1)) {
        alert(`Subjective Question ${i + 1} needs valid marks (> 0).`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/api/test/create", {
        title,
        description,
        durationMinutes,
        questions,
      });
      alert("Test created successfully!");
      // Optional: reset form or redirect
    } catch (err) {
      console.error(err);
      alert("Failed to create test. Check console.");
    }
  };

  // ────────────────────────────────────────────────
  //                        RENDER
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Test</h1>
        <p className="text-gray-600 mb-8">Add test details and questions below</p>

        {/* Test Metadata */}
        <div className="bg-white shadow rounded-xl border border-gray-200 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Test Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mid-Term Exam • Python Programming Test • ..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration (minutes) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description / Instructions (optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any special rules, allowed materials, negative marking, etc..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>
            <div className="flex gap-3">
              <button
                onClick={addObjectiveQuestion}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                + Objective
              </button>
              <button
                onClick={addSubjectiveQuestion}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                + Subjective
              </button>
            </div>
          </div>

          {questions.length === 0 && (
            <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500">No questions added yet.<br />Click one of the buttons above to start.</p>
            </div>
          )}

          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {qIndex + 1}
                    </span>
                    <h3 className="font-semibold text-gray-800">
                      {q.type === "objective" ? "Multiple Choice" : "Subjective"}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Question Text + Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {q.questionImage ? "Question" : "Question Text or Image"}{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => {
                          const next = [...questions];
                          next[qIndex].questionText = e.target.value;
                          setQuestions(next);
                        }}
                        placeholder={
                          q.type === "objective"
                            ? "Which of the following is correct?"
                            : "Explain the process of photosynthesis in detail."
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <p className="mt-1.5 text-xs text-gray-500">
                        {q.questionImage
                          ? "Image set → text is optional"
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
                        disabled={uploading?.q === qIndex}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-60"
                      />
                      {uploading?.q === qIndex && !uploading.opt && (
                        <p className="mt-2 text-sm text-indigo-600">Uploading...</p>
                      )}
                      {q.questionImage && (
                        <img
                          src={q.questionImage}
                          alt="Question preview"
                          className="mt-4 max-h-48 w-auto object-contain rounded border border-gray-200"
                        />
                      )}
                    </div>
                  </div>

                  {/* Objective Options */}
                  {q.type === "objective" && q.options && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Options <span className="text-red-600">*</span>
                        </label>
                        <button
                          onClick={() => addOption(qIndex)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          + Add Option
                        </button>
                      </div>

                      {q.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-lg border ${
                            q.correctAnswerIndex === optIndex
                              ? "border-green-500 bg-green-50/50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex flex-wrap gap-4 items-start">
                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswerIndex === optIndex}
                                onChange={() => {
                                  const next = [...questions];
                                  next[qIndex].correctAnswerIndex = optIndex;
                                  setQuestions(next);
                                }}
                                className="h-5 w-5 text-green-600 focus:ring-green-500"
                              />
                              <span className="text-sm font-medium text-gray-700">Correct</span>
                            </div>

                            <div className="flex-1 min-w-[200px]">
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const next = [...questions];
                                  next[qIndex].options![optIndex].text = e.target.value;
                                  setQuestions(next);
                                }}
                                placeholder={`Option ${optIndex + 1} (text optional if image)`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                              />
                              <p className="mt-1.5 text-xs text-gray-500">
                                {opt.image ? "Image set → text optional" : "Text or image required"}
                              </p>
                            </div>

                            <div className="min-w-[160px]">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleOptionImage(e, qIndex, optIndex)}
                                disabled={uploading?.q === qIndex && uploading.opt === optIndex}
                                className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer disabled:opacity-60"
                              />
                              {uploading?.q === qIndex && uploading.opt === optIndex && (
                                <p className="mt-1.5 text-xs text-indigo-600">Uploading...</p>
                              )}
                            </div>

                            <button
                              onClick={() => removeOption(qIndex, optIndex)}
                              className="text-red-600 hover:text-red-800 text-sm px-3 py-2 rounded hover:bg-red-50 mt-1"
                            >
                              Remove
                            </button>
                          </div>

                          {opt.image && (
                            <img
                              src={opt.image}
                              alt={`Option ${optIndex + 1}`}
                              className="mt-4 max-h-32 w-auto object-contain rounded border border-gray-200 ml-0 md:ml-20"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subjective Marks */}
                  {q.type === "subjective" && (
                    <div className="max-w-xs">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Marks for this question <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={q.marks ?? ""}
                        onChange={(e) => {
                          const next = [...questions];
                          next[qIndex].marks = Number(e.target.value);
                          setQuestions(next);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-10 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-md"
          >
            Save & Create Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;