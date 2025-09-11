import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "A flawless buying flow. Fast, clean, trustworthy. Easily one of the best modern storefronts.",
    name: "Elena R.",
    role: "Product Designer",
  },
  {
    quote:
      "Instant downloads after checkout blew my mind. Performance is top‑tier.",
    name: "Marcus T.",
    role: "Indie Developer",
  },
  {
    quote: "Curation actually matters here. Every listed item feels premium.",
    name: "Sarah K.",
    role: "Creative Lead",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="max-w-xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by Professionals
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Real voices from power users adopting the new standard in digital
            tech retail.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 flex flex-col gap-4 shadow-lg"
            >
              <Quote className="size-6 text-indigo-300" />
              <blockquote className="text-sm leading-relaxed text-gray-100">
                “{t.quote}”
              </blockquote>
              <figcaption className="pt-2 text-xs text-gray-400 flex flex-col">
                <span className="font-medium text-gray-200">{t.name}</span>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
