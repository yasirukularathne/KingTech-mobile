import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-extrabold text-gray-900 tracking-wide">
            Admin Panel
          </div>
          <nav className="flex gap-8">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/users">Customers</NavLink>
            <NavLink href="/admin/orders">Sales</NavLink>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-10 px-4">{children}</main>
    </div>
  );
}
