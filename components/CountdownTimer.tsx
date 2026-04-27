"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
}

function FlipCard({ value, label }: FlipCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0d3063] flex items-center justify-center shadow-lg shadow-[#0d3063]/30">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-black text-white tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const { candidate, t } = useApp();
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
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {t("home.countdown.title")}
      </h2>
      {isOver ? (
        <div className="text-3xl font-black text-[#a32f2c] dark:text-white">
          🗳️ Election Day is Here!
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <FlipCard value={timeLeft.days} label={t("home.countdown.days")} />
          <div className="text-3xl font-black text-[#a32f2c] mb-6 select-none">:</div>
          <FlipCard value={timeLeft.hours} label={t("home.countdown.hours")} />
          <div className="text-3xl font-black text-[#a32f2c] mb-6 select-none">:</div>
          <FlipCard value={timeLeft.minutes} label={t("home.countdown.minutes")} />
          <div className="text-3xl font-black text-[#a32f2c] mb-6 select-none">:</div>
          <FlipCard value={timeLeft.seconds} label={t("home.countdown.seconds")} />
        </div>
      )}
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Election Date:{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {new Date(candidate.electionDate).toLocaleDateString("en-US", {
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
