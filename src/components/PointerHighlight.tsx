"use client";

import { useEffect, useRef } from "react";

export function PointerHighlight() {
  const overlayRef = useRef<HTMLDivElement>(null);

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
      const overlay = overlayRef.current;
      if (overlay) overlay.style.opacity = v ? "1" : "0";
    };

    const update = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.setProperty("--x", `${x}px`);
        overlay.style.setProperty("--y", `${y}px`);
      }
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
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[40] hidden md:block transition-opacity duration-200"
      style={
        {
          opacity: 0,
          // Elegant radial gradient spotlight that follows the cursor
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(99,102,241,0.20), transparent 60%)",
          mixBlendMode: "normal",
        } as React.CSSProperties
      }
    />
  );
}
