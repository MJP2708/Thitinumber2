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
      initial={{ opacity: 0, y: 50 }}
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
    <div className="relative w-full max-w-[340px] mx-auto">
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
            <span className="absolute text-[260px] font-black text-white/5 leading-none select-none pointer-events-none">
              {candidate.number}
            </span>
            {/* Decorative rings */}
            <div className="absolute w-64 h-64 rounded-full border border-white/5" />
            <div className="absolute w-48 h-48 rounded-full border border-white/8" />
            {/* Avatar */}
            <div className="relative z-10 w-36 h-36 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-xl">
              <span className="text-7xl font-black text-white/70">
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
        className="absolute -top-5 -right-5 bg-[#a32f2c] rounded-2xl px-4 py-3 shadow-2xl shadow-[#a32f2c]/40 border border-white/20 z-20"
      >
        <div className="text-[10px] font-black uppercase tracking-widest text-white/75">เลือก</div>
        <div className="text-5xl font-black text-white leading-none">{candidate.number}</div>
      </motion.div>

      {/* Floating stats badge */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-5 -left-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 z-20 shadow-xl"
      >
        <div className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">นโยบาย</div>
        <div className="text-white font-black text-xl leading-none">5 เรื่อง</div>
        <div className="text-white/40 text-[10px] mt-0.5">ตั้งใจทำจริง</div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { candidate, policies, t, showToast } = useApp();
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const topPolicies = policies.slice(0, 3);

  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin)
        .then(() => showToast(t("common.share.copied"), "success"))
        .catch(() => showToast("Could not copy link", "error"));
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-[#0d3063] overflow-hidden"
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
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Campaign info */}
            <div>
              {/* Top badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-sm border border-white/12 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-8"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                เลือกตั้งสภานักเรียน 2569 · ผู้สมัครหมายเลข {candidate.number}
              </motion.div>

              {/* "VOTE FOR" label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-white/75 text-sm font-bold uppercase tracking-[0.3em] mb-3"
              >
                เลือก
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-black leading-[1.0] mb-6"
              >
                <span className="block text-white text-6xl sm:text-7xl xl:text-8xl">
                  {candidate.name.split(" ")[0]}
                </span>
                <span className="block text-white text-4xl sm:text-5xl xl:text-6xl mt-1">
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
                <p className="text-xl sm:text-2xl text-white/70 italic font-medium text-center lg:text-left">
                  &ldquo;{candidate.slogan}&rdquo;
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/policies"
                  className="group flex items-center gap-2 px-7 py-3.5 bg-[#a32f2c] hover:bg-[#8f2926] text-white font-bold rounded-2xl transition-all shadow-xl shadow-[#a32f2c]/30 hover:scale-105 hover:shadow-[#a32f2c]/40"
                >
                  {t("home.hero.cta.policies")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/video"
                  className="group flex items-center gap-2 px-7 py-3.5 bg-white/8 hover:bg-white/14 text-white font-semibold rounded-2xl border border-white/15 hover:border-white/25 transition-all backdrop-blur-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {t("home.video.watch")}
                </Link>
                <button
                  onClick={shareLink}
                  className="flex items-center gap-2 px-5 py-3.5 text-white/50 hover:text-white/80 hover:bg-white/5 rounded-2xl transition-all font-medium text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  {t("common.share")}
                </button>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex items-center gap-8"
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      <ScrollSection className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#0d3063]/10 dark:bg-white/10 text-[#0d3063] dark:text-white text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {t("home.policies.subtitle")}
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              {t("home.policies.title")}
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#a32f2c] hover:bg-[#8f2926] text-white font-bold rounded-2xl transition-all shadow-xl shadow-[#a32f2c]/20 hover:scale-105"
            >
              {t("home.policies.viewall")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* ── VIDEO ── */}
      <ScrollSection className="py-24 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
            {t("home.video.title")}
          </h2>
          <p className="text-slate-400 mb-10">{t("home.video.watch")}</p>
          <VideoPreviewCard onClick={() => router.push("/video")} />
          <Link href="/video" className="inline-flex items-center gap-2 mt-6 text-[#0d3063] dark:text-white font-semibold hover:underline">
            ดูวิดีโอเต็ม <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollSection>

      {/* ── COUNTDOWN ── */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <ScrollSection className="relative z-10">
          <CountdownTimer />
        </ScrollSection>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-24 px-6 bg-[#0d3063] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(163,47,44,0.24)_0%,_transparent_70%)]" />
        <ScrollSection className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-6">
            โรงเรียนที่อยากเห็น
          </div>
          <blockquote className="text-3xl sm:text-4xl font-black text-white leading-snug mb-8">
            &ldquo;{candidate.vision}&rdquo;
          </blockquote>
          <div className="text-white/70 font-medium mb-10">
            - {candidate.name}, ผู้สมัครหมายเลข {candidate.number}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="px-7 py-3.5 bg-[#a32f2c] hover:bg-[#8f2926] text-white font-bold rounded-2xl transition-all"
            >
              {t("home.hero.cta.about")}
            </Link>
            <Link
              href="/feedback"
              className="px-7 py-3.5 bg-white/8 text-white border border-white/15 font-semibold rounded-2xl hover:bg-white/12 transition-all"
            >
              {t("home.hero.cta.feedback")}
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
