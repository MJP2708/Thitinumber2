"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, ChevronDown, Vote, Calendar, CheckCircle,
  Users, Shield, Clock, Share2,
} from "lucide-react";
import { defaultFAQ } from "@/lib/defaultData";
import { useApp } from "@/contexts/AppContext";

const votingSteps = [
  {
    icon: Clock,
    title: "Election Day",
    desc: "May 15, 2026 — Voting opens from 8:00 AM to 4:00 PM",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Get Your Code",
    desc: "Collect your unique voting code from your homeroom teacher in the morning",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "Access the Portal",
    desc: "Visit the school's official voting portal on any device",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Vote,
    title: "Cast Your Vote",
    desc: "Enter your code, select your candidate, and confirm. Done in under 2 minutes!",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function FAQPage() {
  const { candidate, showToast } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);

  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin)
        .then(() => showToast("Link copied!", "success"))
        .catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#060618] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-700/20 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/8 border border-white/12 px-4 py-2 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest mb-5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ & Voting Guide
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black mb-4"
          >
            Everything You Need to Know
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg"
          >
            From how to vote to why student council matters — we&apos;ve got the answers.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-20">
        {/* Election Day Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">Election Day</div>
              <div className="text-3xl font-black">
                {new Date(candidate.electionDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-indigo-200 mt-1 text-sm">Voting hours: 8:00 AM – 4:00 PM</div>
            </div>
            <button
              onClick={shareLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl transition-colors text-sm font-semibold border border-white/20 flex-shrink-0"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>

        {/* How to Vote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 mb-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">How to Vote</h2>
          </div>
          <div className="space-y-4">
            {votingSteps.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                      Step {i + 1}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              All votes are anonymous and secure. Only your participation is recorded, not your choice.
            </p>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-8"
        >
          <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {defaultFAQ.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-indigo-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-800/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Student Council Matters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
        >
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
            Why Student Council Matters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { emoji: "🗣️", title: "Your Voice", desc: "The student council bridges the gap between students and administration, ensuring your concerns are heard at the highest level." },
              { emoji: "🎉", title: "School Events", desc: "From sports days to cultural festivals, the student council organizes and manages key school events that you look forward to." },
              { emoji: "💡", title: "Real Change", desc: "Student councils have the power to propose and implement real changes to school policies, facilities, and programs." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
                <div className="text-3xl mb-3">{emoji}</div>
                <div className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{title}</div>
                <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
