import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl shadow-2xl mx-4 mt-8 mb-16 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
                Latest Tech
                <span className="block text-yellow-300">
                  At Your Fingertips
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                Discover the newest smartphones, laptops, TVs, and accessories
                from top brands. Quality guaranteed with fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg"
                >
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white hover:text-blue-600 shadow-lg"
                >
                  <Link href="/products?category=Phones">Latest Phones</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl transform rotate-3 blur-sm"></div>
                <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 text-black shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">Featured Deal</h3>
                  <p className="text-gray-600 mb-4">
                    Up to 30% off on selected electronics
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                    View Deals
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl shadow-xl bg-white/70 backdrop-blur-lg border-0 p-8 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find exactly what you're looking for in our carefully curated
                categories
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name}`}
                  className="block"
                >
                  <Card className="group rounded-3xl shadow-lg border-0 overflow-hidden bg-white/60 backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <CardContent className="p-0">
                      <div className="relative flex flex-col items-center justify-center p-8">
                        <div
                          className={`absolute inset-0 ${category.color} opacity-30 pointer-events-none rounded-3xl`}
                        />
                        <category.icon className="relative h-12 w-12 mb-4 text-gray-900 group-hover:scale-110 transition-transform drop-shadow-lg" />
                        <h3 className="relative text-xl font-bold text-gray-900 mb-2 tracking-wide text-center">
                          {category.name}
                        </h3>
                        <p className="relative text-gray-700/90 mb-4 text-center text-sm">
                          {category.description}
                        </p>
                        <div className="relative flex items-center justify-center text-gray-900 group-hover:translate-x-2 transition-transform">
                          <span className="font-semibold">Explore</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductGridSection
            title="New Arrivals"
            subtitle="Latest products just added to our collection"
            productsFetcher={getNewestProducts}
            viewAllHref="/products"
          />
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductGridSection
            title="Most Popular"
            subtitle="Customer favorites and trending items"
            productsFetcher={getMostPopularProducts}
            viewAllHref="/products"
          />
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-16">
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

      {/* Call to Action */}
      <section className="bg-gray-900 text-white py-16">
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
