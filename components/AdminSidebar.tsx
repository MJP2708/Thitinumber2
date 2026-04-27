"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, User, FileText, Video, MessageCircle,
  Image, LogOut, ChevronRight, ExternalLink,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function AdminSidebar() {
  const { candidate, logout, t } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const links = [
    { href: "/admin/dashboard", label: t("admin.dashboard"), icon: LayoutDashboard },
    { href: "/admin/candidate", label: t("admin.candidate"), icon: User },
    { href: "/admin/policies", label: t("admin.policies"), icon: FileText },
    { href: "/admin/media", label: "Media & Gallery", icon: Image },
    { href: "/admin/video", label: t("admin.video"), icon: Video },
    { href: "/admin/feedback", label: t("admin.feedback"), icon: MessageCircle },
  ];

  return (
    <aside className="w-60 flex-shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-screen">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            {candidate.number}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Admin Panel</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400">{candidate.name.split(" ")[0]}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("admin.logout")}
        </button>
      </div>
    </aside>
  );
}
