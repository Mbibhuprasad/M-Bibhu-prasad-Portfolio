import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Bibhu Prasad Mahapatra — Full-Stack Developer",
  description:
    "Full-Stack Developer building scalable web applications, SaaS platforms, healthcare systems, business software and modern digital experiences.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fa" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set before paint by themeInitScript, so the server markup can differ — hence suppressHydrationWarning
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="grain">
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
