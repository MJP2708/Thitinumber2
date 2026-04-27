"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Burst {
  id: number;
  x: number;
  y: number;
  radius: number;
  size: number;
  rotation: number;
}

const MAX_BURSTS = 6;
const NUMBERS_PER_BURST = 8;
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
        radius: 34 + Math.random() * 18,
        size: 18 + Math.random() * 8,
        rotation: Math.random() * 360,
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
        <span key={burst.id} className="click-burst-ring" style={{ left: burst.x, top: burst.y }}>
          {Array.from({ length: NUMBERS_PER_BURST }, (_, index) => {
            const angle = (Math.PI * 2 * index) / NUMBERS_PER_BURST + (burst.rotation * Math.PI) / 180;
            const distance = burst.radius * (index % 2 === 0 ? 1 : 0.82);
            return (
              <span
                key={index}
                className="click-burst-2"
                style={{
                  "--dx": `${Math.cos(angle) * distance}px`,
                  "--dy": `${Math.sin(angle) * distance}px`,
                  "--spin": `${Math.round((Math.random() - 0.5) * 60)}deg`,
                  fontSize: burst.size + (index % 3) * 3,
                } as CSSProperties}
              >
                2
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
