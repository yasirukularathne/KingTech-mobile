import db from "@/db/db";
import { notFound } from "next/navigation";
import { ProductDetails } from "./_components/ProductDetails";

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const isObjectId = /^[a-f\d]{24}$/i.test(id);
  if (!isObjectId) return notFound();

  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  return <ProductDetails product={product} />;
}
