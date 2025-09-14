import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const isObjectId = /^[a-f\d]{24}$/i.test(id);
  if (!isObjectId) return notFound();

  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });

  if (product == null) return notFound();

  const extension = product.filePath.split(".").pop();
  const filename = `${product.name}.${extension}`;
  // Redirect the client to download directly from Cloudinary (raw resource)
  // Cloudinary serves proper headers and streaming; avoids serverless FS.
  return NextResponse.redirect(
    product.filePath + `?attname=${encodeURIComponent(filename)}`
  );
}
