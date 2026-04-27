"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "startupIntroSeen";
const FADE_IN_MS  = 320;
const HOLD_MS     = 1150;
const FADE_OUT_MS = 380;

type Phase = "hidden" | "in" | "out";

export default function StartupIntro() {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setPhase("in");

    const holdMs    = reduced ? 500 : FADE_IN_MS + HOLD_MS;
    const totalMs   = reduced ? 500 : FADE_IN_MS + HOLD_MS + FADE_OUT_MS;

    const tOut = setTimeout(() => setPhase("out"), holdMs);
    const tEnd = setTimeout(() => {
      setPhase("hidden");
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
    }, totalMs);

    return () => { clearTimeout(tOut); clearTimeout(tEnd); };
  }, []);

  function skip() {
    setPhase("hidden");
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
  }

  if (phase === "hidden") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0d3063",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 5vw, 2rem)",
        fontFamily: "var(--font-ibm-plex-sans-thai), system-ui, sans-serif",
        willChange: "opacity",
        animation:
          phase === "out"
            ? `startup-fade-out ${FADE_OUT_MS}ms ease forwards`
            : `startup-fade-in ${FADE_IN_MS}ms ease forwards`,
      }}
    >
      {/* Main content — rises in with a slight delay */}
      <div
        style={{
          textAlign: "center",
          maxWidth: "min(90vw, 480px)",
          opacity: 0,
          animation: `startup-rise 400ms ease 80ms both`,
        }}
      >
        {/* Candidate badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "999px",
            padding: "0.3rem 0.85rem",
            fontSize: "clamp(0.7rem, 2vw, 0.8125rem)",
            fontWeight: 600,
            color: "rgba(255,255,255,0.55)",
            marginBottom: "1.25rem",
            letterSpacing: "0.02em",
          }}
        >
          ธิติ แซ่ลี้ · หมายเลข&nbsp;2
        </div>

        {/* Red accent bar */}
        <div
          style={{
            width: "2.25rem",
            height: "3px",
            background: "#a32f2c",
            borderRadius: "2px",
            margin: "0 auto 1.25rem",
          }}
        />

        {/* Credit label */}
        <p
          style={{
            fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "0.55rem",
            fontWeight: 500,
          }}
        >
          เว็บไซต์นี้จัดทำโดย
        </p>

        {/* Name */}
        <p
          style={{
            fontSize: "clamp(1.2rem, 5vw, 2rem)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.25,
            marginBottom: "0.45rem",
            wordBreak: "break-word",
          }}
        >
          Matthew John Prueksakij
        </p>

        {/* Grade */}
        <p
          style={{
            fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
            fontWeight: 700,
            color: "#a32f2c",
            letterSpacing: "0.05em",
          }}
        >
          ม.5/9
        </p>
      </div>

      {/* Skip button */}
      <button
        onClick={skip}
        aria-label="ข้ามการแนะนำเริ่มต้น"
        className="startup-skip"
        style={{
          position: "absolute",
          bottom: "clamp(1rem, 4vw, 1.75rem)",
          right: "clamp(1rem, 4vw, 1.75rem)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "0.625rem",
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.875rem",
          fontWeight: 600,
          padding: "0.5rem 1.1rem",
          cursor: "pointer",
          fontFamily: "var(--font-ibm-plex-sans-thai), system-ui, sans-serif",
          minHeight: "44px",
          minWidth: "64px",
        }}
      >
        ข้าม
      </button>
    </div>
  );
}
