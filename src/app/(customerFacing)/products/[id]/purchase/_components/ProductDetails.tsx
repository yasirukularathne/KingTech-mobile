import { formatCurrency } from "@/lib/formatters";
import { Product } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <span className="text-muted-foreground">Back to</span>
        <a href="/products" className="text-primary hover:underline">
          Products
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-video relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover rounded-lg"
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription className="text-xl font-semibold text-primary">
                  {formatCurrency(product.priceInCents / 100)}
                </CardDescription>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {(product as any).category || "Electronics"}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="w-full" disabled>
                Contact for Purchase
              </Button>
              <p className="text-sm text-center text-gray-500">
                Payment functionality removed - This is a product showcase
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
