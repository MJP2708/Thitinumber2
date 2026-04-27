"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Heart, Star, Leaf, BookOpen, Zap,
  Globe, Users, Music, Shield, Target, Lightbulb,
  ChevronDown,
} from "lucide-react";
import { Policy } from "@/lib/defaultData";
import { useApp } from "@/contexts/AppContext";

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare, Heart, Star, Leaf, BookOpen, Zap,
  Globe, Users, Music, Shield, Target, Lightbulb,
};

const categoryColors: Record<string, string> = {
  Technology: "bg-[#0d3063]/10 text-[#0d3063] dark:bg-white/10 dark:text-white",
  Wellness: "bg-[#a32f2c]/10 text-[#a32f2c] dark:bg-[#a32f2c]/25 dark:text-white",
  Culture: "bg-[#0d3063]/10 text-[#0d3063] dark:bg-white/10 dark:text-white",
  Environment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Education: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

const categoryGradients: Record<string, string> = {
  Technology: "from-[#0d3063] to-[#164b91]",
  Wellness: "from-[#a32f2c] to-[#d94b45]",
  Culture: "from-[#0d3063] to-[#a32f2c]",
  Environment: "from-emerald-500 to-teal-500",
  Education: "from-amber-500 to-orange-500",
  Other: "from-slate-500 to-gray-500",
};

interface PolicyCardProps {
  policy: Policy;
  index?: number;
  compact?: boolean;
}

export default function PolicyCard({ policy, index = 0, compact = false }: PolicyCardProps) {
  const { labels } = useApp();
  const [expanded, setExpanded] = useState(false);
  const Icon = IconMap[policy.icon] || Lightbulb;
  const color = categoryColors[policy.category] || categoryColors.Other;
  const gradient = categoryGradients[policy.category] || categoryGradients.Other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#0d3063]/10 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="break-words text-base font-bold leading-snug text-slate-900 dark:text-white">
                {policy.title}
              </h3>
              <span className={`w-fit flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>
                {policy.category}
              </span>
            </div>
            <p className={`break-words text-sm leading-7 text-slate-600 dark:text-slate-400 ${!expanded && compact ? "line-clamp-2" : ""}`}>
              {policy.description}
            </p>
          </div>
        </div>

        {!compact && (
          <>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-[#a32f2c] uppercase tracking-wide mb-2">
                      {labels.policies.impact}
                    </p>
                    <p className="break-words text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {policy.impact}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 flex min-h-11 items-center gap-1.5 rounded-lg text-xs font-semibold text-[#0d3063] transition-colors hover:text-[#a32f2c] active:scale-[0.98] dark:text-white"
            >
              <span>{expanded ? labels.policies.readLess : labels.policies.readMore}</span>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
