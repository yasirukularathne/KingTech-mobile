import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  category?: string;
  createdAt?: Date | string;
  _count?: { orders?: number };
};

export function ProductCard(props: ProductCardProps) {
  const {
    id,
    name,
    priceInCents,
    description,
    imagePath,
    category = "Electronics",
    createdAt,
    _count,
  } = props;

  const ordersCount = _count?.orders ?? 0;
  const created = createdAt ? new Date(createdAt) : undefined;
  const isNew = created
    ? Date.now() - created.getTime() < 1000 * 60 * 60 * 24 * 14
    : false; // < 14 days
  const isPopular = ordersCount >= 5; // threshold can be tuned

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur transition shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-white/10"
      )}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={imagePath}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 33vw, 25vw"
          className="object-cover"
          priority={isPopular || isNew}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-gray-900/0 to-transparent opacity-60" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="text-[11px] tracking-wide font-medium px-2 py-1 rounded-full bg-white/90 shadow-sm text-gray-700">
            {category}
          </span>
          {isPopular && (
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-500 text-white shadow-sm">
              <TrendingUp className="h-3 w-3" /> Popular
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm transition-none pointer-events-none select-none",
              isNew
                ? "bg-indigo-600 text-white"
                : "bg-white/85 text-gray-600 ring-1 ring-gray-300"
            )}
          >
            <Sparkles
              className={cn(
                "h-3 w-3",
                isNew ? "text-white" : "text-indigo-500"
              )}
            />
            New
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-white font-semibold leading-tight drop-shadow line-clamp-1">
              {name}
            </h3>
            <p className="text-amber-300 font-bold text-sm drop-shadow">
              {formatCurrency(priceInCents / 100)}
            </p>
          </div>
        </div>
      </div>
      <CardContent className="pt-4 pb-0 px-5 flex-grow flex flex-col">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>
        {ordersCount > 0 && (
          <p className="mt-3 text-[11px] uppercase tracking-wide text-gray-400 font-medium">
            {ordersCount} {ordersCount === 1 ? "Order" : "Orders"}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-4">
        <Button
          asChild
          size="sm"
          className="w-full justify-center gap-2 font-medium bg-gray-900 hover:bg-gray-800 text-white group/button"
        >
          <Link href={`/products/${id}/purchase`}>
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse rounded-2xl bg-white/60 backdrop-blur border border-gray-200/50">
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300" />
      <CardContent className="p-5 space-y-3 flex-grow">
        <div className="h-5 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <div className="h-9 w-full rounded-md bg-gray-300" />
      </CardFooter>
    </Card>
  );
}
