"use client";

import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Target,
  Eye,
  Heart,
  Zap,
  BookOpen,
  MessageCircle,
  Star,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const categoryColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
];

export default function AboutPage() {
  const { candidate, t } = useApp();

  const sections = [
    {
      icon: Target,
      label: t("about.mission"),
      content: candidate.mission,
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: Eye,
      label: t("about.vision"),
      content: candidate.vision,
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: BookOpen,
      label: t("about.ideology"),
      content: candidate.ideology,
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Heart,
      label: t("about.reason"),
      content: candidate.reasonForRunning,
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 pt-16 pb-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <User className="w-4 h-4" />
            {t("about.subtitle")}
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl sm:text-6xl font-black mb-2"
          >
            {candidate.name}
          </motion.h1>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-4"
          >
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <GraduationCap className="w-4 h-4" />
              {candidate.grade}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Star className="w-4 h-4 text-amber-400" />
              Candidate No. {candidate.number}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-20">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0 w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-xl">
              <span className="text-white text-5xl font-black">
                {candidate.name.charAt(0)}
              </span>
            </div>
            {/* Bio */}
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                {candidate.name}
              </h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                &ldquo;{candidate.slogan}&rdquo;
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {candidate.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission / Vision / Ideology / Reason cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sections.map(({ icon: Icon, label, content, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 card-hover shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {label}
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Values & Strengths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {t("about.values")}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.values.map((value, i) => (
                <span
                  key={value}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
                    categoryColors[i % categoryColors.length]
                  }`}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {t("about.strengths")}
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {candidate.strengths.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {s}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${90 - i * 8}%` }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center"
        >
          <MessageCircle className="w-10 h-10 mx-auto mb-4 text-indigo-200" />
          <h3 className="text-2xl font-black mb-3">Have a question or idea?</h3>
          <p className="text-indigo-200 mb-6">
            I want to hear from you. Your voice shapes my campaign.
          </p>
          <a
            href="/feedback"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Share Your Feedback
          </a>
        </motion.div>
      </div>
    </div>
  );
}
