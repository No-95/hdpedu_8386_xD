"use client";

import { Briefcase } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function JobsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Light mode background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat" style={{ backgroundImage: 'url(/bg-course.png)' }} />
      {/* Dark mode background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat hidden dark:block" style={{ backgroundImage: 'url(/dark-mode.png)' }} />
      <div className="relative">
      {/* Hero Section */}
      <div className="w-full">
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-3xl p-12 text-center bg-[#a62a26]/95 border border-[#8a2220] shadow-2xl dark:bg-[#000814] dark:border-white/10">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {language === "vi" ? "Cơ Hội Việc Làm" : "취업 기회"}
              </h1>
              <p className="mt-4 text-lg text-white/90 dark:text-white/80">
                {language === "vi" 
                  ? "Khám phá các cơ hội nghề nghiệp tại Hàn Quốc" 
                  : "한국에서의 취업 기회를 탐색하세요"}
              </p>
            </div>
          </div>
        </section>

        {/* Empty State Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-3xl bg-white/95 border border-[#a62a26]/15 dark:bg-[#000814]/90 dark:border-white/10 shadow-xl p-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full p-4 bg-[#a62a26] dark:bg-white">
                  <Briefcase className="h-12 w-12 text-white dark:text-[#000814]" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-[#a62a26] dark:text-white">
                {language === "vi" ? "Đang cập nhật" : "업데이트 중"}
              </h2>
              <p className="text-lg text-gray-700 dark:text-white/80">
                {language === "vi" 
                  ? "Hiện tại chưa có thông tin ứng tuyển nào, hãy quay lại sau" 
                  : "현재 채용 정보가 없습니다. 나중에 다시 방문해주세요"}
              </p>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
