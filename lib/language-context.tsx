"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "vi" | "ko";

type Translations = {
  [key: string]: {
    vi: string;
    ko: string;
  };
};

export const translations: Translations = {
  // Navigation
  courses: { vi: "Khóa Học", ko: "강좌" },
  dashboard: { vi: "Tiến Trình", ko: "프로세스" },
  documents: { vi: "Tài Liệu", ko: "문서" },
  jobOpportunities: { vi: "Cơ Hội Việc Làm", ko: "취업 기회" },
  about: { vi: "Về Chúng Tôi", ko: "우리에 대해" },
  publication: { vi: "Sách", ko: "도서" },
  login: { vi: "Đăng Nhập", ko: "로그인" },
  register: { vi: "Đăng Ký", ko: "회원가입" },
  loginRegister: { vi: "Đăng Nhập / Đăng Ký", ko: "로그인 / 회원가입" },
  
  // Courses Page
  allCourses: { vi: "Tất Cả Khóa Học", ko: "모든 강좌" },
  coursesDescription: { vi: "Khám phá các khóa học chất lượng cao của chúng tôi", ko: "고품질 강좌를 탐색하세요" },
  lessons: { vi: "bài học", ko: "레슨" },
  enrolled: { vi: "đã đăng ký", ko: "등록됨" },
  viewCourse: { vi: "Xem Khóa Học", ko: "강좌 보기" },
  
  // Dashboard Page
  welcomeBack: { vi: "Chào Mừng Trở Lại", ko: "다시 오신 것을 환영합니다" },
  yourProgress: { vi: "Tiến Độ Của Bạn", ko: "학습 진행 상황" },
  coursesInProgress: { vi: "Khóa Học Đang Học", ko: "진행 중인 강좌" },
  completedCourses: { vi: "Khóa Học Hoàn Thành", ko: "완료된 강좌" },
  totalCredits: { vi: "Tổng Credits", ko: "총 크레딧" },
  studyTime: { vi: "Thời Gian Học", ko: "학습 시간" },
  hours: { vi: "giờ", ko: "시간" },
  recentActivity: { vi: "Hoạt Động Gần Đây", ko: "최근 활동" },
  continueLearning: { vi: "Tiếp Tục Học", ko: "학습 계속하기" },
  
  // Job Opportunities Page
  jobOpportunitiesTitle: { vi: "Cơ Hội Việc Làm", ko: "취업 기회" },
  jobDescription: { vi: "Khám phá các cơ hội nghề nghiệp tại Hàn Quốc", ko: "한국에서의 취업 기회를 탐색하세요" },
  fullTime: { vi: "Toàn thời gian", ko: "정규직" },
  partTime: { vi: "Bán thời gian", ko: "파트타임" },
  internship: { vi: "Thực tập", ko: "인턴십" },
  applyNow: { vi: "Ứng Tuyển Ngay", ko: "지금 지원하기" },
  salary: { vi: "Lương", ko: "급여" },
  location: { vi: "Địa điểm", ko: "위치" },
  requirements: { vi: "Yêu cầu", ko: "요구사항" },
  
  // Login/Register Page
  welcomeTo: { vi: "Chào Mừng Đến Với", ko: "환영합니다" },
  email: { vi: "Email", ko: "이메일" },
  password: { vi: "Mật Khẩu", ko: "비밀번호" },
  confirmPassword: { vi: "Xác Nhận Mật Khẩu", ko: "비밀번호 확인" },
  fullName: { vi: "Họ và Tên", ko: "성명" },
  phoneNumber: { vi: "Số Điện Thoại", ko: "전화번호" },
  forgotPassword: { vi: "Quên Mật Khẩu?", ko: "비밀번호를 잊으셨나요?" },
  noAccount: { vi: "Chưa có tài khoản?", ko: "계정이 없으신가요?" },
  haveAccount: { vi: "Đã có tài khoản?", ko: "이미 계정이 있으신가요?" },
  signUpNow: { vi: "Đăng ký ngay", ko: "지금 가입하세요" },
  signInNow: { vi: "Đăng nhập ngay", ko: "지금 로그인하세요" },
  
  // Common
  search: { vi: "Tìm kiếm", ko: "검색" },
  filter: { vi: "Lọc", ko: "필터" },
  sort: { vi: "Sắp xếp", ko: "정렬" },
  all: { vi: "Tất cả", ko: "전체" },
  loading: { vi: "Đang tải...", ko: "로딩 중..." },
  error: { vi: "Lỗi", ko: "오류" },
  success: { vi: "Thành công", ko: "성공" },
  cancel: { vi: "Hủy", ko: "취소" },
  save: { vi: "Lưu", ko: "저장" },
  submit: { vi: "Gửi", ko: "제출" },
  back: { vi: "Quay lại", ko: "뒤로" },
  next: { vi: "Tiếp theo", ko: "다음" },
  previous: { vi: "Trước", ko: "이전" },
  
  // Publication Page
  book: { vi: "Sách", ko: "도서" },
  koreanInFactories: { vi: "Tiếng Hàn Trong Nhà Máy Sản Xuất", ko: "제조 공장의 한국어" },
  bookDescription: { vi: "Cuốn sách thực chiến dành riêng cho môi trường sản xuất tại các nhà máy Hàn Quốc", ko: "한국 제조 공장 환경을 위한 실전 도서" },
  registerNow: { vi: "Đăng ký mua sách ngay", ko: "지금 책 등록하기" },
  aboutAuthor: { vi: "Về tác giả", ko: "저자 소개" },
  authorBio: { vi: "Cử nhân Ngôn ngữ Hàn Quốc - Đại học Hà Nội, Thạc sĩ Quản trị Kinh doanh - Đại học Soongsil, Hàn Quốc. Nhà sáng lập kiêm Giám đốc điều hành tại HDP Edu", ko: "베트남 하노이 대학교 한국어학 학사, 서울 숭실대학교 경영학 석사. HDP Edu의 창립자 겸 CEO" },
  aboutBook: { vi: "Giới thiệu cuốn sách", ko: "도서 소개" },
  bookIntro: { vi: "Tiếng Hàn trong nhà máy sản xuất — Cẩm naan giao tiếp hiệu quả cho nhân viên các nhà máy Hàn Quốc", ko: "제조 공장의 한국어 — 한국 공장 직원을 위한 효과적인 의사소통 가이드" },
  bookContent: { vi: "Trong các nhà máy có vốn đầu tư Hàn Quốc tại Việt Nam, giao tiếp hiệu quả giữa nhân viên Việt và quản lý Hàn là chìa khóa success. Cuốn sách này cung cấp kiến thức thực chiến để giúp bạn giao tiếp tự tin trong nhà máy sản xuất.", ko: "베트남의 한국 투자 공장에서 베트남인 직원과 한국인 관리자 간의 효과적인 의사소통이 성공의 열쇠입니다. 이 책은 제조 공장에서 자신 있게 의사소통할 수 있도록 도와주는 실전 지식을 제공합니다." },
  mainContent: { vi: "Nội dung chính", ko: "주요 내용" },
  suitableFor: { vi: "Phù hợp với", ko: "적합한 대상" },
  values: { vi: "Giá trị mang lại", ko: "제공되는 가치" },
  registrationSuccess: { vi: "Đăng ký thành công!", ko: "등록 성공!" },
  registrationSuccessMsg: { vi: "Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ sớm.", ko: "귀하의 정보를 받았으며 곧 연락하겠습니다." },
  thankYou: { vi: "Cảm ơn bạn!", ko: "감사합니다!" },
  registrationSubmitted: { vi: "Đơn đăng ký của bạn đã được gửi. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.", ko: "등록이 접수되었습니다. 최대한 빨리 연락하겠습니다." },
  registerBook: { vi: "Đăng ký mua sách", ko: "책 등록" },
  fullNameLabel: { vi: "Họ và Tên", ko: "성명" },
  fullNamePlaceholder: { vi: "Nhập họ và tên của bạn", ko: "성명을 입력하세요" },
  phoneLabel: { vi: "Số điện thoại", ko: "전화번호" },
  phonePlaceholder: { vi: "Ví dụ: 0123456789", ko: "예: 0123456789" },
  phoneConfirmLabel: { vi: "Nhập lại số điện thoại", ko: "전화번호 확인" },
  phoneConfirmPlaceholder: { vi: "Nhập lại SĐT để xác nhận", ko: "확인을 위해 전화번호를 다시 입력하세요" },
  phoneConfirmError: { vi: "Số điện thoại nhập lại không khớp.", ko: "전화번호가 일치하지 않습니다." },
  addressLabel: { vi: "Địa chỉ nhận hàng", ko: "배송 주소" },
  addressPlaceholder: { vi: "Nhập địa chỉ nhận hàng của bạn", ko: "배송 주소를 입력하세요" },
  noteLabel: { vi: "Ghi chú", ko: "메모" },
  notePlaceholder: { vi: "Ghi chú thêm (nếu có)", ko: "추가 메모 (선택사항)" },
  submitting: { vi: "Đang xử lý...", ko: "처리 중..." },
  submitButton: { vi: "Gửi thông tin", ko: "정보 제출" },
  privacyNotice: { vi: "Thông tin của bạn sẽ được bảo mật và không chia sẻ với bên thứ ba.", ko: "귀하의 정보는 기밀로 유지되며 제3자와 공유되지 않습니다." },
  contactWithin: { vi: "Nếu chúng tôi không liên hệ lại sau 8 tiếng, vui lòng gọi cho chúng tôi.", ko: "8시간 이내에 연락이 없으면 저희에게 전화해주세요." },
  nationalDelivery: { vi: "Giao hàng toàn quốc", ko: "전국 배송" },
  flexiblePayment: { vi: "Thanh toán linh hoạt", ko: "유연한 결제" },
  support24h: { vi: "Hỗ trợ 24/7", ko: "24/7 지원" },
  
  // Documents Page
  documentsLibrary: { vi: "Thư Viện Tài Liệu", ko: "문서 라이브러리" },
  administrativeOffice: { vi: "Hành Chính Văn Phòng", ko: "행정·사무" },
  administrativeDesc: { vi: "Nhân sự, tổ chức công ty và quy định nội bộ.", ko: "인사, 회사 조직 및 내규" },
  itSpecialized: { vi: "Chuyên Ngành IT", ko: "IT 전문" },
  itDesc: { vi: "Hạ tầng, phần mềm, lập trình và bảo mật.", ko: "인프라, 소프트웨어, 프로그래밍 및 ���안" },
  economicsFinance: { vi: "Kinh Tế & Tài Chính", ko: "경제 및 금융" },
  economicsDesc: { vi: "Vĩ mô, ngân hàng, thuế và quản trị kinh doanh.", ko: "거시경제, 은행업, 세금 및 경영관리" },
  beautyStpa: { vi: "Thẩm Mỹ & SPA", ko: "미용 및 스파" },
  beautySpaDesc: { vi: "Chăm sóc da, liệu trình làm đẹp và máy móc thẩm mỹ.", ko: "피부 관리, 미용 시술 및 미용 기계" },
  manufacturingFactory: { vi: "Sản Xuất & Công Xưởng", ko: "제조 및 공장" },
  manufacturingDesc: { vi: "Quy trình sản xuất, máy móc và quản lý chất lượng.", ko: "생산 공정, 기계 및 품질 관리" },
  internationalTrade: { vi: "Thương Mại Quốc Tế", ko: "국제 무역" },
  internationalTradeDesc: { vi: "Xuất nhập khẩu, đàm phán và thanh toán quốc tế.", ko: "수출입, 협상 및 국제 결제" },
  noDocuments: { vi: "Hiện tại chưa có tài liệu nào trong danh mục này", ko: "현재 이 카테고리에 문서가 없습니다" },
  
  // Dashboard Page
  coursesInProgress: { vi: "Khóa đang học", ko: "진행 중인 과정" },
  completedCoursesLabel: { vi: "Khóa học hoàn thành", ko: "완료된 과정" },
  coursesPurchased: { vi: "Khóa học đã mua", ko: "구매한 과정" },
  totalStudyTime: { vi: "Thời Gian Học", ko: "학습 시간" },
  nothingHighlight: { vi: "Chưa Có Hoạt Động Gì Nổi Bật, Thử Khám Phá Các Tính Năng Khác Ngay.", ko: "아직 주목할 활동이 없습니다. 다른 기능을 탐색해보세요." },
  
  // Achievement Page
  achievementTitle: { vi: "Thành Tích Của Bạn", ko: "당신의 업적" },
  achievementDescription: { vi: "Theo dõi tiến trình và thành tích học tập của bạn", ko: "학습 진행 상황과 업적을 추적하세요" },
  certificates: { vi: "Chứng chỉ", ko: "자격증" },
  badges: { vi: "Huy hiệu", ko: "뱃지" },
  points: { vi: "Điểm", ko: "포인트" },
  level: { vi: "Cấp độ", ko: "레벨" },
  unlocked: { vi: "Đã mở", ko: "잠금 해제" },
  locked: { vi: "Chưa mở", ko: "잠금" },

  // Classroom Page
  totalDuration: { vi: "Tổng Thời Lượng", ko: "전체 기간" },
  totalLessons: { vi: "Tổng Bài Học", ko: "전체 강의" },
  learners: { vi: "Học viên", ko: "학습자" },
  difficulty: { vi: "Độ Khó", ko: "난이도" },
  
  // Author Section
  authorFounderRole: { vi: "Nhà sáng lập kiêm Giám đốc điều hành Công ty", ko: "HDP HOLDINGS 창립자 겸 CEO" },
  authorEducation1: { vi: "Cử nhân Ngôn ngữ Hàn Quốc - Đại học Hà Nội", ko: "베트남 하노이 대학교 한국어학 학사" },
  authorEducation2: { vi: "Thạc sĩ Quản trị Kinh doanh - Đại học Soongsil, Hàn Quốc", ko: "한국 서울 숭실대학교 경영학 석사" },
  authorCompanyName: { vi: "HDP HOLDINGS", ko: "HDP HOLDINGS" },
  authorCompanyDesc: { vi: "đơn vị tư vấn chiến lược và cung cấp giải pháp toàn diện cho doanh nghiệp Việt Nam và doanh nghiệp FDI, đặc biệt là doanh nghiệp Hàn Quốc", ko: "베트남 및 해외직접투자 기업의 전략 상담 및 종합 솔루션을 제공하는 업체, 특히 한국 기업 전문" },
  authorConsultant: { vi: "Hiện là chuyên gia cố vấn cho nhiều hiệp hội doanh nghiệp, cơ quan xúc tiến đầu tư - thương mại của Việt Nam và Hàn Quốc, với kinh nghiệm sâu rộng trong lĩnh vực phát triển doanh nghiệp, hợp tác quốc tế và đào tạo nguồn nhân lực chất lượng cao.", ko: "현재 베트남-한국 비즈니스 협회 및 투자-무역 진흥 기관의 다수 경영 자문가입니다. 기업 개발, 국제 협력, 고급 인재 교육 분야의 광범위한 경험을 보유하고 있습니다." },
  
  // Book Content
  bookMainTitle: { vi: "Tiếng Hàn trong nhà máy sản xuất — Cẩm nang giao tiếp thực chiến cho môi trường công nghiệp Hàn Quốc", ko: "제조 공장의 한국어 — 한국 산업 환경을 위한 실전 의사소통 가이드" },
  bookIntroP1: { vi: "Trong các nhà máy có vốn đầu tư Hàn Quốc, ngôn ngữ không chỉ để giao tiếp mà còn ảnh hưởng trực tiếp đến hiệu suất, an toàn và cơ hội thăng tiến. Chỉ một sai lệch nhỏ trong truyền đạt có thể gây lỗi kỹ thuật, đình trệ dây chuyền hoặc tai nạn lao động.", ko: "한국 자본이 투자한 공장에서 언어는 단순한 의사소통을 넘어 생산성, 안전 및 경력 발전에 직접적인 영향을 미칩니다. 작은 오해도 기술 오류, 생산 라인 정지 또는 산업 재해를 초래할 수 있습니다." },
  bookIntroP2: { vi: "\"Tiếng Hàn trong nhà máy sản xuất\" được biên soạn nhằm cung cấp hệ thống tiếng Hàn chuyên ngành sản xuất sát thực tế, giúp người học sử dụng đúng từ vựng, đúng ngữ cảnh và đúng tình huống công việc.", ko: "\"제조 공장의 한국어\"는 실제 제조 산업의 한국어 시스템을 제공하여 학습자가 올바른 어휘, 맥락 및 업무 상황을 사용하도록 도와줍니다." },
  mainContent: { vi: "Nội dung chính", ko: "주요 내용" },
  mainContentIntro: { vi: "Cuốn sách bám sát quy trình vận hành của nhà máy hiện đại, theo từng bộ phận như:", ko: "이 책은 현대 공장의 운영 절차를 따르며 각 부서별로 다루고 있습니다:" },
  ppcLabel: { vi: "PPC, IQC, Dập kim loại, Ép nhựa – Khuôn, SMT, Sơn – Phủ bề mặt", ko: "PPC, IQC, 금속 프레싱, 플라스틱 사출 - 금형, SMT, 페인팅 - 표면 코팅" },
  assemblyLabel: { vi: "Lắp ráp, QC công đoạn, Bảo trì, Automation", ko: "조립, 공정 QC, 유지보수, 자동화" },
  engineeringLabel: { vi: "Kỹ thuật sản phẩm, Kỹ thuật công đoạn, R&D, OQC…", ko: "제품 엔지니어링, 공정 엔지니어링, R&D, OQC…" },
  eachChapterIncludes: { vi: "Mỗi chương gồm:", ko: "각 장에는 다음이 포함됩니다:" },
  departmentFunction: { vi: "Chức năng bộ phận", ko: "부서 기능" },
  vocabularySpecialized: { vi: "Từ vựng chuyên ngành Hàn – Việt", ko: "한국-베트남 전문 어휘" },
  suitableForTitle: { vi: "Phù hợp với", ko: "다음에 적합합니다:" },
  suitableItem1: { vi: "Người lao động tại nhà máy Hàn Quốc", ko: "한국 공장 근로자" },
  suitableItem2: { vi: "Kỹ thuật viên, QA – QC, tổ trưởng, quản lý sản xuất", ko: "엔지니어, QA-QC, 팀장, 생산 관리자" },
  suitableItem3: { vi: "Sinh viên khối kỹ thuật", ko: "공학 학생" },
  suitableItem4: { vi: "Ứng viên chuẩn bị phỏng vấn công ty Hàn", ko: "한국 회사 인터뷰 준비 중인 지원자" },
  suitableItem5: { vi: "Người học tiếng Hàn định hướng làm việc trong sản xuất", ko: "제조업 분야에서 일할 목표의 한국어 학습자" },
  valuesTitle: { vi: "Giá trị mang lại", ko: "제공되는 가치" },
  valuesItem1: { vi: "Giao tiếp chính xác trong môi trường sản xuất", ko: "제조 환경에서 정확한 의사소통" },
  valuesItem2: { vi: "Tự tin làm việc với quản lý người Hàn", ko: "한국인 관리자와의 자신감 있는 업무" },
  valuesItem3: { vi: "Hạn chế sai sót do hiểu nhầm", ko: "오해로 인한 오류 감소" },
  valuesItem4: { vi: "Nâng cao cơ hội thăng tiến", ko: "승진 기회 증대" },
  bookCTA: { vi: "Đây không chỉ là một cuốn sách học tiếng Hàn. Đây là công cụ hỗ trợ sự nghiệp trong môi trường nhà máy Hàn Quốc.", ko: "이것은 단순한 한국어 교재가 아닙니다. 이것은 한국 공장 환경에서의 경력을 지원하는 도구입니다." },
  bookRegisterCTA: { vi: "Đăng ký mua sách ngay", ko: "지금 책을 등록하세요" },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "vi" ? "ko" : "vi"));
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key];
      if (!translation) return key;
      return translation[language];
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
