"use client";
import { useTransition } from "react";
import { toggleProductAvailability } from "../../_actions/products";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassStatusToggleProps {
  id: string;
  isAvailable: boolean;
}

// A glassy dual-button toggle for Active / Inactive states
export function GlassStatusToggle({ id, isAvailable }: GlassStatusToggleProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function update(next: boolean) {
    if (pending || next === isAvailable) return;
    startTransition(async () => {
      await toggleProductAvailability(id, next);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-xl border border-white/25 bg-white/15 backdrop-blur-xl shadow-sm overflow-hidden text-[11px] font-medium relative",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-white/5 before:pointer-events-none",
        pending && "opacity-60"
      )}
      aria-label="Toggle product availability"
    >
      <button
        type="button"
        onClick={() => update(true)}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 transition-colors relative",
          "hover:bg-white/30",
          isAvailable
            ? "text-emerald-600 bg-white/45 shadow-inner"
            : "text-emerald-500/60"
        )}
        aria-pressed={isAvailable}
        disabled={pending}
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Active
      </button>
      <div className="w-px h-5 bg-white/30" />
      <button
        type="button"
        onClick={() => update(false)}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 transition-colors relative",
          "hover:bg-white/30",
          !isAvailable
            ? "text-gray-800 dark:text-gray-200 bg-white/45 shadow-inner"
            : "text-gray-600 dark:text-gray-400/80"
        )}
        aria-pressed={!isAvailable}
        disabled={pending}
      >
        <XCircle className="h-3.5 w-3.5" /> Inactive
      </button>
    </div>
  );
}
