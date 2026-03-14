"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/lib/language-context";

export default function RegisterFormPage() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    phoneConfirm: "",
    address: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.phone !== form.phoneConfirm) {
      setError(language === "vi" ? "Số điện thoại nhập lại không khớp." : "전화번호가 일치하지 않습니다.");
      const response = await fetch("/api/send-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          message: form.message,
          sourcePath,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Co loi xay ra, vui long thu lai sau.");
      }

      router.push("/publication/registration-confirmed");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Có lỗi xảy ra, vui lòng thử lại sau.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 px-4 sm:px-6 lg:px-8 bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/bg-book1.png')" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">{t("registerBook")}</h1>
          <p className="text-lg text-gray-600">{language === "vi" ? "Tiếng Hàn Trong Nhà Máy Sản Xuất" : "제조 공장의 한국어"}</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-10 sm:px-12">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-lg">
                  ❌ {error}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t("fullNameLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a62a26] transition-colors bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t("phoneLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("phonePlaceholder")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a62a26] transition-colors bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Phone Confirm Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t("phoneConfirmLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="phoneConfirm"
                  value={form.phoneConfirm}
                  onChange={handleChange}
                  placeholder={t("phoneConfirmPlaceholder")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a62a26] transition-colors bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t("addressLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t("addressPlaceholder")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a62a26] transition-colors bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t("noteLabel")} <span className="text-gray-400">{language === "vi" ? "(tùy chọn)" : "(선택사항)"}</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t("notePlaceholder")}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#a62a26] transition-colors bg-gray-50 hover:bg-white resize-none"
                />
              </div>
              {/* Warning Banner */}
            <div className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <p className="text-sm text-amber-800 font-medium">
                ⏰ {language === "vi"
                  ? "Nếu chúng tôi không liên hệ lại sau 8 tiếng, vui lòng liên hệ chúng tôi qua"
                  : "8시간 내에 연락이 없으면 저희에게 전화해주세요"} {" "}
                <span className="font-bold text-amber-900">0869010169</span>
              </p>
            </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#a62a26] hover:bg-[#8a2220] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex justify-center items-center gap-2 mt-8 shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {loading ? <Spinner className="mr-2" /> : null}
                {loading ? t("submitting") : t("submitButton")}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-6">
                {t("privacyNotice")}
              </p>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="font-semibold text-gray-900 mb-1">{t("nationalDelivery")}</h3>
            <p className="text-sm text-gray-600">{language === "vi" ? "Miễn phí vận chuyển" : "무료 배송"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-900 mb-1">{t("flexiblePayment")}</h3>
            <p className="text-sm text-gray-600">{language === "vi" ? "Thanh toán khi nhận hàng" : "배송 단지에서도 결제"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="text-3xl mb-3">☎️</div>
            <h3 className="font-semibold text-gray-900 mb-1">{t("support24h")}</h3>
            <p className="text-sm text-gray-600">0869010169</p>
          </div>
        </div>
      </div>
    </div>
  );
}
            <p className="text-sm text-gray-600">0869010169</p>
          </div>
        </div>
      </div>
    </div>
  );
}
