import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Tech Enthusiast",
    content:
      "Amazing quality products and lightning-fast delivery. The customer service team went above and beyond to help me choose the perfect laptop.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "Business Owner",
    content:
      "I've been shopping here for years. The product selection is unmatched and the prices are incredibly competitive. Highly recommend!",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Emma Thompson",
    role: "Creative Professional",
    content:
      "Found exactly what I needed for my home studio setup. The detailed product descriptions and reviews helped me make the right choice.",
    rating: 5,
    avatar: "ET",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their
            technology needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white/80 backdrop-blur rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <Quote className="h-4 w-4 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
