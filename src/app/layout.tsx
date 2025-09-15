import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FooterConditional } from "@/components/FooterConditional";
import { PointerHighlight } from "@/components/PointerHighlight";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "KingTech",
  description: "All rights reserved",
  icons: {
    icon: "/KingTechLogo.png",
    shortcut: "/KingTechLogo.png",
    apple: "/KingTechLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background max-h-screen font-sans antialiased flex flex-col",
          inter.variable
        )}
      >
        <PointerHighlight />
        <div className="flex-1 flex flex-col">{children}</div>
        <FooterConditional />
        <SpeedInsights />
      </body>
    </html>
  );
}
