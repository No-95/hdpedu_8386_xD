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
import { useUser } from "@/lib/user-context";
import { useAuthActions } from "@convex-dev/auth/react";

function extractAuthErrorDetails(err: unknown) {
  if (!(err instanceof Error)) {
    return { raw: err };
  }

  const candidate = err as Error & {
    code?: string;
    status?: number;
    data?: unknown;
    cause?: unknown;
  };

  return {
    name: candidate.name,
    message: candidate.message,
    code: candidate.code,
    status: candidate.status,
    data: candidate.data,
    cause: candidate.cause,
    stack: candidate.stack,
  };
}


/* ── Real Auth Form ── */
function RealAuthForm() {
  const router = useRouter();
  const { refreshAuth } = useUser();
  const convexReady = useConvexReady();
  const { signIn } = useAuthActions();
  
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

    const attemptedFlow = isLogin ? "signIn" : "signUp";
    const attemptedEmail = formData.email.trim().toLowerCase();

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

      if (!convexReady) {
        setError("Authentication service is not ready. Please set NEXT_PUBLIC_CONVEX_URL and CONVEX_SITE_URL.");
        setLoading(false);
        return;
      }

      const result = await signIn("password", {
        flow: attemptedFlow,
        email: attemptedEmail,
        password: formData.password,
        ...(isLogin ? {} : { name: formData.fullName.trim() }),
      });

      if (!result.signingIn) {
        setError("Authentication failed");
        setLoading(false);
        return;
      }

      document.cookie = `auth_session=${encodeURIComponent(attemptedEmail)}; max-age=${60 * 60 * 24 * 7}; path=/; samesite=lax`;

      // Keep client auth state in sync immediately, then navigate.
      refreshAuth();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-state-changed"));
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      const details = extractAuthErrorDetails(err);
      const errorMsg =
        details && typeof details === "object" && "message" in details && typeof details.message === "string"
          ? details.message
          : "Authentication request failed";

      console.error("[Auth signIn/signUp failed]", {
        flow: attemptedFlow,
        email: attemptedEmail,
        details,
      });

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
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:bg-[#0d1a33]/95 dark:border-[#2a3f66]">
      <div className="flex border-b border-slate-100 bg-slate-50/50 dark:border-[#2a3f66] dark:bg-[#091429]/90">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={cn(
            "flex-1 py-4 font-bold text-sm transition-all relative",
            isLogin
              ? "text-[#a62a26] bg-white dark:bg-[#10264a] dark:text-white"
              : "text-slate-400 hover:text-slate-600 dark:text-white/60 dark:hover:text-white"
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
            !isLogin
              ? "text-[#a62a26] bg-white dark:bg-[#10264a] dark:text-white"
              : "text-slate-400 hover:text-slate-600 dark:text-white/60 dark:hover:text-white"
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
              <Label className="text-slate-700 font-bold ml-1 dark:text-white">{t("fullName")}</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50 dark:text-white/60" />
                <Input
                  type="text"
                  placeholder={language === "vi" ? "Nguyen Van A" : "John Doe"}
                  className="pl-12 py-6 rounded-xl border-slate-200 focus:ring-[#a62a26]/20 focus:border-[#a62a26] dark:bg-[#122846] dark:border-[#2b4671] dark:text-white dark:placeholder:text-white/60"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-bold ml-1 dark:text-white">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50 dark:text-white/60" />
              <Input
                type="email"
                placeholder="student@hdp.edu.vn"
                className="pl-12 py-6 rounded-xl border-slate-200 focus:ring-[#a62a26]/20 focus:border-[#a62a26] dark:bg-[#122846] dark:border-[#2b4671] dark:text-white dark:placeholder:text-white/60"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold ml-1 dark:text-white">{t("phoneNumber")}</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50 dark:text-white/60" />
                <Input
                  type="tel"
                  placeholder="090..."
                  className="pl-12 py-6 rounded-xl border-slate-200 dark:bg-[#122846] dark:border-[#2b4671] dark:text-white dark:placeholder:text-white/60"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-bold ml-1 dark:text-white">{t("password")}</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50 dark:text-white/60" />
              <Input
                type={showPassword ? "text" : "password"}
                className="pl-12 pr-12 py-6 rounded-xl border-slate-200 dark:bg-[#122846] dark:border-[#2b4671] dark:text-white dark:placeholder:text-white/60"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/70">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold ml-1 dark:text-white">{t("confirmPassword")}</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a62a26]/50 dark:text-white/60" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-12 pr-12 py-6 rounded-xl border-slate-200 dark:bg-[#122846] dark:border-[#2b4671] dark:text-white dark:placeholder:text-white/60"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/70">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <Link href="#" className="text-xs font-bold text-[#a62a26] hover:underline dark:text-[#ff8f89]">{t("forgotPassword")}</Link>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm dark:bg-red-950/40 dark:border-red-700 dark:text-red-200">
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
          <p className="text-sm text-slate-500 font-medium dark:text-white/70">
            {isLogin ? t("noAccount") : t("haveAccount")}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#a62a26] font-black hover:underline ml-1 dark:text-[#ff8f89]"
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12 pt-24">
        <div
          className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat dark:hidden"
          style={{ backgroundImage: "url(/bg-course.png)" }}
        />
        <div
          className="fixed inset-0 -z-10 hidden bg-cover bg-fixed bg-center bg-no-repeat dark:block"
          style={{ backgroundImage: "url(/dark-mode.png)" }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -ml-48 -mb-48 dark:bg-[#5b7ac4]/10" />

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform dark:bg-[#10264a]/95 dark:border dark:border-[#2a3f66]">
              <Image
                src="/hdp-logo.png"
                alt="HDP Edu"
                width={150}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </div>
            <h1 className="text-3xl font-black text-[#a62a26] dark:text-white text-center tracking-tight">
              HDP EDU
            </h1>
          </div>

          <RealAuthForm />

          <p className="mt-8 text-center text-slate-400 text-xs font-medium dark:text-white/70">
            &copy; 2026 HDP EDU. Secure Student Portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12 pt-24">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat dark:hidden"
        style={{ backgroundImage: "url(/bg-course.png)" }}
      />
      <div
        className="fixed inset-0 -z-10 hidden bg-cover bg-fixed bg-center bg-no-repeat dark:block"
        style={{ backgroundImage: "url(/dark-mode.png)" }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#a62a26]/5 rounded-full -ml-48 -mb-48 dark:bg-[#5b7ac4]/10" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-transform dark:bg-[#10264a]/95 dark:border dark:border-[#2a3f66]">
            <Image
              src="/hdp-logo.png"
              alt="HDP Edu"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-black text-[#a62a26] dark:text-white text-center tracking-tight">
            HDP EDU
          </h1>
        </div>

        <RealAuthForm />

        <p className="mt-8 text-center text-slate-400 text-xs font-medium dark:text-white/70">
          &copy; 2026 HDP EDU. Secure Student Portal.
        </p>
      </div>
    </div>
  );
}