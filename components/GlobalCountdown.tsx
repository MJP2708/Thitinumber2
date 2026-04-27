"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const ELECTION_TIME = new Date("2026-05-29T00:00:00+07:00").getTime();
const TOP_SAFE_AREA = 72;
const EDGE_PADDING = 10;

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

  useEffect(() => {
    if (hiddenOnAdmin) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const applyPosition = () => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    };

    const bounds = () => {
      const rect = cardRef.current?.getBoundingClientRect();
      const width = rect?.width || 132;
      const height = rect?.height || 72;
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
      posRef.current = {
        x: Math.min(b.maxX, Math.max(b.minX, window.innerWidth - 158)),
        y: TOP_SAFE_AREA,
      };
      applyPosition();
    };

    const step = () => {
      const b = bounds();
      const pos = posRef.current;
      const vel = velRef.current;

      pos.x += vel.x;
      pos.y += vel.y;

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
      className="pointer-events-none fixed left-0 top-0 z-40 w-[132px] select-none rounded-2xl border border-[#0d3063]/10 bg-white/95 p-2.5 text-center text-[#0d3063] shadow-lg shadow-slate-900/10 dark:border-white/10 dark:bg-white/95"
      aria-label={`นับถอยหลังเลือกตั้ง ${content}`}
    >
      <div className="mb-1 rounded-xl bg-[#a32f2c] px-2 py-1 text-[11px] font-black leading-none text-white">
        เลือกเบอร์สอง
      </div>
      <div className="text-xs font-black leading-5 tabular-nums">
        {content}
      </div>
    </div>
  );
}
