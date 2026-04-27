"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  CheckCheck,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminFeedbackPage() {
  const {
    isAuthenticated,
    feedbackList,
    markFeedbackRead,
    deleteFeedback,
    showToast,
    t,
  } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const filtered = feedbackList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !item.isRead) ||
      (filter === "read" && item.isRead);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = feedbackList.filter((f) => !f.isRead).length;

  const handleDelete = () => {
    if (deleteId) {
      deleteFeedback(deleteId);
      showToast("Feedback deleted", "info");
      setDeleteId(null);
    }
  };

  const handleMarkRead = (id: string) => {
    markFeedbackRead(id);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              {t("admin.feedback")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {feedbackList.length} submissions &middot;{" "}
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {unreadCount} unread
              </span>
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search feedback..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      filter === f
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback List */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">
                {feedbackList.length === 0
                  ? "No feedback submissions yet."
                  : "No feedback matches your search."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 ${
                    !item.isRead
                      ? "border-indigo-200 dark:border-indigo-800"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                  onClick={() => !item.isRead && handleMarkRead(item.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.name}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        {item.email && (
                          <span className="text-xs text-slate-400">
                            {item.email}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">
                          {new Date(item.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(item.id);
                        }}
                        disabled={item.isRead}
                        title={item.isRead ? "Already read" : "Mark as read"}
                        className={`p-2 rounded-lg transition-all ${
                          item.isRead
                            ? "text-slate-300 dark:text-slate-700 cursor-default"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        }`}
                      >
                        {item.isRead ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(item.id);
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Mark all read */}
          {unreadCount > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() =>
                  feedbackList.filter((f) => !f.isRead).forEach((f) => markFeedbackRead(f.id))
                }
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
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
