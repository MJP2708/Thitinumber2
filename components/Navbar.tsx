"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, FileText, User, Video, MessageCircle,
  HelpCircle, Menu, X, Sun, Moon,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function Navbar() {
  const { candidate, theme, toggleTheme, labels } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: labels.nav.home, icon: Home },
    { href: "/policies", label: labels.nav.policies, icon: FileText },
    { href: "/about", label: labels.nav.about, icon: User },
    { href: "/video", label: labels.nav.video, icon: Video },
    { href: "/faq", label: labels.nav.faq, icon: HelpCircle },
    { href: "/feedback", label: labels.nav.feedback, icon: MessageCircle },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (pathname.startsWith("/admin")) return null;

  const solidBg = scrolled || mobileOpen;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-150 ${
        solidBg
          ? "bg-white dark:bg-[#0d3063] shadow-md border-b border-slate-200/60 dark:border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#a32f2c] flex items-center justify-center text-white font-black text-lg shadow-lg">
            {candidate.number}
          </div>
          <div className="hidden lg:block">
            <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
              {candidate.name.split(" ")[0]}
            </div>
            <div className="text-xs text-[#a32f2c] dark:text-white/70 font-medium">
              {labels.common.candidate} {candidate.number}
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150 whitespace-nowrap ${
                isActive(href)
                  ? "bg-[#0d3063] text-white shadow-md shadow-[#0d3063]/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-[#0d3063] dark:hover:text-white hover:bg-[#0d3063]/10 dark:hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="สลับโหมดสี"
            className="min-h-12 min-w-12 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={mobileOpen}
            className="lg:hidden min-h-12 min-w-12 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/*
        Mobile menu — pure CSS transition, NO Framer Motion.
        height:auto animation in Framer Motion forces JS layout recalc every frame
        and is the main cause of mobile menu lag. CSS max-height transition is
        GPU-friendly and runs off the main thread.
      */}
      <div
        aria-hidden={!mobileOpen}
        className={`lg:hidden overflow-hidden bg-white dark:bg-[#0d3063] border-b border-slate-200 dark:border-white/5 transition-all duration-200 ease-out ${
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex min-h-[52px] items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-100 ${
                isActive(href)
                  ? "bg-[#0d3063] text-white dark:bg-white/10"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 active:bg-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
