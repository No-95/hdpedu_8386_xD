export interface Lesson {
  id: string
  title: string
  duration: string
  isPremium: boolean
  videoUrl: string
  completed: boolean
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  thumbnail: string
  level: "Beginner" | "Intermediate" | "Advanced"
  modules: Module[]
  isFree?: boolean
}

export interface User {
  name: string
  email?: string
  coursesPurchased: string[]
}
