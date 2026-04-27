"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function Footer() {
  const { candidate, t, showToast } = useApp();

  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(window.location.origin)
        .then(() => showToast(t("common.share.copied"), "success"))
        .catch(() => showToast("คัดลอกลิงก์ไม่สำเร็จ", "error"));
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a32f2c] text-lg font-black text-white">
                {candidate.number}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{candidate.name}</div>
                <div className="text-xs text-[#a32f2c] dark:text-white/70">
                  {t("common.candidate")} {candidate.number}
                </div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">“{candidate.slogan}”</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">เมนูหลัก</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/policies", label: t("nav.policies") },
                { href: "/about", label: t("nav.about") },
                { href: "/video", label: t("nav.video") },
                { href: "/faq", label: t("nav.faq") },
                { href: "/feedback", label: t("nav.feedback") },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="w-fit text-sm text-slate-500 transition-colors hover:text-[#0d3063] dark:text-slate-400 dark:hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">ช่วยแชร์เว็บหาเสียง</h4>
            <p className="mb-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              ถ้าเห็นด้วยกับแนวคิดนี้ ฝากแชร์ให้เพื่อน ๆ ได้รู้จักหมายเลข 2 ด้วยนะ
            </p>
            <button onClick={shareLink} className="flex items-center gap-2 rounded-lg bg-[#a32f2c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8f2926]">
              <Share2 className="h-4 w-4" />
              {t("common.share")}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2026 {candidate.name} - เว็บไซต์หาเสียงสภานักเรียน
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600">ทำด้วยความตั้งใจเพื่อโรงเรียนของเรา</p>
        </div>
      </div>
    </footer>
  );
}
