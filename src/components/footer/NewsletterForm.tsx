"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus("loading");
      // Placeholder: integrate with real endpoint /api/newsletter later
      await new Promise((r) => setTimeout(r, 700));
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-md gap-2 relative">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Get product updates"
        className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
      >
        {status === "loading"
          ? "..."
          : status === "success"
          ? "Done"
          : "Subscribe"}
      </button>
      {status === "error" && (
        <span className="absolute -bottom-6 left-1 text-xs text-red-400">
          Failed. Retry.
        </span>
      )}
      {status === "success" && (
        <span className="absolute -bottom-6 left-1 text-xs text-green-400">
          Subscribed!
        </span>
      )}
    </form>
  );
}
