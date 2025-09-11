import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-800 text-white shadow-2xl">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(115deg,rgba(255,255,255,0.15)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.15)_100%)]" />
      {/* Fine noise texture overlays for premium tactile feel */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'0.4\'/></svg>')] bg-repeat [background-size:320px_320px]" />
      <div className="relative px-6 lg:px-12 py-20 lg:py-28 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur border border-white/20 text-indigo-100">
            <Sparkles className="size-4" />{" "}
            <span className="gradient-text-rl font-semibold">
              Next‑Gen Electronics Marketplace
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Elevate Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300">
              Tech Life
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-xl leading-relaxed">
            Curated devices, trusted brands, secure checkout, instant digital
            delivery. Built for enthusiasts & professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              asChild
              className="font-semibold bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button
              size="lg"
              asChild
              // Match primary button sizing & weight; white variant
              className="font-semibold bg-white text-black hover:bg-white/90 shadow-lg shadow-white/40 h-12 px-6 rounded-xl border border-white/70"
            >
              <Link href="/products?category=Phones">Latest Phones</Link>
            </Button>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-indigo-100/80 pt-4">
            {[
              "Genuine Stock",
              "Secure Payments",
              "Instant Downloads",
              "24/7 Support",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />{" "}
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 bg-gradient-to-tr from-yellow-300/20 via-fuchsia-400/10 to-cyan-300/20 blur-3xl" />
          <div className="relative backdrop-blur-xl rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl">
            <div className="grid gap-6">
              {[
                { label: "Avg. Delivery", value: "Instant" },
                { label: "Products Rated ★4+", value: "92%" },
                { label: "Active Customers", value: "12K+" },
                { label: "Repeat Buyers", value: "68%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-none"
                >
                  <span className="text-sm text-indigo-200">{stat.label}</span>
                  <span className="font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-sm text-indigo-200 leading-relaxed">
              Trusted by creators, developers & gamers worldwide. Performance
              hardware & premium accessories selected by experts.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
