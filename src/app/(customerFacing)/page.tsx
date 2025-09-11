import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import {
  ArrowRight,
  Smartphone,
  Tv,
  Laptop,
  Headphones,
  Watch,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
      include: { _count: { select: { orders: true } } },
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { _count: { select: { orders: true } } },
  });
}, ["/", "getNewestProducts"]);

const getProductsByCategory = cache(
  (category: string) => {
    return db.product.findMany({
      where: {
        isAvailableForPurchase: true,
        category: category,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { _count: { select: { orders: true } } },
    });
  },
  ["/", "getProductsByCategory"]
);

const categories = [
  {
    name: "Phones",
    icon: Smartphone,
    color: "bg-blue-500",
    description: "Latest smartphones and accessories",
  },
  {
    name: "TVs",
    icon: Tv,
    color: "bg-purple-500",
    description: "Smart TVs and entertainment systems",
  },
  {
    name: "Laptops",
    icon: Laptop,
    color: "bg-green-500",
    description: "Powerful laptops for work and gaming",
  },
  {
    name: "Audio",
    icon: Headphones,
    color: "bg-red-500",
    description: "Headphones, speakers, and audio gear",
  },
  {
    name: "Gaming",
    icon: Camera,
    color: "bg-orange-500",
    description: "Gaming consoles and accessories",
  },
  {
    name: "Accessories",
    icon: Watch,
    color: "bg-teal-500",
    description: "Tech accessories and gadgets",
  },
];

export default async function HomePage() {
  // Enrich categories with live product counts (parallelized)
  const categoryStats = await Promise.all(
    categories.map(async (c) => {
      const count = await db.product.count({
        where: { isAvailableForPurchase: true, category: c.name },
      });
      return { ...c, count };
    })
  );
  const maxCategoryCount = Math.max(
    1,
    ...categoryStats.map((c) => c.count || 0)
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="px-4 lg:px-8 pt-2">
        <Hero />
      </div>
      {/* New Arrivals (moved up just after hero per request) */}
      <section className="pt-10 pb-8">
        <div className="container mx-auto px-4">
          <ProductGridSection
            title="New Arrivals"
            subtitle="Latest products just added to our collection"
            productsFetcher={getNewestProducts}
            viewAllHref="/products"
          />
        </div>
      </section>
      {/* Most Popular Products (moved directly after New Arrivals) */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductGridSection
            title="Most Popular"
            subtitle="Customer favorites and trending items"
            productsFetcher={getMostPopularProducts}
            viewAllHref="/products"
          />
        </div>
      </section>
      {/* Brand Showcase (moved up) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop Popular Brands
            </h2>
            <p className="text-gray-600 text-lg">
              Trusted brands, quality products
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CategorySection category="Phones" />
            <CategorySection category="Laptops" />
            <CategorySection category="TVs" />
          </div>
        </div>
      </section>
      <TrustBar />
      <Features />

      {/* Categories Grid (reduced top spacing) */}
      <section className="pt-10 pb-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-indigo-50/40 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Shop by Category
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Curated product families built around performance, creativity &
                entertainment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {categoryStats.map((c, idx) => {
                const pct = Math.round(
                  ((c.count || 0) / (maxCategoryCount || 1)) * 100
                );
                return (
                  <span
                    key={c.name + "-badge"}
                    className="group relative overflow-hidden px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-gray-200/70 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-xs font-medium tracking-wide text-gray-700"
                  >
                    {/* Decorative gradient aura */}
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), transparent 70%)",
                      }}
                    />
                    {/* Colored dot */}
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 ring-2 ring-white/60 shadow" />
                    <span className="relative capitalize">{c.name}</span>
                    <span className="relative text-gray-400">• {c.count}</span>
                    {/* Mini progress bar */}
                    <span className="relative ml-1 h-2 w-16 rounded-full bg-gray-200/70 overflow-hidden">
                      <span
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="relative text-[10px] text-gray-400 font-semibold tabular-nums">
                      {pct}%
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categoryStats.map((category) => {
              const pct = Math.round((category.count / maxCategoryCount) * 100);
              return (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name}`}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-3xl border border-gray-200/60 bg-white/70 backdrop-blur shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col p-8">
                    {/* Accent gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
                    {/* Soft radial highlight */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_70%)]" />
                    <div className="flex items-center gap-4 mb-6 relative">
                      <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg ring-4 ring-white/40">
                        <category.icon className="h-7 w-7 drop-shadow" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                          {category.count}{" "}
                          {category.count === 1 ? "Product" : "Products"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed flex-grow relative">
                      {category.description}
                    </p>
                    {/* Progress indicator */}
                    <div className="mt-6 relative">
                      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                        <span>Inventory</span>
                        <span>{pct}%</span>
                      </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700 relative">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-gray-900/5 group-hover:ring-indigo-300/40" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Call to Action */}
      <section className="bg-gray-900 text-white py-14 pb-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their
            technology needs
          </p>
          <Button
            asChild
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  subtitle?: string;
  productsFetcher: () => Promise<Product[]>;
  viewAllHref?: string;
};

function ProductGridSection({
  productsFetcher,
  title,
  subtitle,
  viewAllHref = "/products",
}: ProductGridSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
      </div>
      <div className="flex justify-center mb-8">
        <Button variant="outline" asChild>
          <Link href={viewAllHref} className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}

function CategorySection({ category }: { category: string }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
        <Button variant="outline" asChild size="sm">
          <Link href={`/products?category=${category}`} className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
            </>
          }
        >
          <CategoryProductSuspense category={category} />
        </Suspense>
      </div>
    </div>
  );
}

async function CategoryProductSuspense({ category }: { category: string }) {
  const products = await getProductsByCategory(category);

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">
          No {category.toLowerCase()} available yet
        </p>
      </div>
    );
  }

  return products
    .slice(0, 1)
    .map((product) => <ProductCard key={product.id} {...product} />);
}
