"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { ShieldCheck, BadgeCheck, Lock } from "lucide-react";

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
};

function AssuranceCards() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Secure Encryption",
      desc: "256-bit SSL protects your payment details end-to-end.",
    },
    {
      icon: BadgeCheck,
      title: "Genuine Warranty",
      desc: "Official product warranty & verified authenticity.",
    },
    {
      icon: Lock,
      title: "Safe Checkout",
      desc: "Secure payment processing • No card data stored here.",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="relative overflow-hidden rounded-xl border border-indigo-100/60 bg-white/70 backdrop-blur-md p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition"
        >
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-multiply" />
          <div className="relative flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 ring-1 ring-indigo-200">
              <Icon className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 tracking-tight">
              {title}
            </h4>
          </div>
          <p className="relative text-xs leading-relaxed text-gray-600 pr-1">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CheckoutForm({ product }: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg font-bold text-indigo-500">
            {formatCurrency(Math.round(product.priceInCents / 100))}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <AssuranceCards />
      <Form priceInCents={product.priceInCents} productId={product.id} />
    </div>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !name) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // Here you can implement your own payment processing logic
      // For now, we'll just simulate a purchase
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page or show success message
      alert(
        "Purchase successful! You will receive your download link via email."
      );
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Complete your purchase to get instant access to your digital
            product.
          </CardDescription>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              By completing this purchase, you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={isLoading}
            type="submit"
          >
            {isLoading
              ? "Processing..."
              : `Complete Purchase - ${formatCurrency(
                  Math.round(priceInCents / 100)
                )}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
