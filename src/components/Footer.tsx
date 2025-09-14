import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/footer/NewsletterForm";

const productLinks = [
  { label: "Phones", href: "/products?category=Phones" },
  { label: "Laptops", href: "/products?category=Laptops" },
  { label: "TVs", href: "/products?category=TVs" },
  { label: "Audio", href: "/products?category=Audio" },
  { label: "Gaming", href: "/products?category=Gaming" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Press", href: "#" },
];

const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "Contact", href: "#" },
];

// Removed legal links per customization request

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-10 bg-gray-950 text-gray-300">
      {/* gradient accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-gradient-to-b from-indigo-600/30 via-purple-500/20 to-transparent blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20 blur-3xl opacity-30" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/20 shadow">
                <Image
                  src="/KingTechLogo.png"
                  alt="KingTech Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                  priority
                />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                KingTech
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Premium marketplace for performance electronics & digital tech
              assets. Curated inventory, secure delivery, modern experience.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <SocialIcon href="#" label="GitHub" icon={Github} />
              <SocialIcon href="#" label="Twitter" icon={Twitter} />
              <SocialIcon href="#" label="LinkedIn" icon={Linkedin} />
              <SocialIcon
                href="mailto:support@example.com"
                label="Email"
                icon={Mail}
              />
            </div>
            <div className="pt-4">
              <NewsletterForm />
            </div>
          </div>
          <NavColumn title="Products" links={productLinks} />
          <NavColumn title="Company" links={companyLinks} />
          <NavColumn title="Support" links={supportLinks} />
          {/* Legal column removed */}
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
          <p className="text-xs text-gray-500">
            © {year} KingTech. All rights reserved.
          </p>
          {/* Removed inline legal links */}
        </div>
      </div>
    </footer>
  );
}

function NavColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold tracking-wide text-white uppercase/80">
        {title}
      </h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any;
}) {
  return (
    <Link
      aria-label={label}
      href={href}
      className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors"
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}
