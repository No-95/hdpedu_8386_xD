"use client"

import React from "react"
import Link from "next/link"
import { 
  BookOpen, 
  ChevronRight, 
  Home, 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  Factory, 
  Globe 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

export default function TaiLieuPage() {
  const { language, t } = useLanguage();
  
  // Updated list based on your folder structure
  const documents = [
    {
      id: "hcvp",
      titleVi: "Hành Chính Văn Phòng",
      titleKo: "행정·사무",
      descVi: "Nhân sự, tổ chức công ty và quy định nội bộ.",
      descKo: "인사, 회사 조직 및 내규",
      path: "/documents/tu-vung-HCVP",
      icon: <Briefcase size={24} />,
      category: "Công sở",
      color: "bg-blue-500"
    },
    {
      id: "it",
      titleVi: "Chuyên Ngành IT",
      titleKo: "IT 전문",
      descVi: "Hạ tầng, phần mềm, lập trình và bảo mật.",
      descKo: "인프라, 소프트웨어, 프로그래밍 및 보안",
      path: "/documents/tu-vung-IT",
      icon: <Cpu size={24} />,
      category: "Kỹ thuật",
      color: "bg-slate-700"
    },
    {
      id: "kinh-te",
      titleVi: "Kinh Tế & Tài Chính",
      titleKo: "경제 및 금융",
      descVi: "Vĩ mô, ngân hàng, thuế và quản trị kinh doanh.",
      descKo: "거시경제, 은행업, 세금 및 경영관리",
      path: "/documents/tu-vung-Kinh-Te",
      icon: <TrendingUp size={24} />,
      category: "Kinh doanh",
      color: "bg-amber-600"
    },
    {
      id: "spa",
      titleVi: "Thẩm Mỹ & SPA",
      titleKo: "미용 및 스파",
      descVi: "Chăm sóc da, liệu trình làm đẹp và máy móc thẩm mỹ.",
      descKo: "피부 관리, 미용 시술 및 미용 기계",
      path: "/documents/tu-vung-SPA",
      icon: <Sparkles size={24} />,
      category: "Làm đẹp",
      color: "bg-pink-500"
    },
    {
      id: "thsx",
      titleVi: "Sản Xuất & Công Xưởng",
      titleKo: "제조 및 공장",
      descVi: "Quy trình sản xuất, máy móc và quản lý chất lượng.",
      descKo: "생산 공정, 기계 및 품질 관리",
      path: "/documents/tu-vung-THSX",
      icon: <Factory size={24} />,
      category: "Sản xuất",
      color: "bg-orange-600"
    },
    {
      id: "thuong-mai",
      titleVi: "Thương Mại Quốc Tế",
      titleKo: "국제 무역",
      descVi: "Xuất nhập khẩu, đàm phán và thanh toán quốc tế.",
      descKo: "수출입, 협상 및 국제 결제",
      path: "/documents/tu-vung-Thuong-Mai",
      icon: <Globe size={24} />,
      category: "XNK",
      color: "bg-emerald-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Light mode background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat light" style={{ backgroundImage: 'url(/bg-course.png)' }} />
      {/* Dark mode background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat hidden dark:block" style={{ backgroundImage: 'url(/dark-mode.png)' }} />
      <div className="relative">
      <header className="border-b border-white/10 light:bg-white/10 dark:bg-[#000814]/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="rounded-lg border px-4 py-2 light:bg-white dark:bg-[#000814]/80 light:border-gray-200 dark:border-white/20">
            <h1 className="text-xl font-semibold text-[#a62a26] dark:text-white">{t("documentsLibrary")}</h1>
          </div>
          <Link href="/" className="text-white/70 hover:text-white dark:text-white/60 dark:hover:text-white transition-colors">
            <Home size={24} />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 relative z-10">
        <Card className="mb-8 light:bg-white dark:bg-[#000814]/90 shadow-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between light:border-b light:border-slate-200 dark:border-b dark:border-white/10 pb-6">
            <div>
              <CardTitle className="text-2xl text-[#a62a26] dark:text-white">{language === "vi" ? "Tài liệu học tập nội bộ" : "교육 자료"}</CardTitle>
              <p className="text-[#a62a26]/80 dark:text-white/80 text-sm mt-1">{language === "vi" ? "Chọn chuyên ngành bạn đang theo học để xem từ vựng." : "학습 중인 전뮄 분야를 선택하여 어휴를 보세요."}</p>
            </div>
            <ShieldCheck className="text-[#a62a26] dark:text-white opacity-80" size={32} />
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Link key={doc.id} href={doc.path} className="group">
                  <div 
                    className="flex flex-col h-full p-5 rounded-2xl border border-[#a62a26]/40 hover:border-[#a62a26] transition-all duration-300 bg-[#a62a26]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl shadow-lg light:bg-white/20 dark:bg-white/10">
                        {React.isValidElement(doc.icon) ? React.cloneElement(doc.icon, { className: "text-white" }) : doc.icon}
                      </div>
                      <Badge className="light:bg-white/20 dark:bg-white/10 text-white border-none text-[10px]">
                        {doc.category}
                      </Badge>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                        {language === "vi" ? doc.titleVi : doc.titleKo}
                      </h3>
                      <p className="text-white/90 text-xs leading-relaxed">
                        {language === "vi" ? doc.descVi : doc.descKo}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-white font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <span>{language === "vi" ? "Xem chi tiết" : "자세히 보기"}</span>
                      <ChevronRight size={16} className="text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/30 dark:text-white/20 text-xs italic">
          Hệ thống bảo mật HDP EDU - Vui lòng không sao chép dữ liệu.
        </p>
      </main>
      </div>
    </div>
  )
}
