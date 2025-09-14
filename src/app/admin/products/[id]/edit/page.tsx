import db from "@/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const isObjectId = /^[a-f\d]{24}$/i.test(id);
  if (!isObjectId)
    return (
      <>
        <PageHeader>Edit Product</PageHeader>
        <p className="text-sm text-gray-500">Invalid product id</p>
      </>
    );

  const product = await db.product.findUnique({ where: { id } });

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
