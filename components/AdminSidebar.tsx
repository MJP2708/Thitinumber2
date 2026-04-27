"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, User, FileText, Video, MessageCircle,
  LogOut, ChevronRight, ExternalLink,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function AdminSidebar() {
  const { candidate, logout, labels } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const links = [
    { href: "/admin/dashboard", label: labels.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/candidate", label: labels.admin.candidate, icon: User },
    { href: "/admin/policies", label: labels.admin.policies, icon: FileText },
    { href: "/admin/video", label: labels.admin.video, icon: Video },
    { href: "/admin/feedback", label: labels.admin.feedback, icon: MessageCircle },
  ];

  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="border-b border-slate-100 p-4 dark:border-slate-800 md:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#a32f2c] flex items-center justify-center text-white font-black text-lg shadow-md">
            {candidate.number}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">หน้าจัดการผู้สมัคร</div>
            <div className="text-xs text-[#a32f2c] dark:text-white/70">{candidate.name.split(" ")[0]}</div>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 md:block md:flex-1 md:space-y-0.5 md:overflow-visible">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className="flex-shrink-0 md:block">
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all md:min-h-0 ${
                  active
                    ? "bg-[#0d3063] text-white shadow-md shadow-[#0d3063]/20"
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

      <div className="border-t border-slate-100 p-3 dark:border-slate-800 md:space-y-1">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-white md:flex"
        >
          <ExternalLink className="w-4 h-4" />
          ดูหน้าเว็บจริง
        </Link>
        <button
          onClick={handleLogout}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 active:scale-[0.98] dark:hover:bg-red-950/30 md:justify-start md:min-h-0"
        >
          <LogOut className="w-4 h-4" />
          {labels.admin.logout}
        </button>
      </div>
    </aside>
  );
}
