"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "#e2e8f0",
            padding: 24,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell",
          }}
        >
          <div style={{ maxWidth: 720, width: "100%" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ opacity: 0.85, marginBottom: 12 }}>
              A server component failed to render. We&apos;ve captured the error
              digest for debugging.
            </p>
            {error?.digest && (
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo",
                  fontSize: 12,
                  background: "#111827",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #374151",
                  overflowX: "auto",
                }}
              >
                digest: {error.digest}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <a
                href="/"
                style={{ color: "#93c5fd", textDecoration: "underline" }}
              >
                Go back home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
