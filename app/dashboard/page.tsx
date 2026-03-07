"use client";

import {
  BookOpen,
  Clock,
  Trophy,
  Wallet,
  Play,
  TrendingUp,
  Calendar,
  Target,
  LogOut,
  Zap,
  Star,
  Award,
  ArrowRight,
  CheckCircle,
  Flame,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SyncBar } from "@/components/sync-bar";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { ProfileCustomizer } from "@/components/profile-customizer";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { useUser } from "@/lib/user-context";
import { courses } from "@/lib/data";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated, isLoading, signOut } = useUser();
  const router = useRouter();

  const currentProfile = useQuery(api.profiles.getCurrentUserProfile, {});

  // Prefer canonical username from profiles table. Fallback to email prefix if needed.
  const profileUsername = currentProfile?.username || user?.email?.split("@")[0] || "";
  const canEditProfile = profileUsername.length > 0;
  
  // Track if we have ever loaded data once to avoid "flicker"
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [secondsOnPage, setSecondsOnPage] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only check auth after component is mounted to avoid race conditions
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        // Add a small delay before redirecting to ensure auth state is settled
        const timer = setTimeout(() => {
          router.push("/auth");
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setHasLoadedOnce(true);
      }
    }
  }, [isLoading, isAuthenticated, router, mounted]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSecondsOnPage((s) => s + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
    router.refresh();
  };

  const handleEditProfile = () => {
    if (canEditProfile) {
      router.push(`/u/${profileUsername}`);
    }
  };

  // 1. HARD BLANK: Only if not logged in and not loading
  if (!isLoading && !isAuthenticated) return null;

  // 2. INITIAL COLD START: Only show skeleton if we have NO user data yet
  // This prevents the "hollow" menu-only look.
  const showSkeleton = isLoading && !hasLoadedOnce;

  const displayName = user?.name || user?.email?.split('@')[0] || "User";

  // Safe access to user data
  const purchasedCount = 0; // always zero as per new requirement
  const inProgressCount = 0;
  const completedCount = 0;

  const formatTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const stats = [
    { title: language === "vi" ? "Khóa đang học" : "진행 중인 과정", value: inProgressCount.toString(), icon: BookOpen, change: "", color: "bg-blue-100 text-blue-700", iconColor: "text-blue-600" },
    { title: language === "vi" ? "Khóa học hoàn thành" : "완료된 과정", value: completedCount.toString(), icon: Trophy, change: "", color: "bg-amber-100 text-amber-700", iconColor: "text-amber-600" },
    { title: language === "vi" ? "Khóa học đã mua" : "구매한 과정", value: purchasedCount.toString(), icon: Wallet, change: "", color: "bg-emerald-100 text-emerald-700", iconColor: "text-emerald-600" },
    { title: language === "vi" ? "Thời Gian Học" : "학습 시간", value: formatTime(secondsOnPage), icon: Clock, change: "", color: "bg-purple-100 text-purple-700", iconColor: "text-purple-600" },
  ];

  // no recent activity by default per requirement; show placeholder message in UI
  const recentActivity: Array<{ course: string; lesson: string; progress: number; date: string; icon: string }> = [];


  const achievements = [
    { title: "Quick Start", description: "Complete first lesson", icon: "🚀", unlocked: true },
    { title: "Week Warrior", description: "Study 7 days straight", icon: "⚡", unlocked: true },
    { title: "Master Mind", description: "Complete a full course", icon: "🧠", unlocked: false },
    { title: "Perfect Score", description: "Get 100% on a quiz", icon: "💯", unlocked: false },
  ];

  return (
    <>
      {/* Top Sync Bar always reflects the current background syncing status */}
      <SyncBar isSyncing={isLoading} label="Refreshing workspace..." />

      <div className="relative min-h-screen light:bg-gradient-to-br light:from-white light:to-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
        {/* background images for light/dark themes */}
        <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat light:block dark:hidden" style={{
          backgroundImage: "url('/bg-course.png')",
        }} />
        <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat hidden dark:block" style={{
          backgroundImage: "url('/dark-mode.png')",
        }} />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {showSkeleton ? (
              <motion.div 
                key="skeleton"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* ── Hero Header Section ── */}
                <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-[#a62a26] via-[#c73a32] to-[#8a2220]">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-24 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 mb-0 blur-3xl" />
                  
                  <div className="relative mx-auto max-w-7xl px-4 py-12 pt-16 z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="rounded-2xl border border-white/30 p-6 md:p-8 bg-white/10 backdrop-blur-xl">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <Zap className="h-6 w-6 text-white" />
                              <span className="text-sm font-semibold uppercase tracking-wider text-white/90">Welcome Back</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                              {displayName}! 👋
                            </h1>
                            <p className="mt-2 text-lg text-white/90">Keep up the momentum with your learning journey</p>
                          </div>
                          <div className="flex flex-col gap-3 md:flex-row">
                            <Button variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 font-semibold">
                              <Wallet className="mr-2 h-4 w-4" />
                              {purchasedCount} Purchased
                            </Button>
                            <Button
                              onClick={handleEditProfile}
                              disabled={!canEditProfile}
                              className="bg-white text-[#a62a26] hover:bg-gray-100 font-semibold"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Profile
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={handleSignOut}
                              className="text-white hover:text-white hover:bg-white/20 font-semibold"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Logout
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-8">
                  {/* ── Stats Grid - Enhanced ── */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, staggerChildren: 0.1 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Progress Overview</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                            type: 'spring',
                            stiffness: 300
                          }}
                        >
                          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <div className={`absolute inset-0 ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                            <CardContent className="relative p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                </div>
                                {stat.change && (
                                  <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                    <TrendingUp className="mr-1 h-3 w-3" />
                                    {stat.change}
                                  </span>
                                )}
                              </div>
                              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                              <p className="text-sm text-gray-700 font-bold">{stat.title}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* ── Main Content Grid ── */}
                  <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    {/* ── Recent Activity ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="lg:col-span-2"
                    >
                      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                        <CardHeader className="border-b border-gray-100">
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <Flame className="h-6 w-6 text-[#a62a26]" />
                            🔥 Recent Activity
                          </CardTitle>
                          <p className="text-sm text-gray-700 mt-1 font-semibold">Your learning journey updated</p>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            {recentActivity.length === 0 ? (
                              <p className="text-center text-gray-600 italic">
                                {language === "vi" 
                                  ? "Chưa Có Hoạt Động Gì Nổi Bật, Thử Khám Phá Các Tính Năng Khác Ngay."
                                  : "아직 주목할 활동이 없습니다. 다른 기능을 탐색해보세요."}
                              </p>
                            ) : (
                              recentActivity.map((activity, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  whileHover={{ scale: 1.02 }}
                                  transition={{
                                    delay: 0.5 + index * 0.1,
                                    type: 'spring',
                                    stiffness: 250
                                  }}
                                >
                                  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-gray-400 hover:shadow-md transition-all group">
                                    <div className="text-3xl pt-1">{activity.icon}</div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-bold text-gray-900 group-hover:text-[#a62a26] transition-colors">{activity.lesson}</p>
                                      <p className="text-sm text-gray-700 truncate font-semibold">{activity.course}</p>
                                      <div className="mt-3 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-bold text-gray-700">Progress</span>
                                          <span className="text-sm font-bold text-[#a62a26]">{activity.progress}%</span>
                                        </div>
                                        <Progress value={activity.progress} className="h-2 bg-gray-200" />
                                      </div>
                                      <p className="text-xs text-gray-500 mt-2">{activity.date}</p>
                                    </div>
                                    {activity.progress === 100 && (
                                      <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* ── Continue Learning ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="bg-white border border-gray-300 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                        <CardHeader className="border-b border-gray-100">
                          <CardTitle className="flex items-center gap-2 text-gray-900">
                            <Target className="h-6 w-6 text-[#a62a26]" />
                            Continue Learning
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="space-y-3 flex-1">
                            {/* intentionally blank */}
                          </div>
                          {/* Browse button hidden per requirements */}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* ── Achievements Section ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Achievements</h2>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.title}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.03 }}
                            transition={{
                              delay: 0.7 + index * 0.1,
                              type: 'spring',
                              stiffness: 280
                            }}
                          >
                            <Card className={`relative overflow-hidden text-center p-6 transition-all ${
                              achievement.unlocked
                                ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-lg hover:shadow-xl"
                                : "bg-gray-50 border-gray-200 opacity-60"
                            }`}>
                              <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-400"></div>
                              </div>
                              <div className="relative">
                                <div className="text-5xl mb-3">{achievement.icon}</div>
                                <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                                <p className="text-xs text-gray-600 mb-3">{achievement.description}</p>
                                {achievement.unlocked ? (
                                  <Badge className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    ✓ Unlocked
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    🔒 Locked
                                  </Badge>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* ── Quick Actions ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 mb-8"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Link href="/courses">
                        <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer h-full">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                              <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                              <h3 className="font-bold text-gray-900 mb-1">Browse Courses</h3>
                              <p className="text-xs text-gray-700">Discover new learning paths</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                      <Link href="/blog">
                        <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all cursor-pointer h-full">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                              <Star className="h-8 w-8 text-green-600 mb-3" />
                              <h3 className="font-bold text-gray-900 mb-1">Community</h3>
                              <p className="text-xs text-gray-700">Share and learn</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                      <Link href="/achievement">
                        <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                              <Award className="h-8 w-8 text-purple-600 mb-3" />
                              <h3 className="font-bold text-gray-900 mb-1">Certificates</h3>
                              <p className="text-xs text-gray-700">View your achievements</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
<Link href="/daily-challenge">
                        <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                              <Zap className="h-8 w-8 text-orange-600 mb-3" />
                              <h3 className="font-bold text-gray-900 mb-1">Daily Challenge</h3>
                              <p className="text-xs text-gray-700">Try the daily quiz</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
