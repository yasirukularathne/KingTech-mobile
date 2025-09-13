"use client";

import { useEffect, useRef } from "react";

export function PointerHighlight() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch devices
    if ("ontouchstart" in window) return;

    let raf = 0;
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0;
    let visible = false;
    let fadeTimer: any = null;

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      const el = dotRef.current;
      const glow = glowRef.current;
      if (el) el.style.opacity = v ? "1" : "0";
      if (glow) glow.style.opacity = v ? "0.6" : "0";
    };

    const update = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      const el = dotRef.current;
      const glow = glowRef.current;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (glow) glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        raf = 0;
      } else {
        raf = requestAnimationFrame(update);
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
      setVisible(true);
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => setVisible(false), 1500);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("pointerdown", onMove as any);
      window.removeEventListener("blur", onLeave as any);
      document.removeEventListener("mouseleave", onLeave as any);
      if (raf) cancelAnimationFrame(raf);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <>
      {/* Cursor ring */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-500/60 shadow-[0_0_14px_rgba(99,102,241,0.25)] transition-opacity duration-200 mix-blend-multiply"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)" }}
      />
      {/* Soft glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-0 hidden md:block h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/18 blur-3xl transition-opacity duration-300 mix-blend-multiply"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)" }}
      />
    </>
  );
}
