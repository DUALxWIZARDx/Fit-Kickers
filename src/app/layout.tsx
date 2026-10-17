import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fit Kickers | Elite Martial Arts & MMA Academy",
  description:
    "Master the art of combat and build unstoppable discipline. Taekwondo, Kickboxing, Self-Defense, and MMA for kids, juniors, and adults.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-zinc-950 text-zinc-100 scroll-smooth`}>
      <body className="min-h-screen bg-zinc-950 font-sans antialiased text-zinc-100 overflow-x-hidden selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
