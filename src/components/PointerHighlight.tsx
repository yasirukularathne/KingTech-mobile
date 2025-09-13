"use client";

import { useEffect, useRef } from "react";

/**
 * Premium cursor system inspired by high-end sites
 * - Core dot for precision
 * - Responsive ring with active underline feel on links/buttons
 * - Smooth trailing blob
 * - Hover labels via data-cursor-text
 * - Click ripples
 * - Reduced-motion friendly and disabled on touch
 * - Renders under text (mix-blend + low z-index)
 */
export function PointerHighlight() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let raf = 0;
    // Targets
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    // Positions
    let cx = tx,
      cy = ty; // core snaps
    let rx = tx,
      ry = ty; // ring ease
    let bx = tx,
      by = ty; // blob ease

    let visible = false;
    let hover = false;
    let fadeTimer: number | undefined;

    const setOpacity = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      const core = coreRef.current;
      const ring = ringRef.current;
      const blob = blobRef.current;
      const label = labelRef.current;
      const coreAlpha = v ? "1" : "0";
      const ringAlpha = v ? "0.9" : "0";
      const blobAlpha = v ? (prefersReduced ? "0.0" : "0.35") : "0";
      if (core) core.style.opacity = coreAlpha;
      if (ring) ring.style.opacity = ringAlpha;
      if (blob) blob.style.opacity = blobAlpha;
      if (label) label.style.opacity = v ? "1" : "0";
    };

    const update = () => {
      cx = tx; // snap core for precision
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      bx += (tx - bx) * 0.12;
      by += (ty - by) * 0.12;

      const core = coreRef.current;
      const ring = ringRef.current;
      const blob = blobRef.current;
      const label = labelRef.current;
      if (core) core.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (blob) blob.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
      if (label)
        label.style.transform = `translate3d(${rx}px, ${ry - 18}px, 0)`;

      raf = requestAnimationFrame(update);
    };

    const setHoverState = (el: Element | null) => {
      const ring = ringRef.current;
      const label = labelRef.current;
      if (!ring || !label) return;

      let text = "";
      const isInteractive =
        !!el && el.closest("a,button,[role=button]") != null;
      const dataEl = el?.closest("[data-cursor-text]") as HTMLElement | null;
      if (dataEl?.dataset.cursorText) text = dataEl.dataset.cursorText;
      else if (isInteractive)
        text =
          (el as HTMLElement).getAttribute("aria-label") ||
          (el as HTMLElement).innerText?.trim().slice(0, 16) ||
          "Open";

      hover = isInteractive || !!text;
      const scale = hover ? 1.4 : 1;
      ring.style.transform += ` scale(${scale})`;
      label.style.display = text ? "block" : "none";
      label.textContent = text || "";
    };

    const spawnRipple = (x: number, y: number) => {
      const container = containerRef.current;
      if (!container) return;
      const ripple = document.createElement("div");
      ripple.className =
        "pointer-events-none fixed top-0 left-0 z-[1] hidden md:block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/30 blur-[1px]";
      ripple.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ripple.style.opacity = "0.9";
      ripple.style.transition =
        "transform 500ms cubic-bezier(.2,.8,.2,1), opacity 500ms ease";
      container.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = `translate3d(${x}px, ${y}px, 0) scale(10)`;
        ripple.style.opacity = "0";
      });
      setTimeout(() => ripple.remove(), 520);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
      setOpacity(true);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(() => setOpacity(false), 1600);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHoverState(el);
    };

    const onDown = (e: PointerEvent) => {
      spawnRipple(e.clientX, e.clientY);
    };

    const onLeave = () => setOpacity(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    setOpacity(false);
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden className="contents">
      {/* Core dot - precise pointer */}
      <div
        ref={coreRef}
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/80 shadow-[0_0_10px_rgba(99,102,241,0.35)] transition-opacity duration-150 mix-blend-multiply"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)" }}
      />
      {/* Ring - grows on interactive elements */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-[opacity,transform] duration-200 will-change-transform mix-blend-multiply"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)" }}
      />
      {/* Label for actions */}
      <div
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block -translate-x-1/2 -translate-y-full rounded-full bg-indigo-600/90 text-white px-2 py-0.5 text-[10px] font-semibold tracking-wide shadow-md transition-opacity duration-150"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)" }}
      />
      {/* Trailing blob */}
      <div
        ref={blobRef}
        className="pointer-events-none fixed top-0 left-0 z-0 hidden md:block h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),transparent_60%)] blur-3xl transition-opacity duration-300 mix-blend-multiply"
        style={{ opacity: 0, transform: "translate3d(-100px,-100px,0)" }}
      />
    </div>
  );
}
