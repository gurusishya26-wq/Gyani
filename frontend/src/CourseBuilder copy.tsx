import { useState, useEffect } from "react";
import axios from "axios";

export default function CourseBuilder() {
  // ================= CONFIG =================
  const API_BASE = "https://gyani-vxc9.onrender.com/";   // ← Change to production URL when deploying

  // ================= CORE STATE =================
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [courseType, setCourseType] = useState("");

  const [parentId, setParentId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [courseNotesUrl, setCourseNotesUrl] = useState("");

  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [editCourseId, setEditCourseId] = useState("");

  // ================= TESTS =================
  const [courseTest, setCourseTest] = useState({ questions: [] as any[] });

  // ================= CHAPTERS & LESSONS =================
  const [chapters, setChapters] = useState([
    {
      title: "",
      notesUrl: "",
      lessons: [
        {
          title: "",
          videos: [] as any[],
          notesUrl: "",
          uploading: false,
          test: { questions: [] as any[] },
        },
      ],
      test: { questions: [] as any[] },
    },
  ]);

  // ================= FETCH =================
  useEffect(() => {
    fetchCourses();
    fetchClasses();
    fetchExams();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/competitive-exams`);
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= PARENT =================
  const handleParentChange = (type: string, id: string) => {
    setParentId(id);
    if (type === "Class") {
      const selected = classes.find((c: any) => c._id === id);
      setSubjects(selected?.subjects || []);
    }
    if (type === "Exam") {
      const selected = exams.find((e: any) => e._id === id);
      setSubjects(selected?.subjects || []);
    }
  };

  // ================= FILE UPLOAD HELPER =================
  const uploadFile = async (
    file: File | undefined,
    type: "pdf" | "video" | "image",
    onSuccess: (url: string) => void,
    onProgress?: (progress: number) => void
  ) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append(type, file);

      const res = await axios.post(`${API_BASE}/api/upload-${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
            );
            onProgress(percentCompleted);
          }
        },
      });

      onSuccess(res.data.url);
    } catch (err: any) {
      console.error(err);
      alert(`${type.toUpperCase()} upload failed: ${err.response?.data?.error || err.message}`);
    }
  };

  // ================= PDF UPLOAD HANDLERS =================
  const uploadLessonNotes = async (chapterIndex: number, lessonIndex: number, file: File | undefined) => {
    if (!file) return;
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons[lessonIndex].uploading = true;
      return updated;
    });

    uploadFile(file, "pdf", (url) => {
      setChapters((prev) => {
        const updated = [...prev];
        updated[chapterIndex].lessons[lessonIndex].notesUrl = url;
        updated[chapterIndex].lessons[lessonIndex].uploading = false;
        return updated;
      });
    });
  };

  const uploadChapterNotes = async (chapterIndex: number, file: File | undefined) => {
    if (!file) return;
    uploadFile(file, "pdf", (url) => {
      setChapters((prev) => {
        const updated = [...prev];
        updated[chapterIndex].notesUrl = url;
        return updated;
      });
    });
  };

  const uploadCourseNotes = async (file: File | undefined) => {
    if (!file) return;
    uploadFile(file, "pdf", setCourseNotesUrl);
  };

  // ================= CHAPTER & LESSON HELPERS =================
  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      { title: "", notesUrl: "", lessons: [], test: { questions: [] } },
    ]);
  };

  const addLesson = (chapterIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons.push({
        title: "",
        videos: [],
        notesUrl: "",
        uploading: false,
        test: { questions: [] },
      });
      return updated;
    });
  };

  const updateChapter = (index: number, value: string) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[index].title = value;
      return updated;
    });
  };

  const updateLesson = (chapterIndex: number, lessonIndex: number, value: string) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons[lessonIndex].title = value;
      return updated;
    });
  };

  // ================= VIDEO HELPERS =================
  const addVideo = (chapterIndex: number, lessonIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons[lessonIndex].videos.push({
        title: "",
        videoUrl: "",
        progress: 0,
      });
      return updated;
    });
  };

  const uploadLessonVideo = async (
    chapterIndex: number,
    lessonIndex: number,
    videoIndex: number,
    file: File | undefined
  ) => {
    if (!file) return;

    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons[lessonIndex].uploading = true;
      if (updated[chapterIndex].lessons[lessonIndex].videos[videoIndex]) {
        updated[chapterIndex].lessons[lessonIndex].videos[videoIndex].progress = 0;
      }
      return updated;
    });

    uploadFile(
      file,
      "video",
      (url) => {
        setChapters((prev) => {
          const updated = [...prev];
          const video = updated[chapterIndex].lessons[lessonIndex].videos[videoIndex];
          if (video) {
            video.videoUrl = url;
            video.progress = 100;
          }
          updated[chapterIndex].lessons[lessonIndex].uploading = false;
          return updated;
        });
      },
      (progress) => {
        setChapters((prev) => {
          const updated = [...prev];
          const video = updated[chapterIndex]?.lessons[lessonIndex]?.videos[videoIndex];
          if (video) video.progress = progress;
          return updated;
        });
      }
    );
  };

  // ================= QUESTION HELPERS =================
  const addQuestion = (chapterIndex: number, lessonIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      if (!updated[chapterIndex].lessons[lessonIndex].test) {
        updated[chapterIndex].lessons[lessonIndex].test = { questions: [] };
      }
      updated[chapterIndex].lessons[lessonIndex].test.questions.push({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        imageUrl: "",
      });
      return updated;
    });
  };

  const addChapterQuestion = (chapterIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      if (!updated[chapterIndex].test) updated[chapterIndex].test = { questions: [] };
      updated[chapterIndex].test.questions.push({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        imageUrl: "",
      });
      return updated;
    });
  };

  const addCourseQuestion = () => {
    setCourseTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0, imageUrl: "" },
      ],
    }));
  };

  const deleteQuestion = (chapterIndex: number, lessonIndex: number, questionIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons[lessonIndex].test.questions.splice(questionIndex, 1);
      return updated;
    });
  };

  const deleteChapterQuestion = (chapterIndex: number, questionIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].test.questions.splice(questionIndex, 1);
      return updated;
    });
  };

  const deleteCourseQuestion = (questionIndex: number) => {
    setCourseTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== questionIndex),
    }));
  };

  // ================= IMAGE UPLOAD =================
  const uploadQuestionImage = async (
    chapterIndex: number | null,
    lessonIndex: number | null,
    questionIndex: number,
    isChapterTest: boolean = false,
    isCourseTest: boolean = false,
    file: File | undefined
  ) => {
    if (!file) return;
    uploadFile(
      file,
      "image",
      (imageUrl) => {
        if (isCourseTest) {
          setCourseTest((prev) => {
            const updated = { ...prev };
            updated.questions[questionIndex].imageUrl = imageUrl;
            return updated;
          });
        } else if (chapterIndex !== null) {
          setChapters((prev) => {
            const updated = [...prev];
            if (isChapterTest) {
              updated[chapterIndex].test.questions[questionIndex].imageUrl = imageUrl;
            } else if (lessonIndex !== null) {
              updated[chapterIndex].lessons[lessonIndex].test.questions[questionIndex].imageUrl = imageUrl;
            }
            return updated;
          });
        }
      }
    );
  };

  // ================= EDIT =================
  const editCourse = (course: any) => {
    setEditCourseId(course._id);
    setCourseTitle(course.title || "");
    setDescription(course.description || "");
    setPrice(course.price || "");
    setCourseType(course.type || "");
    setParentId(course.parentId || "");
    setSubjectName(course.subjectName || "");
    setCourseNotesUrl(course.notesUrl || "");

    setCourseTest(course.test || { questions: [] });

    setChapters(
      course.chapters?.length
        ? course.chapters.map((ch: any) => ({
            title: ch.title || "",
            notesUrl: ch.notesUrl || "",
            lessons: ch.lessons?.length
              ? ch.lessons.map((ls: any) => ({
                  title: ls.title || "",
                  videos: (ls.videos || []).map((v: any) => ({ ...v, progress: 0 })),
                  notesUrl: ls.notesUrl || "",
                  uploading: false,
                  test: ls.test || { questions: [] },
                }))
              : [],
            test: ch.test || { questions: [] },
          }))
        : [{ title: "", notesUrl: "", lessons: [], test: { questions: [] } }]
    );

    if (course.type === "Class") {
      const selected = classes.find((c: any) => c._id === course.parentId);
      setSubjects(selected?.subjects || []);
    }
    if (course.type === "Exam") {
      const selected = exams.find((e: any) => e._id === course.parentId);
      setSubjects(selected?.subjects || []);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= SAVE =================
  // ================= SAVE COURSE (FIXED) =================
  const saveCourse = async () => {
    if (!courseTitle.trim()) {
      alert("Course Title is required!");
      return;
    }
    if (!courseType) {
      alert("Please select Course Type (Class or Exam)!");
      return;
    }

    const payload = {
      title: courseTitle.trim(),
      description: description.trim(),
      price: price.trim(),
      type: courseType,
      parentId: parentId || undefined,
      subjectName: subjectName || undefined,
      notesUrl: courseNotesUrl || undefined,
      chapters: chapters.map((chapter) => ({
        title: chapter.title.trim(),
        notesUrl: chapter.notesUrl || undefined,
        lessons: chapter.lessons.map((lesson) => ({
          title: lesson.title.trim(),
          videos: lesson.videos,
          notesUrl: lesson.notesUrl || undefined,
          test: lesson.test,
        })),
        test: chapter.test,
      })),
      test: courseTest,
    };

    console.log("Sending Payload:", payload);   // For debugging

    try {
      if (editCourseId) {
        await axios.put(`${API_BASE}/api/courses/${editCourseId}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/courses/create`, payload);
      }
      alert("✅ Course saved successfully!");
      resetForm();
      fetchCourses();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save course: " + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setEditCourseId("");
    setCourseTitle("");
    setDescription("");
    setPrice("");
    setCourseType("");
    setParentId("");
    setSubjectName("");
    setCourseNotesUrl("");
    setSubjects([]);
    setCourseTest({ questions: [] });
    setChapters([{ title: "", notesUrl: "", lessons: [], test: { questions: [] } }]);
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API_BASE}/api/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  // ================= REUSABLE RENDERERS =================
  const renderNotesUploader = (
    label: string,
    currentUrl: string,
    onUpload: (file: File | undefined) => void,
    isUploading: boolean = false
  ) => (
    <div className="mt-6 p-5 border rounded-xl bg-white">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => onUpload(e.target.files?.[0])}
        className="w-full border p-3 rounded-xl"
      />
      {isUploading && <p className="text-blue-600 mt-2">Uploading PDF...</p>}
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center gap-2 mt-3"
        >
          📄 View/Download Notes PDF
        </a>
      )}
    </div>
  );

  const renderQuestion = (
    q: any,
    qIndex: number,
    chapterIndex: number | null,
    lessonIndex: number | null,
    isChapterTest: boolean,
    isCourseTest: boolean,
    onQuestionChange: (val: string) => void,
    onOptionChange: (optIndex: number, val: string) => void,
    onCorrectChange: (val: number) => void,
    onDelete: () => void
  ) => (
    <div key={qIndex} className="border rounded-xl p-5 mt-4 bg-gray-50">
      <h4 className="font-bold mb-3">Question {qIndex + 1}</h4>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Question Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadQuestionImage(chapterIndex, lessonIndex, qIndex, isChapterTest, isCourseTest, e.target.files?.[0])}
          className="w-full border p-3 rounded-xl"
        />
        {q.imageUrl && (
          <div className="mt-3">
            <img src={q.imageUrl} alt="Question" className="max-w-full h-auto border rounded-lg shadow" />
            <p className="text-green-600 text-sm mt-1">✅ Image Uploaded</p>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Question Text (optional if using image)"
        value={q.question || ""}
        onChange={(e) => onQuestionChange(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3"
      />

      {q.options.map((option: string, optIndex: number) => (
        <input
          key={optIndex}
          type="text"
          placeholder={`Option ${optIndex + 1}`}
          value={option}
          onChange={(e) => onOptionChange(optIndex, e.target.value)}
          className="w-full border p-3 rounded-xl mb-2"
        />
      ))}

      <select
        value={q.correctAnswer}
        onChange={(e) => onCorrectChange(Number(e.target.value))}
        className="w-full border p-3 rounded-xl mb-4"
      >
        <option value={0}>Correct Option 1</option>
        <option value={1}>Correct Option 2</option>
        <option value={2}>Correct Option 3</option>
        <option value={3}>Correct Option 4</option>
      </select>

      <button type="button" onClick={onDelete} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">
        Delete Question
      </button>
    </div>
  );

  // ================= UI =================
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Course Builder</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl">
        {/* Basic Info */}
        <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Course Title" className="w-full border p-4 rounded-xl mb-4" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border p-4 rounded-xl mb-4 h-28" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)" className="w-full border p-4 rounded-xl mb-4" />

        <select value={courseType} onChange={(e) => { setCourseType(e.target.value); setParentId(""); setSubjects([]); }} className="w-full border p-4 rounded-xl mb-4">
          <option value="">Select Type</option>
          <option value="Class">Class</option>
          <option value="Exam">Exam</option>
        </select>

        {courseType === "Class" && (
          <select value={parentId} onChange={(e) => handleParentChange("Class", e.target.value)} className="w-full border p-4 rounded-xl mb-4">
            <option value="">Select Class</option>
            {classes.map((c: any) => <option key={c._id} value={c._id}>Class {c.classNumber}</option>)}
          </select>
        )}

        {courseType === "Exam" && (
          <select value={parentId} onChange={(e) => handleParentChange("Exam", e.target.value)} className="w-full border p-4 rounded-xl mb-4">
            <option value="">Select Exam</option>
            {exams.map((e: any) => <option key={e._id} value={e._id}>{e.title}</option>)}
          </select>
        )}

        <select value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full border p-4 rounded-xl mb-8">
          <option value="">Select Subject</option>
          {subjects.map((s: any, i: number) => <option key={i} value={s.name}>{s.name}</option>)}
        </select>

        <h2 className="text-2xl font-bold mb-6">Chapters & Lessons</h2>

        {chapters.map((ch, i) => (
          <div key={i} className="border p-6 rounded-2xl mb-8 bg-gray-50">
            <input value={ch.title} onChange={(e) => updateChapter(i, e.target.value)} placeholder="Chapter Title" className="w-full border p-4 rounded-xl mb-6 text-lg font-medium" />

            {ch.lessons.map((ls, j) => (
              <div key={j} className="bg-white border p-6 rounded-xl mb-8">
                <input value={ls.title} onChange={(e) => updateLesson(i, j, e.target.value)} placeholder="Lesson Title" className="w-full border p-4 rounded-xl mb-4" />

                <button onClick={() => addVideo(i, j)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg mb-4">+ Add Video</button>

                {ls.videos.map((video: any, vIndex: number) => (
                  <div key={vIndex} className="border p-4 rounded-lg mb-4">
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title || ""}
                      onChange={(e) => {
                        setChapters((prev) => {
                          const updated = [...prev];
                          updated[i].lessons[j].videos[vIndex].title = e.target.value;
                          return updated;
                        });
                      }}
                      className="w-full border p-3 rounded-xl mb-3"
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => uploadLessonVideo(i, j, vIndex, e.target.files?.[0])}
                      className="w-full border p-3 rounded-xl"
                    />
                    {video.progress > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 h-3 rounded-full">
                          <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${video.progress}%` }} />
                        </div>
                        <p className="text-center text-sm mt-1">{video.progress}%</p>
                      </div>
                    )}
                    {video.videoUrl && <p className="text-green-600 mt-2">✅ Uploaded</p>}
                  </div>
                ))}

                {renderNotesUploader("Lesson Notes (PDF)", ls.notesUrl, (file) => uploadLessonNotes(i, j, file), ls.uploading)}

                <div className="mt-8">
                  <h3 className="font-bold mb-3">Lesson Test</h3>
                  <button onClick={() => addQuestion(i, j)} className="bg-orange-600 text-white px-5 py-2 rounded-lg mb-4">+ Add Lesson Question</button>
                  {ls.test?.questions?.map((q: any, qIndex: number) =>
                    renderQuestion(q, qIndex, i, j, false, false,
                      (val) => setChapters((prev) => { const u = [...prev]; u[i].lessons[j].test.questions[qIndex].question = val; return u; }),
                      (optIdx, val) => setChapters((prev) => { const u = [...prev]; u[i].lessons[j].test.questions[qIndex].options[optIdx] = val; return u; }),
                      (val) => setChapters((prev) => { const u = [...prev]; u[i].lessons[j].test.questions[qIndex].correctAnswer = val; return u; }),
                      () => deleteQuestion(i, j, qIndex)
                    )
                  )}
                </div>
              </div>
            ))}

            <button onClick={() => addLesson(i)} className="bg-blue-600 text-white px-6 py-3 rounded-lg">+ Add Lesson</button>

            {renderNotesUploader("Chapter Notes (PDF)", ch.notesUrl, (file) => uploadChapterNotes(i, file))}

            <div className="mt-10 pt-6 border-t">
              <h3 className="font-bold mb-3">Chapter Test</h3>
              <button onClick={() => addChapterQuestion(i)} className="bg-purple-600 text-white px-5 py-2 rounded-lg mb-4">+ Add Chapter Question</button>
              {ch.test?.questions?.map((q: any, qIndex: number) =>
                renderQuestion(q, qIndex, i, null, true, false,
                  (val) => setChapters((prev) => { const u = [...prev]; u[i].test.questions[qIndex].question = val; return u; }),
                  (optIdx, val) => setChapters((prev) => { const u = [...prev]; u[i].test.questions[qIndex].options[optIdx] = val; return u; }),
                  (val) => setChapters((prev) => { const u = [...prev]; u[i].test.questions[qIndex].correctAnswer = val; return u; }),
                  () => deleteChapterQuestion(i, qIndex)
                )
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-4 mt-8">
          <button onClick={addChapter} className="bg-purple-600 text-white px-8 py-4 rounded-xl">+ Add Chapter</button>
        </div>

        {/* Course Final Test */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Course Final Test</h2>
          <button onClick={addCourseQuestion} className="bg-indigo-600 text-white px-5 py-2 rounded-lg mb-4">+ Add Course Question</button>
          {courseTest.questions.map((q, qIndex) =>
            renderQuestion(q, qIndex, null, null, false, true,
              (val) => { const u = { ...courseTest }; u.questions[qIndex].question = val; setCourseTest(u); },
              (optIdx, val) => { const u = { ...courseTest }; u.questions[qIndex].options[optIdx] = val; setCourseTest(u); },
              (val) => { const u = { ...courseTest }; u.questions[qIndex].correctAnswer = val; setCourseTest(u); },
              () => deleteCourseQuestion(qIndex)
            )
          )}
        </div>

        {/* Course Notes */}
        <div className="mt-12">
          {renderNotesUploader("Course Notes (PDF)", courseNotesUrl, uploadCourseNotes)}
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={saveCourse} className="bg-green-600 text-white px-10 py-4 rounded-xl font-semibold">
            {editCourseId ? "Update Course" : "Create Course"}
          </button>
        </div>
      </div>

      {/* Existing Courses */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Existing Courses</h2>
        {courses.map((c) => (
          <div key={c._id} className="bg-gray-100 p-5 rounded-xl flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-gray-600">{c.subjectName} • ₹{c.price}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => editCourse(c)} className="bg-blue-500 text-white px-5 py-2 rounded-lg">Edit</button>
              <button onClick={() => deleteCourse(c._id)} className="bg-red-500 text-white px-5 py-2 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}