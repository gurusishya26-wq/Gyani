import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ Correct Dynamic API URL
  const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://gyani-vxc9.onrender.com";

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([0]);
  const [userNotes, setUserNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "notes">("about");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/courses/${id}`);
        setCourse(res.data);

        if (res.data.introVideoUrl) {
          setCurrentVideo({ 
            title: "Course Introduction", 
            videoUrl: res.data.introVideoUrl 
          });
        } else if (res.data.chapters?.[0]?.lessons?.[0]?.videos?.[0]) {
          setCurrentVideo(res.data.chapters[0].lessons[0].videos[0]);
        }

        const savedNotes = localStorage.getItem(`course-notes-${id}`);
        if (savedNotes) setUserNotes(savedNotes);
      } catch (err) {
        console.error(err);
        setError("Course not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // Video Switch
  useEffect(() => {
    if (!currentVideo?.videoUrl || !videoRef.current) return;
    const video = videoRef.current;
    video.src = currentVideo.videoUrl;
    video.load();
    video.play().catch(() => {});
  }, [currentVideo]);

  const toggleChapter = (index: number) => {
    if (expandedChapters.includes(index)) {
      setExpandedChapters(expandedChapters.filter(i => i !== index));
    } else {
      setExpandedChapters([...expandedChapters, index]);
    }
  };

  const saveNotes = () => {
    localStorage.setItem(`course-notes-${id}`, userNotes);
    alert("✅ Notes saved successfully!");
  };

  const openTest = (type: string, chapterIdx?: number, lessonIdx?: number) => {
    let url = `/test?type=${type}&courseId=${id}`;
    if (chapterIdx !== undefined) url += `&chapter=${chapterIdx}`;
    if (lessonIdx !== undefined) url += `&lesson=${lessonIdx}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading course content...</div>;
  if (error || !course) return <div className="text-center py-20 text-red-500">{error || "Course not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Class 8</span>
            <span>›</span>
            <span>{course.subjectName}</span>
            <span>›</span>
            <span className="font-semibold text-gray-800">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-6 py-8">
        {/* Main Video Area */}
        <div className="flex-1">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video mb-6">
            {currentVideo?.videoUrl ? (
              <video 
                ref={videoRef}
                controls 
                autoPlay 
                className="w-full h-full"
                controlsList="nodownload noplaybackrate"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="h-full flex items-center justify-center text-white text-xl">
                Select a video from the right sidebar
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-1">{currentVideo?.title || course.title}</h2>
          <p className="text-gray-600 mb-8">{course.description}</p>

          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-8 py-4 font-medium ${activeTab === "about" ? "border-b-4 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
            >
              About Course
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-8 py-4 font-medium ${activeTab === "notes" ? "border-b-4 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
            >
              My Notes
            </button>
          </div>

          {activeTab === "about" && (
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg leading-relaxed">{course.description}</p>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Write your personal notes here..."
                className="w-full h-96 p-6 border rounded-3xl focus:outline-none focus:border-indigo-500 resize-y"
              />
              <button
                onClick={saveNotes}
                className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-700 font-medium"
              >
                💾 Save Notes
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white rounded-3xl shadow p-6 self-start sticky top-8">
          <h3 className="font-bold text-xl mb-6">Course Content</h3>

          {course.chapters?.map((chapter: any, chIndex: number) => (
            <div key={chIndex} className="mb-4 border rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleChapter(chIndex)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left font-medium"
              >
                <span>Chapter {chIndex + 1}: {chapter.title}</span>
                <span>{expandedChapters.includes(chIndex) ? "−" : "+"}</span>
              </button>

              {expandedChapters.includes(chIndex) && (
                <div className="px-4 pb-4">
                  {chapter.lessons?.map((lesson: any, lsIndex: number) => (
                    <div key={lsIndex} className="pl-4 py-3 border-l border-gray-200">
                      <p className="font-medium text-sm mb-2">{lesson.title}</p>

                      {lesson.videos?.map((video: any, vIndex: number) => (
                        video.videoUrl && (
                          <div
                            key={vIndex}
                            onClick={() => setCurrentVideo(video)}
                            className={`pl-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 rounded-xl flex items-center gap-2 ${currentVideo?.videoUrl === video.videoUrl ? 'bg-indigo-100 text-indigo-700' : ''}`}
                          >
                            ▶ {video.title || `Video ${vIndex + 1}`}
                          </div>
                        )
                      ))}

                      {lesson.notesUrl && (
                        <a href={lesson.notesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block pl-4 text-xs mt-2">
                          📄 Lesson Notes
                        </a>
                      )}

                      {lesson.test?.questions?.length > 0 && (
                        <button
                          onClick={() => openTest("lesson", chIndex, lsIndex)}
                          className="ml-4 mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm px-5 py-2 rounded-full flex items-center gap-2"
                        >
                          📝 Take Lesson Test ({lesson.test.questions.length} Qs)
                        </button>
                      )}
                    </div>
                  ))}

                  {chapter.notesUrl && (
                    <div className="mt-4 pl-4">
                      <a href={chapter.notesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 text-sm">
                        📄 Chapter Notes
                      </a>
                    </div>
                  )}

                  {chapter.test?.questions?.length > 0 && (
                    <button
                      onClick={() => openTest("chapter", chIndex)}
                      className="ml-4 mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-full flex items-center gap-2"
                    >
                      📝 Take Chapter Test ({chapter.test.questions.length} Qs)
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {course.notesUrl && (
            <div className="mt-8 pt-6 border-t">
              <a href={course.notesUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                📄 Complete Course Notes
              </a>
            </div>
          )}

          {course.test?.questions?.length > 0 && (
            <button
              onClick={() => openTest("final")}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2"
            >
              📝 Take Final Course Test ({course.test.questions.length} Questions)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
