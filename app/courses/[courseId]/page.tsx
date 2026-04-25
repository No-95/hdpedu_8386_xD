"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Lock, Play, CheckCircle, ArrowLeft, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/lib/data";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = courses.find((c) => c.id === courseId);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(`course-${courseId}-completed`);
    if (stored) {
      try {
        setCompletedLessons(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy khóa học</h2>
          <Link href="/courses">
            <Button className="mt-4 bg-[#a62a26] text-white hover:bg-[#8a2220]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    const prevLesson = allLessons[lessonIndex - 1];
    return completedLessons.has(prevLesson.id);
  };

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedLessons.has(l.id)).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#000814]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#a62a26] via-[#c73a32] to-[#8a2220] dark:from-[#000814] dark:via-[#0a0a2e] dark:to-[#1a1a4d]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách khóa học
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {course.isFree && (
                  <Badge className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                    ✅ Free 100%
                  </Badge>
                )}
                <Badge className="bg-white/20 text-white font-semibold px-3 py-1 rounded-full text-sm">
                  {course.level}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/80 text-base leading-relaxed max-w-2xl mb-4">
                {course.description}
              </p>
              <p className="text-white/70 text-sm">👤 {course.instructor}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">Tiến độ học tập</span>
              <span className="text-white font-bold text-sm">{completedCount}/{totalLessons} bài</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div
                className="bg-green-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-1">{progress}% hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        {course.modules.map((module, moduleIndex) => (
          <div key={module.id} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#a62a26]" />
              {module.title}
            </h2>
            <div className="space-y-3">
              {module.lessons.map((lesson, lessonIdx) => {
                const globalIndex = course.modules
                  .slice(0, moduleIndex)
                  .reduce((acc, m) => acc + m.lessons.length, 0) + lessonIdx;
                const unlocked = isLessonUnlocked(globalIndex);
                const completed = completedLessons.has(lesson.id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: globalIndex * 0.04 }}
                  >
                    {unlocked ? (
                      <Link href={`/courses/${courseId}/${lesson.id}`}>
                        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                          ${completed
                            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-[#a62a26] hover:shadow-md"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            completed ? "bg-green-500" : "bg-[#a62a26]"
                          }`}>
                            {completed
                              ? <CheckCircle className="h-5 w-5 text-white" />
                              : <Play className="h-5 w-5 text-white ml-0.5" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {lesson.title}
                            </p>
                            {lesson.duration !== "--:--" && (
                              <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{lesson.duration}</p>
                            )}
                          </div>
                          {completed && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-semibold text-xs rounded-full px-2 py-0.5">
                              Hoàn thành
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-xl border bg-gray-100 dark:bg-white/3 border-gray-200 dark:border-white/5 opacity-60 cursor-not-allowed select-none">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                          <Lock className="h-5 w-5 text-gray-500 dark:text-white/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-500 dark:text-white/40 truncate">
                            {lesson.title}
                          </p>
                          {lesson.duration !== "--:--" && (
                            <p className="text-xs text-gray-400 mt-0.5">{lesson.duration}</p>
                          )}
                        </div>
                        <Badge className="bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 font-semibold text-xs rounded-full px-2 py-0.5">
                          Đã khóa
                        </Badge>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
