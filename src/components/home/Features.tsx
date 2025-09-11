import { Cpu, Zap, Globe2, Download } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Performance Curated",
    desc: "Hand‑picked devices benchmarked for reliability & speed.",
  },
  {
    icon: Zap,
    title: "Optimized Experience",
    desc: "Responsive UI, blazing fast Next.js edge rendering.",
  },
  {
    icon: Globe2,
    title: "Global Ready",
    desc: "Scalable architecture ready for multi‑region deployment.",
  },
  {
    icon: Download,
    title: "Instant Delivery",
    desc: "Digital products accessible seconds after purchase.",
  },
];

export function Features() {
  return (
    <section className="py-14 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50 to-white" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Engineered For Growth
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            Modern performance stack, security hardened & crafted with developer
            empathy.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur shadow-sm hover:shadow-xl transition-all p-6"
            >
              <div className="size-10 rounded-xl flex items-center justify-center bg-indigo-600/10 text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm tracking-wide uppercase">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
