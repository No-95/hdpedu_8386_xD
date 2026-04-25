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

export const courses: Course[] = [
  {
    id: "15001100",
    title: "Cẩm nang Video: Tiếng Hàn Sản xuất",
    description: "Khóa học miễn phí tổng hợp 75 video hướng dẫn tiếng Hàn chuyên ngành sản xuất – từ từ vựng cơ bản đến giao tiếp thực tế tại nhà máy.",
    instructor: "HDP EDU",
    thumbnail: "",
    level: "Beginner",
    isFree: true,
    modules: [
      {
        id: "mod-01",
        title: "Bài 1: Giới thiệu về bộ phận kế hoạch và điều tiết sản xuất",
        lessons: [
          { id: "l-001", title: "P1: Giới thiệu chung", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/vZKokqiDgLA", completed: false },
          { id: "l-002", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/3NljGCyLf8A", completed: false },
          { id: "l-003", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/dzqNCVlEVo4", completed: false },
          { id: "l-004", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/dB4bMQBhHCU", completed: false },
          { id: "l-005", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/Ao3KuVjKcFk", completed: false },
        ],
      },
      {
        id: "mod-02",
        title: "Bài 2: Bộ phận kiểm tra đầu vào",
        lessons: [
          { id: "l-006", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/ozHZri2aev4", completed: false },
          { id: "l-007", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/2P44ZijiBo8", completed: false },
          { id: "l-008", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/qyvLUEkYs2E", completed: false },
          { id: "l-009", title: "P4: Tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/39Y80nYJaUE", completed: false },
          { id: "l-010", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/qx0SMsqP2M0", completed: false },
        ],
      },
      {
        id: "mod-03",
        title: "Bài 3: Bộ phận dập kim loại",
        lessons: [
          { id: "l-011", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/0xrN-t2MUQ4", completed: false },
          { id: "l-012", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/2P44ZijiBo8", completed: false },
          { id: "l-013", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/uoYih_8px64", completed: false },
          { id: "l-014", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/rLjnv8_JiKU", completed: false },
        ],
      },
      {
        id: "mod-04",
        title: "Bài 4: Bộ phận ép nhựa khuôn",
        lessons: [
          { id: "l-015", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/_nSuaSC-5h8", completed: false },
          { id: "l-016", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/EmRw9nVzqnU", completed: false },
          { id: "l-017", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/sYzPxExflFY", completed: false },
          { id: "l-018", title: "P4: Tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/FboCZfH7gmw", completed: false },
          { id: "l-019", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/ZuwLe__1u3U", completed: false },
        ],
      },
      {
        id: "mod-05",
        title: "Bài 5: Bộ phận SMT (Surface Mount Technology)",
        lessons: [
          { id: "l-020", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/fWVSO-TS4O4", completed: false },
          { id: "l-021", title: "P2: Từ vựng", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/-oRcem7Tmsc", completed: false },
          { id: "l-022", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/Xv8NL1U60R8", completed: false },
          { id: "l-023", title: "P4: Tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/rvVsTqoRr4I", completed: false },
          { id: "l-024", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/wsagvO3GfZw", completed: false },
        ],
      },
      {
        id: "mod-06",
        title: "Bài 6: Bộ phận sơn phủ bề mặt",
        lessons: [
          { id: "l-025", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/Ld6qQe2ObJA", completed: false },
          { id: "l-026", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/pBV7Kubl4nM", completed: false },
          { id: "l-027", title: "P3: Hội thoại & Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/wSx0DqmjWZU", completed: false },
          { id: "l-028", title: "P4: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/6lYnGNQaf6A", completed: false },
        ],
      },
      {
        id: "mod-07",
        title: "Bài 7: Bộ phận lắp ráp Module",
        lessons: [
          { id: "l-029", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/rt1hVTxe360", completed: false },
          { id: "l-030", title: "P2: Từ vựng", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/XW2JyLfhdpY", completed: false },
          { id: "l-031", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/_x5F7pXZBJk", completed: false },
          { id: "l-032", title: "P4: Tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/R71bsqIZ3mM", completed: false },
          { id: "l-033", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/O-88-Ci9oKE", completed: false },
        ],
      },
      {
        id: "mod-08",
        title: "Bài 8: Bộ phận kiểm tra công đoạn",
        lessons: [
          { id: "l-034", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/Sy69KidBQug", completed: false },
          { id: "l-035", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/ybtvO8diDbw", completed: false },
          { id: "l-036", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/fukEK3CB6eo", completed: false },
          { id: "l-037", title: "P4: Tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/4f9W-YC3ZDY", completed: false },
          { id: "l-038", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/pSV-ukct3YQ", completed: false },
        ],
      },
      {
        id: "mod-09",
        title: "Bài 9: Bộ phận bảo trì thiết bị",
        lessons: [
          { id: "l-039", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/wVaKSIrPHAM", completed: false },
          { id: "l-040", title: "P2: Từ vựng", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/cxj_DCv-Tnk", completed: false },
          { id: "l-041", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/hllWeTxPSV0", completed: false },
          { id: "l-042", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/dgImF7LJWMk", completed: false },
          { id: "l-043", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/o6sHevFthGg", completed: false },
        ],
      },
      {
        id: "mod-10",
        title: "Bài 10: Bộ phận Robot – AI",
        lessons: [
          { id: "l-044", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/3k771rxvWNc", completed: false },
          { id: "l-045", title: "P2: Từ vựng", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/AQKIEhsTMCI", completed: false },
          { id: "l-046", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/xdHZ1c8gdGI", completed: false },
          { id: "l-047", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/B_BrknPp2zY", completed: false },
          { id: "l-048", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/OIxva2wtmVM", completed: false },
        ],
      },
      {
        id: "mod-11",
        title: "Bài 11: Bộ phận kĩ thuật sản phẩm (Product Engineering)",
        lessons: [
          { id: "l-049", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/xhsml9QOu1Q", completed: false },
          { id: "l-050", title: "P2: Từ vựng", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/e5biJKUrkuw", completed: false },
          { id: "l-051", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/HL2Zk3lOiJA", completed: false },
          { id: "l-052", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/_QhAq51nv2A", completed: false },
          { id: "l-053", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/flY9F3x6_wE", completed: false },
        ],
      },
      {
        id: "mod-12",
        title: "Bài 12: Bộ phận kĩ thuật công đoạn",
        lessons: [
          { id: "l-054", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/MmPHf6oFx3M", completed: false },
          { id: "l-055", title: "P2: Từ vựng", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/zUIj1-cU-PE", completed: false },
          { id: "l-056", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/p5vq44BXThE", completed: false },
          { id: "l-057", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/TCTLfMFhm-A", completed: false },
          { id: "l-058", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/iq-rWORla-A", completed: false },
        ],
      },
      {
        id: "mod-13",
        title: "Bài 13: Bộ phận thử nghiệm phát triển",
        lessons: [
          { id: "l-059", title: "P1: Tổng quan", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/wUZq1uwC7MY", completed: false },
          { id: "l-060", title: "P2: Từ vựng chuyên ngành", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/QV0lTHn1_Pg", completed: false },
          { id: "l-061", title: "P3: Hội thoại thực tế", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/LIOcq2eJMvE", completed: false },
          { id: "l-062", title: "P4: Các tình huống phát sinh", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/u7JAFwdhkhA", completed: false },
          { id: "l-063", title: "P5: Luyện dịch", duration: "--:--", isPremium: false, videoUrl: "https://youtu.be/zbK73IWEu9g", completed: false },
        ],
      },
    ],
  },
];

// Re-export as mockCourse with a safe fallback so classroom page never crashes
export const mockCourse: Course = courses[0] ?? placeholderCourse;

export const mockUser: User = {
  name: "",
  email: "",
  coursesPurchased: [],
}
