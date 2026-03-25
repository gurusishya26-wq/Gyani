// src/pages/CourseBuilderPage.tsx
import { useState, useCallback, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import {
  Plus,
  GripVertical,
  Trash2,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
  Upload,
  Save,
  Send,
  User,
  Tag,
  Folder,
  PlayCircle,
  Image as ImageIcon,
  HelpCircle,
  File,
  BookOpen,
} from "lucide-react";

type LessonType = "lesson" | "quiz" | "note";
type TabType = "basics" | "curriculum" | "additional";
type QuestionType = "truefalse" | "mcq" | "fillblank";

interface Question {
  type: QuestionType;
  text?: string;
  image?: string;
  correctAnswer?: "True" | "False";
  options?: Array<{ text?: string; image?: string }>;
  correctOptionIndex?: number;
  fillBlankAnswer?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration?: string;
  filePreview?: string;
  fileName?: string;
  questions?: Question[];
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  isCollapsed?: boolean;
  isEditing?: boolean;
  originalTitle?: string;
}

export default function CourseBuilderPage() {
  const [activeTab, setActiveTab] = useState<TabType>("basics");

  // ─── Basics ─────────────────────────────────────────────────────
  const [courseTitle, setCourseTitle] = useState("Untitled Course");
  const [courseDescription, setCourseDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState<"All Levels" | "Beginner" | "Intermediate" | "Advanced">("All Levels");

  // ─── Sidebar / Publishing Info ──────────────────────────────────
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [introVideoPreview, setIntroVideoPreview] = useState<string | null>(null);
  const [pricingModel, setPricingModel] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState<number | undefined>(1999);
  const [author, setAuthor] = useState("Amar Das");
  const [categories, setCategories] = useState<string[]>(["Web Development"]);
  const [tags, setTags] = useState<string[]>(["react", "frontend"]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  // ─── Additional Info ────────────────────────────────────────────
  const [requirements, setRequirements] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  // ─── Curriculum ─────────────────────────────────────────────────
  const [sections, setSections] = useState<Section[]>([]);

  // ─── Modals ─────────────────────────────────────────────────────
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [lessonVideoPreview, setLessonVideoPreview] = useState<string | null>(null);
  const [lessonDuration, setLessonDuration] = useState<string | undefined>();

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [noteFilePreview, setNoteFilePreview] = useState<string | null>(null);
  const [noteFileName, setNoteFileName] = useState<string | null>(null);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  // Question builder states
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
  const [tempQuestionText, setTempQuestionText] = useState("");
  const [tempQuestionImage, setTempQuestionImage] = useState<string | null>(null);
  const [tempOptions, setTempOptions] = useState<{ text?: string; image?: string }[]>([]);
  const [tempCorrectTrueFalse, setTempCorrectTrueFalse] = useState<"True" | "False" | null>(null);
  const [tempCorrectOptionIndex, setTempCorrectOptionIndex] = useState<number | null>(null);
  const [tempFillBlankAnswer, setTempFillBlankAnswer] = useState("");
  const [uploadingOptionIndex, setUploadingOptionIndex] = useState<number | null>(null);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const questionImageRef = useRef<HTMLInputElement>(null);
  const optionImageRef = useRef<HTMLInputElement>(null);

  // ─── Curriculum Actions ─────────────────────────────────────────
  const addSection = () => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: "New Section",
      lessons: [],
      isCollapsed: false,
      isEditing: false,
    };
    setSections([...sections, newSection]);
  };

  const toggleSectionCollapse = (id: string) =>
    setSections(sections.map(s => s.id === id ? { ...s, isCollapsed: !s.isCollapsed } : s));

  const updateSectionTitle = (id: string, title: string) =>
    setSections(sections.map(s => s.id === id ? { ...s, title } : s));

  const startEditingSection = (id: string) =>
    setSections(sections.map(s => s.id === id ? { ...s, isEditing: true, originalTitle: s.title } : { ...s, isEditing: false }));

  const finishEditingSection = (id: string, save: boolean) =>
    setSections(sections.map(s => {
      if (s.id !== id) return s;
      return { ...s, isEditing: false, title: save ? s.title : (s.originalTitle || s.title) };
    }));

  const deleteSection = (id: string) => setSections(sections.filter(s => s.id !== id));

  const deleteLesson = (sectionId: string, lessonId: string) =>
    setSections(sections.map(s => s.id === sectionId ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) } : s));

  const updateLessonTitle = (sectionId: string, lessonId: string, title: string) =>
    setSections(sections.map(s => s.id === sectionId ? {
      ...s,
      lessons: s.lessons.map(l => l.id === lessonId ? { ...l, title } : l)
    } : s));

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === "section") {
      const newSections = [...sections];
      const [moved] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, moved);
      setSections(newSections);
      return;
    }

    const sourceSection = sections.find(s => s.id === source.droppableId);
    const destSection = sections.find(s => s.id === destination.droppableId);
    if (!sourceSection || !destSection) return;

    if (sourceSection.id === destSection.id) {
      const lessons = [...sourceSection.lessons];
      const [moved] = lessons.splice(source.index, 1);
      lessons.splice(destination.index, 0, moved);
      setSections(sections.map(s => s.id === sourceSection.id ? { ...s, lessons } : s));
    } else {
      const sourceLessons = [...sourceSection.lessons];
      const destLessons = [...destSection.lessons];
      const [moved] = sourceLessons.splice(source.index, 1);
      destLessons.splice(destination.index, 0, moved);
      setSections(sections.map(s => {
        if (s.id === sourceSection.id) return { ...s, lessons: sourceLessons };
        if (s.id === destSection.id) return { ...s, lessons: destLessons };
        return s;
      }));
    }
  }, [sections]);

  const getTypeIcon = (type: LessonType) => {
    switch (type) {
      case "lesson": return <Video size={18} className="text-blue-600" />;
      case "quiz":   return <HelpCircle size={18} className="text-amber-600" />;
      case "note":   return <FileText size={18} className="text-emerald-600" />;
      default:       return null;
    }
  };

  // ─── Handlers ───────────────────────────────────────────────────
  const handleFeaturedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFeaturedImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleIntroVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setIntroVideoPreview(URL.createObjectURL(e.target.files[0]));
  };

  const addCategory = () => {
    const val = newCategory.trim();
    if (val && !categories.includes(val)) {
      setCategories([...categories, val]);
      setNewCategory("");
    }
  };

  const addTag = () => {
    const val = newTag.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setNewTag("");
    }
  };

  const handleQuestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setTempQuestionImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleOptionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadingOptionIndex === null || !e.target.files?.[0]) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setTempOptions(prev => {
      const next = [...prev];
      next[uploadingOptionIndex] = { ...next[uploadingOptionIndex], image: url };
      return next;
    });
    setUploadingOptionIndex(null);
  };

  // ────────────────────────────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* ─── HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-indigo-600" size={28} strokeWidth={2.2} />
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Course Builder</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 transition shadow-sm hover:shadow">
                <Save size={18} /> Save Draft
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Send size={18} /> Publish Course
              </button>
            </div>
          </div>

          <nav className="flex gap-10 -mb-px border-t border-zinc-200">
            {(["basics", "curriculum", "additional"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-indigo-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-indigo-600 after:rounded-t"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
          {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
          <div className="flex-1 space-y-10">
            {activeTab === "basics" && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100">
                  <h2 className="text-2xl font-semibold text-zinc-900">Course Information</h2>
                </div>
                <div className="p-8 space-y-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">Title</label>
                    <input
                      value={courseTitle}
                      onChange={e => setCourseTitle(e.target.value)}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-xl font-medium placeholder-zinc-400 outline-none"
                      placeholder="e.g. Modern React & TypeScript – 2026 Edition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">Description</label>
                    <textarea
                      value={courseDescription}
                      onChange={e => setCourseDescription(e.target.value)}
                      rows={6}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none placeholder-zinc-400 outline-none"
                      placeholder="Describe what students will learn and why they should take this course..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">Difficulty Level</label>
                    <select
                      value={difficultyLevel}
                      onChange={e => setDifficultyLevel(e.target.value as any)}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition appearance-none outline-none"
                    >
                      <option>All Levels</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-zinc-900">Curriculum</h2>
                  {sections.length > 0 && (
                    <button
                      onClick={addSection}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <Plus size={20} /> Add Section
                    </button>
                  )}
                </div>

                {sections.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-16 text-center">
                    <img
                      src="https://illustrations.popsy.co/white/teaching.svg"
                      alt="Start building course"
                      className="w-80 mx-auto mb-10 opacity-90"
                    />
                    <h3 className="text-2xl font-semibold text-zinc-900 mb-4">Let's build your course</h3>
                    <p className="text-zinc-600 mb-10 max-w-md mx-auto">
                      Organize your content into clear sections with lessons, quizzes, and resources.
                    </p>
                    <button
                      onClick={addSection}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
                    >
                      <Plus size={24} /> Create First Section
                    </button>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections" type="section">
                      {provided => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                          {sections.map((section, idx) => (
                            <Draggable key={section.id} draggableId={section.id} index={idx}>
                              {(dragProvided, snapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  className={`bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm transition-all ${
                                    snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-400/30 scale-[1.01]" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-4 px-6 py-5 bg-zinc-50/70 border-b border-zinc-100">
                                    <div {...dragProvided.dragHandleProps} className="cursor-grab text-zinc-400 hover:text-zinc-600">
                                      <GripVertical size={22} />
                                    </div>

                                    <button onClick={() => toggleSectionCollapse(section.id)} className="text-zinc-500 hover:text-zinc-800">
                                      {section.isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                                    </button>

                                    {section.isEditing ? (
                                      <div className="flex-1 flex items-center gap-3 pr-4">
                                        <input
                                          autoFocus
                                          value={section.title}
                                          onChange={e => updateSectionTitle(section.id, e.target.value)}
                                          className="flex-1 text-xl font-semibold bg-white border border-zinc-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                                        />
                                        <button onClick={() => finishEditingSection(section.id, true)} className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 min-w-[70px]">
                                          Save
                                        </button>
                                        <button onClick={() => finishEditingSection(section.id, false)} className="px-5 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 min-w-[70px]">
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => startEditingSection(section.id)}
                                        className="flex-1 text-left font-semibold text-xl text-zinc-900 hover:text-indigo-700 transition"
                                      >
                                        {section.title}
                                      </button>
                                    )}

                                    <span className="text-sm text-zinc-500 font-medium bg-zinc-100 px-3 py-1 rounded-full">
                                      {section.lessons.length} items
                                    </span>

                                    <button onClick={() => deleteSection(section.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                      <Trash2 size={20} />
                                    </button>
                                  </div>

                                  {!section.isCollapsed && (
                                    <>
                                      <Droppable droppableId={section.id} type="lesson">
                                        {dropProvided => (
                                          <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                                            {section.lessons.map((lesson, lIdx) => (
                                              <Draggable key={lesson.id} draggableId={lesson.id} index={lIdx}>
                                                {(lesProvided, lesSnapshot) => (
                                                  <div
                                                    ref={lesProvided.innerRef}
                                                    {...lesProvided.draggableProps}
                                                    className={`px-7 py-4 flex items-center gap-5 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80 transition-all group ${
                                                      lesSnapshot.isDragging ? "bg-indigo-50/60 shadow-md" : ""
                                                    }`}
                                                  >
                                                    <div {...lesProvided.dragHandleProps} className="cursor-grab text-zinc-300 hover:text-zinc-500">
                                                      <GripVertical size={18} />
                                                    </div>

                                                    {getTypeIcon(lesson.type)}

                                                    <input
                                                      value={lesson.title}
                                                      onChange={e => updateLessonTitle(section.id, lesson.id, e.target.value)}
                                                      className="flex-1 bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-400 rounded px-3 py-1.5 outline-none font-medium"
                                                    />

                                                    <div className="text-sm text-zinc-500 font-medium min-w-[70px] text-right">
                                                      {lesson.duration || "—"}
                                                    </div>

                                                    <button
                                                      onClick={() => deleteLesson(section.id, lesson.id)}
                                                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition"
                                                    >
                                                      <Trash2 size={18} />
                                                    </button>
                                                  </div>
                                                )}
                                              </Draggable>
                                            ))}
                                            {dropProvided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>

                                      <div className="px-7 py-6 border-t border-zinc-100 bg-zinc-50/40 flex flex-wrap gap-3">
                                        <button
                                          onClick={() => {
                                            setCurrentSectionId(section.id);
                                            setNewLessonTitle("");
                                            setLessonVideoPreview(null);
                                            setLessonDuration(undefined);
                                            setShowLessonModal(true);
                                          }}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white border border-zinc-300 rounded-xl hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-sm hover:shadow"
                                        >
                                          <Plus size={16} /> Lesson
                                        </button>

                                        <button
                                          onClick={() => {
                                            setCurrentSectionId(section.id);
                                            setQuizTitle("");
                                            setQuizQuestions([]);
                                            setShowQuizModal(true);
                                          }}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white border border-zinc-300 rounded-xl hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-sm hover:shadow"
                                        >
                                          <Plus size={16} /> Quiz
                                        </button>

                                        <button
                                          onClick={() => {
                                            setCurrentSectionId(section.id);
                                            setNewNoteTitle("");
                                            setNoteFilePreview(null);
                                            setNoteFileName(null);
                                            setShowNoteModal(true);
                                          }}
                                          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white border border-zinc-300 rounded-xl hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-sm hover:shadow"
                                        >
                                          <Plus size={16} /> Note / Resource
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            )}

            {activeTab === "additional" && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100">
                  <h2 className="text-2xl font-semibold text-zinc-900">Additional Information</h2>
                </div>
                <div className="p-8 space-y-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">What students should know before taking this course</label>
                    <textarea
                      value={requirements}
                      onChange={e => setRequirements(e.target.value)}
                      rows={5}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none outline-none"
                      placeholder="e.g. Basic HTML & CSS, familiarity with JavaScript..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">Who this course is for</label>
                    <textarea
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      rows={5}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none outline-none"
                      placeholder="e.g. Developers who want to master modern React patterns, freelancers..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── SIDEBAR ──────────────────────────────────────────────── */}
          {activeTab === "basics" && (
            <aside className="lg:w-96 w-full space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Featured Image */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-100 flex items-center gap-3 font-medium text-zinc-800">
                  <ImageIcon size={20} /> Featured Image
                </div>
                <div
                  onClick={() => imageRef.current?.click()}
                  className="aspect-video bg-zinc-100 flex items-center justify-center cursor-pointer hover:bg-zinc-200/70 transition"
                >
                  {featuredImagePreview ? (
                    <img src={featuredImagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-zinc-500">
                      <Upload size={40} className="mx-auto mb-3 opacity-70" />
                      <p>Click to upload cover image</p>
                      <p className="text-xs mt-1">Recommended: 1280×720</p>
                    </div>
                  )}
                </div>
                <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleFeaturedImage} />
              </div>

              {/* Intro Video */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between font-medium text-zinc-800">
                  <div className="flex items-center gap-3">
                    <PlayCircle size={20} /> Course Trailer
                  </div>
                  {introVideoPreview && <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Uploaded</span>}
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-zinc-900 to-black">
                  {introVideoPreview ? (
                    <video src={introVideoPreview} controls className="w-full h-full" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                      <PlayCircle size={48} className="mb-4 opacity-80" />
                      <p className="text-lg font-medium">Add course trailer</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => videoRef.current?.click()}
                  className="w-full py-4 text-center font-medium text-zinc-700 hover:bg-zinc-50 transition border-t border-zinc-100"
                >
                  {introVideoPreview ? "Replace Video" : "Upload Video"}
                </button>
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleIntroVideo} />
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6 font-medium text-zinc-800">
                  <span className="text-2xl">₹</span> Pricing
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPricingModel("free")}
                    className={`py-3.5 rounded-xl font-medium transition-all ${
                      pricingModel === "free"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setPricingModel("paid")}
                    className={`py-3.5 rounded-xl font-medium transition-all ${
                      pricingModel === "paid"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    Paid
                  </button>
                </div>

                {pricingModel === "paid" && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                      <span className="text-4xl font-bold text-zinc-700">₹</span>
                    </div>
                    <input
                      type="number"
                      value={price ?? ""}
                      onChange={e => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full pl-16 pr-20 py-5 bg-zinc-50 border border-zinc-200 rounded-xl text-4xl font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      placeholder="1999"
                    />
                    <div className="absolute inset-y-0 right-5 flex items-center text-sm text-zinc-500 font-medium">INR</div>
                  </div>
                )}
              </div>

              {/* Author */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 font-medium text-zinc-800">
                  <User size={20} /> Instructor
                </div>
                <input
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              {/* Categories & Tags – can be combined or kept separate */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
                {/* Categories */}
                <div>
                  <div className="flex items-center gap-3 mb-4 font-medium text-zinc-800">
                    <Folder size={20} /> Categories
                  </div>
                  <div className="flex gap-2 mb-4">
                    <input
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCategory())}
                      className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder-zinc-400"
                      placeholder="e.g. Frontend Development"
                    />
                    <button onClick={addCategory} className="px-6 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-900 transition">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <div
                        key={cat}
                        className="bg-zinc-100 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 text-zinc-800"
                      >
                        {cat}
                        <X size={14} className="cursor-pointer hover:text-red-600" onClick={() => setCategories(categories.filter(c => c !== cat))} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center gap-3 mb-4 font-medium text-zinc-800">
                    <Tag size={20} /> Tags
                  </div>
                  <div className="flex gap-2 mb-4">
                    <input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder-zinc-400"
                      placeholder="e.g. typescript"
                    />
                    <button onClick={addTag} className="px-6 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-900 transition">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <div
                        key={tag}
                        className="bg-zinc-100 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 text-zinc-800"
                      >
                        {tag}
                        <X size={14} className="cursor-pointer hover:text-red-600" onClick={() => setTags(tags.filter(t => t !== tag))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* ─── MODALS ───────────────────────────────────────────────────── */}
      {/* Lesson Modal – can be improved further with better layout */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setShowLessonModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-7 py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-zinc-900">Add Lesson</h3>
              <button onClick={() => setShowLessonModal(false)} className="text-zinc-500 hover:text-zinc-800">
                <X size={24} />
              </button>
            </div>

            <div className="p-7 space-y-7">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">Lesson Title</label>
                <input
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  placeholder="e.g. useEffect Hook Explained"
                  className="w-full px-5 py-4 border border-zinc-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">Video (optional)</label>
                <div
                  onClick={() => document.getElementById("lesson-video-input")?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                    lessonVideoPreview ? "border-green-300 bg-green-50/40" : "border-zinc-300 hover:border-indigo-400"
                  }`}
                >
                  {lessonVideoPreview ? (
                    <div className="relative">
                      <video src={lessonVideoPreview} controls className="w-full max-h-56 rounded-lg mx-auto" />
                      <p className="mt-3 text-sm text-green-700 font-medium">
                        Duration: {lessonDuration || "calculating..."}
                      </p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setLessonVideoPreview(null);
                          setLessonDuration(undefined);
                        }}
                        className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black/90"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={44} className="mx-auto text-zinc-400 mb-4" />
                      <p className="text-zinc-700 font-medium">Click to upload video</p>
                      <p className="text-sm text-zinc-500 mt-1">MP4 • max 500 MB recommended</p>
                    </>
                  )}
                </div>
                <input
                  id="lesson-video-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setLessonVideoPreview(url);

                    const video = document.createElement("video");
                    video.preload = "metadata";
                    video.onloadedmetadata = () => {
                      if (!isNaN(video.duration) && video.duration > 0) {
                        const min = Math.floor(video.duration / 60);
                        const sec = Math.floor(video.duration % 60);
                        setLessonDuration(`${min}:${sec.toString().padStart(2, "0")}`);
                      }
                    };
                    video.src = url;
                  }}
                />
              </div>
            </div>

            <div className="px-7 py-5 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
              <button onClick={() => setShowLessonModal(false)} className="px-6 py-2.5 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!currentSectionId || !newLessonTitle.trim()) return;
                  setSections(sections.map(sec =>
                    sec.id === currentSectionId
                      ? {
                          ...sec,
                          lessons: [
                            ...sec.lessons,
                            {
                              id: `les-${Date.now()}`,
                              title: newLessonTitle.trim(),
                              type: "lesson",
                              duration: lessonDuration || "—",
                              filePreview: lessonVideoPreview || undefined,
                            },
                          ],
                        }
                      : sec
                  ));
                  setShowLessonModal(false);
                  setNewLessonTitle("");
                  setLessonVideoPreview(null);
                  setLessonDuration(undefined);
                }}
                disabled={!newLessonTitle.trim()}
                className={`px-7 py-2.5 rounded-xl font-medium transition ${
                  newLessonTitle.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div
          className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={e => e.target === e.currentTarget && setShowNoteModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-zinc-100">
            <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <FileText size={22} className="text-emerald-600" />
                <h3 className="text-xl font-semibold text-zinc-900">Add Resource / Note</h3>
              </div>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-zinc-500 hover:text-zinc-800 p-1.5 rounded-full hover:bg-zinc-100 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-7 space-y-8">
              <div className="space-y-2.5">
                <label className="block text-sm font-medium text-zinc-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. React Router v6 Cheat Sheet   •   Authentication Flow Diagram"
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none placeholder-zinc-400 transition"
                  autoFocus
                />
              </div>

              <div className="space-y-2.5">
                <label className="block text-sm font-medium text-zinc-700">File (PDF recommended)</label>
                <div
                  onClick={() => document.getElementById("note-file-input")?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    noteFilePreview
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50/20"
                  }`}
                >
                  {noteFilePreview ? (
                    <div className="space-y-5">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <File size={32} className="text-emerald-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-zinc-900 truncate max-w-[260px]">{noteFileName || "File uploaded"}</p>
                          <p className="text-sm text-zinc-500 mt-0.5">PDF • ready to save</p>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setNoteFilePreview(null); setNoteFileName(null); }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 mx-auto hover:underline"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} className="mx-auto text-zinc-400 mb-4" />
                      <p className="text-zinc-700 font-medium">Click or drag file here</p>
                      <p className="text-sm text-zinc-500 mt-1.5">PDF • max 20 MB recommended</p>
                    </>
                  )}
                </div>
                <input
                  id="note-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNoteFilePreview(URL.createObjectURL(file));
                      setNoteFileName(file.name);
                    }
                  }}
                />
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Students will be able to download this file in the course curriculum.
              </p>
            </div>

            <div className="px-7 py-5 border-t border-zinc-100 flex justify-end gap-4 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-7 py-2.5 border border-zinc-300 text-zinc-700 rounded-xl hover:bg-zinc-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!currentSectionId || !newNoteTitle.trim()) return;
                  setSections(sections.map(sec =>
                    sec.id === currentSectionId
                      ? {
                          ...sec,
                          lessons: [
                            ...sec.lessons,
                            {
                              id: `note-${Date.now()}`,
                              title: newNoteTitle.trim(),
                              type: "note",
                              filePreview: noteFilePreview || undefined,
                              fileName: noteFileName || undefined,
                            },
                          ],
                        }
                      : sec
                  ));
                  setShowNoteModal(false);
                  setNewNoteTitle("");
                  setNoteFilePreview(null);
                  setNoteFileName(null);
                }}
                disabled={!newNoteTitle.trim()}
                className={`px-8 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                  newNoteTitle.trim()
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}


{/* ────────────────────────────────────────────────────────────────
     QUIZ CONTAINER MODAL
───────────────────────────────────────────────────────────────── */}

      {showQuizModal && (
        <div
          className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={e => e.target === e.currentTarget && setShowQuizModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-3xl max-h-[92vh] overflow-y-auto border border-zinc-100">
            <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <HelpCircle size={22} className="text-amber-600" />
                <h3 className="text-xl font-semibold text-zinc-900">Create Quiz</h3>
              </div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="text-zinc-500 hover:text-zinc-800 p-2 rounded-full hover:bg-zinc-100 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-7 lg:p-8 space-y-10">
              <div className="space-y-2.5">
                <label className="block text-sm font-medium text-zinc-700">
                  Quiz Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                  placeholder="e.g. JavaScript Fundamentals – Module 2 Quiz"
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none placeholder-zinc-400 transition text-lg font-medium"
                  autoFocus
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-zinc-900 flex items-center gap-2.5">
                    <HelpCircle size={20} className="text-amber-600" />
                    Questions <span className="text-sm font-normal text-zinc-500 ml-1.5">({quizQuestions.length})</span>
                  </h4>

                  <button
                    onClick={() => {
                      setShowQuestionTypeSelector(true);
                      setSelectedQuestionType(null);
                      setTempQuestionText("");
                      setTempQuestionImage(null);
                      setTempOptions([]);
                      setTempCorrectTrueFalse(null);
                      setTempCorrectOptionIndex(null);
                      setTempFillBlankAnswer("");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-medium transition-all shadow-sm hover:shadow"
                  >
                    <Plus size={18} /> Add Question
                  </button>
                </div>

                {quizQuestions.length === 0 ? (
                  <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center bg-zinc-50/40">
                    <HelpCircle size={48} className="mx-auto text-zinc-400 mb-4 opacity-70" />
                    <h5 className="text-lg font-medium text-zinc-700 mb-2">No questions yet</h5>
                    <p className="text-zinc-500 max-w-md mx-auto">
                      Start adding questions using the button above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {quizQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium text-sm">
                              {idx + 1}
                            </div>
                            <span className="text-sm font-medium text-zinc-600 uppercase tracking-wide">
                              {q.type === "truefalse" ? "True/False" :
                              q.type === "mcq"      ? "Multiple Choice" :
                              "Fill in the Blank"}
                            </span>
                          </div>
                          <button
                            onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}
                            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {q.image && <img src={q.image} alt="" className="max-h-40 rounded-lg object-contain mb-4 border border-zinc-100 bg-white" />}
                        {q.text && <p className="text-zinc-900 mb-4 leading-relaxed">{q.text}</p>}

                        {q.type === "truefalse" && q.correctAnswer && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-medium">
                            Correct: <strong>{q.correctAnswer}</strong>
                          </div>
                        )}

                        {q.type === "mcq" && q.options && (
                          <div className="space-y-2.5 mt-4">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${
                                  i === q.correctOptionIndex ? "border-emerald-400 bg-emerald-50/60" : "border-zinc-200"
                                }`}
                              >
                                {opt.image && <img src={opt.image} alt="" className="w-12 h-12 object-cover rounded-md" />}
                                <span className="flex-1 text-zinc-800">{opt.text || "(image)"}</span>
                                {i === q.correctOptionIndex && <span className="text-emerald-600 font-bold">✓</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === "fillblank" && q.fillBlankAnswer && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-medium mt-3">
                            Correct: <strong>{q.fillBlankAnswer}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-7 py-5 border-t border-zinc-100 flex justify-end gap-4 sticky bottom-0 bg-white z-10">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-7 py-2.5 border border-zinc-300 text-zinc-700 rounded-xl hover:bg-zinc-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!currentSectionId || !quizTitle.trim()) return alert("Quiz title is required");
                  setSections(sections.map(sec =>
                    sec.id === currentSectionId
                      ? {
                          ...sec,
                          lessons: [
                            ...sec.lessons,
                            {
                              id: `quiz-${Date.now()}`,
                              title: quizTitle.trim(),
                              type: "quiz",
                              questions: quizQuestions.length ? quizQuestions : undefined,
                            },
                          ],
                        }
                      : sec
                  ));
                  setShowQuizModal(false);
                  setQuizTitle("");
                  setQuizQuestions([]);
                }}
                disabled={!quizTitle.trim()}
                className={`px-8 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
                  quizTitle.trim()
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}


{/* ────────────────────────────────────────────────────────────────
     QUESTION BUILDER MODAL (type selector + editor)
───────────────────────────────────────────────────────────────── */}

      {showQuestionTypeSelector && (
        <div
          className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={e => e.target === e.currentTarget && setShowQuestionTypeSelector(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-xl max-h-[92vh] overflow-y-auto border border-zinc-100">
            <div className="px-7 py-5 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <HelpCircle size={22} className="text-amber-600" />
                <h3 className="text-xl font-semibold text-zinc-900">
                  {selectedQuestionType ? "Build Question" : "New Question"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowQuestionTypeSelector(false);
                  setSelectedQuestionType(null);
                }}
                className="text-zinc-500 hover:text-zinc-800 p-2 rounded-full hover:bg-zinc-100 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-7 lg:p-8 space-y-9">
              {!selectedQuestionType ? (
                <div className="space-y-6">
                  <p className="text-zinc-700 font-medium">Select question type:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { type: "truefalse" as const, label: "True / False", desc: "Yes or No", icon: HelpCircle },
                      { type: "mcq"       as const, label: "Multiple Choice", desc: "One correct", icon: HelpCircle },
                      { type: "fillblank" as const, label: "Fill Blank", desc: "Complete text", icon: FileText },
                    ].map(item => (
                      <button
                        key={item.type}
                        onClick={() => {
                          setSelectedQuestionType(item.type);
                          if (item.type === "mcq") {
                            setTempOptions([{ text: "" }, { text: "" }]);
                          } else {
                            setTempOptions([]);
                          }
                          setTempQuestionText("");
                          setTempQuestionImage(null);
                          setTempCorrectTrueFalse(null);
                          setTempCorrectOptionIndex(null);
                          setTempFillBlankAnswer("");
                        }}
                        className="p-6 border border-zinc-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all flex flex-col items-start gap-3 hover:shadow-sm"
                      >
                        <item.icon size={28} className="text-amber-600" />
                        <div>
                          <div className="font-semibold text-zinc-900">{item.label}</div>
                          <div className="text-sm text-zinc-500 mt-1">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-9">
                  {/* Question */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-700">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={tempQuestionText}
                      onChange={e => setTempQuestionText(e.target.value)}
                      placeholder="Enter question text here..."
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-y min-h-[110px] placeholder-zinc-400"
                    />
                    <div
                      onClick={() => questionImageRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        tempQuestionImage ? "border-emerald-300 bg-emerald-50/30" : "border-zinc-300 hover:border-amber-400 hover:bg-amber-50/20"
                      }`}
                    >
                      {tempQuestionImage ? (
                        <div className="relative">
                          <img src={tempQuestionImage} alt="preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                          <button
                            onClick={e => { e.stopPropagation(); setTempQuestionImage(null); }}
                            className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full shadow hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={44} className="mx-auto text-zinc-400 mb-4" />
                          <p className="text-zinc-700 font-medium">Optional image for question</p>
                        </>
                      )}
                    </div>
                    <input ref={questionImageRef} type="file" accept="image/*" className="hidden" onChange={handleQuestionImageUpload} />
                  </div>

                  {/* Type-specific content */}
                  {selectedQuestionType === "truefalse" && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-zinc-700">Correct Answer <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-2 gap-4">
                        {["True", "False"].map(v => (
                          <label
                            key={v}
                            className={`p-5 border rounded-xl cursor-pointer text-center text-lg font-medium transition-all ${
                              tempCorrectTrueFalse === v ? "border-amber-500 bg-amber-50 shadow-sm" : "border-zinc-200 hover:border-amber-300 hover:bg-amber-50/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="tf"
                              checked={tempCorrectTrueFalse === v}
                              onChange={() => setTempCorrectTrueFalse(v as "True" | "False")}
                              className="hidden"
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedQuestionType === "mcq" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-zinc-700">Options <span className="text-red-500">*</span> (min 2)</label>
                        <button
                          onClick={() => setTempOptions(prev => [...prev, { text: "" }])}
                          className="text-amber-700 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>
                      <div className="space-y-5">
                        {tempOptions.map((opt, i) => (
                          <div key={i} className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/40">
                            <div className="flex gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex-shrink-0 flex items-center justify-center font-medium">
                                {String.fromCharCode(65 + i)}
                              </div>
                              <input
                                value={opt.text || ""}
                                onChange={e => {
                                  const next = [...tempOptions];
                                  next[i].text = e.target.value;
                                  setTempOptions(next);
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                              />
                              <button
                                onClick={() => setTempOptions(prev => prev.filter((_, idx) => idx !== i))}
                                className="text-zinc-400 hover:text-red-600 p-2"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {/* option image */}
                            <div
                              onClick={() => { setUploadingOptionIndex(i); optionImageRef.current?.click(); }}
                              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                                opt.image ? "border-emerald-300 bg-emerald-50/20" : "border-zinc-300 hover:border-amber-400"
                              }`}
                            >
                              {opt.image ? (
                                <img src={opt.image} alt="" className="max-h-28 mx-auto rounded-lg object-contain" />
                              ) : (
                                <div className="text-zinc-500 text-sm">
                                  <Upload size={32} className="mx-auto mb-2" />
                                  Optional image
                                </div>
                              )}
                            </div>

                            <label className="mt-4 flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={tempCorrectOptionIndex === i}
                                onChange={() => setTempCorrectOptionIndex(i)}
                                className="accent-amber-600"
                              />
                              <span className="text-sm font-medium">Correct answer</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      <input ref={optionImageRef} type="file" accept="image/*" className="hidden" onChange={handleOptionImageUpload} />
                    </div>
                  )}

                  {selectedQuestionType === "fillblank" && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-zinc-700">
                        Correct Answer <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={tempFillBlankAnswer}
                        onChange={e => setTempFillBlankAnswer(e.target.value)}
                        placeholder="e.g. closures"
                        className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-7 py-5 border-t border-zinc-100 flex justify-end gap-4 sticky bottom-0 bg-white z-10">
              <button
                onClick={() => {
                  setShowQuestionTypeSelector(false);
                  setSelectedQuestionType(null);
                  setTempQuestionText("");
                  setTempQuestionImage(null);
                  setTempOptions([]);
                  setTempCorrectTrueFalse(null);
                  setTempCorrectOptionIndex(null);
                  setTempFillBlankAnswer("");
                }}
                className="px-7 py-2.5 border border-zinc-300 text-zinc-700 rounded-xl hover:bg-zinc-50 transition font-medium"
              >
                Cancel
              </button>

              {selectedQuestionType && (
                <button
                  onClick={() => {
                    if (!tempQuestionText.trim() && !tempQuestionImage) return alert("Question text or image required");
                    if (selectedQuestionType === "truefalse" && !tempCorrectTrueFalse) return alert("Select correct answer");
                    if (selectedQuestionType === "mcq" && (tempOptions.length < 2 || tempCorrectOptionIndex === null)) {
                      return alert("At least 2 options + select correct one");
                    }
                    if (selectedQuestionType === "fillblank" && !tempFillBlankAnswer.trim()) return alert("Enter correct answer");

                    const q: Question = {
                      type: selectedQuestionType,
                      ...(tempQuestionText.trim() && { text: tempQuestionText.trim() }),
                      ...(tempQuestionImage && { image: tempQuestionImage }),
                    };

                    if (selectedQuestionType === "truefalse") q.correctAnswer = tempCorrectTrueFalse!;
                    if (selectedQuestionType === "mcq") {
                      q.options = tempOptions.filter(o => o.text?.trim() || o.image).map(o => ({ text: o.text?.trim(), image: o.image }));
                      q.correctOptionIndex = tempCorrectOptionIndex!;
                    }
                    if (selectedQuestionType === "fillblank") q.fillBlankAnswer = tempFillBlankAnswer.trim();

                    setQuizQuestions([...quizQuestions, q]);

                    // reset for next question
                    setSelectedQuestionType(null);
                    setTempQuestionText("");
                    setTempQuestionImage(null);
                    setTempOptions([]);
                    setTempCorrectTrueFalse(null);
                    setTempCorrectOptionIndex(null);
                    setTempFillBlankAnswer("");
                  }}
                  className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all shadow-sm"
                >
                  Add Question
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}