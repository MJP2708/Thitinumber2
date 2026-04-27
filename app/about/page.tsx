"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap, Target, Eye, Heart, Zap, BookOpen,
  MessageCircle, Star, Quote, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";

const tagColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-700",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700",
];

function AnimatedBar({ value, delay }: { value: number; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
      />
    </div>
  );
}

function CandidatePhoto() {
  const { candidate } = useApp();
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d3063]/30 to-[#a32f2c]/20 rounded-3xl blur-xl scale-105" />
      <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl">
        {candidate.aboutImage ? (
          <img src={candidate.aboutImage} alt={candidate.name} className="w-full h-full object-cover" />
        ) : candidate.heroImage ? (
          <img src={candidate.heroImage} alt={candidate.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d3063] via-[#123f7d] to-[#a32f2c] flex flex-col items-center justify-center relative overflow-hidden">
            <span className="absolute text-[200px] font-black text-white/5 leading-none select-none">{candidate.number}</span>
            <div className="relative z-10 w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
              <span className="text-5xl font-black text-white/70">{candidate.name.charAt(0)}</span>
            </div>
            <div className="relative z-10 mt-4 text-center">
              <div className="font-black text-lg text-white/80">{candidate.name.split(" ")[0]}</div>
              <div className="text-white/40 text-xs mt-1">Add photo in admin</div>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#a32f2c] flex items-center justify-center font-black text-white text-sm shadow-lg">
              {candidate.number}
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">{candidate.name}</div>
              <div className="text-white/60 text-xs">{candidate.grade}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { candidate, t } = useApp();

  const infoCards = [
    { icon: Target, label: t("about.mission"), content: candidate.mission, grad: "from-[#0d3063] to-[#164b91]" },
    { icon: Eye, label: t("about.vision"), content: candidate.vision, grad: "from-[#0d3063] to-[#a32f2c]" },
    { icon: BookOpen, label: t("about.ideology"), content: candidate.ideology, grad: "from-[#0d3063] to-[#164b91]" },
    { icon: Heart, label: t("about.reason"), content: candidate.reasonForRunning, grad: "from-[#a32f2c] to-[#d94b45]" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero banner */}
      <div className="bg-[#0d3063] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#a32f2c]/25 rounded-full blur-[80px] translate-x-1/4 translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            {/* Left: Text info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/8 border border-white/12 px-4 py-2 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest mb-6"
              >
                {t("about.subtitle")}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-black text-white mb-4 leading-tight"
              >
                <span className="block text-5xl sm:text-6xl">{candidate.name.split(" ")[0]}</span>
                <span className="block text-3xl sm:text-4xl text-white">
                  {candidate.name.split(" ").slice(1).join(" ")}
                </span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-white/70 text-sm">
                  <GraduationCap className="w-4 h-4 text-white/70" />
                  {candidate.grade}
                </span>
                <span className="flex items-center gap-1.5 bg-[#a32f2c]/25 border border-[#a32f2c]/40 px-3 py-1.5 rounded-full text-white text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  Candidate No. {candidate.number}
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-white/50 italic text-lg"
              >
                &ldquo;{candidate.slogan}&rdquo;
              </motion.p>
            </div>
            {/* Right: Photo (small, in hero) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-[260px] mx-auto lg:ml-auto"
            >
              <CandidatePhoto />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 pb-20">
        {/* Bio card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8 relative overflow-hidden"
        >
          <Quote className="absolute -top-4 -left-4 w-20 h-20 text-indigo-100 dark:text-indigo-900/40 rotate-180" />
          <div className="relative z-10">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">About Me</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">{candidate.bio}</p>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {infoCards.map(({ icon: Icon, label, content, grad }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{label}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{content}</p>
            </motion.div>
          ))}
        </div>

        {/* Values + Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{t("about.values")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.values.map((value, i) => (
                <span
                  key={value}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border ${tagColors[i % tagColors.length]}`}
                >
                  {value}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{t("about.strengths")}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {candidate.strengths.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-28 flex-shrink-0">{s}</span>
                  <AnimatedBar value={90 - i * 8} delay={1 + i * 0.1} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Why vote for me */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-[#0d3063] rounded-3xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">Why Vote for Me?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: "🎯", title: "Results-Driven", desc: "Every policy I propose has a clear action plan and measurable outcome." },
                { emoji: "👂", title: "Student-First", desc: "I listen to students first. Your problems become my agenda." },
                { emoji: "⚡", title: "Quick to Act", desc: "I don't wait. I bring proposals to administration within the first week." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-3xl mb-2">{emoji}</div>
                  <div className="font-bold mb-1">{title}</div>
                  <div className="text-white/70 text-sm">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <MessageCircle className="w-8 h-8 text-[#a32f2c] flex-shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Have a question or idea?</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Your voice shapes my campaign.</div>
            </div>
          </div>
          <Link
            href="/feedback"
            className="flex items-center gap-2 px-6 py-3 bg-[#a32f2c] hover:bg-[#8f2926] text-white font-bold rounded-xl transition-colors flex-shrink-0"
          >
            Share Feedback <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
