"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Heart, MessageCircle, Search, Trash2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import ConfirmModal from "@/components/ConfirmModal";

type SortMode = "newest" | "liked";

export default function AdminFeedbackPage() {
  const { isAuthenticated, feedbackList, deleteFeedback, showToast, t } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [sort, setSort] = useState<SortMode>("newest");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  const categories = useMemo(() => ["ทั้งหมด", ...Array.from(new Set(feedbackList.map((item) => item.category)))], [feedbackList]);

  const filtered = useMemo(() => {
    return feedbackList
      .filter((item) => {
        const matchesCategory = category === "ทั้งหมด" || item.category === category;
        const text = `${item.name} ${item.grade || ""} ${item.category} ${item.message}`.toLowerCase();
        return matchesCategory && text.includes(search.toLowerCase());
      })
      .sort((a, b) => {
        if (sort === "liked") return (b.likes || 0) - (a.likes || 0);
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [category, feedbackList, search, sort]);

  if (!isAuthenticated) return null;

  const handleDelete = async () => {
    if (deleteId) {
      const ok = await deleteFeedback(deleteId);
      if (ok) {
        showToast("ลบความคิดเห็นแล้ว", "info");
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">{t("admin.feedback")}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              ทั้งหมด {feedbackList.length} ความคิดเห็น · แสดงอยู่ {filtered.length} รายการ
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาความคิดเห็น..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#a32f2c] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="newest">ใหม่ล่าสุด</option>
                <option value="liked">คนเห็นด้วยมากที่สุด</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
              <MessageCircle className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-700" />
              <p className="text-slate-500 dark:text-slate-400">
                {feedbackList.length === 0 ? "ยังไม่มีความคิดเห็นเข้ามา" : "ไม่พบความคิดเห็นตามตัวกรองนี้"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-950 dark:text-white">{item.name || "ไม่ระบุชื่อ"}</span>
                        {item.grade && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800">{item.grade}</span>}
                        <span className="rounded-full bg-[#0d3063]/10 px-2 py-0.5 text-xs font-semibold text-[#0d3063] dark:bg-white/10 dark:text-white">{item.category}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#a32f2c]/10 px-2 py-0.5 text-xs font-bold text-[#a32f2c]">
                          <Heart className="h-3.5 w-3.5 fill-current" />
                          {item.likes || 0}
                        </span>
                        <span className="ml-auto text-xs text-slate-400">
                          {new Date(item.timestamp).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{item.message}</p>
                    </div>

                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      title="ลบ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={!!deleteId}
        title={t("admin.confirm.delete")}
        message={t("admin.confirm.delete.sub")}
        confirmLabel={t("admin.delete")}
        cancelLabel={t("admin.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
