"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Heart,
  MessageCircle,
  Star,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";

function CandidateCard() {
  const { candidate } = useApp();
  const image = candidate.aboutImage || candidate.heroImage;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[4/5] max-h-[460px] bg-[#0d3063]">
        {image ? (
          <img
            src={image}
            alt={candidate.name}
            className="h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0d3063] to-[#a32f2c] px-8 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg">
              <span className="text-6xl font-black leading-none text-white">ธ</span>
            </div>
            <p className="mt-5 text-sm font-medium leading-7 text-white/75">
              เพิ่มรูปผู้สมัครได้จากหน้าแอดมิน
            </p>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-2xl bg-[#a32f2c] px-4 py-3 text-white shadow-lg">
          <div className="text-xs font-bold text-white/70">หมายเลข</div>
          <div className="text-5xl font-black leading-none">{candidate.number}</div>
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-black leading-tight text-slate-950 dark:text-white">{candidate.name}</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0d3063]/10 px-3 py-1.5 font-semibold text-[#0d3063] dark:bg-white/10 dark:text-white">
            <GraduationCap className="h-4 w-4" />
            {candidate.grade}
          </span>
          <span className="rounded-full bg-[#a32f2c]/10 px-3 py-1.5 font-semibold text-[#a32f2c] dark:bg-[#a32f2c]/20 dark:text-white">
            ผู้สมัครหมายเลข {candidate.number}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{candidate.bio}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0d3063] text-white">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  );
}

export default function AboutPage() {
  const { candidate, policies, feedbackList, labels } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="bg-[#0d3063] px-4 py-6 text-white sm:px-6 sm:py-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <motion.div {...motionProps}>
            <div className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
              {labels.about.subtitle}
            </div>
            <h1 className="text-[clamp(2rem,10vw,4rem)] font-black leading-tight">{candidate.name}</h1>
            <p className="mt-3 max-w-3xl text-base font-medium leading-8 text-white/75 sm:text-lg">
              &ldquo;{candidate.slogan}&rdquo;
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <CalendarDays className="mb-2 h-5 w-5 text-white/70" />
              <div className="text-sm font-semibold text-white/60">วันเลือกตั้ง</div>
              <div className="text-lg font-black">29 พ.ค. 2569</div>
            </div>
            <div className="rounded-2xl bg-[#a32f2c] p-4">
              <FileText className="mb-2 h-5 w-5 text-white/80" />
              <div className="text-sm font-semibold text-white/70">นโยบาย</div>
              <div className="text-lg font-black">{policies.length} เรื่อง</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <MessageCircle className="mb-2 h-5 w-5 text-white/70" />
              <div className="text-sm font-semibold text-white/60">ข้อเสนอ</div>
              <div className="text-lg font-black">{feedbackList.length} รายการ</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <Heart className="mb-2 h-5 w-5 text-white/70" />
              <div className="text-sm font-semibold text-white/60">จำเบอร์</div>
              <div className="text-lg font-black">เบอร์ {candidate.number}</div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <motion.div {...motionProps}>
          <CandidateCard />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard icon={Heart} title={labels.about.reason}>
            {candidate.reasonForRunning}
          </InfoCard>
          <InfoCard icon={Target} title={labels.about.mission}>
            {candidate.mission}
          </InfoCard>
          <InfoCard icon={Star} title={labels.about.vision}>
            {candidate.vision}
          </InfoCard>
          <InfoCard icon={BookOpen} title={labels.about.ideology}>
            {candidate.ideology}
          </InfoCard>

          <section className="rounded-2xl bg-[#0d3063] p-5 text-white md:col-span-2">
            <h3 className="mb-2 text-xl font-black">อยากเป็นตัวแทนที่เพื่อน ๆ คุยด้วยง่าย</h3>
            <p className="max-w-4xl text-sm leading-8 text-white/75 sm:text-base">
              สภานักเรียนไม่ควรอยู่ไกลจากชีวิตประจำวันของนักเรียน ถ้าเรื่องไหนทำให้เพื่อน ๆ ลำบาก
              ผมอยากช่วยฟัง ช่วยรวบรวม และช่วยพูดต่อให้ชัดขึ้น
            </p>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
            <div>
              <h3 className="font-black text-slate-950 dark:text-white">มีเรื่องอยากเสนอไหม?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                ส่งความคิดเห็นมาได้เลย ผมอยากรู้ว่าเพื่อน ๆ อยากให้โรงเรียนดีขึ้นตรงไหน
              </p>
            </div>
            <Link
              href="/feedback"
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-6 py-3 font-bold text-white transition hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto"
            >
              เสนอความคิดเห็น <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
