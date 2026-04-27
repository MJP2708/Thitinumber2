"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  MessageCircle,
  Video,
  User,
  TrendingUp,
  ChevronRight,
  Bell,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  const { isAuthenticated, candidate, policies, feedbackList, gallery, t } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const unreadCount = feedbackList.filter((f) => !f.isRead).length;

  const stats = [
    {
      label: "Policies",
      value: policies.length,
      icon: FileText,
      color: "from-indigo-500 to-blue-600",
      href: "/admin/policies",
      desc: `${policies.length} active policies`,
    },
    {
      label: "Feedback",
      value: feedbackList.length,
      icon: MessageCircle,
      color: "from-purple-500 to-indigo-600",
      href: "/admin/feedback",
      desc: `${unreadCount} unread`,
    },
    {
      label: "Campaign Video",
      value: candidate.videoUrl ? "Set" : "Not set",
      icon: Video,
      color: "from-rose-500 to-pink-600",
      href: "/admin/video",
      desc: candidate.videoUrl ? "Video URL configured" : "No video uploaded",
    },
    {
      label: "Gallery Photos",
      value: gallery.length,
      icon: ImageIcon,
      color: "from-violet-500 to-purple-600",
      href: "/admin/media",
      desc: `${gallery.length} photo${gallery.length !== 1 ? "s" : ""} in gallery`,
    },
    {
      label: "Election Date",
      value: new Date(candidate.electionDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      href: "/admin/candidate",
      desc: candidate.electionDate,
    },
  ];

  const quickActions = [
    { label: t("admin.candidate"), href: "/admin/candidate", icon: User },
    { label: t("admin.policies"), href: "/admin/policies", icon: FileText },
    { label: "Media & Gallery", href: "/admin/media", icon: ImageIcon },
    { label: t("admin.video"), href: "/admin/video", icon: Video },
    { label: t("admin.feedback"), href: "/admin/feedback", icon: MessageCircle },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              {t("admin.dashboard")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back! Here&apos;s your campaign overview.
            </p>
          </motion.div>
        </div>

        {/* Unread notification */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl px-5 py-4"
          >
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <p className="text-sm text-indigo-700 dark:text-indigo-300 flex-1">
              You have <strong>{unreadCount} unread feedback</strong> submission{unreadCount !== 1 ? "s" : ""}.
            </p>
            <Link
              href="/admin/feedback"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, color, href, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={href}
                className="block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 card-hover shadow-sm group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
                  {value}
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {label}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">
                  {desc}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions + Recent Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Recent Feedback
              </h2>
              <Link
                href="/admin/feedback"
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                View all
              </Link>
            </div>
            {feedbackList.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No feedback yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbackList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-sm ${
                      !item.isRead
                        ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30"
                        : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Candidate preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-indigo-200 mb-1">
                Current Campaign
              </div>
              <h3 className="text-2xl font-black">{candidate.name}</h3>
              <p className="text-indigo-200 mt-1 italic text-sm">
                &ldquo;{candidate.slogan}&rdquo;
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-200 mb-1">Candidate No.</div>
              <div className="text-6xl font-black leading-none">
                {candidate.number}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg"
            >
              View Public Site
            </Link>
            <Link
              href="/admin/candidate"
              className="text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg"
            >
              Edit Info
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
