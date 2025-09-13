import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import db from "@/db/db";
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  PackagePlus,
  ArrowUpDown,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
// Dropdown product actions removed (three-dots menu eliminated)
import { GlassStatusToggle } from "./_components/GlassStatusToggle";
import { CategoryIcon } from "./_components/CategoryIcon";
import { InlineDeleteButton } from "./_components/InlineDeleteButton";
import { Suspense } from "react";
// Dropdown menu components no longer needed after removal of three-dots menu

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  const adminEmails = ["yasirukularathne1234@gmail.com"];
  const email = session?.user?.email ?? "";
  if (!session || !email || !adminEmails.includes(email)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <PageHeader>Products</PageHeader>
            <p className="text-sm text-gray-500">
              Manage your catalog, availability and pricing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="glass" className="gap-2">
              <Link href="/admin/products/new">
                <span className="inline-flex items-center justify-center rounded-md p-1.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-sm">
                  <PackagePlus className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-semibold">
                  New Product
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <Toolbar />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Suspense
            fallback={
              <p className="text-sm text-gray-400">Loading products...</p>
            }
          >
            <ProductsGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProductsGrid() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  if (products.length === 0)
    return (
      <p className="text-sm text-gray-500 col-span-full">No products found</p>
    );
  return (
    <>
      {products.map(
        (p: {
          id: string;
          name: string;
          category: string;
          priceInCents: number;
          isAvailableForPurchase: boolean;
          _count: { orders: number };
        }) => (
          <div
            key={p.id}
            className="group relative flex flex-col rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur hover:shadow-xl shadow-sm transition-all p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 pr-2">
                <CategoryIcon category={p.category} />
                <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                  {p.name}
                </h3>
              </div>
              <GlassStatusToggle
                id={p.id}
                isAvailable={p.isAvailableForPurchase}
              />
            </div>
            <div className="flex items-center gap-6 text-sm mb-4">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase text-gray-500 tracking-wide">
                  Price
                </span>
                <span className="font-semibold text-indigo-600">
                  {formatCurrency(Math.round(p.priceInCents / 100))}
                </span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-3 pt-1">
              <InlineActions product={p} />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 group-hover:ring-indigo-300/50" />
          </div>
        )
      )}
    </>
  );
}

// (Old StatusBadge removed in favor of GlassStatusToggle)

function InlineActions({
  product,
}: {
  product: {
    id: string;
    isAvailableForPurchase: boolean;
    _count?: { orders: number };
  };
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        size="sm"
        variant="glass"
        className="h-7 px-3 text-[11px]"
      >
        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
      </Button>
      <Button
        asChild
        size="sm"
        variant="glass"
        className="h-7 px-3 text-[11px] gap-1"
      >
        <a download href={`/admin/products/${product.id}/download`}>
          Download
        </a>
      </Button>
      <InlineDeleteButton
        id={product.id}
        disabled={(product._count?.orders ?? 0) > 0}
      />
    </div>
  );
}

function Toolbar() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search products"
            className="w-full pl-9 pr-3 h-10 rounded-lg border border-gray-200 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
          />
        </div>
        <Button variant="glass" size="sm" className="gap-1">
          <Filter className="h-4 w-4" /> Filters
        </Button>
        <Button variant="glass" size="sm" className="gap-1">
          <ArrowUpDown className="h-4 w-4" /> Sort
        </Button>
      </div>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-500">
        <span className="hidden md:inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500" /> Active
        </span>
        <span className="hidden md:inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-800" /> Inactive
        </span>
      </div>
    </div>
  );
}
