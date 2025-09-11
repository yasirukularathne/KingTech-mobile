"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All", value: undefined },
  { label: "TVs", value: "TVs" },
  { label: "Phones", value: "Phones" },
  { label: "Laptops", value: "Laptops" },
  { label: "Gaming", value: "Gaming" },
  { label: "Audio", value: "Audio" },
  { label: "Accessories", value: "Accessories" },
  { label: "Electronics", value: "Electronics" },
];

export function CategoryNav() {
  const search = useSearchParams();
  const active = (search && search.get("category")) || undefined;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 animate-pulse" />
            Browse Categories
          </div>
          <div className="flex-1 md:ml-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-2 -mx-1 px-1">
              {categories.map((c) => {
                const isActive =
                  active === c.value || (!active && c.value === undefined);
                const href = c.value
                  ? `/products?category=${c.value}`
                  : "/products";
                return (
                  <Link
                    key={c.label}
                    href={href}
                    className={cn(
                      "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all select-none",
                      "bg-white/60 backdrop-blur ring-1 ring-gray-200/60 shadow-sm hover:shadow-md hover:bg-white",
                      isActive
                        ? "text-gray-900 ring-indigo-300/70 shadow-md bg-white after:absolute after:inset-0 after:rounded-full after:ring-2 after:ring-indigo-500/40"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {c.label}
                      {isActive && (
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-[10px] tracking-widest font-semibold text-gray-400 uppercase">
              {categories.length} Groups
            </div>
          </div>
        </div>
      </div>
      {/* divider removed */}
    </nav>
  );
}
