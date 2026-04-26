import { useState } from 'react';
import { FileText, CheckCircle, ChevronDown, ChevronUp, Play } from 'lucide-react';

const CoursePage = () => {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4"
  );

  const course = {
    title: "Mathematics Foundation for Class 10",
    description: "Master all important concepts of Class 10 Mathematics with easy explanations, solved examples, and practice tests. Completely Free!",
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
          videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4"
        },
        { 
          id: 102, 
          title: "Euclid's Division Lemma", 
          duration: "35 min",
          videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4"
        },
        { 
          id: 103, 
          title: "Fundamental Theorem of Arithmetic", 
          duration: "42 min",
          videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4"
        },
      ],
      pdfNotes: "real-numbers-notes.pdf",
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
          videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4"
        },
        { 
          id: 202, 
          title: "Zeros of a Polynomial", 
          duration: "38 min",
          videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4"
        },
      ],
      pdfNotes: "polynomials-notes.pdf",
    },
  ];

  // Play lesson video in main player
  const playLessonVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  // Open Test in NEW TAB
  const openTestInNewTab = (type: 'lesson' | 'chapter', id: number) => {
    const testUrl = `/test?type=${type}&courseId=${course.title}&id=${id}`;
    window.open(testUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{course.title}</h1>
          <span className="inline-block mt-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
            FREE COURSE
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side - Video Player + Description */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Video Player */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
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

          {/* Course Description */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {course.description}
            </p>
          </div>
        </div>

        {/* Right Side - Chapters & Lessons */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-sm border sticky top-24 overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
              <p className="text-sm text-gray-500 mt-1">2 Chapters • 5 Lessons</p>
            </div>

            <div className="divide-y">
              {chapters.map((chapter, index) => (
                <div key={chapter.id}>
                  {/* Chapter Header */}
                  <div
                    onClick={() => setActiveChapter(activeChapter === index ? null : index)}
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{chapter.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{chapter.duration}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          openTestInNewTab('chapter', chapter.id); 
                        }}
                        className="text-xs px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl transition"
                      >
                        Chapter Test
                      </button>
                      <a
                        href={`/notes/${chapter.pdfNotes}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FileText className="w-5 h-5" />
                      </a>
                      {activeChapter === index ? 
                        <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </div>

                  {/* Lessons List */}
                  {activeChapter === index && (
                    <div className="px-6 pb-6 bg-gray-50">
                      {chapter.lessons.map((lesson) => (
                        <div 
                          key={lesson.id} 
                          className="flex items-center justify-between py-4 border-b last:border-none group"
                        >
                          <div 
                            onClick={() => playLessonVideo(lesson.videoUrl)}
                            className="flex items-center gap-4 flex-1 cursor-pointer hover:text-[#5faae0] transition"
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2
                              ${completedLessons.includes(lesson.id) 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300 group-hover:border-[#5faae0]'}`}>
                              {completedLessons.includes(lesson.id) ? 
                                <CheckCircle className="w-4 h-4 text-white" /> : 
                                <Play className="w-4 h-4 text-gray-400" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 group-hover:text-[#5faae0]">{lesson.title}</p>
                              <p className="text-xs text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                markLessonComplete(lesson.id); 
                              }}
                              className="text-xs px-3 py-1.5 border border-gray-300 hover:bg-white rounded-lg transition"
                            >
                              Done
                            </button>
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                openTestInNewTab('lesson', lesson.id); 
                              }}
                              className="text-xs px-4 py-1.5 bg-[#5faae0] hover:bg-[#4a9bd4] text-white rounded-lg transition"
                            >
                              MCQ Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;