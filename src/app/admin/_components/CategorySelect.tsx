"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Cpu,
  Tv,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Package,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CATEGORIES: {
  value: string;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "Electronics", label: "Electronics", icon: Cpu },
  { value: "TVs", label: "TVs", icon: Tv },
  { value: "Phones", label: "Phones", icon: Smartphone },
  { value: "Laptops", label: "Laptops", icon: Laptop },
  { value: "Gaming", label: "Gaming", icon: Gamepad2 },
  { value: "Audio", label: "Audio", icon: Headphones },
  { value: "Accessories", label: "Accessories", icon: Package },
];

export function CategorySelect({
  initialValue,
  error,
}: {
  initialValue: string;
  error?: string;
}) {
  const fallback = CATEGORIES[0].value;
  const [value, setValue] = useState(
    CATEGORIES.find((c) => c.value === initialValue)?.value || fallback
  );
  const active = CATEGORIES.find((c) => c.value === value) || CATEGORIES[0];

  return (
    <div className="space-y-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full h-11 rounded-xl px-3 text-sm flex items-center justify-between gap-3",
              "bg-white/80 border border-gray-200 shadow-sm hover:shadow-md transition-all",
              "focus-visible:outline-none focus-visible:ring-0",
              error && "ring-1 ring-red-400"
            )}
            aria-label="Select category"
          >
            <span className="flex items-center gap-2 text-gray-700">
              <active.icon className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">{active.label}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] p-1.5 rounded-xl border border-gray-200/70 bg-white/90 backdrop-blur-xl shadow-lg"
          align="start"
        >
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const selected = c.value === value;
            return (
              <DropdownMenuItem
                key={c.value}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer text-gray-700",
                  "focus:bg-indigo-50 focus:text-indigo-700",
                  selected && "bg-indigo-50 text-indigo-700 font-medium"
                )}
                onClick={() => setValue(c.value)}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{c.label}</span>
                {selected && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <input type="hidden" name="category" value={value} />
      {error && <div className="text-xs text-red-500 font-medium">{error}</div>}
    </div>
  );
}
