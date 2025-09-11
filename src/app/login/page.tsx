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
  const unauthorized = error === "AccessDenied" || error === "Callback"; // AccessDenied from signIn false

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {unauthorized && (
          <div className="mb-4 text-sm text-red-600 font-medium text-center">
            You are not authorised to access the admin dashboard.
          </div>
        )}
        <button
          disabled={submitting || status === "loading"}
          className="w-full py-2 px-4 bg-blue-600 disabled:opacity-60 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          onClick={async () => {
            setSubmitting(true);
            await signIn("google");
            setSubmitting(false);
          }}
        >
          {submitting ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
