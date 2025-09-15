"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: string;
};

export function GoldTech({ className, children = "Tech" }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(false);

  function onMove(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    const el = ref.current;
    if (!el) return;
    if (!active) setActive(true);
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const pct = rect.width ? (x / rect.width) * 100 : 50;
    el.style.backgroundPosition = `${pct}% 50%`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.backgroundPosition = "";
    setActive(false);
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "inline-block select-none transition-[background-position] duration-150 ease-linear",
        active ? "gold-text" : "text-[#d4af37]",
        className
      )}
    >
      {children}
    </span>
  );
}
