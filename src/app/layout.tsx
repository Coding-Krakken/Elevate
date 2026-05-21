import type { Metadata } from "next";
import { Inter, Orbitron, Satisfy, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["800", "900"],
});

export const metadata: Metadata = {
  title: "Syracuse Exoticz | Premium Dispensary",
  description: "Premium futuristic cannabis ecommerce demo homepage.",
  icons: {
    icon: "/file.svg",
    shortcut: "/file.svg",
    apple: "/file.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${satisfy.variable} ${orbitron.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#050708] text-white">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteProvider>
          <div className="mx-2 my-2 min-h-[calc(100vh-1rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#05080b] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_90px_rgba(0,0,0,0.45)]">
            <TopBar />
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SiteProvider>
      </body>
    </html>
  );
}
