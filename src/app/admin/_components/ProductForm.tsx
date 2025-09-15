"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useMemo, useState } from "react";
import { addProduct, updateProduct } from "../_actions/products";
import { CategorySelect } from "@/app/admin/_components/CategorySelect";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const errs = (error ?? {}) as Record<string, any>;
  const [priceRupees, setPriceRupees] = useState<number | undefined>(
    product?.priceInCents != null
      ? Math.round(product.priceInCents / 100)
      : undefined
  );
  const currencyPreview = formatCurrency(priceRupees || 0);
  const [fileError, setFileError] = useState<string | undefined>();
  const [imageError, setImageError] = useState<string | undefined>();
  const maxFileMB = 3;
  const maxBytes = useMemo(() => maxFileMB * 1024 * 1024, [maxFileMB]);

  return (
    <form action={action} className="space-y-10 relative">
      {/* General Info Card */}
      <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-base font-semibold tracking-wide text-gray-900">
              General Information
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Core details customers will see first. Keep it concise and
              compelling.
            </p>
          </div>
          {product && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 ring-1 ring-indigo-200">
              Editing
            </span>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. Ultra HD 4K Monitor"
              defaultValue={product?.name || ""}
              className="h-11 rounded-xl bg-white/80 border-gray-200 focus-visible:outline-none focus-visible:ring-0 hover:shadow-sm focus:shadow-md transition-shadow"
            />
            {errs.name && (
              <div className="text-xs text-red-500 font-medium">
                {errs.name}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="priceRupees"
              className="text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Price (LKR)
            </Label>
            <div className="relative">
              <Input
                type="number"
                id="priceRupees"
                required
                value={priceRupees ?? ""}
                onChange={(e) =>
                  setPriceRupees(Number(e.target.value) || undefined)
                }
                placeholder="19999"
                className="h-11 rounded-xl bg-white/80 border-gray-200 pr-28 focus-visible:outline-none focus-visible:ring-0 hover:shadow-sm focus:shadow-md transition-shadow"
              />
              {/* Hidden field posted as cents for backend compatibility */}
              <input
                type="hidden"
                name="priceInCents"
                value={priceRupees != null ? priceRupees * 100 : ""}
              />
              <span className="absolute inset-y-0 right-2 my-auto px-2 h-7 inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-white text-[11px] font-semibold tracking-wide shadow">
                {currencyPreview}
              </span>
            </div>
            {errs.priceInCents && (
              <div className="text-xs text-red-500 font-medium">
                {errs.priceInCents}
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Highlight the key value, performance metrics, materials, and unique selling points."
              defaultValue={product?.description}
              className="rounded-xl bg-white/80 border-gray-200 focus-visible:outline-none focus-visible:ring-0 hover:shadow-sm focus:shadow-md transition-shadow resize-y"
            />
            {errs.description && (
              <div className="text-xs text-red-500 font-medium">
                {errs.description}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              Category
            </Label>
            <CategorySelect
              initialValue={product?.category || "Electronics"}
              error={errs.category as string | undefined}
            />
          </div>
        </div>
      </div>

      {/* Assets Card */}
      <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-base font-semibold tracking-wide text-gray-900">
              Digital Assets
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Upload product deliverable and display imagery. High‑resolution
              images recommended.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="file"
              className="text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Product File
            </Label>
            <Input
              type="file"
              id="file"
              name="file"
              required={product == null}
              className="rounded-xl bg-white/80 border-gray-200 h-11 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white file:text-xs file:font-medium hover:file:bg-indigo-500 focus-visible:outline-none focus-visible:ring-0 hover:shadow-sm focus:shadow-md transition-shadow"
              onChange={(e) => {
                setFileError(undefined);
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > maxBytes) {
                  setFileError(`File is too large. Max ${maxFileMB}MB.`);
                  e.target.value = "";
                }
              }}
            />
            {product != null && (
              <div className="text-[11px] text-gray-500 font-medium break-all">
                {product.filePath}
              </div>
            )}
            {(fileError || errs.file) && (
              <div className="text-xs text-red-500 font-medium">
                {fileError || errs.file}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="image"
              className="text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Preview Image
            </Label>
            <Input
              type="file"
              id="image"
              name="image"
              required={product == null}
              className="rounded-xl bg-white/80 border-gray-200 h-11 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white file:text-xs file:font-medium hover:file:bg-indigo-500 focus-visible:outline-none focus-visible:ring-0 hover:shadow-sm focus:shadow-md transition-shadow"
              accept="image/*"
              onChange={(e) => {
                setImageError(undefined);
                const f = e.target.files?.[0];
                if (!f) return;
                if (!f.type.startsWith("image/")) {
                  setImageError("Please select a valid image file.");
                  e.target.value = "";
                  return;
                }
                if (f.size > maxBytes) {
                  setImageError(`Image is too large. Max ${maxFileMB}MB.`);
                  e.target.value = "";
                }
              }}
            />
            {product != null && (
              <div className="relative mt-3 w-full max-w-xs overflow-hidden rounded-xl ring-1 ring-gray-200/70 bg-white/50 backdrop-blur">
                <Image
                  src={product.imagePath}
                  height={400}
                  width={400}
                  alt="Product Image"
                  className="object-cover rounded-xl"
                />
                <span className="absolute top-2 right-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded-full">
                  Current
                </span>
              </div>
            )}
            {(imageError || errs.image) && (
              <div className="text-xs text-red-500 font-medium">
                {imageError || errs.image}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="reset"
          variant="ghost"
          className="rounded-xl bg-white/70 shadow-sm hover:shadow-md hover:bg-white/80 text-gray-700 focus-visible:outline-none focus-visible:ring-0 border-0"
        >
          Reset
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 px-6 h-11 font-semibold focus-visible:ring-0 focus-visible:outline-none"
    >
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}
