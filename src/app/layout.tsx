import type { Metadata } from "next";
import type { Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fit Kickers | Taekwondo & Martial Arts Academy",
    template: "%s | Fit Kickers",
  },
  description:
    "Train in WT Taekwondo, Olympic sparring, Poomsae, self-defense, and martial arts at Fit Kickers. Programs for kids, teens, and adults.",
  applicationName: "Fit Kickers",
  keywords: [
    "Fit Kickers",
    "Taekwondo academy",
    "WT Taekwondo",
    "martial arts",
    "Kyorugi",
    "Poomsae",
    "self-defense",
    "kids martial arts",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Fit Kickers",
    title: "Fit Kickers | Taekwondo & Martial Arts Academy",
    description:
      "Train in WT Taekwondo, Olympic sparring, Poomsae, self-defense, and martial arts at Fit Kickers. Programs for kids, teens, and adults.",
  },
  twitter: {
    card: "summary",
    title: "Fit Kickers | Taekwondo & Martial Arts Academy",
    description:
      "Train in WT Taekwondo, Olympic sparring, Poomsae, self-defense, and martial arts at Fit Kickers.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.className} ${montserrat.variable} bg-zinc-950 text-zinc-100 scroll-smooth`}
    >
      <body className="min-h-screen bg-zinc-950 antialiased text-zinc-100 overflow-x-hidden selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
