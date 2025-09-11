"use client";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow hover:from-red-600 hover:to-pink-600 transition"
    >
      Logout
    </button>
  );
}
