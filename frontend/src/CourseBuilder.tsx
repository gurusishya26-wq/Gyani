import { useState, useEffect } from "react";
import axios from "axios";

export default function CourseManagement() {
  // ================= CORE =================
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [courseType, setCourseType] = useState("");

  const [parentId, setParentId] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [editCourseId, setEditCourseId] = useState("");

  // ================= COURSE LEVEL TEST =================
  const [courseTest, setCourseTest] = useState({
    questions: [] as any[],
  });

  // ================= CHAPTERS =================
  const [chapters, setChapters] = useState([
    {
      title: "",
      lessons: [
        {
          title: "",
          videos: [] as any[],
          uploading: false,
          test: { questions: [] },
        },
      ],
      test: { questions: [] },
    },
  ]);

  // ================= FETCH =================
  useEffect(() => {
    fetchCourses();
    fetchClasses();
    fetchExams();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get("https://gyani-vxc9.onrender.com/api/courses");
    setCourses(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get("https://gyani-vxc9.onrender.com/api/classes");
    setClasses(res.data);
  };

  const fetchExams = async () => {
    const res = await axios.get("https://gyani-vxc9.onrender.com/api/competitive-exams");
    setExams(res.data);
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

  // ================= CHAPTER HELPERS =================
  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      { title: "", lessons: [], test: { questions: [] } },
    ]);
  };

  const addLesson = (chapterIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons.push({
        title: "",
        videos: [],
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
        title: "",           // Video Title
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

    try {
      setChapters((prev) => {
        const updated = [...prev];
        const lesson = updated[chapterIndex].lessons[lessonIndex];
        lesson.uploading = true;
        if (lesson.videos[videoIndex]) lesson.videos[videoIndex].progress = 0;
        return updated;
      });

      const formData = new FormData();
      formData.append("video", file);

      const res = await axios.post(
        "https://gyani-vxc9.onrender.com/api/upload-video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded)
            );
            setChapters((prev) => {
              const updated = [...prev];
              const video = updated[chapterIndex]?.lessons[lessonIndex]?.videos[videoIndex];
              if (video) video.progress = percentCompleted;
              return updated;
            });
          },
        }
      );

      const videoUrl = res.data.url;

      setChapters((prev) => {
        const updated = [...prev];
        const video = updated[chapterIndex].lessons[lessonIndex].videos[videoIndex];
        if (video) {
          video.videoUrl = videoUrl;
          video.progress = 100;
        }
        updated[chapterIndex].lessons[lessonIndex].uploading = false;
        return updated;
      });
    } catch (err) {
      console.error(err);
      setChapters((prev) => {
        const updated = [...prev];
        updated[chapterIndex].lessons[lessonIndex].uploading = false;
        const video = updated[chapterIndex].lessons[lessonIndex].videos[videoIndex];
        if (video) video.progress = 0;
        return updated;
      });
      alert("Video upload failed");
    }
  };

  // ================= MCQ HELPERS =================
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
      });
      return updated;
    });
  };

  const deleteQuestion = (chapterIndex: number, lessonIndex: number, questionIndex: number) => {
    setChapters((prev) => {
      const updated = [...prev];
      updated[chapterIndex].lessons[lessonIndex].test.questions.splice(questionIndex, 1);
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
      });
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

  // ================= COURSE LEVEL TEST HELPERS =================
  const addCourseQuestion = () => {
    setCourseTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    }));
  };

  const deleteCourseQuestion = (questionIndex: number) => {
    setCourseTest((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== questionIndex),
    }));
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
    setCourseTest(course.test || { questions: [] });

    setChapters(
      course.chapters?.length
        ? course.chapters.map((ch: any) => ({
            title: ch.title || "",
            lessons: ch.lessons?.length
              ? ch.lessons.map((ls: any) => ({
                  title: ls.title || "",
                  videos: (ls.videos || []).map((v: any) => ({
                    title: v.title || "",
                    videoUrl: v.videoUrl || "",
                    progress: 0,
                  })),
                  uploading: false,
                  test: ls.test || { questions: [] },
                }))
              : [],
            test: ch.test || { questions: [] },
          }))
        : [{ title: "", lessons: [], test: { questions: [] } }]
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
  const saveCourse = async () => {
    const payload = {
  courseTitle: courseTitle,
  description,
  price,
  courseType,
  parentId,
  subjectName,

  chapters: chapters.map((chapter) => ({
    title: chapter.title,
    lessons: chapter.lessons.map((lesson) => ({
      title: lesson.title,
      videos: lesson.videos,
      test: lesson.test,
    })),
    test: chapter.test,
  })),

  test: courseTest,
};

    if (editCourseId) {
      await axios.put(`https://gyani-vxc9.onrender.com/api/courses/${editCourseId}`, payload);
    } else {
      await axios.post("https://gyani-vxc9.onrender.com/api/courses/create", payload);
    }

    // Reset
    setEditCourseId("");
    setCourseTitle("");
    setDescription("");
    setPrice("");
    setCourseType("");
    setParentId("");
    setSubjectName("");
    setSubjects([]);
    setCourseTest({ questions: [] });
    setChapters([{ title: "", lessons: [], test: { questions: [] } }]);

    fetchCourses();
  };

  const deleteCourse = async (id: string) => {
    await axios.delete(`https://gyani-vxc9.onrender.com/api/courses/${id}`);
    fetchCourses();
  };

  // ================= UI =================
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">Course Management</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {/* Basic Info */}
        <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Course Title" className="w-full border p-3 rounded-xl mb-3" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border p-3 rounded-xl mb-3 h-24" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full border p-3 rounded-xl mb-3" />

        <select value={courseType} onChange={(e) => { setCourseType(e.target.value); setParentId(""); setSubjects([]); }} className="w-full border p-3 rounded-xl mb-3">
          <option value="">Select Type</option>
          <option value="Class">Class</option>
          <option value="Exam">Exam</option>
        </select>

        {courseType === "Class" && (
          <select value={parentId} onChange={(e) => handleParentChange("Class", e.target.value)} className="w-full border p-3 rounded-xl mb-3">
            <option>Select Class</option>
            {classes.map((c: any) => <option key={c._id} value={c._id}>Class {c.classNumber}</option>)}
          </select>
        )}

        {courseType === "Exam" && (
          <select value={parentId} onChange={(e) => handleParentChange("Exam", e.target.value)} className="w-full border p-3 rounded-xl mb-3">
            <option>Select Exam</option>
            {exams.map((e: any) => <option key={e._id} value={e._id}>{e.title}</option>)}
          </select>
        )}

        <select value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full border p-3 rounded-xl mb-5">
          <option>Select Subject</option>
          {subjects.map((s: any, i: number) => <option key={i} value={s.name}>{s.name}</option>)}
        </select>

        <h2 className="text-2xl font-bold mb-4">Chapters & Lessons</h2>

        {chapters.map((ch, i) => (
          <div key={i} className="border p-5 rounded-xl mb-6 bg-gray-50">
            <input value={ch.title || ""} onChange={(e) => updateChapter(i, e.target.value)} placeholder="Chapter Title" className="w-full border p-3 rounded-xl mb-4 text-lg font-medium" />

            {ch.lessons.map((ls, j) => (
              <div key={j} className="border rounded-xl p-4 mb-6 bg-white">
                <input value={ls.title || ""} onChange={(e) => updateLesson(i, j, e.target.value)} placeholder="Lesson Title" className="w-full border p-3 rounded-xl mb-4" />

                <button type="button" onClick={() => addVideo(i, j)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg mb-4 hover:bg-indigo-700">+ Add Video</button>

                {ls.videos.map((video: any, videoIndex: number) => (
                  <div key={videoIndex} className="border border-gray-200 p-4 rounded-lg mb-4">
                    {/* Video Title */}
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title || ""}
                      onChange={(e) => {
                        setChapters((prev) => {
                          const updated = [...prev];
                          updated[i].lessons[j].videos[videoIndex].title = e.target.value;
                          return updated;
                        });
                      }}
                      className="w-full border p-3 rounded-xl mb-3"
                    />

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => uploadLessonVideo(i, j, videoIndex, e.target.files?.[0])}
                      className="w-full border p-3 rounded-xl"
                    />

                    {video.progress > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${video.progress}%` }} />
                        </div>
                        <p className="text-center text-sm mt-1 font-medium text-blue-600">{video.progress}% Uploaded</p>
                      </div>
                    )}

                    {video.videoUrl && (
                      <p className="text-green-600 text-sm mt-3 font-medium">✅ Video Uploaded Successfully</p>
                    )}
                  </div>
                ))}

                {/* Lesson MCQ Section */}
                <div className="mt-6">
                  <button type="button" onClick={() => addQuestion(i, j)} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">+ Add Lesson MCQ</button>
                  {ls.test?.questions?.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="border rounded p-4 mt-4 bg-gray-50">
                      <h4 className="font-bold mb-2">Question {qIndex + 1}</h4>
                      <input type="text" placeholder="Enter Question" value={q.question} onChange={(e) => { setChapters((prev) => { const updated = [...prev]; updated[i].lessons[j].test.questions[qIndex].question = e.target.value; return updated; }); }} className="w-full border p-2 rounded mb-3" />
                      {q.options.map((option: string, optIndex: number) => (
                        <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} value={option} onChange={(e) => { setChapters((prev) => { const updated = [...prev]; updated[i].lessons[j].test.questions[qIndex].options[optIndex] = e.target.value; return updated; }); }} className="w-full border p-2 rounded mb-2" />
                      ))}
                      <select value={q.correctAnswer} onChange={(e) => { setChapters((prev) => { const updated = [...prev]; updated[i].lessons[j].test.questions[qIndex].correctAnswer = Number(e.target.value); return updated; }); }} className="w-full border p-2 rounded mb-3">
                        <option value={0}>Correct Option 1</option>
                        <option value={1}>Correct Option 2</option>
                        <option value={2}>Correct Option 3</option>
                        <option value={3}>Correct Option 4</option>
                      </select>
                      <button type="button" onClick={() => deleteQuestion(i, j, qIndex)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Question</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={() => addLesson(i)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">+ Add Lesson</button>

            {/* Chapter Test */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-bold mb-3">Chapter Test</h3>
              <button type="button" onClick={() => addChapterQuestion(i)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">+ Add Chapter MCQ</button>
              {ch.test?.questions?.map((q: any, qIndex: number) => (
                <div key={qIndex} className="border rounded p-4 mt-4 bg-white">
                  <input type="text" placeholder="Question" value={q.question} onChange={(e) => { setChapters((prev) => { const updated = [...prev]; updated[i].test.questions[qIndex].question = e.target.value; return updated; }); }} className="w-full border p-2 mb-3" />
                  {q.options.map((option: string, optIndex: number) => (
                    <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} value={option} onChange={(e) => { setChapters((prev) => { const updated = [...prev]; updated[i].test.questions[qIndex].options[optIndex] = e.target.value; return updated; }); }} className="w-full border p-2 mb-2" />
                  ))}
                  <select value={q.correctAnswer} onChange={(e) => { setChapters((prev) => { const updated = [...prev]; updated[i].test.questions[qIndex].correctAnswer = Number(e.target.value); return updated; }); }} className="w-full border p-2 rounded mb-3">
                    <option value={0}>Correct Option 1</option>
                    <option value={1}>Correct Option 2</option>
                    <option value={2}>Correct Option 3</option>
                    <option value={3}>Correct Option 4</option>
                  </select>
                  <button type="button" onClick={() => deleteChapterQuestion(i, qIndex)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-4 mt-6">
          <button onClick={addChapter} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">+ Add Chapter</button>
          <button onClick={saveCourse} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold">{editCourseId ? "Update Course" : "Create Course"}</button>
        </div>

        {/* Course Final Test */}
        <h2 className="text-xl font-bold mt-10">Course Final Test</h2>
        <button type="button" onClick={addCourseQuestion} className="bg-indigo-600 text-white px-4 py-2 rounded mt-3">+ Add Course MCQ</button>

        {courseTest.questions.map((q, questionIndex) => (
          <div key={questionIndex} className="border p-4 mt-4 rounded bg-gray-50">
            <input type="text" placeholder="Question" value={q.question} onChange={(e) => { const updated = { ...courseTest }; updated.questions[questionIndex].question = e.target.value; setCourseTest(updated); }} className="w-full border p-2 rounded mb-3" />
            {q.options.map((option: string, optionIndex: number) => (
              <input key={optionIndex} type="text" placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(e) => { const updated = { ...courseTest }; updated.questions[questionIndex].options[optionIndex] = e.target.value; setCourseTest(updated); }} className="w-full border p-2 rounded mb-2" />
            ))}
            <select value={q.correctAnswer} onChange={(e) => { const updated = { ...courseTest }; updated.questions[questionIndex].correctAnswer = Number(e.target.value); setCourseTest(updated); }} className="w-full border p-2 rounded mb-3">
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
            <button type="button" onClick={() => deleteCourseQuestion(questionIndex)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>

      {/* Existing Courses List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Existing Courses</h2>
        {courses.map((c) => (
          <div key={c._id} className="bg-gray-100 p-5 rounded-xl flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-gray-600">{c.subjectName} • ₹{c.price}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => editCourse(c)} className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600">Edit</button>
              <button onClick={() => deleteCourse(c._id)} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}