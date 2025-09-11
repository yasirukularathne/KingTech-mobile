"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterConditional() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (pathname === "/login" || pathname.startsWith("/admin")) return null;
  return <Footer />;
}
