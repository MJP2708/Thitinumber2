"use client";

import { useEffect, useMemo, useState } from "react";

const ELECTION_TIME = new Date("2026-05-29T00:00:00+07:00").getTime();

function getRemaining() {
  const diff = ELECTION_TIME - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function GlobalCountdown() {
  const [remaining, setRemaining] = useState(() => getRemaining());

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const content = useMemo(() => {
    if (!remaining) return "ถึงวันเลือกตั้งแล้ว";
    return `${remaining.days}วัน ${remaining.hours}ชม. ${remaining.minutes}น. ${remaining.seconds}วิ.`;
  }, [remaining]);

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200/70 bg-white/95 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0d3063]/10 bg-white px-3 py-1.5 text-[#0d3063] shadow-sm dark:border-white/10 dark:bg-white dark:text-[#0d3063] sm:px-4">
          <span className="shrink-0 rounded-full bg-[#a32f2c] px-2.5 py-1 text-xs font-black text-white">
            เลือกเบอร์สอง
          </span>
          <span className="truncate text-sm font-black tabular-nums sm:text-base">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
