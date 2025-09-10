import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl shadow-xl rounded-b-3xl border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between py-6 px-8">
          <div className="flex items-center gap-3">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-4 py-2 font-bold text-lg shadow">
              Admin Panel
            </span>
          </div>
          <nav className="flex gap-8 text-base font-semibold">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/users">Customers</NavLink>
            <NavLink href="/admin/orders">Sales</NavLink>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-6">
        <div className="rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl p-8 border border-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}
