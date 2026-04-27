"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const INSTAGRAM_URL = "https://www.instagram.com/";

function InstagramMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const { candidate, labels, showToast } = useApp();

  const shareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard
      .writeText(window.location.origin)
      .then(() => showToast(labels.common.shareCopied, "success"))
      .catch(() => showToast("คัดลอกลิงก์ไม่สำเร็จ", "error"));
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_1fr_1.1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a32f2c] text-xl font-black text-white">
                {candidate.number}
              </div>
              <div>
                <div className="text-base font-black text-slate-900 dark:text-white">{candidate.name}</div>
                <div className="text-xs font-semibold text-[#a32f2c] dark:text-white/70">
                  {labels.common.candidate} {candidate.number}
                </div>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              &ldquo;{candidate.slogan}&rdquo;
            </p>
          </div>

          <nav aria-label="เมนูท้ายเว็บ">
            <h4 className="mb-3 text-sm font-black text-slate-900 dark:text-white">เมนูหลัก</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/", label: labels.nav.home },
                { href: "/policies", label: labels.nav.policies },
                { href: "/about", label: labels.nav.about },
                { href: "/video", label: labels.nav.video },
                { href: "/faq", label: labels.nav.faq },
                { href: "/feedback", label: labels.nav.feedback },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="min-h-10 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-[#0d3063]/5 hover:text-[#0d3063] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a32f2c] text-white">
                <InstagramMark className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-950 dark:text-white">ติดตามเพิ่มเติม</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">อัปเดตแคมเปญบน Instagram</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#8f2926] active:scale-[0.98]"
              >
                <InstagramMark className="h-4 w-4" />
                Instagram
              </a>
              <button
                onClick={shareLink}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#0d3063]/15 bg-white px-4 py-3 text-sm font-bold text-[#0d3063] transition hover:bg-[#0d3063]/5 active:scale-[0.98] dark:border-white/10"
              >
                <Share2 className="h-4 w-4" />
                แชร์เว็บ
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-5 text-center dark:border-slate-800 sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2026 {candidate.name} - เว็บไซต์หาเสียงสภานักเรียน
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            เว็บไซต์นี้จัดทำโดย Matthew John Prueksakij ม.5/9
          </p>
        </div>
      </div>
    </footer>
  );
}
