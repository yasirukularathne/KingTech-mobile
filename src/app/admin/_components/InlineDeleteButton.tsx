"use client";
import { useTransition } from "react";
import { deleteProduct } from "../_actions/products";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InlineDeleteButton({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isDisabled = disabled || pending;
  return (
    <Button
      type="button"
      size="sm"
      variant="glass"
      disabled={isDisabled}
      className={cn(
        "h-7 px-3 text-[11px] gap-1 text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white",
        isDisabled && "opacity-40 cursor-not-allowed"
      )}
      onClick={() => {
        if (isDisabled) return;
        if (!confirm("Delete this product? This cannot be undone.")) return;
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        });
      }}
      aria-label="Delete product"
    >
      <Trash2 className="h-3.5 w-3.5" /> Delete
    </Button>
  );
}
