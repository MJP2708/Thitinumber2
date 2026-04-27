"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const ELECTION_TIME = new Date("2026-05-29T00:00:00+07:00").getTime();
const TOP_SAFE_AREA = 72;
const EDGE_PADDING = 10;
const MOBILE_QUERY = "(max-width: 640px)";

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
  const pathname = usePathname();
  const hiddenOnAdmin = pathname.startsWith("/admin");
  const [remaining, setRemaining] = useState(() => getRemaining());
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const posRef = useRef({ x: 16, y: TOP_SAFE_AREA });
  const velRef = useRef({ x: 0.38, y: 0.28 });

  useEffect(() => {
    if (hiddenOnAdmin) return;
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, [hiddenOnAdmin]);

  const content = useMemo(() => {
    if (!remaining) return "ถึงวันเลือกตั้งแล้ว";
    return `${remaining.days}วัน ${remaining.hours}ชม. ${remaining.minutes}น. ${remaining.seconds}วิ.`;
  }, [remaining]);

  const mobileContent = useMemo(() => {
    if (!remaining) return "ถึงวันแล้ว";
    return `${remaining.days}วัน ${remaining.hours}:${String(remaining.minutes).padStart(2, "0")}:${String(remaining.seconds).padStart(2, "0")}`;
  }, [remaining]);

  useEffect(() => {
    if (hiddenOnAdmin) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const applyPosition = () => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    };

    const bounds = () => {
      const rect = cardRef.current?.getBoundingClientRect();
      const width = rect?.width || 108;
      const height = rect?.height || 56;
      return {
        minX: EDGE_PADDING,
        minY: TOP_SAFE_AREA,
        maxX: Math.max(EDGE_PADDING, window.innerWidth - width - EDGE_PADDING),
        maxY: Math.max(TOP_SAFE_AREA, window.innerHeight - height - EDGE_PADDING),
      };
    };

    const placeInside = () => {
      const b = bounds();
      posRef.current.x = Math.min(b.maxX, Math.max(b.minX, posRef.current.x));
      posRef.current.y = Math.min(b.maxY, Math.max(b.minY, posRef.current.y));
      applyPosition();
    };

    const startPosition = () => {
      const b = bounds();
      const isMobile = window.matchMedia(MOBILE_QUERY).matches;
      posRef.current = {
        x: Math.min(b.maxX, Math.max(b.minX, window.innerWidth - (isMobile ? 124 : 158))),
        y: isMobile ? TOP_SAFE_AREA + 4 : TOP_SAFE_AREA,
      };
      velRef.current = isMobile ? { x: 0.82, y: 0.64 } : { x: 0.38, y: 0.28 };
      applyPosition();
    };

    const step = () => {
      const b = bounds();
      const isMobile = window.matchMedia(MOBILE_QUERY).matches;
      const speedBoost = isMobile ? 1.22 : 1;
      const pos = posRef.current;
      const vel = velRef.current;

      pos.x += vel.x * speedBoost;
      pos.y += vel.y * speedBoost;

      if (pos.x <= b.minX) {
        pos.x = b.minX;
        vel.x = Math.abs(vel.x);
      } else if (pos.x >= b.maxX) {
        pos.x = b.maxX;
        vel.x = -Math.abs(vel.x);
      }

      if (pos.y <= b.minY) {
        pos.y = b.minY;
        vel.y = Math.abs(vel.y);
      } else if (pos.y >= b.maxY) {
        pos.y = b.maxY;
        vel.y = -Math.abs(vel.y);
      }

      applyPosition();
      frameRef.current = requestAnimationFrame(step);
    };

    startPosition();

    if (!reduceMotion) {
      frameRef.current = requestAnimationFrame(step);
    }

    window.addEventListener("resize", placeInside);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      window.removeEventListener("resize", placeInside);
    };
  }, [hiddenOnAdmin]);

  if (hiddenOnAdmin) return null;

  return (
    <div
      ref={cardRef}
      className="pointer-events-none fixed left-0 top-0 z-40 w-[104px] select-none rounded-xl border border-[#0d3063]/10 bg-white/90 p-1.5 text-center text-[#0d3063] shadow-md shadow-slate-900/10 dark:border-white/10 dark:bg-white/90 sm:w-[132px] sm:rounded-2xl sm:p-2.5"
      aria-label={`นับถอยหลังเลือกตั้ง ${content}`}
    >
      <div className="mb-0.5 rounded-lg bg-[#a32f2c] px-1.5 py-0.5 text-[9px] font-black leading-none text-white sm:mb-1 sm:rounded-xl sm:px-2 sm:py-1 sm:text-[11px]">
        เลือกเบอร์สอง
      </div>
      <div className="text-[10px] font-black leading-4 tabular-nums sm:text-xs sm:leading-5">
        <span className="sm:hidden">{mobileContent}</span>
        <span className="hidden sm:inline">{content}</span>
      </div>
    </div>
  );
}
