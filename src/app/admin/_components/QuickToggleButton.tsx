"use client";
import { useTransition } from "react";
import { toggleProductAvailability } from "../_actions/products";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickToggleButton({
  id,
  isAvailable,
}: {
  id: string;
  isAvailable: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button
      type="button"
      size="sm"
      variant={isAvailable ? "success" : "inactive"}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailable);
          router.refresh();
        });
      }}
      className="h-8 px-3 text-xs gap-1"
      aria-label={isAvailable ? "Deactivate product" : "Activate product"}
    >
      {isAvailable ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {isAvailable ? "Active" : "Inactive"}
    </Button>
  );
}
