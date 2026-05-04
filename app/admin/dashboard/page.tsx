"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, FileText, Heart, MessageCircle, User, Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  const { isAuthenticated, sessionLoading, candidate, policies, feedbackList, labels } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) router.replace("/admin/login");
  }, [isAuthenticated, sessionLoading, router]);

  if (sessionLoading || !isAuthenticated) return null;

  const totalLikes = feedbackList.reduce((sum, item) => sum + (item.likes || 0), 0);
  const stats = [
    { label: "นโยบาย", value: policies.length, icon: FileText, href: "/admin/policies", desc: "นโยบายที่แสดงบนเว็บ" },
    { label: "ความคิดเห็น", value: feedbackList.length, icon: MessageCircle, href: "/admin/feedback", desc: "ข้อเสนอจากนักเรียน" },
    { label: "คนเห็นด้วย", value: totalLikes, icon: Heart, href: "/admin/feedback", desc: "ยอดถูกใจรวม" },
    { label: "วิดีโอ", value: candidate.videoUrl ? "ตั้งแล้ว" : "ยังไม่มี", icon: Video, href: "/admin/video", desc: "วิดีโอแนะนำตัว" },
    { label: "วันเลือกตั้ง", value: new Date(candidate.electionDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" }), icon: CalendarDays, href: "/admin/candidate", desc: candidate.electionDate },
  ];

  const quickActions = [
    { label: labels.admin.candidate, href: "/admin/candidate", icon: User },
    { label: labels.admin.policies, href: "/admin/policies", icon: FileText },
    { label: labels.admin.video, href: "/admin/video", icon: Video },
    { label: labels.admin.feedback, href: "/admin/feedback", icon: MessageCircle },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-[clamp(1.75rem,8vw,2.25rem)] font-black leading-tight text-slate-950 dark:text-white">{labels.admin.dashboard}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">ภาพรวมเว็บหาเสียงของผู้สมัครหมายเลข {candidate.number}</p>
          </motion.div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map(({ label, value, icon: Icon, href, desc }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={href} className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d3063]">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#a32f2c]" />
                </div>
                <div className="mb-0.5 text-2xl font-black text-slate-950 dark:text-white">{value}</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</div>
                <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-600">{desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-bold text-slate-950 dark:text-white">เมนูลัด</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700 transition hover:bg-[#0d3063]/10 hover:text-[#0d3063] dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-950 dark:text-white">ความคิดเห็นล่าสุด</h2>
              <Link href="/admin/feedback" className="text-xs font-semibold text-[#a32f2c] hover:underline">ดูทั้งหมด</Link>
            </div>
            {feedbackList.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
                <p className="text-sm">ยังไม่มีความคิดเห็น</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbackList.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-950 dark:text-white">{item.name || "ไม่ระบุชื่อ"}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700">{item.category}</span>
                    </div>
                    <p className="line-clamp-2 leading-6 text-slate-600 dark:text-slate-400">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-[#0d3063] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/60">แคมเปญปัจจุบัน</div>
              <h3 className="text-2xl font-black">{candidate.name}</h3>
              <p className="mt-1 text-sm italic text-white/70">“{candidate.slogan}”</p>
            </div>
            <div className="text-right">
              <div className="mb-1 text-xs text-white/60">หมายเลข</div>
              <div className="text-6xl font-black leading-none">{candidate.number}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/" target="_blank" className="rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold transition hover:bg-white/30">ดูหน้าเว็บจริง</Link>
            <Link href="/admin/candidate" className="rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold transition hover:bg-white/30">แก้ไขข้อมูล</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
