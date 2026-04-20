"use client" // clean

import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Target, Users, Lightbulb, Globe, CheckCircle2, Briefcase, Sparkles, Star, Zap, TrendingUp, Award, Rocket } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { ImageCarousel } from "@/components/image-carousel"

export default function HomePage() {
  const { language } = useLanguage()

  const content = {
    hero: {
      vi: {
        title: "NỀN TẢNG HỌC TRỰC TUYẾN GIÚP BẠN SẴN SÀNG LÀM VIỆC TẠI HÀN QUỐC",
        description: "Chúng tôi cung cấp các khóa học trực tuyến giúp người Việt Nam học tiếng Hàn, hiểu văn hóa doanh nghiệp và trang bị kỹ năng cần thiết để làm việc tại Hàn Quốc.",
        subtext: "Nội dung được thiết kế theo định hướng nghề nghiệp, bám sát thực tế môi trường làm việc tại Hàn Quốc và phù hợp với nền tảng của người Việt.",
        cta: "Khám Phá Khóa Học"
      },
      ko: {
        title: "한국에서 일할 준비를 도와주는 온라인 학습 플랫폼",
        description: "저희는 베트남인이 한국어를 배우고, 기업 문화를 이해하며, 한국에서 일하는 데 필요한 기술을 갖추도록 돕는 온라인 과정을 제공합니다.",
        subtext: "콘텐츠는 경력 지향적으로 설계되었으며 한국의 실제 업무 환경을 반영하고 베트남인의 배경에 적합합니다.",
        cta: "강좌 탐색하기"
      }
    },
    stats: {
      vi: {
        items: [
          { number: "10K+", label: "Học viên" },
          { number: "50+", label: "Khóa học" },
          { number: "95%", label: "Sự hài lòng" },
          { number: "1K+", label: "Hỗ trợ tuyển dụng" }
        ]
      },
      ko: {
        items: [
          { number: "10K+", label: "학생들" },
          { number: "50+", label: "강좌" },
          { number: "95%", label: "만족도" },
          { number: "1K+", label: "채용 성공" }
        ]
      }
    },
    whatYouLearn: {
      vi: {
        title: "Bạn Sẽ Học Được Gì",
        description: "Thông qua các chương trình học tập trực tuyến, người học sẽ được trang bị:",
        items: [
          "Tiếng Hàn ứng dụng trong môi trường làm việc",
          "Cách giao tiếp và ứng xử trong doanh nghiệp Hàn Quốc",
          "Văn hóa, tác phong và tư duy làm việc của người Hàn",
          "Kỹ năng chuẩn bị hồ sơ, phỏng vấn và hòa nhập công việc",
          "Định hướng học tập và phát triển nghề nghiệp rõ ràng"
        ]
      },
      ko: {
        title: "무엇을 배우게 됩니까?",
        description: "온라인 학습 프로그램을 통해 학생들은 다음을 갖추게 됩니다:",
        items: [
          "업무 환경에서 실용적인 한국어",
          "한국 기업에서 의사소통 및 에티켓",
          "한국인의 업무 문화, 직장 예절 및 사고방식",
          "이력서 준비, 면접 및 직무 적응 기술",
          "명확한 학습 방향 및 경력 개발"
        ]
      }
    },
    journey: {
      vi: {
        title: "Hành Trình Học Tập Của Bạn",
        steps: [
          { number: "01", title: "Nắm Vững Cơ Bản", desc: "Học các kiến thức cơ bản tiếng Hàn và văn hóa" },
          { number: "02", title: "Áp Dụng Thực Tế", desc: "Học tiếng Hàn thực tế theo từng lĩnh vực công việc" },
          { number: "03", title: "Hoàn Thành Chuẩn Bị", desc: "Chiến lược xin việc, phỏng vấn và hòa nhập công việc" },
          { number: "04", title: "Thành Công Tuyển Dụng", desc: "Bắt đầu sự nghiệp thành công tại doanh nghiệp Hàn" }
        ]
      },
      ko: {
        title: "당신의 학습 여정",
        steps: [
          { number: "01", title: "기초 마스터", desc: "핵심 한국어 및 문화 기초 학습" },
          { number: "02", title: "실무 적용", desc: "직무별 실무 한국어 및 기술 습득" },
          { number: "03", title: "준비 완성", desc: "이력서, 면접, 직무 적응 전략" },
          { number: "04", title: "성공 취업", desc: "한국 기업에서의 성공적인 시작" }
        ]
      }
    },
    trainingFields: {
      vi: {
        title: "Các Chương Trình Đào Tạo Chính",
        items: [
          { title: "Tiếng Hàn Thực Tế", icon: BookOpen, desc: "Tiếng Hàn cần thiết trong môi trường làm việc thực tế", color: "from-blue-500/30 to-cyan-500/30" },
          { title: "Văn Hóa Doanh Nghiệp", icon: Briefcase, desc: "Hiểu biết về môi trường doanh nghiệp Hàn Quốc", color: "from-purple-500/30 to-pink-500/30" },
          { title: "Kỹ Năng Công Việc", icon: Target, desc: "Kỹ năng thiết yếu cho cuộc sống công sở", color: "from-orange-500/30 to-red-500/30" },
          { title: "Phát Triển Sự Nghiệp", icon: Rocket, desc: "Chiến lược phát triển bền vững", color: "from-green-500/30 to-emerald-500/30" }
        ]
      },
      ko: {
        title: "핵심 교육 프로그램",
        items: [
          { title: "업무용 한국어", icon: BookOpen, desc: "실제 업무에서 필요한 한국어", color: "from-blue-500/30 to-cyan-500/30" },
          { title: "기업 문화", icon: Briefcase, desc: "한국 기업 환경 이해하기", color: "from-purple-500/30 to-pink-500/30" },
          { title: "업무 기술", icon: Target, desc: "직장 생활 필수 스킬", color: "from-orange-500/30 to-red-500/30" },
          { title: "경력 개발", icon: Rocket, desc: "지속가능한 성장 전략", color: "from-green-500/30 to-emerald-500/30" }
        ]
      }
    },
    benefits: {
      vi: {
        title: "Những Gì Bạn Sẽ Nhận Được",
        items: [
          { icon: Award, text: "Chứng chỉ được công nhân chứng" },
          { icon: TrendingUp, text: "Hỗ trợ phát triển sự nghiệp" },
          { icon: Users, text: "Kết nối mạng lưới toàn cầu" },
          { icon: Sparkles, text: "Học tập được cá nhân hóa" },
          { icon: Zap, text: "Quyền truy cập học tập suốt đời" },
          { icon: CheckCircle2, text: "Bảo đảm 100% hài lòng" }
        ]
      },
      ko: {
        title: "당신이 얻을 것",
        items: [
          { icon: Award, text: "업계 인정 자격증" },
          { icon: TrendingUp, text: "경력 개발 지원" },
          { icon: Users, text: "글로벌 네트워킹" },
          { icon: Sparkles, text: "개인 맞춤 학습" },
          { icon: Zap, text: "평생 학습 접근권" },
          { icon: CheckCircle2, text: "100% 만족 보장" }
        ]
      }
    },
    cta: {
      vi: {
        title: "Sẵn Sàng Thay Đổi Sự Nghiệp Của Bạn?",
        description: "Hàng nghìn người Việt Nam đã thực hiện ước mơ tuyển dụng tại Hàn Quốc thông qua HDP EDU. Bạn cũng có thể làm được.",
        button: "Bắt Đầu Ngay Bây Giờ"
      },
      ko: {
        title: "당신의 경력을 변화시킬 준비가 되셨습니까?",
        description: "수천 명의 베트남인이 이미 HDP EDU를 통해 한국 취업의 꿈을 실현했습니다. 당신도 할 수 있습니다.",
        button: "지금 시작하기"
      }
    }
  }

  const t = (section: keyof typeof content): any => {
    return content[section][language as keyof typeof content['hero']]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

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
      {/* Premium Welcome Section */}
      <section className="relative overflow-hidden py-20 md:py-32 border-b light:bg-white/15 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="absolute inset-0 opacity-30">
          <motion.div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" animate={{ y: [0, 30, 0], x: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl" animate={{ y: [0, -30, 0], x: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} />
        </div>
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-center">
            <motion.div className="inline-flex items-center gap-2 mb-6 px-5 py-3 rounded-full border light:bg-white/60 dark:bg-transparent" style={{ borderColor: '#a62a26' }} animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles className="h-4 w-4 text-[#a62a26] dark:text-white" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#a62a26] dark:text-white">당신의 경력 게이트웨이</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 flex flex-col items-center gap-4"
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-[#a62a26] dark:text-white">
                HDP EDUCATION
              </h1>
            </motion.div>
            <motion.p className="text-xl md:text-2xl text-[#a62a26]/80 dark:text-white/80 max-w-2xl mx-auto mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Excellence in Education for Global Careers
            </motion.p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#a62a26] dark:via-white to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Hero Section with Dynamic CTA */}
      <section className="py-20 md:py-28 border-b light:bg-white/30 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="grid md:grid-cols-2 gap-12 items-center rounded-3xl border border-[#a62a26]/35 p-8 md:p-12 backdrop-blur-xl light:bg-[#a62a26]/18 dark:bg-transparent">
            <div>
              <motion.div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-[#a62a26]/40 light:bg-[#a62a26]/25 dark:bg-transparent" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Globe className="h-4 w-4 text-[#a62a26] dark:text-white" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a62a26] dark:text-white">Career Focused Korean Learning</span>
              </motion.div>
              <motion.h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-[#a62a26] dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {t("hero").title}
              </motion.h2>
              <motion.p className="text-lg mb-5 leading-relaxed text-slate-900 dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {t("hero").description}
              </motion.p>
              <motion.p className="text-base mb-8 leading-relaxed border-l-4 border-[#a62a26] pl-5 text-slate-800 dark:text-white/85 dark:border-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {t("hero").subtext}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Button asChild size="lg" className="group bg-[#a62a26] text-white hover:bg-[#8e2420] dark:bg-white dark:text-[#000814] dark:hover:bg-white/90 shadow-2xl transition-all font-bold text-base px-8 py-6">
                  <Link href="/courses">
                    <span className="flex items-center gap-3 dark:text-[#000814]">
                      {t("hero").cta}
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative h-96 hidden md:flex items-center justify-center">
              <div className="absolute inset-8 rounded-3xl border border-[#a62a26]/30 light:bg-[#a62a26]/14 dark:bg-transparent backdrop-blur-md" />
              <Image src="/hdp-logo.png" alt="Logo" width={390} height={390} className="object-contain drop-shadow-2xl relative z-10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 border-b light:bg-white/20 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid md:grid-cols-4 gap-6">
            {t("stats").items.map((stat: any, index: number) => (
              <motion.div key={index} variants={itemVariants} className="text-center p-8 rounded-2xl backdrop-blur-xl border border-[#a62a26]/45 hover:border-[#a62a26]/80 transition-all group light:bg-[#a62a26]/32 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.35)' }}>
                <motion.div className="text-5xl font-black text-black dark:text-white mb-3" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  {stat.number}
                </motion.div>
                <p className="font-semibold text-black dark:text-white uppercase tracking-wider text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24 md:py-32 border-b light:bg-white/50 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-[#a62a26] dark:text-white">{t("whatYouLearn").title}</h2>
            <p className="text-lg max-w-2xl mx-auto text-slate-700 dark:text-white/80">{t("whatYouLearn").description}</p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t("whatYouLearn").items.map((item: any, index: number) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Card className="backdrop-blur-xl border-[#a62a26]/45 h-full hover:border-[#a62a26]/80 transition-all shadow-lg light:bg-[#a62a26]/32 dark:bg-transparent dark:border-white/20">
                  <CardContent className="p-8">
                    <motion.div className="p-4 w-fit rounded-2xl mb-4 light:bg-black/10 light:text-black dark:bg-white/20 dark:text-white">
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <p className="leading-relaxed text-lg font-semibold text-black dark:text-white">{item}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Journey Timeline */}
      <section className="py-24 md:py-32 border-b light:bg-white/20 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2 className="text-5xl md:text-6xl font-black mb-20 text-center text-[#a62a26] dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            {t("journey").title}
          </motion.h2>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid md:grid-cols-4 gap-6 relative">
            {t("journey").steps.map((step: any, index: number) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                <div className="rounded-2xl p-8 backdrop-blur-xl border border-[#a62a26]/45 shadow-xl hover:border-[#a62a26]/80 transition-all group h-full light:bg-[#a62a26]/32 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.35)' }}>
                  <motion.div className="text-6xl font-black text-black/25 dark:text-white/20 mb-4" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}>
                    {step.number}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">{step.title}</h3>
                  <p className="text-black/85 dark:text-white/80">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Training Programs with Gradients */}
      <section className="py-24 md:py-32 border-b light:bg-slate-50/50 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2 className="text-5xl md:text-6xl font-black mb-20 text-center text-[#a62a26] dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            {t("trainingFields").title}
          </motion.h2>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid md:grid-cols-2 gap-8">
            {t("trainingFields").items.map((item: any, index: number) => {
              const IconComponent = item.icon
              return (
                <motion.div key={index} variants={itemVariants} whileHover={{ y: -12 }} className="group">
                  <div className={`rounded-3xl p-12 backdrop-blur-xl border border-[#a62a26]/45 shadow-2xl transition-all h-full light:bg-[#a62a26]/32 dark:bg-transparent`} style={{ borderColor: 'rgba(166, 42, 38, 0.35)' }}>
                    <motion.div className="w-fit p-5 rounded-2xl mb-6 light:bg-black/90 light:text-white dark:bg-white dark:text-[#000814]">
                      <IconComponent className="h-10 w-10" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">{item.title}</h3>
                    <p className="text-lg leading-relaxed text-black/85 dark:text-white/80">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 md:py-32 border-b light:bg-white/20 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2 className="text-5xl md:text-6xl font-black mb-20 text-center text-[#a62a26] dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            {t("benefits").title}
          </motion.h2>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-6">
            {t("benefits").items.map((benefit: any, index: number) => {
              const IconComponent = benefit.icon
              return (
                <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }} className="p-8 rounded-2xl backdrop-blur-xl border border-[#a62a26]/45 shadow-lg transition-all text-center group light:bg-[#a62a26]/32 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.35)' }}>
                  <motion.div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full light:bg-black/10 light:text-black dark:bg-white/20 dark:text-white group-hover:light:bg-black group-hover:light:text-white group-hover:dark:bg-white group-hover:dark:text-[#000814] transition-all">
                      <IconComponent className="h-8 w-8" />
                    </div>
                  </motion.div>
                  <p className="font-semibold text-lg text-black dark:text-white">{benefit.text}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Image Carousel */}
      <ImageCarousel />

      {/* Premium CTA Section */}
      <section className="py-24 md:py-32 light:bg-white/10 dark:bg-transparent">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-3xl p-12 md:p-24 backdrop-blur-md border text-center shadow-2xl light:bg-white/90 dark:bg-transparent" style={{ borderColor: 'rgba(166, 42, 38, 0.2)' }}>
            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight text-[#a62a26] dark:text-white" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {t("cta").title}
              </motion.h2>
              <motion.p className="text-xl mb-12 leading-relaxed text-slate-700 dark:text-white/80" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {t("cta").description}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Button asChild size="lg" className="group bg-[#a62a26] text-white hover:bg-[#8e2420] dark:bg-white dark:text-[#000814] dark:hover:bg-white/90 shadow-2xl transition-all font-bold text-base px-10 py-7">
                  <Link href="/courses">
                    <span className="flex items-center gap-3 dark:text-[#000814]">
                      {t("cta").button}
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
