"use client";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Laptop,
  Monitor,
  Cpu,
  Headphones,
  Camera,
  Watch,
  Tablet,
  HardDrive,
  Printer,
  Gamepad2,
  Tv,
  Database,
  BatteryCharging,
  Tag,
  type LucideIcon,
} from "lucide-react";

function resolveIcon(categoryRaw: string | null | undefined): LucideIcon {
  if (!categoryRaw) return Tag;
  const category = categoryRaw.toLowerCase();
  const map: Record<string, LucideIcon> = {
    phone: Smartphone,
    mobile: Smartphone,
    smartphone: Smartphone,
    laptop: Laptop,
    computer: Monitor,
    desktop: Monitor,
    pc: Monitor,
    monitor: Monitor,
    cpu: Cpu,
    processor: Cpu,
    audio: Headphones,
    headphone: Headphones,
    headphones: Headphones,
    earphones: Headphones,
    camera: Camera,
    watch: Watch,
    wearable: Watch,
    tablet: Tablet,
    storage: HardDrive,
    harddrive: HardDrive,
    drive: HardDrive,
    printer: Printer,
    gaming: Gamepad2,
    game: Gamepad2,
    database: Database,
    power: BatteryCharging,
    battery: BatteryCharging,
  tv: Tv,
  television: Tv,
  "smart tv": Tv,
  smarttv: Tv,
  };
  if (map[category]) return map[category];
  // fallback: try partial match
  for (const key of Object.keys(map)) {
    if (category.includes(key)) return map[key];
  }
  return Tag;
}

export function CategoryIcon({ category, className }: { category?: string; className?: string }) {
  const Icon = resolveIcon(category);
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-md border border-white/30 bg-white/25 backdrop-blur p-1.5 shadow-sm text-gray-700 dark:text-gray-200",
        className
      )}
      title={category}
      aria-label={category ? `${category} category` : "Category"}
    >
      <Icon className="h-4 w-4" />
      <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br from-white/30 to-transparent" />
    </div>
  );
}
