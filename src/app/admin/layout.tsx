import { AdminNavbar } from "@/components/admin/AdminNavbar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 relative overflow-visible">
        {/* Blur / conceal overlay so underlying content isn't visible while scrolling */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-2xl bg-gradient-to-b from-white/90 via-white/70 to-white/30 border-b border-white/60 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
        />
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col"></div>
            </div>
          </div>
          <AdminNavbar />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-white/80 backdrop-blur-lg shadow-xl p-8 border border-gray-100/70">
          {children}
        </div>
      </main>
    </div>
  );
}
