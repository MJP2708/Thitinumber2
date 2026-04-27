"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "startupIntroSeen";
const HOLD_MS = 3000;

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
    const hideDelay = leaveDelay + (reduced ? 20 : 300);

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
        <a
          href="https://www.instagram.com/iammatthewei/"
          target="_blank"
          rel="noopener noreferrer"
          className="startup-intro-ig"
        >
          <svg className="startup-intro-ig-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          @iammatthewei
        </a>
      </div>

      <button type="button" onClick={skip} className="startup-intro-skip" aria-label="ข้ามหน้าแนะนำ">
        ข้าม
      </button>
    </div>
  );
}
