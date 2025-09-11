"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.isAdmin) {
      router.replace("/admin");
    }
  }, [status, session, router]);

  const error = params?.get("error");
  const unauthorized = error === "AccessDenied" || error === "Callback";

  return (
    <div className="relative min-h-screen w-full flex bg-gray-950 text-white overflow-hidden">
      {/* Gradient backdrops */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/10 to-indigo-500/20 blur-3xl" />
      </div>

      {/* Left content / marketing panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-14 w-[50%] z-10">
        <div className="space-y-10 max-w-md">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold tracking-wide ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 animate-pulse" />
              Admin Access Portal
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-br from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              Control. Insight. Velocity.
            </h1>
            <p className="mt-5 text-indigo-100/80 text-lg leading-relaxed">
              Secure dashboard for managing products, orders & user analytics.
              Designed for clarity and speed.
            </p>
          </div>
          <ul className="grid gap-4 text-sm text-indigo-100/70">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400" />
              Real‑time order metrics
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-400" />
              Product performance insights
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
              Secure role‑based access
            </li>
          </ul>
        </div>
        <div className="text-xs text-indigo-200/50 tracking-wider uppercase">
          © {new Date().getFullYear()} KingTech
        </div>
      </div>

      {/* Right auth panel */}
      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-10 lg:p-16 z-10">
        <div className="absolute inset-0 rounded-none sm:rounded-3xl bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" />
        <div className="relative w-full max-w-md">
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg ring-2 ring-white/20">
                <span className="text-base font-bold">KT</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Admin Login
                </h2>
                <p className="text-sm text-indigo-200/70 mt-1">
                  Authenticate with your organization email
                </p>
              </div>
            </div>
            {unauthorized && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 text-red-300 text-sm px-4 py-3">
                You are not authorised to access the admin dashboard.
              </div>
            )}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (submitting || status === "loading") return;
              setSubmitting(true);
              await signIn("google");
              setSubmitting(false);
            }}
            className="space-y-6"
          >
            <button
              type="submit"
              disabled={submitting || status === "loading"}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 px-6 py-4 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:shadow-indigo-500/30 disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {submitting ? (
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20Zm4.87 10.75c-.06-.5-.55-.75-.95-.75h-2.17v-.75h2.17c.4 0 .9-.25.95-.75.12-.97.12-1.53 0-2.5-.06-.5-.55-.75-.95-.75h-2.17V5c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v1.25H6.75c-.4 0-.9.25-.95.75-.12.97-.12 1.53 0 2.5.06.5.55.75.95.75h2.17v.75H6.75c-.4 0-.9.25-.95.75-.12.97-.12 1.53 0 2.5.06.5.55.75.95.75h2.17V19c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1.25h2.17c.4 0 .9-.25.95-.75.12-.97.12-1.53 0-2.5Z" />
                  </svg>
                )}
                {submitting ? "Authenticating..." : "Sign in with Google"}
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
            </button>
          </form>
          <div className="mt-10 space-y-4 text-xs text-indigo-200/60">
            <p>
              Access restricted to approved administrator accounts. Activity may
              be logged.
            </p>
            <p className="font-mono tracking-tight">
              Status: <span className="text-indigo-300">{status}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
