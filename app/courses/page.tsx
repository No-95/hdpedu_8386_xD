"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, BookOpen, Star, ArrowRight, Sparkles, Users, TrendingUp, Flame, Bell, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { courses as coursesData } from "@/lib/data";
import { useUser } from "@/lib/user-context";
import { motion } from "framer-motion";

const categories = [
  { key: "all", vi: "Tất cả", ko: "전체" },
  { key: "korean", vi: "Tiếng Hàn", ko: "한국어" },
  { key: "culture", vi: "Văn hóa", ko: "문화" },
  { key: "business", vi: "Kinh doanh", ko: "비즈니스" },
  { key: "travel", vi: "Du lịch", ko: "여행" },
];

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800",
  "Intermediate": "bg-blue-100 text-blue-800",
  "Advanced": "bg-purple-100 text-purple-800",
};

export default function CoursesPage() {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getCourseHref = (courseId: string, isFree?: boolean) => {
    const target = isFree ? `/courses/${courseId}` : `/classroom?course=${courseId}`;
    if (isAuthenticated) return target;
    return `/auth?redirect=${encodeURIComponent(target)}`;
  };

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Featured course (first one)
  const featuredCourse = coursesData[0];
  // Most popular courses (random selection for demo)
  const popularCourses = coursesData.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Light mode background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat light"
        style={{
          backgroundImage: 'url(/bg-course.png)',
        }}
      />
      
      {/* Dark mode background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat hidden dark:block"
        style={{
          backgroundImage: 'url(/dark-mode.png)',
        }}
      />
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-[#a62a26] via-[#c73a32] to-[#8a2220] dark:from-[#000814] dark:via-[#0a0a2e] dark:to-[#1a1a4d]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-24 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 mb-0 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-white/90" />
              <span className="text-sm font-semibold uppercase tracking-wider text-white/90">Khám phá khóa học</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-white mb-4 leading-tight">
              {t("allCourses")}
            </h1>
            <p className="text-lg text-white/90 dark:text-white/80 max-w-2xl leading-relaxed">
              {language === "vi" 
                ? "Nâng cao kỹ năng của bạn với những khóa học chất lượng cao từ các chuyên gia hàng đầu"
                : "Các 전문가로부터 고품질 코스로 자신의 기술을 향상시키세요"}
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/30 p-6 md:p-8 bg-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                <Input
                  type="text"
                  placeholder={t("search") + "..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border border-white/50 text-gray-900 placeholder:text-gray-400 focus:border-white focus:ring-2 focus:ring-white/30 transition-all rounded-lg"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap md:justify-end">
                {categories.map((category) => (
                  <Button
                    key={category.key}
                    variant={selectedCategory === category.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.key)}
                    className={`shrink-0 font-semibold transition-all duration-300 ${
                      selectedCategory === category.key
                        ? "bg-white text-[#a62a26] hover:bg-white shadow-lg"
                        : "border-white/50 text-white hover:bg-white/20 hover:border-white"
                    }`}
                  >
                    {language === "vi" ? category.vi : category.ko}
                  </Button>
                ))}
                <Link href="/courses/classroom">
                  <Button
                    size="sm"
                    className="shrink-0 font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-lg gap-1.5 transition-all duration-300"
                  >
                    <Video className="h-4 w-4" />
                    {language === "vi" ? "Khóa học trực tuyến" : "온라인 수업"}
                  </Button>
                </Link>
              </div>
            </div>
            {filteredCourses.length > 0 && (
              <p className="text-sm text-white/80 mt-4">
                📚 {filteredCourses.length} {filteredCourses.length === 1 ? "khóa học" : "khóa học"} được tìm thấy
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Empty State - No Courses */}
      {coursesData.length === 0 ? (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <BookOpen className="h-20 w-20 text-[#a62a26]/30" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "vi" ? "Chưa có khóa học nào" : "아직 강좌가 없습니다"}
              </h2>
              <p className="text-xl text-gray-700 dark:text-white/80 font-semibold mb-2">
                {language === "vi" 
                  ? "Chưa có khóa học nào đang diễn ra, bật thông báo lên mà mong chờ đê" 
                  : "진행 중인 강좌가 없습니다. 알림을 켜고 기다려주세요"}
              </p>
              <p className="text-gray-600 text-sm mt-4">
                {language === "vi" 
                  ? "Chúng tôi sẽ sớm ra mắt những khóa học mới" 
                  : "곧 새로운 강좌를 출시할 예정입니다"}
              </p>
              <div className="mt-8">
                <Bell className="mx-auto h-12 w-12 text-[#a62a26]/50 animate-bounce" />
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Course Section */}
          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Flame className="h-6 w-6 text-[#a62a26]" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {language === "vi" ? "🔥 Khóa Học Nổi Bật" : "💥 특집 강좌"}
                  </h2>
                </div>
            <Card className="overflow-hidden border border-gray-300 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-[#000814]/90 dark:to-[#1a1a4d]/80 dark:border-white/10">
              <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10">
                {/* Featured Course Image/Icon */}
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-[#a62a26]/20 to-[#a62a26]/5 rounded-xl flex items-center justify-center overflow-hidden border-2 border-[#a62a26]/20">
                    <BookOpen className="h-24 w-24 text-[#a62a26]/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
                {/* Featured Course Info */}
                <div className="flex flex-col justify-between">
                  <div>
                    <Badge className="mb-4 bg-[#a62a26] text-white px-3 py-1 rounded-full font-semibold">
                      ⭐ {language === "vi" ? "Được Đề Xuất" : "추천"}
                    </Badge>
                    {featuredCourse.isFree && (
                      <Badge className="mb-4 ml-2 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                        ✅ Free 100%
                      </Badge>
                    )}
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                      {featuredCourse.title}
                    </h3>
                    <p className="text-gray-700 dark:text-white/80 text-lg mb-4 leading-relaxed font-medium">
                      {featuredCourse.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`${difficultyColors[featuredCourse.level]} text-sm px-3 py-1 rounded-full font-bold`}>
                        {featuredCourse.level}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1 rounded-full text-gray-700 font-semibold border-gray-400">
                        👤 {featuredCourse.instructor}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-300">
                      <div>
                        <p className="text-2xl font-bold text-[#a62a26]">{featuredCourse.modules.length}</p>
                        <p className="text-sm text-gray-700 font-semibold">{language === "vi" ? "Chương" : "챕터"}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#a62a26]">4.8</p>
                        <p className="text-sm text-gray-700 font-semibold">⭐ {language === "vi" ? "Đánh Giá" : "평점"}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#a62a26]">2.5K+</p>
                        <p className="text-sm text-gray-700 font-semibold">{language === "vi" ? "Học Viên" : "학생"}</p>
                      </div>
                    </div>
                  </div>
                  <Link href={getCourseHref(featuredCourse.id, featuredCourse.isFree)} className="w-full mt-6">
                    <Button className="w-full bg-[#a62a26] hover:bg-[#8a2220] text-white font-semibold py-6 text-lg rounded-lg transition-all hover:shadow-lg">
                      {t("viewCourse")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {language === "vi" ? "📚 Tất Cả Khóa Học" : "📚 모든 강좌"}
            </h2>
          </motion.div>
          {filteredCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full border border-gray-200 bg-white dark:bg-[#000814]/90 dark:border-white/10 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 dark:hover:from-[#1a1a4d]/80 dark:hover:to-[#2d2d5f]/80"
                  >
                    <CardHeader className="p-0">
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#a62a26]/10 group-hover:to-[#a62a26]/5 transition-colors duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-300 group-hover:text-[#a62a26]/40 transition-colors" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute right-3 top-3">
                          {course.isFree ? (
                            <Badge className="bg-green-500 text-white font-bold shadow-lg rounded-full px-3 py-1">
                              ✅ Free 100%
                            </Badge>
                          ) : (
                            <Badge className="bg-[#a62a26] text-white font-semibold shadow-lg hover:bg-[#8a2220] rounded-full px-3 py-1">
                              {course.modules.length} Chương
                            </Badge>
                          )}
                        </div>
                        <div className="absolute left-3 top-3">
                          <Badge className={`${difficultyColors[course.level]} font-semibold shadow-lg rounded-full px-3 py-1`}>
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                      <h3 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#a62a26] dark:group-hover:text-white transition-colors">
                          {course.title}
                        </h3>
                      </div>
                      <p className="line-clamp-2 text-sm mb-4 leading-relaxed text-gray-700 dark:text-white/80 font-medium">
                        {course.description}
                      </p>
                      <p className="text-xs font-bold text-gray-700 dark:text-white/80 mb-3 flex items-center gap-1">
                        👤 {course.instructor}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-700 pb-4 border-b border-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#a62a26]" />
                          <span>
                            {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} {t("lessons")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>4.8</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>1.2K</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4">
                      <Link href={getCourseHref(course.id, course.isFree)} className="w-full">
                        <Button className="w-full bg-[#a62a26] text-white hover:bg-[#8a2220] font-semibold transition-all group-hover:shadow-lg rounded-lg">
                          {t("viewCourse")}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 dark:text-white/20 mb-4" />
              <p className="text-gray-900 dark:text-white text-lg font-bold">
                {language === "vi" ? "Không tìm thấy khóa học" : "강좌를 찾을 수 없습니다"}
              </p>
              <p className="text-gray-700 dark:text-white/80 text-sm mt-2 font-semibold">
                {language === "vi" ? "Thử tìm kiếm với từ khóa khác" : "다른 키워드로 검색해보세요"}
              </p>
            </motion.div>
          )}
        </div>
      </section>
        </>
      )}
    </div>    </div>  );
}
