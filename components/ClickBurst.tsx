"use client";

import { useEffect, useRef, useState } from "react";

interface Burst {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const MAX_BURSTS = 10;
const MIN_CLICK_GAP_MS = 45;

export default function ClickBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);
  const lastClickRef = useRef(0);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastClickRef.current < MIN_CLICK_GAP_MS) return;
      lastClickRef.current = now;

      const id = idRef.current++;
      const next: Burst = {
        id,
        x: event.clientX,
        y: event.clientY,
        size: 22 + Math.random() * 18,
        opacity: 0.78 + Math.random() * 0.22,
      };

      setBursts((current) => [...current.slice(-(MAX_BURSTS - 1)), next]);
      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
      }, 760);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="click-burst-2"
          style={{
            left: burst.x,
            top: burst.y,
            fontSize: burst.size,
            opacity: burst.opacity,
          }}
        >
          2
        </span>
      ))}
    </div>
  );
}
