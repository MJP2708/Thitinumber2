"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [remaining, setRemaining] = useState(() => getRemaining());
  const [isDragging, setIsDragging] = useState(false);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const posRef = useRef({ x: 16, y: 76 });
  const velRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
    lastX: 16,
    lastY: 76,
    lastTime: 0,
  });

  const hiddenOnAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (hiddenOnAdmin) return;
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, [hiddenOnAdmin]);

  const content = useMemo(() => {
    if (!remaining) return "ถึงวันเลือกตั้งแล้ว";
    return `${remaining.days}วัน ${remaining.hours}ชม. ${remaining.minutes}น. ${remaining.seconds}วิ.`;
  }, [remaining]);

  const applyPosition = () => {
    if (!pillRef.current) return;
    pillRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
  };

  const stopAnimation = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const getBounds = () => {
    const rect = pillRef.current?.getBoundingClientRect();
    const width = rect?.width || 260;
    const height = rect?.height || 48;

    return {
      minX: 8,
      minY: 72,
      maxX: Math.max(8, window.innerWidth - width - 8),
      maxY: Math.max(72, window.innerHeight - height - 8),
    };
  };

  const startBounce = () => {
    stopAnimation();

    const step = () => {
      const bounds = getBounds();
      const pos = posRef.current;
      const vel = velRef.current;

      pos.x += vel.x;
      pos.y += vel.y;
      vel.x *= 0.92;
      vel.y *= 0.92;

      if (pos.x < bounds.minX) {
        pos.x = bounds.minX;
        vel.x = Math.abs(vel.x) * 0.58;
      } else if (pos.x > bounds.maxX) {
        pos.x = bounds.maxX;
        vel.x = -Math.abs(vel.x) * 0.58;
      }

      if (pos.y < bounds.minY) {
        pos.y = bounds.minY;
        vel.y = Math.abs(vel.y) * 0.58;
      } else if (pos.y > bounds.maxY) {
        pos.y = bounds.maxY;
        vel.y = -Math.abs(vel.y) * 0.58;
      }

      applyPosition();

      if (Math.abs(vel.x) > 0.18 || Math.abs(vel.y) > 0.18) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (hiddenOnAdmin) return;

    const setInitialPosition = () => {
      const rect = pillRef.current?.getBoundingClientRect();
      const width = rect?.width || 260;
      posRef.current = {
        x: Math.max(8, window.innerWidth - width - 16),
        y: 76,
      };
      applyPosition();
    };

    setInitialPosition();
    window.addEventListener("resize", startBounce);
    return () => {
      stopAnimation();
      window.removeEventListener("resize", startBounce);
    };
    // startBounce intentionally reads refs so it stays outside React render work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenOnAdmin]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pillRef.current) return;
    stopAnimation();

    const now = performance.now();
    const rect = pillRef.current.getBoundingClientRect();
    dragRef.current = {
      active: true,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      lastX: posRef.current.x,
      lastY: posRef.current.y,
      lastTime: now,
    };
    velRef.current = { x: 0, y: 0 };
    setIsDragging(true);
    pillRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const rect = pillRef.current?.getBoundingClientRect();
    const width = rect?.width || 260;
    const height = rect?.height || 48;
    const softMinX = -width * 0.45;
    const softMaxX = window.innerWidth - width * 0.55;
    const softMinY = 48;
    const softMaxY = window.innerHeight - height * 0.55;
    const nextX = Math.min(softMaxX, Math.max(softMinX, event.clientX - dragRef.current.offsetX));
    const nextY = Math.min(softMaxY, Math.max(softMinY, event.clientY - dragRef.current.offsetY));
    const now = performance.now();
    const dt = Math.max(16, now - dragRef.current.lastTime);

    velRef.current = {
      x: ((nextX - dragRef.current.lastX) / dt) * 16,
      y: ((nextY - dragRef.current.lastY) / dt) * 16,
    };
    posRef.current = { x: nextX, y: nextY };
    dragRef.current.lastX = nextX;
    dragRef.current.lastY = nextY;
    dragRef.current.lastTime = now;
    applyPosition();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    pillRef.current?.releasePointerCapture(event.pointerId);
    startBounce();
  };

  if (hiddenOnAdmin) return null;

  return (
    <div
      ref={pillRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed left-0 top-0 z-40 touch-none select-none rounded-full border border-[#0d3063]/10 bg-white px-3 py-1.5 text-[#0d3063] shadow-lg shadow-slate-900/10 dark:border-white/10 dark:bg-white dark:text-[#0d3063] sm:px-4 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      aria-label={`นับถอยหลังเลือกตั้ง ${content}`}
    >
      <div className={`countdown-float-inner inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 ${isDragging ? "is-dragging" : ""}`}>
        <span className="shrink-0 rounded-full bg-[#a32f2c] px-2.5 py-1 text-xs font-black text-white">
          เลือกเบอร์สอง
        </span>
        <span className="truncate text-sm font-black tabular-nums sm:text-base">
          {content}
        </span>
      </div>
    </div>
  );
}
