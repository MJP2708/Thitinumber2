"use client";

import { motion } from "framer-motion";
import { Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import VideoSection from "@/components/VideoSection";

export default function VideoPage() {
  const { candidate, labels } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#0d3063] px-4 pb-24 pt-20 sm:px-6 sm:pt-24">
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
            {labels.video.title}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 text-[clamp(2rem,11vw,3.75rem)] font-black leading-[1.25]"
          >
            {labels.video.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base leading-8 text-white/70 sm:text-lg"
          >
            {labels.video.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-5xl px-4 pb-20 sm:-mt-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <VideoSection />
        </motion.div>

        {/* Candidate info below video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              เกี่ยวกับผู้สมัคร
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {candidate.bio}
            </p>
          </div>
          <div className="rounded-2xl bg-[#0d3063] p-5 text-white sm:p-6">
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
