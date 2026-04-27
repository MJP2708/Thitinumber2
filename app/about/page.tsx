"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronRight, GraduationCap, Heart, MessageCircle, Star, Target } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";

function CandidatePhoto() {
  const { candidate } = useApp();
  const image = candidate.aboutImage || candidate.heroImage;

  return (
    <div className="relative w-full max-w-[300px] mx-auto sm:max-w-[340px]">
      {/*
        The blur-2xl glow that was here caused black GPU artifacts on mobile.
        When a blur filter inside an overflow-hidden ancestor creates a compositing
        layer at a clip boundary, Chrome/Safari mobile renders a black rectangle.
        Removed and replaced with a simple box-shadow on the card instead.
      */}
      <div className="overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl shadow-black/30">
        <div className="relative aspect-[4/5] bg-[#0d3063]">
          {image ? (
            <img
              src={image}
              alt={candidate.name}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0d3063] to-[#164b91] px-8 text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-xl sm:h-28 sm:w-28">
                <span className="text-5xl font-black leading-none text-white sm:text-6xl">ฐ</span>
              </div>
              <p className="text-sm font-medium leading-7 text-white/70">
                เพิ่มรูปผู้สมัครได้จากหน้าแอดมิน
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-[64px_1fr] items-center gap-3 bg-white p-4 dark:bg-slate-900 sm:grid-cols-[72px_1fr] sm:gap-4 sm:p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#a32f2c] text-3xl font-black leading-none text-white shadow-lg sm:h-16 sm:w-16 sm:text-4xl">
            {candidate.number}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-black leading-6 text-slate-950 dark:text-white sm:text-lg sm:leading-7">
              {candidate.name}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{candidate.grade} · ผู้สมัครหมายเลข {candidate.number}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { candidate, labels } = useApp();

  const infoCards = [
    { icon: Target, label: labels.about.mission, content: candidate.mission },
    { icon: Star, label: labels.about.vision, content: candidate.vision },
    { icon: BookOpen, label: labels.about.ideology, content: candidate.ideology },
    { icon: Heart, label: labels.about.reason, content: candidate.reasonForRunning },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="relative overflow-hidden bg-[#0d3063]">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Small decorative blob — no blur, just a radial gradient */}
        <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#a32f2c]/20 sm:h-72 sm:w-72" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-12 lg:grid-cols-[1fr_360px] lg:gap-10 lg:pb-14 lg:pt-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
              {labels.about.subtitle}
            </div>
            <h1 className="text-[clamp(2rem,10vw,3.75rem)] font-black leading-[1.15] text-white">
              {candidate.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/75 sm:text-lg sm:leading-9">
              &ldquo;{candidate.slogan}&rdquo;
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                {candidate.grade}
              </span>
              <span className="rounded-full bg-[#a32f2c] px-4 py-2 text-sm font-semibold text-white">
                หมายเลข {candidate.number}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}>
            <CandidatePhoto />
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Bio card — removed the absolute Quote icon that caused dark-mode rendering bugs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="mb-2 text-lg font-black text-slate-950 dark:text-white">เกี่ยวกับธิติ</h2>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{candidate.bio}</p>
        </motion.section>

        <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {infoCards.map(({ icon: Icon, label, content }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.06 }}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0d3063]">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-950 dark:text-white">{label}</h3>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{content}</p>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl bg-[#0d3063] p-4 text-white"
        >
          <h3 className="mb-2 text-base font-black">ทำไมถึงอยากเป็นตัวแทนนักเรียน</h3>
          <p className="max-w-3xl text-sm leading-8 text-white/75 sm:text-base">
            ผมเชื่อว่าสภานักเรียนไม่ควรเป็นแค่คนจัดงาน แต่ควรเป็นคนที่ช่วยฟังและส่งต่อปัญหาของเพื่อน ๆ ให้ถึงคนที่แก้ได้จริง
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="h-7 w-7 flex-shrink-0 text-[#a32f2c]" />
            <div>
              <p className="font-bold text-slate-950 dark:text-white">มีเรื่องอยากให้ช่วยดูไหม?</p>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">ส่งความคิดเห็นมาได้เลย ผมอยากฟังจริง ๆ</p>
            </div>
          </div>
          <Link
            href="/feedback"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-6 py-3 font-bold text-white transition-colors hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto"
          >
            เสนอความคิดเห็น <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </main>
    </div>
  );
}
