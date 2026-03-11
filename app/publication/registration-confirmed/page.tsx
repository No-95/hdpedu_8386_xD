"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";

export default function RegistrationConfirmedPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const timer = setTimeout(() => {
      router.push("/blog/community/hdp-work-and-korean-community");
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">{t("registrationSuccess")}</h1>
        <p className="text-lg">{t("registrationSuccessMsg")}</p>
      </div>

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 text-center border border-gray-100">
          <p className="text-xl font-semibold text-gray-900">
            Cảm ơn vì đã mua sách, thử khám phá cộng đồng HDP Work &amp; Korean Community nhé
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Tự động chuyển trang sau {secondsLeft} giây...
          </p>
        </div>
      </div>
    </div>
  );
}
