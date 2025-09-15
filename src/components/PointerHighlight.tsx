"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PointerHighlight() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;

    let x = 0,
      y = 0;
    let visible = false;
    let fadeTimer: any = null;

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      const overlay = overlayRef.current;
      if (overlay) overlay.style.opacity = v ? "1" : "0";
    };

    const updatePosition = (nx: number, ny: number) => {
      x = nx;
      y = ny;
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.setProperty("--x", `${x}px`);
        overlay.style.setProperty("--y", `${y}px`);
      }
    };

    // For desktop pointer (optional)
    const onPointerMove = (e: PointerEvent) => {
      updatePosition(e.clientX, e.clientY);
      setVisible(true);
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => setVisible(false), 1500);
    };

    // For touch devices
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
      setVisible(true);
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => setVisible(false), 800); // fade faster on touch
    };

    const onLeave = () => setVisible(false);

    // Add event listeners
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    // Touch events
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchend", onLeave);

    // Cleanup
    return () => {
      window.removeEventListener("pointermove", onPointerMove as any);
      window.removeEventListener("pointerdown", onPointerMove as any);
      window.removeEventListener("blur", onLeave as any);
      document.removeEventListener("mouseleave", onLeave as any);

      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchstart", onTouchMove as any);
      window.removeEventListener("touchend", onLeave as any);

      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[40] hidden md:block transition-opacity duration-200"
      style={
        {
          opacity: 0,
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(99,102,241,0.20), transparent 60%)",
          mixBlendMode: "normal",
        } as React.CSSProperties
      }
    />
  );
}
