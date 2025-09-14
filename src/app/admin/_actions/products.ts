"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  uploadImage,
  destroyImage,
  uploadRaw,
  destroyRaw,
} from "@/lib/cloudinary";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const fileBuf = Buffer.from(await data.file.arrayBuffer());
  const fileUpload = await uploadRaw(fileBuf, "kingtech/files", data.file.name);
  const filePath = fileUpload.url;
  const filePublicId = fileUpload.public_id;

  // Upload image to Cloudinary
  const imgBuf = Buffer.from(await data.image.arrayBuffer());
  const uploaded = await uploadImage(imgBuf, "kingtech/products");
  const imagePath = uploaded.url;
  const imagePublicId = uploaded.public_id;

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      category: data.category,
      priceInCents: data.priceInCents,
      filePath,
      // store Cloudinary public id alongside path for clean deletes
      // @ts-ignore - schema may not yet have this field; optional in Mongo
      filePublicId,
      imagePath,
      imagePublicId,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  let filePath = product.filePath;
  let filePublicId = (product as any).filePublicId as string | undefined;
  if (data.file != null && data.file.size > 0) {
    if (filePublicId) await destroyRaw(filePublicId);
    const newRaw = await uploadRaw(
      Buffer.from(await data.file.arrayBuffer()),
      "kingtech/files",
      data.file.name
    );
    filePath = newRaw.url;
    filePublicId = newRaw.public_id;
  }

  let imagePath = product.imagePath;
  let imagePublicId = (product as any).imagePublicId as string | undefined;
  if (data.image != null && data.image.size > 0) {
    if (imagePublicId) await destroyImage(imagePublicId);
    const newUpload = await uploadImage(
      Buffer.from(await data.image.arrayBuffer()),
      "kingtech/products"
    );
    imagePath = newUpload.url;
    imagePublicId = newUpload.public_id;
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      priceInCents: data.priceInCents,
      filePath,
      // @ts-ignore
      filePublicId,
      imagePath,
      imagePublicId,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });

  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const existingOrders = await db.order.findMany({
    where: { productId: id },
    select: { id: true },
  });
  if (existingOrders.length > 0) {
    throw new Error("Cannot delete a product that has existing orders.");
  }

  // Manually clean up related records (Mongo has no referential actions)
  await (db as any).downloadVerification?.deleteMany?.({
    where: { productId: id },
  });

  const product = await db.product.delete({ where: { id } });

  if (product == null) return notFound();

  // Attempt to clean up stored raw file
  if ((product as any).filePublicId) {
    await destroyRaw((product as any).filePublicId as string);
  }
  if ((product as any).imagePublicId) {
    await destroyImage((product as any).imagePublicId as string);
  }

  revalidatePath("/");
  revalidatePath("/products");
}
