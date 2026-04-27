"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface FlipCardProps {
  value: number;
  label: string;
  inverted?: boolean;
}

function FlipCard({ value, label, inverted = false }: FlipCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg sm:h-20 sm:w-20 ${
          inverted
            ? "border border-white/20 bg-white/15 shadow-white/5"
            : "bg-[#0d3063] shadow-[#0d3063]/30"
        }`}
      >
        <span className="tabular-nums text-2xl font-black text-white sm:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${
          inverted ? "text-white/60" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ inverted = false }: { inverted?: boolean }) {
  const { candidate, labels } = useApp();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(candidate.electionDate));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(candidate.electionDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [candidate.electionDate]);

  const isOver =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div className="text-center">
      <div className="mb-2 flex items-baseline justify-center gap-3">
        <span
          className={`font-black text-[clamp(2rem,8vw,3.5rem)] ${
            inverted ? "text-white" : "text-slate-900 dark:text-white"
          }`}
        >
          เลือกเบอร์
        </span>
        <span className="font-black leading-none text-[#a32f2c] text-[clamp(5rem,20vw,10rem)]">2</span>
      </div>
      <p
        className={`mb-6 text-sm font-semibold uppercase tracking-[0.2em] ${
          inverted ? "text-white/60" : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {labels.countdown.title}
      </p>
      {isOver ? (
        <div className="text-3xl font-black text-[#a32f2c]">
          ถึงวันเลือกตั้งแล้ว
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <FlipCard value={timeLeft.days} label={labels.countdown.days} inverted={inverted} />
          <div className="mb-6 select-none text-3xl font-black text-[#a32f2c]">:</div>
          <FlipCard value={timeLeft.hours} label={labels.countdown.hours} inverted={inverted} />
          <div className="mb-6 select-none text-3xl font-black text-[#a32f2c]">:</div>
          <FlipCard value={timeLeft.minutes} label={labels.countdown.minutes} inverted={inverted} />
          <div className="mb-6 select-none text-3xl font-black text-[#a32f2c]">:</div>
          <FlipCard value={timeLeft.seconds} label={labels.countdown.seconds} inverted={inverted} />
        </div>
      )}
      <p
        className={`mt-4 text-sm ${
          inverted ? "text-white/60" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        วันเลือกตั้ง:{" "}
        <span
          className={`font-semibold ${
            inverted ? "text-white/90" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {new Date(candidate.electionDate).toLocaleDateString("th-TH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </p>
    </div>
  );
}
