// src/lib/data.ts
import { Course, User } from "./types"

const classroomDemoVideoUrl = process.env.NEXT_PUBLIC_CLASSROOM_DEMO_VIDEO_URL ?? ""

// Placeholder course used by the classroom page when no real data is available
const placeholderCourse: Course = {
  id: "placeholder",
  title: "Coming Soon",
  description: "This course is currently being prepared. Check back soon for exciting new content.",
  instructor: "HDP EDU",
  thumbnail: "",
  level: "Beginner",
  modules: [
    {
      id: "mod-1",
      title: "Introduction",
      lessons: [
        {
          id: "lesson-1",
          title: "Welcome",
          duration: "5:00",
          isPremium: false,
          videoUrl: classroomDemoVideoUrl,
          completed: false,
        },
      ],
    },
  ],
};

export const courses: Course[] = [];

// Re-export as mockCourse with a safe fallback so classroom page never crashes
export const mockCourse: Course = courses[0] ?? placeholderCourse;

export const mockUser: User = {
  name: "",
  email: "",
  coursesPurchased: [],
}
