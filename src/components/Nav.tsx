"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-4 -bottom-6 top-0 -z-10 backdrop-blur-2xl bg-white/40 [mask-image:linear-gradient(to_bottom,black,70%,transparent)]"
      />
      <nav className="flex items-center gap-4 overflow-x-auto scrollbar-none rounded-2xl bg-white/60 backdrop-blur-xl px-5 py-1.5 ring-1 ring-gray-200/60 shadow-lg relative">
        <Link
          href="/"
          className="flex items-center gap-3 pr-4 mr-2 border-r border-gray-200/60"
        >
          <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-white/60 shadow">
            <Image
              src="/KingTechLogo.png"
              alt="KingTech Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              KingTech
            </span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </nav>
    </div>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  const { children, ...rest } = props as any;
  return (
    <Link
      {...rest}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-white shadow ring-1 ring-indigo-300/60 text-gray-900"
          : "text-gray-500 hover:text-gray-900 hover:bg-white/70"
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
      )}
    </Link>
  );
}
