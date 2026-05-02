import { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Award, 
  BookOpen, 
  Edit3 
} from 'lucide-react';

const CoursePage = () => {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4"
  );

  const [activeTab, setActiveTab] = useState<'about' | 'transcript' | 'notes'>('about');
  const [notes, setNotes] = useState<string>("");

  const course = {
    title: "Mathematics Foundation for Class 10",
    description: "Master all important concepts of Class 10 Mathematics with easy explanations, solved examples, and practice tests. Completely Free!",
    instructor: "Mr. Rajesh Sharma",
    duration: "45+ hours",
    level: "Class 10",
    language: "Hindi & English",
  };

  const chapters = [
    {
      id: 1,
      title: "Chapter 1: Real Numbers",
      duration: "6 hours",
      lessons: [
        {
          id: 101,
          title: "Introduction to Real Numbers",
          duration: "28 min",
          videos: [
            { 
              id: 1011, 
              title: "What are Real Numbers?", 
              duration: "12 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" 
            },
            { 
              id: 1012, 
              title: "Types of Real Numbers", 
              duration: "16 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" 
            },
          ],
          pdfNotes: "intro-real-numbers.pdf",
        },
        {
          id: 102,
          title: "Euclid's Division Lemma",
          duration: "35 min",
          videos: [
            { 
              id: 1021, 
              title: "Understanding Euclid's Lemma", 
              duration: "20 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" 
            },
            { 
              id: 1022, 
              title: "Examples & Proof", 
              duration: "15 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" 
            },
          ],
          pdfNotes: "euclid-division.pdf",
        },
      ],
    },
    {
      id: 2,
      title: "Chapter 2: Polynomials",
      duration: "8 hours",
      lessons: [
        {
          id: 201,
          title: "Introduction to Polynomials",
          duration: "25 min",
          videos: [
            { 
              id: 2011, 
              title: "What is a Polynomial?", 
              duration: "10 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" 
            },
            { 
              id: 2012, 
              title: "Degree & Types", 
              duration: "15 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" 
            },
          ],
          pdfNotes: "intro-polynomials.pdf",
        },
      ],
    },
  ];

  // Demo Transcript (You can later make this dynamic per video)
  const currentTranscript = `In this lesson, we will understand the concept of Real Numbers. Real numbers include both rational and irrational numbers. Rational numbers can be expressed in the form of p/q where q ≠ 0. This chapter forms the foundation for all higher mathematics.`;

  const playVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const openTestInNewTab = (type: 'lesson' | 'chapter' | 'course', id?: number) => {
    const testUrl = `/test?type=${type}&courseId=${encodeURIComponent(course.title)}${id ? `&id=${id}` : ''}`;
    window.open(testUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {course.title}
          </h1>
          <span className="inline-block mt-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs md:text-sm font-medium">
            FREE COURSE
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 lg:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ====================== LEFT SIDE - VIDEO + TABS ====================== */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            
            {/* Video Player */}
            <div className="bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-xl aspect-video">
              <video
                key={currentVideoUrl}
                controls
                autoPlay
                className="w-full h-full"
              >
                <source src={currentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
              
              {/* Tab Navigation */}
              <div className="flex border-b overflow-x-auto hide-scrollbar bg-white">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 min-w-[100px] py-4 px-4 font-medium flex items-center justify-center gap-2 transition-all text-sm md:text-base whitespace-nowrap
                    ${activeTab === 'about' 
                      ? 'text-[#5faae0] border-b-4 border-[#5faae0]' 
                      : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <BookOpen className="w-5 h-5" />
                  About Course
                </button>

                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`flex-1 min-w-[100px] py-4 px-4 font-medium flex items-center justify-center gap-2 transition-all text-sm md:text-base whitespace-nowrap
                    ${activeTab === 'transcript' 
                      ? 'text-[#5faae0] border-b-4 border-[#5faae0]' 
                      : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Play className="w-5 h-5" />
                  Transcript
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 min-w-[100px] py-4 px-4 font-medium flex items-center justify-center gap-2 transition-all text-sm md:text-base whitespace-nowrap
                    ${activeTab === 'notes' 
                      ? 'text-[#5faae0] border-b-4 border-[#5faae0]' 
                      : 'text-gray-600 hover:text-gray-800'}`}
                >
                  <Edit3 className="w-5 h-5" />
                  Take Notes
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 md:p-8 min-h-[280px]">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">About This Course</h2>
                    <p className="text-gray-700 leading-relaxed text-[17px]">
                      {course.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                      <div>
                        <span className="text-gray-500 block">Instructor</span>
                        <p className="font-medium text-gray-800">{course.instructor}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Duration</span>
                        <p className="font-medium text-gray-800">{course.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Level</span>
                        <p className="font-medium text-gray-800">{course.level}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Language</span>
                        <p className="font-medium text-gray-800">{course.language}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                      <Play className="w-6 h-6 text-[#5faae0]" />
                      Video Transcript
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed border">
                      {currentTranscript}
                      <p className="text-xs text-gray-500 mt-8 italic">
                        * Transcript is auto-generated and may have minor inaccuracies.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                      <Edit3 className="w-6 h-6 text-[#5faae0]" />
                      My Notes
                    </h2>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your personal notes here... Important formulas, doubts, key points, etc."
                      className="w-full h-64 p-5 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#5faae0] resize-y min-h-[220px] text-gray-700"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => alert("✅ Notes saved successfully!")}
                        className="px-8 py-3 bg-[#5faae0] hover:bg-[#4a9bd4] text-white rounded-2xl font-medium transition"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ====================== RIGHT SIDE - COURSE CURRICULUM ====================== */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border sticky top-20 lg:top-24 overflow-hidden">
              <div className="p-5 md:p-6 border-b bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {chapters.length} Chapters • {chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)} Lessons
                </p>
              </div>

              <div className="divide-y max-h-[70vh] lg:max-h-none overflow-y-auto">
                {chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id}>
                    {/* Chapter Header */}
                    <div
                      onClick={() => {
                        setActiveChapter(activeChapter === chapterIndex ? null : chapterIndex);
                        setActiveLesson(null);
                      }}
                      className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800">{chapter.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{chapter.duration}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); openTestInNewTab('chapter', chapter.id); }}
                          className="text-xs px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl transition"
                        >
                          Chapter Test
                        </button>
                        {activeChapter === chapterIndex ? 
                          <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>

                    {/* Lessons */}
                    {activeChapter === chapterIndex && (
                      <div className="px-4 md:px-6 pb-6 bg-gray-50 space-y-4">
                        {chapter.lessons.map((lesson) => {
                          const isLessonOpen = activeLesson === lesson.id;

                          return (
                            <div key={lesson.id} className="bg-white rounded-2xl border overflow-hidden">
                              <div
                                onClick={() => setActiveLesson(isLessonOpen ? null : lesson.id)}
                                className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                                    ${completedLessons.includes(lesson.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                    {completedLessons.includes(lesson.id) ? 
                                      <CheckCircle className="w-5 h-5 text-white" /> : 
                                      <Play className="w-5 h-5 text-gray-400" />
                                    }
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm md:text-base">{lesson.title}</p>
                                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                                  </div>
                                </div>
                                {isLessonOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>

                              {isLessonOpen && (
                                <div className="px-4 md:px-5 pb-5 space-y-3">
                                  {lesson.videos.map((video) => (
                                    <div
                                      key={video.id}
                                      onClick={() => playVideo(video.videoUrl)}
                                      className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl cursor-pointer group active:scale-[0.98] transition"
                                    >
                                      <Play className="w-5 h-5 text-[#5faae0] group-hover:scale-110 transition" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-[#5faae0]">
                                          {video.title}
                                        </p>
                                        <p className="text-xs text-gray-500">{video.duration}</p>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); markLessonComplete(lesson.id); }}
                                      className="flex-1 py-3 text-sm border border-gray-300 hover:bg-gray-100 rounded-2xl transition"
                                    >
                                      Mark as Done
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); openTestInNewTab('lesson', lesson.id); }}
                                      className="flex-1 py-3 text-sm bg-[#5faae0] hover:bg-[#4a9bd4] text-white rounded-2xl transition"
                                    >
                                      Lesson Test
                                    </button>
                                    <a
                                      href={`/notes/${lesson.pdfNotes}`}
                                      target="_blank"
                                      onClick={(e) => e.stopPropagation()}
                                      className="px-4 py-3 border border-gray-300 hover:bg-gray-100 rounded-2xl flex items-center"
                                    >
                                      <FileText className="w-5 h-5" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <button
                          onClick={() => openTestInNewTab('chapter', chapter.id)}
                          className="w-full mt-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition"
                        >
                          Take Full Chapter Test
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Final Course Test */}
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50">
                  <button
                    onClick={() => openTestInNewTab('course')}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition"
                  >
                    <Award className="w-6 h-6" />
                    Take Final Course Test
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Complete all chapters to unlock certification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;