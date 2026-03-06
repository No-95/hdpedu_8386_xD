"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, BookOpen, Briefcase, Trophy, Users, FileText, BookMarked, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "courses", href: "/courses", icon: BookOpen },
  { key: "documents", href: "/documents", icon: BookMarked },
  { key: "publication", href: "/publication", icon: BookOpen }, // added book link
  { key: "jobOpportunities", href: "/jobs", icon: Briefcase },
  { key: "about", href: "/about-us", icon: Users },
];

export function NavigationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useUser();
  const pathname = usePathname();

  const languageLabel = language === "vi" ? "VN" : "KO";
  const displayName = user.name || user.email?.split('@')[0] || "";

  return (
    <header 
      className="fixed top-0 left-0 z-50 w-full backdrop-blur-xl border-b transition-all duration-300 bg-[#a62a26] dark:bg-[#000814] border-[#a62a26]/20 dark:border-[#000814]/20"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/hdp-logo.png"
            alt="HDP EDU"
            width={120}
            height={60}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-background/15 text-white shadow-sm" 
                    : "text-white/80 hover:text-white hover:bg-background/8"
                )}
                title={t(item.key)}
              >
                <Icon className="w-4 h-4 text-slate-200" />
                <span className="hidden lg:inline text-slate-100">{t(item.key)}</span>
              </Link>
            );
          })}
          
          <Link
            href="/blog"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === "/blog"
                ? "bg-background/15 text-white shadow-sm"
                : "text-white/80 hover:text-white hover:bg-background/8"
            )}
            title="Blog"
          >
            <FileText className="w-4 h-4 text-slate-100" />
            <span className="hidden lg:inline text-slate-100">Blog</span>
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-background/8 transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            <span>{languageLabel}</span>
          </button>

          <div className="w-px h-6 bg-white/10"></div>

          {isLoading ? (
            <div className="w-24 h-9 bg-white/20 rounded-lg animate-pulse" />
          ) : isAuthenticated ? (
            <Link href="/dashboard">
              <Button 
                className="bg-background/50 text-[#A62A26] hover:bg-background/80 font-semibold px-5 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                {displayName || "Dashboard"}
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button 
                className="bg-white dark:bg-blue-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-blue-700 font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg">
                {t("loginRegister")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg text-white hover:bg-background/10 transition-colors"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-background/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t backdrop-blur-xl bg-[#a62a26] dark:bg-[#000814] border-[#a62a26]/20 dark:border-[#000814]/20"
        >
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-background/15 text-white" 
                        : "text-white/80 hover:text-white hover:bg-background/8"
                    )}
                >
                  <Icon className="w-4 h-4" />
                  {t(item.key)}
                </Link>
              );
            })}
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-background/8 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              Blog
            </Link>
            <div className="pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-background/50 text-[#A62A26] hover:bg-background/80 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {displayName || "Dashboard"}
                  </Button>
                </Link>
              ) : (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-background/50 text-white dark:text-[#000814] hover:bg-background/80 font-semibold rounded-lg transition-all duration-200"
                  >
                    {t("loginRegister")}
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
