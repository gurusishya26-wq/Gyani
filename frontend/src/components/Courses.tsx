import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

const CoursePage = () => {
  const navigate = useNavigate();

  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeTopic, setActiveTopic] = useState<number | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(
    "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4"
  );

  const [activeTab, setActiveTab] = useState<'about' | 'transcript' | 'notes'>('about');
  const [notes, setNotes] = useState<string>("");

  const course = {
    title: "Maths for Class 5",
    description: "Learn Mathematics in a simple and easy way.",
    instructor: "Teacher Priya",
    duration: "30+ hours",
    level: "Class 5",
    language: "Hindi & English",
  };

  const chapters = [
    {
      id: 0,
      title: "Introduction",
      isIntro: true,
      topics: [
        {
          id: 1,
          title: "Welcome to Class 5 Maths",
          duration: "15 min",
          videos: [
            { 
              id: 11, 
              title: "Course Introduction", 
              duration: "15 min", 
              videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" 
            }
          ]
        }
      ]
    },
    {
      id: 1,
      title: "Chapter 1 – Number System",
      topics: [
        {
          id: 101,
          title: "Natural Numbers",
          duration: "45 min",
          videos: [
            { id: 1011, title: "Natural Numbers - Part 1", duration: "22 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" },
            { id: 1012, title: "Natural Numbers - Part 2", duration: "23 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" }
          ]
        },
        {
          id: 102,
          title: "Whole Numbers",
          duration: "50 min",
          videos: [
            { id: 1021, title: "Whole Numbers - Part 1", duration: "25 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" },
            { id: 1022, title: "Whole Numbers - Part 2", duration: "25 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" }
          ]
        },
        {
          id: 103,
          title: "Integers",
          duration: "55 min",
          videos: [
            { id: 1031, title: "Integers - Part 1", duration: "28 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" },
            { id: 1032, title: "Integers - Part 2", duration: "27 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Chapter 2 – Probability and Statistics",
      topics: [
        {
          id: 201,
          title: "Probability",
          duration: "40 min",
          videos: [
            { id: 2011, title: "Probability - Part 1", duration: "20 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" },
            { id: 2012, title: "Probability - Part 2", duration: "20 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" }
          ]
        },
        {
          id: 202,
          title: "Venn Diagrams",
          duration: "35 min",
          videos: [
            { id: 2021, title: "Venn Diagrams - Part 1", duration: "18 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" },
            { id: 2022, title: "Venn Diagrams - Part 2", duration: "17 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" }
          ]
        },
        {
          id: 203,
          title: "Statistics",
          duration: "45 min",
          videos: [
            { id: 2031, title: "Statistics - Part 1", duration: "22 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1775194267/lesson1_qytuxy.mp4" },
            { id: 2032, title: "Statistics - Part 2", duration: "23 min", videoUrl: "https://res.cloudinary.com/dvlbqsfyu/video/upload/v1772246923/8948765-hd_1920_1080_25fps_rjrswg.mp4" }
          ]
        }
      ]
    }
  ];

  const playVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTest = (testType: string, id?: number) => {
    navigate('/test', { 
      state: { 
        testType,
        courseTitle: course.title,
        id 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {course.title}
          </h1>
          <p className="text-gray-600 mt-1">Easy Maths for Class 5</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ===================== LEFT SIDE ===================== */}
          <div className="lg:col-span-8 space-y-8">

            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow">
              <video 
                key={currentVideoUrl}
                controls 
                autoPlay 
                className="w-full aspect-video"
              >
                <source src={currentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 py-4 text-base font-medium ${activeTab === 'about' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'}`}
                >
                  About Course
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`flex-1 py-4 text-base font-medium ${activeTab === 'transcript' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'}`}
                >
                  Transcript
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-4 text-base font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600'}`}
                >
                  My Notes
                </button>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'about' && (
                  <div className="space-y-6 text-[17px]">
                    <p className="text-gray-700 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="text-gray-500 text-sm">Teacher</span>
                        <p className="font-medium">{course.instructor}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Duration</span>
                        <p className="font-medium">{course.duration}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div className="bg-gray-50 p-6 rounded-xl text-gray-700 leading-relaxed">
                    This is the transcript of the current video. You can read it while watching.
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write important points here..."
                      className="w-full h-64 p-5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-base"
                    />
                    <button 
                      onClick={() => alert("Notes Saved Successfully!")}
                      className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
                    >
                      Save Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===================== RIGHT SIDE - COURSE CONTENT ===================== */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border sticky top-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Course Content</h2>
              </div>

              <div className="divide-y">
                {chapters.map((chapter) => (
                  <div key={chapter.id}>
                    {/* Chapter Header */}
                    <div
                      onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-lg text-gray-800">{chapter.title}</h3>
                      {activeChapter === chapter.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>

                    {/* Topics Section */}
                    {activeChapter === chapter.id && (
                      <div className="px-5 pb-6 bg-gray-50 space-y-4">
                        {chapter.topics.map((topic) => (
                          <div key={topic.id} className="bg-white border rounded-xl">
                            <div
                              onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-xl"
                            >
                              <div>
                                <p className="font-medium text-gray-800">{topic.title}</p>
                                <p className="text-sm text-gray-500">{topic.duration}</p>
                              </div>
                              {activeTopic === topic.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>

                            {activeTopic === topic.id && (
                              <div className="px-4 pb-5 space-y-3">
                                {topic.videos.map((video) => (
                                  <div
                                    key={video.id}
                                    onClick={() => playVideo(video.videoUrl)}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl cursor-pointer"
                                  >
                                    <Play className="w-5 h-5 text-blue-600" />
                                    <div className="flex-1">
                                      <p className="text-gray-700">{video.title}</p>
                                      <p className="text-sm text-gray-500">{video.duration}</p>
                                    </div>
                                  </div>
                                ))}

                                {/* Test Button - Hidden for Introduction */}
                                {!chapter.isIntro && (
                                  <button
                                    onClick={() => openTest(`${topic.title} Test`, topic.id)}
                                    className="w-full py-3 border border-gray-300 hover:bg-gray-100 rounded-xl text-sm font-medium mt-2"
                                  >
                                    Take Test
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* End of Chapter Test - Hidden for Introduction */}
                        {!chapter.isIntro && (
                          <button
                            onClick={() => openTest(`End of ${chapter.title}`, chapter.id)}
                            className="w-full py-4 bg-gray-800 text-white rounded-2xl font-medium mt-6 hover:bg-black"
                          >
                            End of Chapter Test
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Full Syllabus Tests */}
                <div className="p-6 space-y-4 bg-gray-50">
                  <button
                    onClick={() => openTest("Full Syllabus Test 1")}
                    className="w-full py-4 bg-gray-800 text-white rounded-2xl font-medium hover:bg-black"
                  >
                    Test 1 - Full Syllabus
                  </button>
                  <button
                    onClick={() => openTest("Full Syllabus Test 2")}
                    className="w-full py-4 bg-gray-800 text-white rounded-2xl font-medium hover:bg-black"
                  >
                    Test 2 - Full Syllabus
                  </button>
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