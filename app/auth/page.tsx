"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useConvexReady, useConvexProbing } from "@/app/ConvexClientProvider";
import { useRouter } from "next/navigation";


/* ── Real Auth Form ── */
function RealAuthForm() {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "", fullName: "", phone: "",
  });
  const { language, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!isLogin && !formData.fullName) {
        setError("Please enter your full name");
        setLoading(false);
        return;
      }

      // Create FormData for submission
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("flow", isLogin ? "signin" : "signup");
      if (!isLogin) {
        formDataToSend.append("name", formData.fullName);
      }
      formDataToSend.append("redirect_uri", "/dashboard");

      // Submit to our Next.js API endpoint
      const response = await fetch("/api/auth", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Success! Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        setError(result.error || "Authentication failed");
        setLoading(false);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Connection error";
      console.error("Auth error:", err);
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      loading={loading}
      error={error}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
    />
  );
}

/* ── Shared visual form shell ── */
interface AuthFormShellProps {
  isLogin: boolean;
  setIsLogin: (v: boolean) => void;
  loading: boolean;
  error: string | null;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  formData: { email: string; password: string; confirmPassword: string; fullName: string; phone: string };
  setFormData: (v: { email: string; password: string; confirmPassword: string; fullName: string; phone: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  banner?: React.ReactNode;
}

function AuthFormShell({
  isLogin, setIsLogin, loading, error,
  showPassword, setShowPassword,
  showConfirmPassword, setShowConfirmPassword,
  formData, setFormData, onSubmit, banner,
}: AuthFormShellProps) {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={cn(
            "flex-1 py-4 font-bold text-sm transition-all relative",
            isLogin ? "text-[#a62a26] bg-white" : "text-slate-400 hover:text-slate-600"
          )}
        >
          {t("login")}
          {isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a62a26]" />}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={cn(
            "flex-1 py-4 font-bold text-sm transition-all relative",
            !isLogin ? "text-[#a62a26] bg-white" : "text-slate-400 hover:text-slate-600"
          )}
        >
          {t("register")}
          {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a62a26]" />}
        </button>
      </div>

      {banner}

      <div className="p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold ml-1">{t("fullName")}</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50" />
                <Input
                  type="text"
                  placeholder={language === "vi" ? "Nguyen Van A" : "John Doe"}
                  className="pl-12 py-6 rounded-xl border-slate-200 focus:ring-[#a62a26]/20 focus:border-[#a62a26]"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-bold ml-1">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50" />
              <Input
                type="email"
                placeholder="student@hdp.edu.vn"
                className="pl-12 py-6 rounded-xl border-slate-200 focus:ring-[#a62a26]/20 focus:border-[#a62a26]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold ml-1">{t("phoneNumber")}</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50" />
                <Input
                  type="tel"
                  placeholder="090..."
                  className="pl-12 py-6 rounded-xl border-slate-200"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-bold ml-1">{t("password")}</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50" />
              <Input
                type={showPassword ? "text" : "password"}
                className="pl-12 pr-12 py-6 rounded-xl border-slate-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold ml-1">{t("confirmPassword")}</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-12 pr-12 py-6 rounded-xl border-slate-200"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <Link href="#" className="text-xs font-bold text-[#a62a26] hover:underline">{t("forgotPassword")}</Link>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button
            disabled={loading}
            className="w-full py-7 bg-[#a62a26] hover:bg-[#8a2420] text-white rounded-xl shadow-lg shadow-red-200 transition-all font-bold text-lg"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : (isLogin ? t("login") : t("register"))}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isLogin ? t("noAccount") : t("haveAccount")}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#a62a26] font-black hover:underline ml-1"
            >
              {isLogin ? t("signUpNow") : t("signInNow")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function AuthPage() {
  const convexReady = useConvexReady();
  const isProbing = useConvexProbing();
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Detect if running on localhost
  useEffect(() => {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setIsLocalhost(isLocal);
  }, []);

  // In development (localhost), skip the backend check - always show the real form
  const shouldShowFallback = isLocalhost ? false : (!convexReady || isProbing);

  // Only show fallback if backend is not ready and not on localhost
  if (shouldShowFallback) {
    return (
      <div
        className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center px-4 py-12 pt-24"
        style={{ backgroundImage: "url(/bg-course.png)", backgroundColor: "#f8fafc" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -ml-48 -mb-48" />

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
              <Image
                src="/hdp-logo.png"
                alt="HDP Edu"
                width={150}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-black text-[#a62a26] text-center tracking-tight">
              HDP EDU
            </h1>
          </div>

          <RealAuthForm />

          <p className="mt-8 text-center text-slate-400 text-xs font-medium">
            &copy; 2026 HDP EDU. Secure Student Portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat flex items-center justify-center px-4 py-12 pt-24"
      style={{ backgroundImage: "url(/bg-course.png)", backgroundColor: "#f8fafc" }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -ml-48 -mb-48" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
            <Image
              src="/hdp-logo.png"
              alt="HDP Edu"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-black text-[#a62a26] text-center tracking-tight">
            HDP EDU
          </h1>
        </div>

        <RealAuthForm />

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          &copy; 2026 HDP EDU. Secure Student Portal.
        </p>
      </div>
    </div>
  );
}