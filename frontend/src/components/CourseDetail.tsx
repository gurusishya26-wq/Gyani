import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const API_BASE = "https://gyani-vxc9.onrender.com";

  const [course, setCourse] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([0]);
  const [userNotes, setUserNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "notes">("about");
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, classesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/courses/${id}`),
          axios.get(`${API_BASE}/api/classes`)
        ]);

        setCourse(courseRes.data);
        setClasses(classesRes.data);

        // Default to Intro Video
        if (courseRes.data.introVideoUrl) {
          setCurrentVideo({ 
            title: "Course Introduction", 
            videoUrl: courseRes.data.introVideoUrl 
          });
        } else if (courseRes.data.chapters?.[0]?.lessons?.[0]?.videos?.[0]) {
          setCurrentVideo(courseRes.data.chapters[0].lessons[0].videos[0]);
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

    if (id) fetchData();
  }, [id]);

  const getClassNumber = () => {
    if (!course || !course.parentId) return "N/A";
    const foundClass = classes.find(c => c._id === course.parentId);
    return foundClass ? foundClass.classNumber : "N/A";
  };

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
    if (!isPurchased && course?.price !== "0") {
      alert("Please purchase the course to save notes.");
      return;
    }
    localStorage.setItem(`course-notes-${id}`, userNotes);
    alert("✅ Notes saved successfully!");
  };

  const openTest = (type: string, chapterIdx?: number, lessonIdx?: number) => {
    if (!isPurchased && course?.price !== "0") {
      alert("Please purchase the course to access tests.");
      return;
    }
    let url = `/test?type=${type}&courseId=${id}`;
    if (chapterIdx !== undefined) url += `&chapter=${chapterIdx}`;
    if (lessonIdx !== undefined) url += `&lesson=${lessonIdx}`;
    window.open(url, "_blank");
  };

  // ONLY Intro Video + Lesson 1 First Video are unlocked
  const isLockedContent = (chapterIdx: number, lessonIdx?: number, videoIdx?: number) => {
    if (isPurchased || course?.price === "0") return false;
    return !(chapterIdx === 0 && lessonIdx === 0 && (videoIdx === 0 || videoIdx === undefined));
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading course content...</div>;
  if (error || !course) return <div className="text-center py-20 text-red-500">{error || "Course not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Class {getClassNumber()}</span>
            <span>›</span>
            <span>{course.subjectName}</span>
            <span>›</span>
            <span className="font-semibold text-gray-800">{course.title}</span>
            {course.price !== "0" && <span className="ml-auto text-amber-600 font-bold">Paid Course</span>}
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

          {/* Tabs */}
          <div className="flex border-b mb-8 mt-8">
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

        {/* Sidebar - Course Content */}
        <div className="w-full lg:w-96 bg-white rounded-3xl shadow p-6 self-start sticky top-8">
          <h3 className="font-bold text-xl mb-6">Course Content</h3>

          {/* Intro Video - Always Unlocked */}
          {course.introVideoUrl && (
            <div className="mb-4 border rounded-2xl overflow-hidden bg-gray-50">
              <div
                onClick={() => setCurrentVideo({ title: "Course Introduction", videoUrl: course.introVideoUrl })}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-indigo-50 ${currentVideo?.title === "Course Introduction" ? 'bg-indigo-100' : ''}`}
              >
                <span className="text-xl">🎬</span>
                <span className="font-medium">Course Introduction Video</span>
              </div>
            </div>
          )}

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

                      {lesson.videos?.map((video: any, vIndex: number) => {
                        const isLocked = isLockedContent(chIndex, lsIndex, vIndex);
                        return (
                          <div
                            key={vIndex}
                            onClick={() => !isLocked && setCurrentVideo(video)}
                            className={`pl-4 py-2 text-sm flex items-center gap-2 rounded-xl mb-1 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-50'}`}
                          >
                            ▶ {video.title || `Video ${vIndex + 1}`}
                            {isLocked && <span className="text-amber-500 text-xs ml-auto">🔒</span>}
                          </div>
                        );
                      })}

                      {/* Lesson Notes - Locked */}
                      {lesson.notesUrl && (
                        <div className="pl-4 text-xs mt-2">
                          {isLockedContent() ? (
                            <span className="text-amber-600">🔒 Lesson Notes</span>
                          ) : (
                            <a href={lesson.notesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              📄 Lesson Notes
                            </a>
                          )}
                        </div>
                      )}

                      {/* Lesson Test - Locked */}
                      {lesson.test?.questions?.length > 0 && (
                        <button
                          onClick={() => openTest("lesson", chIndex, lsIndex)}
                          className="ml-4 mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm px-5 py-2 rounded-full flex items-center gap-2"
                        >
                          📝 Take Lesson Test
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Chapter Notes - Locked */}
                  {chapter.notesUrl && (
                    <div className="mt-4 pl-4">
                      {isLockedContent() ? (
                        <span className="text-amber-600">🔒 Chapter Notes</span>
                      ) : (
                        <a href={chapter.notesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 text-sm">
                          📄 Chapter Notes
                        </a>
                      )}
                    </div>
                  )}

                  {/* Chapter Test - Locked */}
                  {chapter.test?.questions?.length > 0 && (
                    <button
                      onClick={() => openTest("chapter", chIndex)}
                      className="ml-4 mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-full flex items-center gap-2"
                    >
                      📝 Take Chapter Test
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Course Notes - Locked */}
          {course.notesUrl && (
            <div className="mt-8 pt-6 border-t">
              {isLockedContent() ? (
                <div className="text-amber-600 flex items-center gap-2">
                  🔒 Complete Course Notes
                </div>
              ) : (
                <a href={course.notesUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                  📄 Complete Course Notes
                </a>
              )}
            </div>
          )}

          {/* Final Test - Locked */}
          {course.test?.questions?.length > 0 && (
            <button
              onClick={() => openTest("final")}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2"
            >
              📝 Take Final Course Test
            </button>
          )}

          {/* Purchase Button for Paid Courses */}
          {!isPurchased && course?.price !== "0" && (
            <button
              onClick={() => alert("Redirect to Payment Gateway - Coming Soon")}
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-semibold text-lg hover:brightness-110"
            >
              💰 Purchase Course - ₹{course.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
