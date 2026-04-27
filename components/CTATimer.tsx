"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

function getTimeLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CTATimer() {
  const { candidate } = useApp();
  const [t, setT] = useState(() => getTimeLeft(candidate.electionDate));

  useEffect(() => {
    setT(getTimeLeft(candidate.electionDate));
    const id = setInterval(() => setT(getTimeLeft(candidate.electionDate)), 1000);
    return () => clearInterval(id);
  }, [candidate.electionDate]);

  const units = t
    ? [
        { value: t.days, label: "วัน" },
        { value: t.hours, label: "ชม." },
        { value: t.minutes, label: "น." },
        { value: t.seconds, label: "วิ." },
      ]
    : null;

  return (
    <section className="relative overflow-hidden bg-[#a32f2c] px-4 py-7 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-end overflow-hidden pr-6 opacity-[0.07]">
        <span className="text-[16rem] font-black leading-none">2</span>
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div>
          <p className="mb-0.5 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
            อย่าลืม — ในวันเลือกตั้ง
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black sm:text-3xl">เลือกหมายเลข</span>
            <span className="text-[5rem] font-black leading-none sm:text-[6rem]">{candidate.number}</span>
          </div>
        </div>

        {units ? (
          <div className="flex items-end gap-2 tabular-nums">
            {units.map(({ value, label }, i) => (
              <div key={label} className="flex items-end gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black leading-none sm:text-5xl">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold text-white/70">{label}</span>
                </div>
                {i < units.length - 1 && (
                  <span className="mb-5 text-xl font-black text-white/40">:</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-2xl font-black">ถึงวันเลือกตั้งแล้ว!</div>
        )}
      </div>
    </section>
  );
}
