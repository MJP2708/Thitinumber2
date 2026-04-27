"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "startupIntroSeen";
const HOLD_MS = 1250;

type Phase = "hidden" | "visible" | "leaving";

export default function StartupIntro() {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leaveDelay = reduced ? 650 : HOLD_MS;
    const hideDelay = leaveDelay + (reduced ? 20 : 320);

    const showFrame = window.requestAnimationFrame(() => setPhase("visible"));
    const leaveTimer = window.setTimeout(() => setPhase("leaving"), leaveDelay);
    const hideTimer = window.setTimeout(() => {
      setPhase("hidden");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    }, hideDelay);

    return () => {
      window.cancelAnimationFrame(showFrame);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const skip = () => {
    setPhase("hidden");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
  };

  if (phase === "hidden") return null;

  return (
    <div
      className={`startup-intro ${phase === "leaving" ? "startup-intro-out" : ""}`}
      role="dialog"
      aria-label="เครดิตผู้จัดทำเว็บไซต์"
    >
      <div className="startup-intro-card">
        <div className="startup-intro-badge">ธิติ แซ่ลี้ · หมายเลข 2</div>
        <div className="startup-intro-line" />
        <p className="startup-intro-label">เว็บไซต์นี้จัดทำโดย</p>
        <h2>มัทธิว จอห์น พฤกษากิจ</h2>
        <p className="startup-intro-grade">ม.5/9</p>
      </div>

      <button type="button" onClick={skip} className="startup-intro-skip" aria-label="ข้ามหน้าแนะนำ">
        ข้าม
      </button>
    </div>
  );
}
