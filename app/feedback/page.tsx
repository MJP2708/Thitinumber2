"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, Trophy } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const CATEGORIES = ["การเรียน", "กิจกรรม", "อาหาร/โรงอาหาร", "ความสะอาด", "การสื่อสาร", "ความปลอดภัย", "อื่น ๆ"];

function formatThaiDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FeedbackPage() {
  const { addFeedback, feedbackList, likeFeedback, t, showToast } = useApp();
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    grade: "",
    category: "อื่น ๆ",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      setLikedIds(JSON.parse(localStorage.getItem("likedFeedbackIds") || "[]"));
    } catch {
      setLikedIds([]);
    }
  }, []);

  const sortedFeedback = useMemo(
    () => [...feedbackList].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [feedbackList]
  );

  const leaderboard = useMemo(
    () => [...feedbackList].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5),
    [feedbackList]
  );

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.message.trim()) nextErrors.message = "เขียนข้อเสนอแนะก่อนนะ";
    else if (form.message.trim().length < 8) nextErrors.message = "ขอรายละเอียดอีกนิดนึง";
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    addFeedback({
      name: form.name.trim(),
      grade: form.grade.trim() || undefined,
      category: form.category,
      message: form.message.trim(),
    });
    showToast(t("feedback.success"), "success");
    setForm({ name: "", grade: "", category: "อื่น ๆ", message: "" });
    setErrors({});
  };

  const handleLike = (id: string) => {
    const liked = likeFeedback(id);
    if (liked) {
      setLikedIds((prev) => [...prev, id]);
      showToast("ขอบคุณที่กดเห็นด้วยนะ", "success");
    } else {
      showToast("ข้อเสนอนี้กดถูกใจแล้ว", "info");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="relative z-0 overflow-hidden bg-[#0d3063] px-6 pb-28 pt-20 text-white">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
        <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#a32f2c]/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
            <MessageCircle className="h-4 w-4" />
            เสียงของเพื่อน ๆ สำคัญ
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="text-4xl font-black leading-tight sm:text-6xl">
            {t("feedback.title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/75">
            {t("feedback.subtitle")}
          </motion.p>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-0">
        <div className="-mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
          >
            <div className="mb-6 rounded-2xl bg-[#0d3063]/5 p-4 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-300">
              {t("feedback.note")}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("feedback.name")}</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t("feedback.name.placeholder")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("feedback.grade")}</label>
                <input
                  value={form.grade}
                  onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
                  placeholder={t("feedback.grade.placeholder")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("feedback.category")}</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t("feedback.message")} <span className="text-[#a32f2c]">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder={t("feedback.message.placeholder")}
                rows={6}
                className={`w-full resize-none rounded-xl border bg-slate-50 px-4 py-3 text-sm leading-7 focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:bg-slate-800 dark:text-white ${errors.message ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.message && <p className="mt-2 text-xs text-red-500">{errors.message}</p>}
            </div>

            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#a32f2c] px-6 py-4 font-bold text-white shadow-lg shadow-[#a32f2c]/20 transition hover:scale-[1.01] hover:bg-[#8f2926]">
              <Send className="h-4 w-4" />
              {t("feedback.submit")}
            </button>
          </motion.form>

          <motion.aside initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d3063] text-white">
                <Trophy className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black leading-7 text-slate-950 dark:text-white">ข้อเสนอที่คนเห็นด้วยมากที่สุด</h2>
            </div>

            {leaderboard.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                ยังไม่มีข้อเสนอแนะ ลองเป็นคนแรกที่เสนอไอเดียดูสิ
              </p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((item, index) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#a32f2c] text-sm font-black text-white">{index + 1}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#a32f2c]">
                        <Heart className="h-4 w-4 fill-current" />
                        {item.likes || 0}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.message}</p>
                    <p className="mt-2 text-xs font-semibold text-[#0d3063] dark:text-white">{item.category}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">บอร์ดความคิดเห็น</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ข้อเสนอที่ส่งเข้ามาจะแสดงตรงนี้ทันที</p>
            </div>
            <span className="rounded-full bg-[#0d3063]/10 px-4 py-2 text-sm font-bold text-[#0d3063] dark:bg-white/10 dark:text-white">
              {feedbackList.length} ข้อเสนอ
            </span>
          </div>

          {sortedFeedback.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              ยังไม่มีข้อเสนอแนะ ลองเป็นคนแรกที่เสนอไอเดียดูสิ
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sortedFeedback.map((item, index) => {
                const isLiked = likedIds.includes(item.id);
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#0d3063]/10 px-3 py-1 text-xs font-bold text-[#0d3063] dark:bg-white/10 dark:text-white">{item.category}</span>
                      {item.grade && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800">{item.grade}</span>}
                    </div>
                    <p className="min-h-16 text-base leading-8 text-slate-700 dark:text-slate-300">{item.message}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{item.name || "ไม่ระบุชื่อ"}</p>
                        <p>{formatThaiDate(item.timestamp)}</p>
                      </div>
                      <button
                        onClick={() => handleLike(item.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${isLiked ? "bg-[#a32f2c]/10 text-[#a32f2c]" : "bg-slate-100 text-slate-600 hover:bg-[#a32f2c] hover:text-white dark:bg-slate-800 dark:text-slate-300"}`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                        {isLiked ? "ถูกใจแล้ว" : "เห็นด้วย"} · {item.likes || 0}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
