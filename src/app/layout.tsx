import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { FooterConditional } from "@/components/FooterConditional";
import { PointerHighlight } from "@/components/PointerHighlight";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "KingTech",
  description: "Your one-stop shop for all things tech",
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
          "bg-background min-h-screen font-sans antialiased flex flex-col",
          inter.variable
        )}
      >
        <PointerHighlight />
        <div className="flex-1 flex flex-col">{children}</div>
        <FooterConditional />
      </body>
    </html>
  );
}
