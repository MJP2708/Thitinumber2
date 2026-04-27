"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Share2,
  Vote,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import PolicyCard from "@/components/PolicyCard";
import CountdownTimer from "@/components/CountdownTimer";
import FAQ from "@/components/FAQ";
import { VideoPreviewCard } from "@/components/VideoSection";
import { useRouter } from "next/navigation";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { candidate, policies, t, showToast } = useApp();
  const router = useRouter();
  const topPolicies = policies.slice(0, 3);

  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(window.location.origin)
        .then(() => showToast(t("common.share.copied"), "success"))
        .catch(() => showToast("Could not copy link", "error"));
    }
  };

  const votingSteps = [
    t("home.voting.step1"),
    t("home.voting.step2"),
    t("home.voting.step3"),
    t("home.voting.step4"),
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Floating Vote Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="badge-vote absolute top-8 right-8 sm:top-12 sm:right-12 z-10"
        >
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl px-4 py-3 shadow-2xl shadow-amber-500/40 border border-amber-300/30">
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
              {t("common.vote")}
            </div>
            <div className="text-4xl font-black leading-none">
              {candidate.number}
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t("common.candidate")} {candidate.number} — Student Council 2026
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight"
          >
            <span className="block">{candidate.name.split(" ")[0]}</span>
            <span className="gradient-text">{candidate.name.split(" ").slice(1).join(" ")}</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-indigo-200 font-medium italic mb-4"
          >
            &ldquo;{candidate.slogan}&rdquo;
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 text-white/60 text-sm mb-10"
          >
            <MapPin className="w-4 h-4" />
            {candidate.grade} &middot;{" "}
            {new Date(candidate.electionDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/policies"
              className="group flex items-center gap-2.5 px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl shadow-white/20 hover:scale-105"
            >
              {t("home.hero.cta.policies")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
            >
              {t("home.hero.cta.about")}
            </Link>
            <button
              onClick={shareLink}
              className="flex items-center gap-2.5 px-6 py-4 text-white/70 font-medium rounded-2xl hover:text-white hover:bg-white/10 transition-all"
            >
              <Share2 className="w-4 h-4" />
              {t("common.share")}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-2 bg-white/40 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Strip */}
      <AnimatedSection>
        <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-8">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `No. ${candidate.number}`, label: "Candidate Number" },
              { value: policies.length, label: "Policies Planned" },
              { value: candidate.grade, label: "Grade / Class" },
              { value: "2026", label: "Election Year" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                  {value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Top Policies */}
      <AnimatedSection className="py-20 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              {t("home.policies.subtitle")}
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-105"
            >
              {t("home.policies.viewall")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Campaign Video */}
      <AnimatedSection className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
              {t("home.video.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {t("home.video.watch")}
            </p>
          </div>
          <VideoPreviewCard onClick={() => router.push("/video")} />
          <div className="text-center mt-6">
            <Link
              href="/video"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Watch full video <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Countdown */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-700">
        <AnimatedSection>
          <CountdownTimer />
        </AnimatedSection>
      </section>

      {/* Voting Guide */}
      <AnimatedSection className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Vote className="w-4 h-4" />
            Voting Guide
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-10">
            {t("home.voting.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {votingSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            Your vote makes a difference. Vote responsibly!
          </div>
        </div>
      </AnimatedSection>

      {/* Manifesto Banner */}
      <section className="py-20 px-6 bg-slate-950 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.4)_0%,_transparent_70%)]" />
        </div>
        <AnimatedSection className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl font-black text-white leading-snug"
          >
            &ldquo;{candidate.vision}&rdquo;
          </motion.p>
          <div className="mt-6 text-indigo-400 font-medium">
            — {candidate.name}, Candidate No. {candidate.number}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/feedback"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              {t("home.hero.cta.feedback")}
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              {t("home.hero.cta.about")}
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <div className="bg-slate-50 dark:bg-slate-950">
        <FAQ />
      </div>
    </div>
  );
}
