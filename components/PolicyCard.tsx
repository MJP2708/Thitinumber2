"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

interface CategoryStyle {
  stripe: string;
  badge: string;
  icon: string;
}

const CATEGORY_STYLE: Record<string, CategoryStyle> = {
  "การเรียน":       { stripe: "from-[#0d3063] to-[#1a5bb5]",   badge: "bg-[#0d3063]/10 text-[#0d3063] dark:bg-white/10 dark:text-white",               icon: "from-[#0d3063] to-[#1a5bb5]"    },
  "กิจกรรม":        { stripe: "from-indigo-500 to-violet-500",  badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",      icon: "from-indigo-500 to-violet-500"  },
  "ชีวิตนักเรียน":  { stripe: "from-emerald-500 to-teal-400",   badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",  icon: "from-emerald-500 to-teal-400"   },
  "การสื่อสาร":     { stripe: "from-amber-400 to-orange-500",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",          icon: "from-amber-400 to-orange-500"   },
  "สิ่งแวดล้อม":   { stripe: "from-green-500 to-emerald-400",  badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",          icon: "from-green-500 to-emerald-400"  },
  "อื่น ๆ":         { stripe: "from-slate-400 to-slate-500",    badge: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",             icon: "from-slate-400 to-slate-500"    },
};
const DEFAULT_STYLE: CategoryStyle = CATEGORY_STYLE["อื่น ๆ"];

interface PolicyCardProps {
  policy: Policy;
  index?: number;
  compact?: boolean;
}

export default function PolicyCard({ policy, compact = false }: PolicyCardProps) {
  const { labels } = useApp();
  const [expanded, setExpanded] = useState(false);
  const Icon = IconMap[policy.icon] || Lightbulb;
  const style = CATEGORY_STYLE[policy.category] ?? DEFAULT_STYLE;

  return (
    <div className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0d3063]/8 dark:border-slate-800 dark:bg-slate-900">
      <div className={`h-1 bg-gradient-to-r ${style.stripe}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.icon} flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-200 group-hover:rotate-[6deg] group-hover:scale-105`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="break-words text-sm font-bold leading-snug text-slate-900 dark:text-white">
                {policy.title}
              </h3>
              <span className={`w-fit flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}>
                {policy.category}
              </span>
            </div>
            <p className={`break-words text-xs leading-6 text-slate-600 dark:text-slate-400 ${!expanded && compact ? "line-clamp-2" : ""}`}>
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
                  <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#a32f2c]">
                      {labels.policies.impact}
                    </p>
                    <p className="break-words text-xs leading-6 text-slate-600 dark:text-slate-400">
                      {policy.impact}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex min-h-10 items-center gap-1.5 rounded-lg text-xs font-semibold text-[#0d3063] transition-colors hover:text-[#a32f2c] active:scale-[0.98] dark:text-white"
            >
              <span>{expanded ? labels.policies.readLess : labels.policies.readMore}</span>
              <div className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                <ChevronDown className="w-3 h-3" />
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
