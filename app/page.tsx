"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  FileText,
  Heart,
  MessageCircle,
  Play,
  Share2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import CountdownTimer from "@/components/CountdownTimer";
import FAQ from "@/components/FAQ";
import PolicyCard from "@/components/PolicyCard";
import { VideoPreviewCard } from "@/components/VideoSection";

function ScrollSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-64px" });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CandidatePortrait() {
  const { candidate } = useApp();

  return (
    <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[320px] lg:max-w-none">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl">
        <div className="aspect-[4/5] max-h-[360px] lg:max-h-none">
          {candidate.heroImage ? (
            <img
              src={candidate.heroImage}
              alt={candidate.name}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#123f7d] to-[#a32f2c] px-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 shadow-lg sm:h-32 sm:w-32">
                <span className="text-5xl font-black text-white/75 sm:text-6xl">
                  {candidate.name.charAt(0)}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/70">
                เพิ่มรูปผู้สมัครได้จากหน้าแอดมิน
              </p>
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
          <div className="text-sm font-bold text-white">{candidate.grade}</div>
          <div className="line-clamp-1 text-xs italic text-white/60">&ldquo;{candidate.slogan}&rdquo;</div>
        </div>
      </div>

      <div className="absolute -right-2 -top-3 rounded-2xl border border-white/20 bg-[#a32f2c] px-3 py-2 text-white shadow-lg shadow-[#a32f2c]/25 sm:-right-4 sm:-top-4">
        <div className="text-[10px] font-black tracking-widest text-white/75">เลือก</div>
        <div className="text-4xl font-black leading-none">{candidate.number}</div>
      </div>
    </div>
  );
}

function HeroCard({
  icon: Icon,
  label,
  children,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        accent
          ? "border-[#a32f2c]/60 bg-[#a32f2c] text-white"
          : "border-white/15 bg-white/10 text-white"
      }`}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white/70">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-lg font-black leading-snug">{children}</div>
    </div>
  );
}

export default function Home() {
  const { candidate, policies, feedbackList, labels, showToast } = useApp();
  const router = useRouter();
  const topPolicies = policies.slice(0, 3);
  const topFeedback = [...feedbackList].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];

  const shareLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard
      .writeText(window.location.origin)
      .then(() => showToast(labels.common.shareCopied, "success"))
      .catch(() => showToast("คัดลอกลิงก์ไม่สำเร็จ", "error"));
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950">
      <section className="relative overflow-hidden bg-[#0d3063] px-4 py-6 text-white sm:px-6 sm:py-8 lg:py-10">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden">
          <span className="text-[28rem] font-black leading-none text-white/[0.05] lg:text-[36rem]">2</span>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-5 xl:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="order-1 lg:order-2 lg:col-span-4"
          >
            <CandidatePortrait />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="order-2 text-center lg:order-1 lg:col-span-5 lg:text-left"
          >
            <div className="mb-4 flex flex-col items-center gap-2 lg:items-start">
              <div className="inline-flex items-baseline gap-2 rounded-full bg-[#a32f2c] px-5 py-2.5 font-black text-white shadow-lg shadow-[#a32f2c]/25">
                <span className="text-sm">เลือกเบอร์</span>
                <span className="text-3xl leading-none">2</span>
              </div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
                เลือกตั้งสภานักเรียน 2569
              </div>
            </div>

            <h1 className="mb-4 font-black leading-[1.1] text-[clamp(2.5rem,11vw,5.5rem)]">
              {candidate.name}
            </h1>

            <div className="mb-5">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-[#a32f2c] to-transparent" />
                <Sparkles className="h-4 w-4 text-amber-300" />
                <div className="h-px flex-1 bg-gradient-to-l from-[#a32f2c] to-transparent" />
              </div>
              <p className="text-base font-medium italic leading-8 text-white/75 sm:text-lg lg:text-2xl">
                &ldquo;{candidate.slogan}&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Link
                href="/policies"
                className="group flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#a32f2c] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#a32f2c]/25 transition hover:bg-[#8f2926] active:scale-[0.98]"
              >
                {labels.home.policiesCta}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/video"
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/15 active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-white" />
                {labels.home.videoWatch}
              </Link>
              <button
                onClick={shareLink}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
              >
                <Share2 className="h-4 w-4" />
                {labels.common.share}
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="order-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1"
          >
            <HeroCard icon={CalendarDays} label="วันเลือกตั้ง">29 พ.ค. 2569</HeroCard>
            <HeroCard icon={FileText} label="นโยบาย">{policies.length} เรื่องที่อยากทำจริง</HeroCard>
            <HeroCard icon={MessageCircle} label="เสียงจากเพื่อน ๆ">
              {topFeedback ? (
                <span className="line-clamp-2 text-base leading-7">{topFeedback.message}</span>
              ) : (
                <span className="text-base leading-7">ยังไม่มีข้อเสนอ ลองเป็นคนแรกได้เลย</span>
              )}
            </HeroCard>
            <HeroCard icon={Heart} label="จำไว้ในวันเลือกตั้ง" accent>
              เลือกหมายเลข {candidate.number}
            </HeroCard>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="relative mx-auto mt-8 max-w-4xl border-t border-white/10 pt-8"
        >
          <CountdownTimer inverted />
        </motion.div>
      </section>

      <section className="bg-white px-4 py-5 dark:bg-slate-900 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: `เบอร์ ${candidate.number}`, label: "ผู้สมัคร" },
            { value: policies.length, label: "นโยบาย" },
            { value: feedbackList.length, label: "ความคิดเห็น" },
            { value: candidate.grade, label: "ระดับชั้น" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="truncate text-xl font-black text-[#0d3063] dark:text-white">{value}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <ScrollSection className="bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#a32f2c] px-4 py-1.5 text-xs font-bold text-white">
              เบอร์ 2 เสนอ
            </div>
            <h2 className="text-[clamp(1.75rem,8vw,2.5rem)] font-black text-slate-900 dark:text-white">
              {labels.home.policyTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {topPolicies.map((policy, i) => (
              <PolicyCard key={policy.id} policy={policy} index={i} />
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link
              href="/policies"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-8 py-3 font-bold text-white shadow-lg shadow-[#a32f2c]/20 transition hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto"
            >
              {labels.home.viewAllPolicies}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection className="bg-white px-4 py-8 dark:bg-slate-900 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-2 text-[clamp(1.5rem,7vw,2rem)] font-black text-slate-900 dark:text-white">
            {labels.home.videoTitle}
          </h2>
          <p className="mb-5 text-sm text-slate-400">{labels.home.videoWatch}</p>
          <VideoPreviewCard onClick={() => router.push("/video")} />
          <Link href="/video" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0d3063] hover:underline dark:text-white">
            ดูวิดีโอเต็ม <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollSection>

      <section className="bg-[#0d3063] px-4 py-8 text-white sm:px-6 sm:py-10">
        <ScrollSection className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-white/60">
            โรงเรียนที่อยากเห็น
          </div>
          <blockquote className="mb-4 text-[clamp(1.5rem,7vw,2.25rem)] font-black leading-snug">
            &ldquo;{candidate.vision}&rdquo;
          </blockquote>
          <div className="mb-5 text-sm font-medium text-white/70">
            {candidate.name}, ผู้สมัครหมายเลข {candidate.number}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/about"
              className="flex min-h-[52px] items-center justify-center rounded-2xl bg-[#a32f2c] px-7 py-3.5 font-bold text-white transition hover:bg-[#8f2926] active:scale-[0.98]"
            >
              {labels.home.aboutCta}
            </Link>
            <Link
              href="/feedback"
              className="flex min-h-[52px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/15 active:scale-[0.98]"
            >
              {labels.home.feedbackCta}
            </Link>
          </div>
        </ScrollSection>
      </section>

      <div className="bg-slate-50 dark:bg-slate-950">
        <FAQ />
      </div>
    </div>
  );
}
