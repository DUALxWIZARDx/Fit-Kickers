"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const NewsSection = dynamic(() => import("@/components/NewsSection"));
const InquiryForm = dynamic(() => import("@/components/InquiryForm"));
const Disciplines = dynamic(() => import("@/components/Disciplines"));
const AgeGroups = dynamic(() => import("@/components/AgeGroups"));
const Coaches = dynamic(() => import("@/components/Coaches"));

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-zinc-950 text-white">
      {/* Shared fixed background for the complete landing page */}
      <div className="fixed inset-0 w-full h-[100dvh] pointer-events-none z-0 overflow-hidden transform-gpu">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-75 contrast-110 brightness-105 pointer-events-none"
          src="/videos/hero-bg.mp4"
        />
        <div className="absolute inset-0 bg-black/75 pointer-events-none" />
      </div>

      {/* Scrollable Page Sections */}
      <div className="relative z-10 space-y-0">
        <Navbar />
        <Hero />
        <NewsSection />
        <InquiryForm />
        <Disciplines />
        <AgeGroups />
        <Coaches />
        <Footer />
      </div>
    </main>
  );
}
