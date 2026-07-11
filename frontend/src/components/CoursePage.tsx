import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000//api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
        setError("Course not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-2xl">Loading course content...</div>;
  if (error || !course) return <div className="text-center py-20 text-red-500 text-xl">{error || "Course not found"}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <p className="text-xl text-gray-600">{course.description}</p>

          <div className="mt-6 flex gap-4">
            <div className="text-3xl font-bold text-emerald-600">
              {course.price === "0" || course.price === 0 ? "Free" : `₹${course.price}`}
            </div>
            <div className="text-sm bg-gray-100 px-4 py-2 rounded-2xl self-center">
              {course.type}
            </div>
          </div>
        </div>

        {/* Chapters */}
        <h2 className="text-3xl font-bold mb-8">Course Content</h2>

        {course.chapters?.map((chapter: any, chIndex: number) => (
          <div key={chIndex} className="mb-12 bg-white rounded-3xl p-8 shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {chIndex + 1}
              </div>
              <h3 className="text-2xl font-bold">{chapter.title}</h3>
            </div>

            {chapter.notesUrl && (
              <a href={chapter.notesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mb-6">
                📄 Download Chapter Notes
              </a>
            )}

            {/* Lessons */}
            {chapter.lessons?.map((lesson: any, lsIndex: number) => (
              <div key={lsIndex} className="mb-10 pl-6 border-l-4 border-indigo-200">
                <h4 className="font-semibold text-xl mb-4">{lesson.title}</h4>

                {/* Videos */}
                {lesson.videos?.length > 0 && (
                  <div className="mb-6">
                    <p className="font-medium mb-3">📹 Videos</p>
                    {lesson.videos.map((video: any, vIndex: number) => (
                      video.videoUrl && (
                        <div key={vIndex} className="mb-6 bg-gray-50 p-4 rounded-2xl">
                          <p className="font-medium mb-2">{video.title}</p>
                          <video controls className="w-full rounded-xl">
                            <source src={video.videoUrl} type="video/mp4" />
                          </video>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Lesson Notes */}
                {lesson.notesUrl && (
                  <a href={lesson.notesUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mb-6">
                    📄 Lesson Notes PDF
                  </a>
                )}

                {/* Lesson Test */}
                {lesson.test?.questions?.length > 0 && (
                  <div>
                    <p className="font-medium mb-4">📝 Lesson Test</p>
                    {lesson.test.questions.map((q: any, qIndex: number) => (
                      <div key={qIndex} className="bg-gray-50 p-5 rounded-2xl mb-6">
                        <p className="font-medium mb-4">Q{qIndex + 1}. {q.question}</p>
                        {q.imageUrl && <img src={q.imageUrl} alt="Question" className="mb-4 rounded-lg max-w-full" />}
                        <div className="grid gap-3">
                          {q.options.map((opt: string, oIndex: number) => (
                            <div
                              key={oIndex}
                              className={`p-4 rounded-xl border ${oIndex === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Course Final Test */}
        {course.test?.questions?.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow mt-12">
            <h3 className="text-2xl font-bold mb-6">Final Course Assessment</h3>
            {course.test.questions.map((q: any, qIndex: number) => (
              <div key={qIndex} className="bg-gray-50 p-5 rounded-2xl mb-6">
                <p className="font-medium mb-4">Q{qIndex + 1}. {q.question}</p>
                {q.imageUrl && <img src={q.imageUrl} alt="Question" className="mb-4 rounded-lg" />}
                <div className="grid gap-3">
                  {q.options.map((opt: string, oIndex: number) => (
                    <div
                      key={oIndex}
                      className={`p-4 rounded-xl border ${oIndex === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}