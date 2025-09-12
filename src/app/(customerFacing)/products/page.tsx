import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { CategoryNav } from "@/components/CategoryNav";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import { ArrowDownWideNarrow, RefreshCcw } from "lucide-react";
import Link from "next/link";

const getProducts = cache(
  (category?: string) => {
    return db.product.findMany({
      where: {
        isAvailableForPurchase: true,
        ...(category && category !== "All" ? { category } : {}),
      },
      orderBy: { name: "asc" },
      include: { _count: { select: { orders: true } } },
    });
  },
  ["/products", "getProducts"]
);

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category || "All";
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <CategoryNav />
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(168,85,247,0.15),transparent_40%,rgba(56,189,248,0.15))] mix-blend-overlay" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-4 py-1.5 text-xs font-semibold tracking-wider text-gray-600 ring-1 ring-gray-200 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 animate-pulse" />
                Discover & Compare
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {activeCategory === "All" ? (
                  <>
                    All Premium Products
                    <span className="text-indigo-500">.</span>
                  </>
                ) : (
                  <>
                    {activeCategory} Collection
                    <span className="text-indigo-500">.</span>
                  </>
                )}
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed">
                Curated selection of top‑rated tech. Filter by category, explore
                specs, and find gear trusted by professionals & enthusiasts.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="text-xs font-semibold uppercase tracking-wider bg-white text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-full shadow border border-gray-200"
                >
                  Reset Filters
                </Link>
                <button className="text-xs font-semibold uppercase tracking-wider bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-full shadow flex items-center gap-2">
                  <ArrowDownWideNarrow className="h-3.5 w-3.5" /> Sort
                </button>
                <button className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow flex items-center gap-2">
                  <RefreshCcw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              {[
                { label: "Active Categories", value: 8 },
                { label: "Avg. Rating", value: "4.7★" },
                { label: "Top Sellers", value: "24" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm ring-1 ring-gray-200 flex flex-col gap-1"
                >
                  <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    {s.label}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="relative z-10 mt-8 md:mt-12 lg:mt-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-gray-200/70 shadow-2xl p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {activeCategory === "All"
                  ? "Browse Everything"
                  : `${activeCategory} Products`}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full ring-1 ring-gray-200 shadow-sm">
                  Secure Checkout
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full ring-1 ring-gray-200 shadow-sm">
                  Instant Delivery
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full ring-1 ring-gray-200 shadow-sm">
                  Warranty Ready
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Suspense
                fallback={
                  <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                  </>
                }
              >
                <ProductsSuspense category={searchParams.category} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Footer stats / trust bar */}
      <section className="border-t border-gray-200/70 bg-white/80 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Fast Support", desc: "Live chat & email 24/7" },
            { label: "Global Delivery", desc: "Instant digital access" },
            { label: "Secure Payments", desc: "Industry‑grade encryption" },
          ].map((f) => (
            <div key={f.label} className="space-y-1">
              <div className="text-xs font-semibold tracking-wider text-gray-900 uppercase">
                {f.label}
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

async function ProductsSuspense({ category }: { category?: string }) {
  const products = await getProducts(category);

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <h3 className="text-xl text-gray-500">
          No products found in this category
        </h3>
      </div>
    );
  }

  return products.map((product: Product & { _count: { orders: number } }) => (
    <ProductCard key={product.id} {...product} />
  ));
}
