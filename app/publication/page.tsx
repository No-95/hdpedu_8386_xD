"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";

const gallery = [
  "/book1/cover1.png",
  "/book1/cover2.png",
  "/book1/cover3.png",
  "/book1/1.png",
  "/book1/2.png",
  "/book1/3.png",
  "/book1/4.png",
];

function BookShowcase() {
  const [index, setIndex] = useState(0);

  // cycle through gallery automatically every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-white dark:bg-white/10 rounded-2xl p-4 shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-center aspect-[340/420] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={gallery[index]}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full relative"
            >
              <Image
                src={gallery[index]}
                alt={`Book ${index + 1}`}
                fill
                priority
                className="object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {gallery.map((src, i) => (
          <motion.button
            key={src}
            onClick={() => setIndex(i)}
            whileHover={{ scale: 1.06 }}
            className={`flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 ${
              i === index ? "border-[#a62a26] dark:border-white" : "border-transparent"
            } transition-all`}
          >
            <Image src={src} alt={`Thumb ${i + 1}`} width={80} height={112} className="object-cover h-full w-full" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function PublicationPage() {
  const { language, t } = useLanguage();

  const bookTitle =
    language === "vi"
      ? 'Sách - "Tiếng Hàn Trong Nhà Máy Sản Xuất"'
      : '도서 - "제조 공장의 한국어"';

  const bookSubtitle =
    language === "vi"
      ? "Cuốn sách thực chiến dành riêng cho môi trường sản xuất – giúp bạn hiểu quy trình, thuật ngữ, bối cảnh giao tiếp và tự tin làm việc với quản lý."
      : "제조 환경을 위한 실전 도서 - 프로세스, 용어, 의사소통 맥락을 이해하고 관리자와 자신 있게 일하세요.";

  return (
    // The background images are handled by globals.css body styles, 
    // but we use a wrapper to ensure the theme colors apply.
    <div className="min-h-screen transition-colors duration-300">
      <div className="relative z-10 text-gray-900 dark:text-white">
        
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="bg-white/90 dark:bg-[#000814]/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h1
                  className="text-3xl md:text-4xl font-extrabold leading-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {bookTitle}
                </motion.h1>

                <motion.p
                  className="mt-4 text-lg max-w-lg text-gray-700 dark:text-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {bookSubtitle}
                </motion.p>

                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#a62a26] text-white font-semibold px-8 py-6 hover:bg-[#8a2220] transition-all rounded-xl"
                  >
                    <a href="/publication/register-form">{t("registerNow")}</a>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <BookShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* Author Section */}
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="bg-white/80 dark:bg-[#000814]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-[220px] h-[300px] flex-shrink-0">
                <Image
                  src="/author.png"
                  alt={t("aboutAuthor")}
                  fill
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">{t("aboutAuthor")}</h2>
                <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-200 space-y-4">
                  <p className="font-medium text-[#a62a26] dark:text-white/90">{t("authorEducation1")}</p>
                  <p className="font-medium text-[#a62a26] dark:text-white/90">{t("authorEducation2")}</p>
                  <p>
                    {t("authorFounderRole")} <strong className="text-gray-900 dark:text-white">{t("authorCompanyName")}</strong>, {t("authorCompanyDesc")}
                  </p>
                  <p>{t("authorConsultant")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="bg-white/90 dark:bg-[#000814]/95 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-center">{t("aboutBook")}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#a62a26] dark:text-white mb-3">{t("bookMainTitle")}</h3>
                    <p className="text-gray-700 dark:text-gray-200">{t("bookIntroP1")}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200">{t("bookIntroP2")}</p>
                  
                  <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl">
                    <h3 className="font-bold mb-3">{t("mainContent")}</h3>
                    <ul className="space-y-2 list-inside list-disc text-gray-600 dark:text-gray-300">
                      <li>{t("ppcLabel")}</li>
                      <li>{t("assemblyLabel")}</li>
                      <li>{t("engineeringLabel")}</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">{t("suitableForTitle")}</h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a62a26] dark:bg-white" />
                          {t(`suitableItem${i}`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                    <h3 className="text-xl font-bold mb-3">{t("valuesTitle")}</h3>
                    <ul className="grid grid-cols-1 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <li key={i} className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#a62a26] dark:bg-white" />
                           {t(`valuesItem${i}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center border-t border-gray-100 dark:border-white/5 pt-12">
                <h2 className="text-3xl font-bold mb-8">{t("bookRegisterCTA")}</h2>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#a62a26] hover:bg-[#8a2220] text-white px-10 py-7 text-xl rounded-2xl shadow-xl transition-all"
                >
                  <a href="/publication/register-form">
                    {t("bookRegisterCTA")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}