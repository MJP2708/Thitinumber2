"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import PolicyCard from "@/components/PolicyCard";

const CATEGORIES = ["ทั้งหมด", "การสื่อสาร", "ชีวิตนักเรียน", "กิจกรรม", "สิ่งแวดล้อม", "การเรียน", "อื่น ๆ"];

export default function PoliciesPage() {
  const { policies, labels } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "ทั้งหมด" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [policies, search, activeCategory]);

  const usedCategories = useMemo(() => {
    const cats = new Set(policies.map((p) => p.category));
    return CATEGORIES.filter((c) => c === "ทั้งหมด" || cats.has(c));
  }, [policies]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#0d3063] px-4 pb-24 pt-20 text-white sm:px-6 sm:pt-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <FileText className="w-4 h-4" />
            {policies.length} นโยบาย
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-3 text-[clamp(2rem,11vw,3.75rem)] font-black leading-[1.25]"
          >
            {labels.policies.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base leading-8 text-white/70 sm:text-lg"
          >
            {labels.policies.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={labels.policies.search}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-base text-slate-900 placeholder-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {usedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${
                    activeCategory === cat
                      ? "bg-[#0d3063] text-white shadow-md shadow-[#0d3063]/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#0d3063]/10 dark:hover:bg-white/10 hover:text-[#0d3063] dark:hover:text-white"
                  }`}
                >
                  {cat === "ทั้งหมด" ? labels.policies.all : cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <div className="pb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                {labels.policies.noResults}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                แสดง {filtered.length} จาก {policies.length} นโยบาย
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((policy, i) => (
                  <PolicyCard key={policy.id} policy={policy} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
