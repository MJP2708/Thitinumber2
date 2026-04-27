"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Star,
  Leaf,
  BookOpen,
  Zap,
  Globe,
  Users,
  Music,
  Shield,
  Target,
  Lightbulb,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { Policy } from "@/lib/defaultData";
import { useApp } from "@/contexts/AppContext";

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Heart,
  Star,
  Leaf,
  BookOpen,
  Zap,
  Globe,
  Users,
  Music,
  Shield,
  Target,
  Lightbulb,
};

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Wellness: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Culture: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Environment: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Education: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

const categoryGradients: Record<string, string> = {
  Technology: "from-blue-500 to-cyan-500",
  Wellness: "from-rose-500 to-pink-500",
  Culture: "from-purple-500 to-violet-500",
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
  const { t } = useApp();
  const [expanded, setExpanded] = useState(false);
  const Icon = IconMap[policy.icon] || Lightbulb;
  const color = categoryColors[policy.category] || categoryColors.Other;
  const gradient = categoryGradients[policy.category] || categoryGradients.Other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden card-hover shadow-sm"
    >
      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                {policy.title}
              </h3>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${color}`}
              >
                {policy.category}
              </span>
            </div>
            <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${!expanded && compact ? "line-clamp-2" : ""}`}>
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
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                        {t("policies.impact")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {policy.impact}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/btn"
            >
              <span>{expanded ? t("policies.readless") : t("policies.readmore")}</span>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.div>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
