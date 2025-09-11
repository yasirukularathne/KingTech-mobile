"use client";

import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
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
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

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
      desc: "Stripe powered • PCI compliant • No card data stored here.",
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

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
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
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
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
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(email, productId);

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page"
      );
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(Math.round(priceInCents / 100))}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
