"use client";

import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function Footer() {
  const { candidate, t, showToast } = useApp();

  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(window.location.origin)
        .then(() => showToast(t("common.share.copied"), "success"))
        .catch(() => showToast("Could not copy link", "error"));
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#a32f2c] flex items-center justify-center text-white font-black text-lg">
                {candidate.number}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {candidate.name}
                </div>
                <div className="text-xs text-[#a32f2c] dark:text-white/70">
                  {t("common.candidate")} {candidate.number}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              &ldquo;{candidate.slogan}&rdquo;
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/policies", label: t("nav.policies") },
                { href: "/about", label: t("nav.about") },
                { href: "/video", label: t("nav.video") },
                { href: "/faq", label: "FAQ" },
                { href: "/feedback", label: t("nav.feedback") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#0d3063] dark:hover:text-white transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Support the Campaign
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Share this website and help spread the word. Every vote counts!
            </p>
            <button
              onClick={shareLink}
              className="flex items-center gap-2 px-4 py-2 bg-[#a32f2c] hover:bg-[#8f2926] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t("common.share")}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2026 {candidate.name} — Student Council Campaign
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 inline" /> for
            our school
          </p>
        </div>
      </div>
    </footer>
  );
}
