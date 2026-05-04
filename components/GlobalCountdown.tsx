"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const ELECTION_TIME = new Date("2026-05-29T00:00:00+07:00").getTime();

function getRemaining() {
  const diff = ELECTION_TIME - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function GlobalCountdown() {
  const pathname = usePathname();
  const [remaining, setRemaining] = useState(() => getRemaining());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    // Delay visibility so it fades in after page load (once only)
    const fadeIn = window.setTimeout(() => setVisible(true), 300);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(fadeIn);
    };
  }, [pathname]);

  const content = useMemo(() => {
    if (!remaining) return "ถึงวันเลือกตั้งแล้ว";
    return `${remaining.days}วัน ${remaining.hours}ชม. ${remaining.minutes}น. ${remaining.seconds}วิ.`;
  }, [remaining]);

  const mobileContent = useMemo(() => {
    if (!remaining) return "ถึงวันแล้ว";
    return `${remaining.days}วัน ${remaining.hours}:${String(remaining.minutes).padStart(2, "0")}:${String(remaining.seconds).padStart(2, "0")}`;
  }, [remaining]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className="pointer-events-none fixed right-3 top-[72px] z-40 w-[96px] select-none rounded-xl border border-[#0d3063]/8 bg-white/65 p-1.5 text-center text-[#0d3063] shadow-sm shadow-slate-900/8 backdrop-blur-sm dark:border-white/8 dark:bg-slate-900/65 sm:w-[120px] sm:rounded-2xl sm:p-2 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
      aria-label={`นับถอยหลังเลือกตั้ง ${content}`}
    >
      <div className="mb-0.5 rounded-lg bg-[#a32f2c]/90 px-1.5 py-0.5 text-[9px] font-black leading-none text-white sm:mb-1 sm:rounded-xl sm:px-2 sm:py-1 sm:text-[10px]">
        เลือกเบอร์สอง
      </div>
      <div className="text-[9px] font-black leading-4 tabular-nums text-[#0d3063]/80 dark:text-white/80 sm:text-[11px] sm:leading-5">
        <span className="sm:hidden">{mobileContent}</span>
        <span className="hidden sm:inline">{content}</span>
      </div>
    </div>
  );
}
