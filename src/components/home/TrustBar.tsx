import { ShieldCheck, Truck, Headphones, CreditCard } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Secure Warranty", desc: "Authentic products" },
  { icon: CreditCard, title: "Safe Checkout", desc: "Stripe powered" },
  { icon: Truck, title: "Fast Delivery", desc: "Instant digital" },
  { icon: Headphones, title: "24/7 Support", desc: "We’re here" },
];

export function TrustBar() {
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((i) => (
          <div
            key={i.title}
            className="group relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur shadow-sm hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-5 flex flex-col gap-2">
              <i.icon className="size-6 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">{i.title}</h3>
              <p className="text-xs text-gray-500">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
