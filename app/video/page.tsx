"use client";

import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import VideoSection from "@/components/VideoSection";

export default function VideoPage() {
  const { candidate, t } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#0d3063] pt-16 pb-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <Video className="w-4 h-4" />
            {t("video.title")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black mb-3"
          >
            {t("video.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            {t("video.subtitle")}
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8"
        >
          <VideoSection />
        </motion.div>

        {/* Candidate info below video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              เกี่ยวกับผู้สมัคร
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {candidate.bio}
            </p>
          </div>
          <div className="bg-[#0d3063] rounded-2xl p-6 text-white">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
              ผู้สมัครหมายเลข
            </div>
            <div className="text-7xl font-black leading-none mb-4">
              {candidate.number}
            </div>
            <p className="text-white/70 italic text-sm">
              &ldquo;{candidate.slogan}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
