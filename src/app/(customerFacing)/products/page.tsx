import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { CategoryNav } from "@/components/CategoryNav";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const getProducts = cache(
  (category?: string) => {
    return db.product.findMany({
      where: {
        isAvailableForPurchase: true,
        ...(category && category !== "All" ? { category } : {}),
      },
      orderBy: { name: "asc" },
    });
  },
  ["/products", "getProducts"]
);

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return (
    <div className="space-y-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen py-10">
      <CategoryNav />
      <div className="container mx-auto px-4">
        <div className="rounded-3xl shadow-xl bg-white/70 backdrop-blur-lg border-0 p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight text-center drop-shadow-lg">
            {searchParams.category
              ? `${searchParams.category}`
              : "All Products"}
          </h1>
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

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
