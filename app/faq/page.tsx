"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Calendar, Share2 } from "lucide-react";
import { defaultFAQ } from "@/lib/defaultData";
import { useApp } from "@/contexts/AppContext";

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
      <div className="bg-[#0d3063] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#a32f2c]/25 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/2" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-28 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
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
            className="text-white/70 text-lg"
          >
            Campaign answers from {candidate.name}, Candidate No. {candidate.number}.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#a32f2c] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Election Day</div>
              <div className="text-3xl font-black">
                {new Date(candidate.electionDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
        >
          <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-[#0d3063] flex items-center justify-center shadow-md">
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
                transition={{ delay: 0.5 + i * 0.07 }}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                  <motion.div animate={{ rotate: openId === faq.id ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                    <ChevronDown className="w-5 h-5 text-[#a32f2c]" />
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
      </div>
    </div>
  );
}
