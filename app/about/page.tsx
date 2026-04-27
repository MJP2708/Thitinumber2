"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronRight, GraduationCap, Heart, MessageCircle, Quote, Star, Target } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";

function CandidatePhoto() {
  const { candidate } = useApp();
  const image = candidate.aboutImage || candidate.heroImage;

  return (
    <div className="relative w-full max-w-[340px] mx-auto">
      <div className="absolute inset-0 rounded-[2rem] bg-[#a32f2c]/25 blur-2xl translate-y-4" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl dark:bg-slate-900">
        <div className="relative aspect-[4/5] bg-[#0d3063]">
          {image ? (
            <img src={image} alt={candidate.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0d3063] to-[#164b91] px-8 text-center">
              <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-xl">
                <span className="text-6xl font-black leading-none text-white">ฐ</span>
              </div>
              <p className="text-sm font-medium leading-7 text-white/70">
                เพิ่มรูปผู้สมัครได้จากหน้าแอดมิน
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-[72px_1fr] items-center gap-4 bg-white p-5 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#a32f2c] text-4xl font-black leading-none text-white shadow-lg">
            {candidate.number}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black leading-7 text-slate-950 dark:text-white">
              {candidate.name}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <GraduationCap className="h-4 w-4" />
              {candidate.grade} · ผู้สมัครหมายเลข {candidate.number}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { candidate, t } = useApp();

  const infoCards = [
    { icon: Target, label: t("about.mission"), content: candidate.mission },
    { icon: Star, label: t("about.vision"), content: candidate.vision },
    { icon: BookOpen, label: t("about.ideology"), content: candidate.ideology },
    { icon: Heart, label: t("about.reason"), content: candidate.reasonForRunning },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="relative overflow-hidden bg-[#0d3063]">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#a32f2c]/30 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1fr_380px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
              {t("about.subtitle")}
            </div>
            <h1 className="text-5xl font-black leading-[1.15] text-white sm:text-6xl">
              {candidate.name}
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-medium leading-9 text-white/75">
              “{candidate.slogan}”
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                {candidate.grade}
              </span>
              <span className="rounded-full bg-[#a32f2c] px-4 py-2 text-sm font-semibold text-white">
                หมายเลข {candidate.number}
              </span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <CandidatePhoto />
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <Quote className="absolute -left-4 -top-5 h-20 w-20 rotate-180 text-[#0d3063]/10" />
          <div className="relative">
            <h2 className="mb-4 text-2xl font-black text-slate-950 dark:text-white">เกี่ยวกับธิติ</h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{candidate.bio}</p>
          </div>
        </motion.section>

        <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {infoCards.map(({ icon: Icon, label, content }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d3063]">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-950 dark:text-white">{label}</h3>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{content}</p>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl bg-[#0d3063] p-8 text-white"
        >
          <h3 className="mb-4 text-2xl font-black">ทำไมถึงอยากเป็นตัวแทนนักเรียน</h3>
          <p className="max-w-3xl text-base leading-8 text-white/75">
            ผมเชื่อว่าสภานักเรียนไม่ควรเป็นแค่คนจัดงาน แต่ควรเป็นคนที่ช่วยฟังและส่งต่อปัญหาของเพื่อน ๆ ให้ถึงคนที่แก้ได้จริง
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <MessageCircle className="h-8 w-8 text-[#a32f2c]" />
            <div>
              <p className="font-bold text-slate-950 dark:text-white">มีเรื่องอยากให้ช่วยดูไหม?</p>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">ส่งความคิดเห็นมาได้เลย ผมอยากฟังจริง ๆ</p>
            </div>
          </div>
          <Link href="/feedback" className="inline-flex items-center gap-2 rounded-xl bg-[#a32f2c] px-6 py-3 font-bold text-white transition hover:bg-[#8f2926]">
            เสนอความคิดเห็น <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </main>
    </div>
  );
}
