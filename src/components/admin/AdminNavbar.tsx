"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { LogoutButton } from "@/app/admin/logout-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Sales", icon: ShoppingCart },
];

export function AdminNavbar() {
  const pathname = usePathname();
  return (
    <div className="relative">
      {/* Expanded blur field beneath nav to further obscure passing content */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -bottom-6 top-0 -z-10 backdrop-blur-2xl bg-white/40 [mask-image:linear-gradient(to_bottom,black,70%,transparent)]"
      />
      <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none rounded-2xl bg-white/60 backdrop-blur-xl px-4 py-2 ring-1 ring-gray-200/60 shadow-lg relative">
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-white shadow ring-1 ring-indigo-300/60 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/70"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{l.label}</span>
              {active && (
                <span className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
              )}
            </Link>
          );
        })}
        <div className="ml-auto pl-2">
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
