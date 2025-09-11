"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="sticky top-2 z-50 bg-primary/70 text-primary-foreground flex items-center justify-between py-3 rounded-3xl shadow-lg mt-4 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 backdrop-blur-lg border border-white/30">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl tracking-wide">🛒 E-Shop</span>
      </div>
      <div className="flex gap-2">{children}</div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  return (
    <Link
      {...props}
      className={cn(
        "relative px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-base hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        isActive ? "bg-background text-foreground shadow-md" : "",
        "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1 after:w-2/3 after:h-0.5 after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200",
        isActive ? "after:scale-x-100" : ""
      )}
    />
  );
}
