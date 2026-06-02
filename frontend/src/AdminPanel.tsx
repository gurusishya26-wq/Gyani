import { useEffect, useState } from "react";
import axios from "axios";

interface Subject {
  name: string;
  icon: string;
}

interface ExamSubject {
  name: string;
  desc: string;
}

interface QuizOption {
  id: string;
  text: string;
}

interface Quiz {
  _id: string;
  category: string;
  title: string;
  reward: string;
  correctAnswer: string;
  questionImage?: string;
  options: any[];
}

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<'classes' | 'exams' | 'quizzes'>('classes');
  const [loading, setLoading] = useState(false);

  // ==================== CLASS STATES ====================
  const [classNumber, setClassNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([{ name: "", icon: "" }]);
  const [classes, setClasses] = useState<any[]>([]);
  const [editId, setEditId] = useState("");

  // ==================== COMPETITIVE EXAM STATES ====================
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examImage, setExamImage] = useState<File | null>(null);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [competitiveExams, setCompetitiveExams] = useState<any[]>([]);
  const [editExamId, setEditExamId] = useState("");

  // ==================== QUIZ STATES ====================
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editQuizId, setEditQuizId] = useState("");

  const [quizCategory, setQuizCategory] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizReward, setQuizReward] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ]);

  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [optionImageA, setOptionImageA] = useState<File | null>(null);
  const [optionImageB, setOptionImageB] = useState<File | null>(null);
  const [optionImageC, setOptionImageC] = useState<File | null>(null);
  const [optionImageD, setOptionImageD] = useState<File | null>(null);

  // ==================== FETCH DATA ====================
  useEffect(() => {
    fetchClasses();
    fetchCompetitiveExams();
    fetchQuizzes();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("https://gyani-vxc9.onrender.com/api/classes");
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompetitiveExams = async () => {
    try {
      const res = await axios.get("https://gyani-vxc9.onrender.com/api/competitive-exams");
      setCompetitiveExams(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("https://gyani-vxc9.onrender.com/api/daily-quizzes");
      setQuizzes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ==================== SIDEBAR MENU ====================
  const menuItems = [
    { id: 'classes', label: 'Manage Classes', icon: '📚' },
    { id: 'exams', label: 'Competitive Exams', icon: '🏆' },
    { id: 'quizzes', label: 'Daily Quizzes', icon: '❓' },
  ] as const;

  // ==================== CLASS FUNCTIONS ====================
  const addSubject = () => setSubjects(prev => [...prev, { name: "", icon: "" }]);

  const handleSubjectChange = (index: number, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("classNumber", classNumber);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("subjects", JSON.stringify(subjects));
      if (image) formData.append("image", image);

      if (editId) {
        await axios.put(`https://gyani-vxc9.onrender.com/api/classes/${editId}`, formData);
        alert("✅ Class updated successfully");
      } else {
        await axios.post("https://gyani-vxc9.onrender.com/api/classes/create", formData);
        alert("✅ Class added successfully");
      }
      resetClassForm();
      fetchClasses();
    } catch (error) {
      alert("❌ Error saving class");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetClassForm = () => {
    setClassNumber(""); setTitle(""); setDescription(""); setImage(null);
    setSubjects([{ name: "", icon: "" }]); setEditId("");
  };

  const editClass = (cls: any) => {
    setEditId(cls._id);
    setClassNumber(cls.classNumber);
    setTitle(cls.title);
    setDescription(cls.description);
    setSubjects(Array.isArray(cls.subjects) ? cls.subjects : [{ name: "", icon: "" }]);
  };

  const deleteClass = async (id: string) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await axios.delete(`https://gyani-vxc9.onrender.com/api/classes/${id}`);
      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  // ==================== EXAM FUNCTIONS ====================
  const addExamSubject = () => setExamSubjects(prev => [...prev, { name: "", desc: "" }]);

  const handleExamSubjectChange = (index: number, field: keyof ExamSubject, value: string) => {
    setExamSubjects(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const saveCompetitiveExam = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", examTitle);
      formData.append("description", examDescription);
      if (examImage) formData.append("image", examImage);
      formData.append("subjects", JSON.stringify(examSubjects));

      if (editExamId) {
        await axios.put(`https://gyani-vxc9.onrender.com/api/competitive-exams/${editExamId}`, formData);
        alert("✅ Exam updated successfully");
      } else {
        await axios.post("https://gyani-vxc9.onrender.com/api/competitive-exams/create", formData);
        alert("✅ Exam added successfully");
      }
      resetExamForm();
      fetchCompetitiveExams();
    } catch (error) {
      alert("❌ Error saving exam");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetExamForm = () => {
    setExamTitle(""); setExamDescription(""); setExamImage(null);
    setExamSubjects([]); setEditExamId("");
  };

  const editExam = (exam: any) => {
    setEditExamId(exam._id);
    setExamTitle(exam.title || "");
    setExamDescription(exam.description || "");
    setExamSubjects(Array.isArray(exam.subjects) ? exam.subjects : []);
  };

  const deleteExam = async (id: string) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await axios.delete(`https://gyani-vxc9.onrender.com/api/competitive-exams/${id}`);
      fetchCompetitiveExams();
    } catch (error) {
      console.error(error);
    }
  };

  // ==================== QUIZ FUNCTIONS ====================
  const handleOptionChange = (index: number, value: string) => {
    setQuizOptions(prev => prev.map((opt, i) => i === index ? { ...opt, text: value } : opt));
  };

  const handleOptionImageChange = (id: string, file: File | null) => {
    if (id === "A") setOptionImageA(file);
    if (id === "B") setOptionImageB(file);
    if (id === "C") setOptionImageC(file);
    if (id === "D") setOptionImageD(file);
  };

  const saveQuiz = async () => {
    if (!quizTitle || !quizCategory || !correctAnswer) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", quizCategory);
      formData.append("title", quizTitle);
      formData.append("reward", quizReward);
      formData.append("correctAnswer", correctAnswer);

      quizOptions.forEach(opt => {
        formData.append(`option${opt.id}Text`, opt.text);
      });

      if (questionImage) formData.append("questionImage", questionImage);
      if (optionImageA) formData.append("optionImageA", optionImageA);
      if (optionImageB) formData.append("optionImageB", optionImageB);
      if (optionImageC) formData.append("optionImageC", optionImageC);
      if (optionImageD) formData.append("optionImageD", optionImageD);

      if (editQuizId) {
        await axios.put(`https://gyani-vxc9.onrender.com/api/daily-quizzes/${editQuizId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("✅ Quiz updated successfully");
      } else {
        await axios.post("https://gyani-vxc9.onrender.com/api/daily-quizzes/create", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("✅ Quiz added successfully");
      }

      resetQuizForm();
      fetchQuizzes();
    } catch (error) {
      alert("❌ Error saving quiz");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuizForm = () => {
    setEditQuizId("");
    setQuizCategory("");
    setQuizTitle("");
    setQuizReward("");
    setCorrectAnswer("");
    setQuestionImage(null);
    setOptionImageA(null);
    setOptionImageB(null);
    setOptionImageC(null);
    setOptionImageD(null);

    setQuizOptions([
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ]);
  };

  const editQuiz = (quiz: Quiz) => {
    setEditQuizId(quiz._id);
    setQuizCategory(quiz.category || "");
    setQuizTitle(quiz.title || "");
    setQuizReward(quiz.reward || "");
    setCorrectAnswer(quiz.correctAnswer || "");

    setQuizOptions([
      { id: "A", text: quiz.options?.[0]?.text || "" },
      { id: "B", text: quiz.options?.[1]?.text || "" },
      { id: "C", text: quiz.options?.[2]?.text || "" },
      { id: "D", text: quiz.options?.[3]?.text || "" },
    ]);
  };

  const deleteQuiz = async (id: string) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await axios.delete(`https://gyani-vxc9.onrender.com/api/daily-quizzes/${id}`);
      fetchQuizzes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 shadow-xl fixed h-screen overflow-auto">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900">EduAdmin</h1>
          <p className="text-gray-500 text-sm">Admin Dashboard</p>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-10">
        <div className="max-w-5xl mx-auto">
          {/* Classes Section */}
          {activeSection === 'classes' && (
            <div>
              <h2 className="text-4xl font-bold mb-8">Manage Classes</h2>
              <div className="bg-white rounded-3xl shadow p-8 mb-12">
                <form onSubmit={handleSubmitClass} className="space-y-6">
                  {/* Class Form Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <input type="number" placeholder="Class Number" value={classNumber} onChange={(e) => setClassNumber(e.target.value)} className="border p-4 rounded-2xl" required />
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-4 rounded-2xl" required />
                  </div>

                  <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-4 rounded-2xl" rows={4} required />

                  <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full border p-4 rounded-2xl" />

                  <div>
                    <div className="flex justify-between mb-4">
                      <h3 className="text-xl font-semibold">Subjects</h3>
                      <button type="button" onClick={addSubject} className="bg-blue-600 text-white px-5 py-2 rounded-xl">Add Subject</button>
                    </div>
                    {subjects.map((subject, index) => (
                      <div key={index} className="flex gap-4 mb-4">
                        <input type="text" placeholder="Subject Name" value={subject.name} onChange={(e) => handleSubjectChange(index, "name", e.target.value)} className="flex-1 border p-4 rounded-2xl" />
                        <input type="text" placeholder="Icon" value={subject.icon} onChange={(e) => handleSubjectChange(index, "icon", e.target.value)} className="w-32 border p-4 rounded-2xl" />
                      </div>
                    ))}
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg">
                    {loading ? "Saving..." : editId ? "Update Class" : "Create Class"}
                  </button>
                </form>
              </div>

              {/* Classes List */}
              <h3 className="text-2xl font-bold mb-6">All Classes</h3>
              <div className="grid gap-6">
                {classes.map(cls => (
                  <div key={cls._id} className="bg-white p-6 rounded-3xl flex items-center justify-between shadow">
                    <div className="flex items-center gap-6">
                      <img src={cls.image} alt="" className="w-20 h-20 object-cover rounded-2xl" />
                      <div>
                        <h4 className="text-xl font-bold">Class {cls.classNumber}</h4>
                        <p className="text-gray-600">{cls.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => editClass(cls)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl">Edit</button>
                      <button onClick={() => deleteClass(cls._id)} className="bg-red-600 text-white px-6 py-3 rounded-2xl">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitive Exams Section */}
          {activeSection === 'exams' && (
            <div>
              <h2 className="text-4xl font-bold mb-8">Competitive Exams</h2>
              {/* Similar structure as classes - you can expand as needed */}
              <div className="bg-white rounded-3xl shadow p-8">
                {/* Exam Form */}
                <input type="text" placeholder="Exam Title" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="w-full border p-4 rounded-2xl mb-4" />
                <textarea placeholder="Description" value={examDescription} onChange={(e) => setExamDescription(e.target.value)} className="w-full border p-4 rounded-2xl mb-4" rows={4} />
                <input type="file" onChange={(e) => setExamImage(e.target.files?.[0] || null)} className="w-full border p-4 rounded-2xl mb-6" />

                <button type="button" onClick={addExamSubject} className="bg-blue-600 text-white px-6 py-3 rounded-xl mb-4">Add Subject</button>

                {examSubjects.map((sub, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Subject Name" value={sub.name} onChange={(e) => handleExamSubjectChange(i, "name", e.target.value)} className="border p-4 rounded-2xl" />
                    <input type="text" placeholder="Description" value={sub.desc} onChange={(e) => handleExamSubjectChange(i, "desc", e.target.value)} className="border p-4 rounded-2xl" />
                  </div>
                ))}

                <button onClick={saveCompetitiveExam} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold mt-6">
                  {editExamId ? "Update Exam" : "Create Exam"}
                </button>
              </div>

              {/* Exams List */}
              <h3 className="text-2xl font-bold mb-6">All Competitive Exams</h3>
              <div className="grid gap-6">
                {competitiveExams.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">No competitive exams added yet.</p>
                ) : (
                  competitiveExams.map((exam) => (
                    <div
                      key={exam._id}
                      className="bg-white p-6 rounded-3xl shadow flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        {exam.image && (
                          <img
                            src={exam.image}
                            alt={exam.title}
                            className="w-24 h-24 object-cover rounded-2xl"
                          />
                        )}
                        <div>
                          <h4 className="text-2xl font-bold">{exam.title}</h4>
                          <p className="text-gray-600 mt-1 line-clamp-2">{exam.description}</p>
                          {exam.subjects && exam.subjects.length > 0 && (
                            <p className="text-sm text-blue-600 mt-2">
                              {exam.subjects.length} Subjects
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => editExam(exam)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExam(exam._id)}
                          className="bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Daily Quizzes Section */}
          {activeSection === 'quizzes' && (
            <div>
              <h2 className="text-4xl font-bold mb-8">Daily Quiz Management</h2>

              <div className="bg-white rounded-3xl shadow p-8 mb-12">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      placeholder="Category"
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                      className="w-full border p-4 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reward Points</label>
                    <input
                      type="number"
                      placeholder="Reward (e.g. 50)"
                      value={quizReward}
                      onChange={(e) => setQuizReward(e.target.value)}
                      className="w-full border p-4 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Question</label>
                  <textarea
                    placeholder="Enter Question"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full border p-4 rounded-2xl"
                    rows={4}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Question Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setQuestionImage(e.target.files?.[0] || null)}
                    className="w-full border p-4 rounded-2xl"
                  />
                </div>

                {/* Options */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Options</h3>
                  <div className="space-y-6">
                    {quizOptions.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg">
                          {option.id}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full border p-4 rounded-2xl"
                            placeholder={`Option ${option.id}`}
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleOptionImageChange(option.id, e.target.files?.[0] || null)}
                          className="border p-3 rounded-2xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium mb-2">Correct Answer</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full border p-4 rounded-2xl"
                  >
                    <option value="">Select Correct Option</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <button
                  onClick={saveQuiz}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-bold mt-10 text-lg"
                >
                  {loading ? "Saving..." : editQuizId ? "Update Quiz" : "Create Quiz"}
                </button>
              </div>

              {/* Quiz List */}
              <h3 className="text-2xl font-bold mb-6">All Quizzes</h3>
              <div className="grid gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white p-6 rounded-3xl shadow">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                            {quiz.category}
                          </span>
                          <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-medium">
                            ⭐ {quiz.reward} Points
                          </span>
                        </div>

                        <h4 className="text-xl font-bold mb-4">{quiz.title}</h4>

                        {quiz.questionImage && (
                          <img src={quiz.questionImage} alt="Question" className="max-w-md rounded-2xl mb-6" />
                        )}

                        <div className="space-y-4">
                          {quiz.options?.map((opt: any) => (
                            <div key={opt.id} className="border p-4 rounded-2xl flex items-center gap-4">
                              <strong className="text-blue-600 w-8">{opt.id}:</strong>
                              <span className="flex-1">{opt.text}</span>
                              {opt.image && (
                                <img src={opt.image} alt={`Option ${opt.id}`} className="w-20 h-20 object-cover rounded-xl" />
                              )}
                            </div>
                          ))}
                        </div>

                        <p className="mt-6 font-semibold text-green-600">
                          Correct Answer: Option {quiz.correctAnswer}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 ml-6">
                        <button onClick={() => editQuiz(quiz)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl">Edit</button>
                        <button onClick={() => deleteQuiz(quiz._id)} className="bg-red-600 text-white px-6 py-3 rounded-2xl">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}