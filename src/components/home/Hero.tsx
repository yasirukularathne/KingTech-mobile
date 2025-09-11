import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Headphones,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Advanced Background System */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" />

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000" />
      <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 px-4 py-2 mb-8 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          </div>
          <span className="text-sm font-medium text-slate-700">
            Trusted by 50k+ customers worldwide
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight">
            <span className="block text-slate-900 leading-none">
              The Future of
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-none">
              Electronics
            </span>
            <span className="block text-slate-900 leading-none">is Here</span>
          </h1>

          <p className="mx-auto max-w-3xl text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
            Experience premium technology that transforms your digital life.
            <span className="font-medium text-slate-800">
              {" "}
              Curated collection
            </span>{" "}
            of cutting-edge devices with{" "}
            <span className="font-medium text-slate-800">
              guaranteed authenticity
            </span>{" "}
            and
            <span className="font-medium text-slate-800">
              {" "}
              lifetime support
            </span>
            .
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-2xl shadow-blue-500/25 px-8 py-4 h-auto text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/products" className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Explore Collection
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="group border-2 border-slate-200 hover:border-slate-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 px-8 py-4 h-auto text-lg font-semibold rounded-2xl transition-all duration-300"
          >
            <Link
              href="#demo"
              className="flex items-center gap-3 text-slate-700"
            >
              <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Link>
          </Button>
        </div>

        {/* Social Proof & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="group p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Global Shipping
            </h3>
            <p className="text-slate-600 text-sm">
              Worldwide delivery with express options
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Lifetime Warranty
            </h3>
            <p className="text-slate-600 text-sm">
              Comprehensive protection & support
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">24/7 Support</h3>
            <p className="text-slate-600 text-sm">
              Expert help when you need it
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-md border border-white/50 shadow-2xl">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              1M+
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              Products Sold
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              50K+
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              Happy Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              99.9%
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              Uptime SLA
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              4.9★
            </div>
            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              Average Rating
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-sm font-medium">Discover More</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Bottom Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
    </section>
  );
}
