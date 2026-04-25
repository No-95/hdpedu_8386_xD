"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/lib/data";

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const course = courses.find((c) => c.id === courseId);
  const allLessons = course?.modules.flatMap((m) => m.lessons) ?? [];
  const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`course-${courseId}-completed`);
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored);
        const set = new Set(parsed);
        setCompletedLessons(set);
        setIsCompleted(set.has(lessonId));
      } catch {}
    }
  }, [courseId, lessonId]);

  const markComplete = () => {
    const next = new Set(completedLessons);
    next.add(lessonId);
    setCompletedLessons(next);
    setIsCompleted(true);
    localStorage.setItem(`course-${courseId}-completed`, JSON.stringify([...next]));
  };

  const goToNext = () => {
    if (!isCompleted) markComplete();
    if (nextLesson) router.push(`/courses/${courseId}/${nextLesson.id}`);
  };

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài học</h2>
          <Link href={`/courses/${courseId}`}>
            <Button className="mt-4 bg-[#a62a26] text-white hover:bg-[#8a2220]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại khóa học
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ytId = getYouTubeId(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {course.title}
        </Link>
        <span className="text-white/30 text-sm">/</span>
        <span className="text-white text-sm font-medium truncate max-w-xs">{lesson.title}</span>
        {isCompleted && (
          <Badge className="ml-auto bg-green-500 text-white font-bold text-xs rounded-full px-2 py-0.5 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Hoàn thành
          </Badge>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
            {ytId ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Play className="mx-auto h-16 w-16 text-white/20 mb-3" />
                  <p className="text-white/40 text-sm">Video chưa có sẵn</p>
                  <p className="text-white/20 text-xs mt-1">Nội dung sẽ được cập nhật sớm</p>
                </div>
              </div>
            )}
          </div>

          {/* Video info & controls */}
          <div className="bg-gray-900 px-6 py-5 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-white leading-snug">{lesson.title}</h1>
                  <p className="text-white/50 text-sm mt-1">
                    Bài {lessonIndex + 1} / {allLessons.length} · {course.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {!isCompleted ? (
                  <Button
                    onClick={markComplete}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Đánh dấu hoàn thành
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Đã hoàn thành
                  </div>
                )}

                {prevLesson && (
                  <Link href={`/courses/${courseId}/${prevLesson.id}`}>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Bài trước
                    </Button>
                  </Link>
                )}

                {nextLesson && (
                  <Button
                    onClick={goToNext}
                    className="bg-[#a62a26] hover:bg-[#8a2220] text-white font-semibold gap-2"
                  >
                    Bài tiếp theo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: lesson list */}
        <div className="w-full lg:w-80 bg-gray-900 border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto max-h-[70vh] lg:max-h-none">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white font-semibold text-sm">Danh sách bài học</h2>
            <p className="text-white/40 text-xs mt-0.5">{allLessons.length} bài · {completedLessons.size} hoàn thành</p>
          </div>
          <div className="divide-y divide-white/5">
            {allLessons.map((l, idx) => {
              const isUnlocked = idx === 0 || completedLessons.has(allLessons[idx - 1].id);
              const isDone = completedLessons.has(l.id);
              const isCurrent = l.id === lessonId;

              return (
                <div key={l.id}>
                  {isUnlocked ? (
                    <Link href={`/courses/${courseId}/${l.id}`}>
                      <div className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer
                        ${isCurrent ? "bg-white/10" : "hover:bg-white/5"}
                      `}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                          ${isDone ? "bg-green-500 text-white" : isCurrent ? "bg-[#a62a26] text-white" : "bg-white/10 text-white/50"}
                        `}>
                          {isDone ? <CheckCircle className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className={`text-sm truncate leading-snug ${isCurrent ? "text-white font-semibold" : "text-white/70"}`}>
                          {l.title}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 opacity-40 cursor-not-allowed">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-xs text-white/30">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-white/30 truncate">{l.title}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
