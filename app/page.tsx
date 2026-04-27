"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, ChevronRight, Share2,
  Sparkles, Play,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import PolicyCard from "@/components/PolicyCard";
import CountdownTimer from "@/components/CountdownTimer";
import FAQ from "@/components/FAQ";
import { VideoPreviewCard } from "@/components/VideoSection";
import { useRouter } from "next/navigation";

function ScrollSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CandidatePortrait() {
  const { candidate } = useApp();
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[340px]">
      {/* Glow ring behind photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-[#a32f2c]/30 to-white/10 rounded-3xl blur-2xl scale-105" />

      {/* Photo container */}
      <div className="relative rounded-3xl overflow-hidden aspect-[3/4] border border-white/10 shadow-2xl">
        {candidate.heroImage ? (
          <img
            src={candidate.heroImage}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d3063] via-[#123f7d] to-[#a32f2c] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Watermark number */}
            <span className="absolute text-[190px] font-black leading-none text-white/5 sm:text-[260px]">
              {candidate.number}
            </span>
            {/* Decorative rings */}
            <div className="absolute w-64 h-64 rounded-full border border-white/5" />
            <div className="absolute w-48 h-48 rounded-full border border-white/8" />
            {/* Avatar */}
            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 shadow-xl backdrop-blur-sm sm:h-36 sm:w-36">
              <span className="text-6xl font-black text-white/70 sm:text-7xl">
                {candidate.name.charAt(0)}
              </span>
            </div>
            <div className="relative z-10 mt-5 text-center px-6">
              <div className="font-black text-xl text-white/80 tracking-wide">
                {candidate.name.split(" ")[0].toUpperCase()}
              </div>
              <div className="text-white/40 text-xs mt-2 font-medium">
                เพิ่มรูปได้ในหน้าแอดมิน
              </div>
            </div>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="text-white/90 font-bold text-sm">{candidate.grade}</div>
          <div className="text-white/50 text-xs italic mt-0.5 line-clamp-1">&ldquo;{candidate.slogan}&rdquo;</div>
        </div>
      </div>

      {/* Floating Vote badge */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute -right-2 -top-3 z-20 rounded-2xl border border-white/20 bg-[#a32f2c] px-3 py-2 shadow-2xl shadow-[#a32f2c]/40 sm:-right-5 sm:-top-5 sm:px-4 sm:py-3"
      >
        <div className="text-[10px] font-black uppercase tracking-widest text-white/75">เลือก</div>
        <div className="text-4xl font-black leading-none text-white sm:text-5xl">{candidate.number}</div>
      </motion.div>

      {/* Floating stats badge */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -left-2 z-20 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-xl sm:-bottom-5 sm:-left-5"
      >
        <div className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">นโยบาย</div>
        <div className="text-white font-black text-xl leading-none">5 เรื่อง</div>
        <div className="text-white/40 text-[10px] mt-0.5">ตั้งใจทำจริง</div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { candidate, policies, labels, showToast } = useApp();
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const topPolicies = policies.slice(0, 3);

  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin)
        .then(() => showToast(labels.common.shareCopied, "success"))
        .catch(() => showToast("Could not copy link", "error"));
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-[#0d3063] pt-6 sm:min-h-screen sm:pt-0"
      >
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-white/10 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#a32f2c]/30 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Large watermark number */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span className="text-[40vw] font-black text-white/[0.025] leading-none">
            {candidate.number}
          </span>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: Campaign info */}
            <div>
              {/* Top badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm sm:mb-8"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                เลือกตั้งสภานักเรียน 2569 · ผู้สมัครหมายเลข {candidate.number}
              </motion.div>

              {/* "VOTE FOR" label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/75 sm:tracking-[0.3em]"
              >
                เลือก
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mb-6 font-black leading-[1.08] sm:leading-[1.0]"
              >
                <span className="block text-[clamp(3rem,16vw,6rem)] text-white">
                  {candidate.name.split(" ")[0]}
                </span>
                <span className="mt-1 block text-[clamp(2.25rem,12vw,4.5rem)] text-white">
                  {candidate.name.split(" ").slice(1).join(" ")}
                </span>
              </motion.h1>

              {/* Slogan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#a32f2c] to-transparent" />
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <div className="h-px flex-1 bg-gradient-to-l from-[#a32f2c] to-transparent" />
                </div>
                <p className="text-center text-lg font-medium italic leading-8 text-white/70 sm:text-2xl lg:text-left">
                  &ldquo;{candidate.slogan}&rdquo;
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                <Link
                  href="/policies"
                  className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#a32f2c] px-7 py-3.5 font-bold text-white shadow-xl shadow-[#a32f2c]/30 transition-all hover:scale-[1.02] hover:bg-[#8f2926] hover:shadow-[#a32f2c]/40 active:scale-[0.98] sm:w-auto"
                >
                  {labels.home.policiesCta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/video"
                  className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/14 active:scale-[0.98] sm:w-auto"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {labels.home.videoWatch}
                </Link>
                <button
                  onClick={shareLink}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-medium text-white/70 transition-all hover:bg-white/5 hover:text-white/90 active:scale-[0.98] sm:w-auto"
                >
                  <Share2 className="w-4 h-4" />
                  {labels.common.share}
                </button>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:flex sm:items-center sm:gap-8"
              >
                {[
                  { value: `เบอร์ ${candidate.number}`, label: "ผู้สมัคร" },
                  { value: policies.length, label: "นโยบาย" },
                  { value: candidate.grade, label: "ระดับชั้น" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-white">{value}</div>
                    <div className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Candidate portrait */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex justify-center lg:justify-end"
            >
              <CandidatePortrait />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex flex-col items-center gap-2 text-white/30"
          >
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 bg-white/30 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TOP POLICIES ── */}
      <ScrollSection className="bg-slate-50 px-4 py-16 dark:bg-slate-950 sm:px-6 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#0d3063]/10 dark:bg-white/10 text-[#0d3063] dark:text-white text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {labels.home.policySubtitle}
            </div>
            <h2 className="text-[clamp(2rem,10vw,3rem)] font-black text-slate-900 dark:text-white">
              {labels.home.policyTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPolicies.map((policy, i) => (
              <PolicyCard key={policy.id} policy={policy} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/policies"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#a32f2c] px-8 py-3.5 font-bold text-white shadow-xl shadow-[#a32f2c]/20 transition-all hover:scale-[1.02] hover:bg-[#8f2926] active:scale-[0.98] sm:w-auto"
            >
              {labels.home.viewAllPolicies}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* ── VIDEO ── */}
      <ScrollSection className="bg-white px-4 py-16 dark:bg-slate-900 sm:px-6 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-3 text-[clamp(2rem,10vw,2.5rem)] font-black text-slate-900 dark:text-white">
            {labels.home.videoTitle}
          </h2>
          <p className="text-slate-400 mb-10">{labels.home.videoWatch}</p>
          <VideoPreviewCard onClick={() => router.push("/video")} />
          <Link href="/video" className="inline-flex items-center gap-2 mt-6 text-[#0d3063] dark:text-white font-semibold hover:underline">
            ดูวิดีโอเต็ม <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollSection>

      {/* ── COUNTDOWN ── */}
      <section className="relative overflow-hidden bg-white px-4 py-16 dark:bg-slate-900 sm:px-6 sm:py-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <ScrollSection className="relative z-10">
          <CountdownTimer />
        </ScrollSection>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="relative overflow-hidden bg-[#0d3063] px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(163,47,44,0.24)_0%,_transparent_70%)]" />
        <ScrollSection className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-6">
            โรงเรียนที่อยากเห็น
          </div>
          <blockquote className="mb-8 text-[clamp(1.75rem,9vw,2.5rem)] font-black leading-snug text-white">
            &ldquo;{candidate.vision}&rdquo;
          </blockquote>
          <div className="text-white/70 font-medium mb-10">
            - {candidate.name}, ผู้สมัครหมายเลข {candidate.number}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#a32f2c] px-7 py-3.5 font-bold text-white transition-all hover:bg-[#8f2926] active:scale-[0.98]"
            >
              {labels.home.aboutCta}
            </Link>
            <Link
              href="/feedback"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 px-7 py-3.5 font-semibold text-white transition-all hover:bg-white/12 active:scale-[0.98]"
            >
              {labels.home.feedbackCta}
            </Link>
          </div>
        </ScrollSection>
      </section>

      {/* ── FAQ ── */}
      <div className="bg-slate-50 dark:bg-slate-950">
        <FAQ />
      </div>
    </div>
  );
}
