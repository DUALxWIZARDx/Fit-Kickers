import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InquiryForm from "@/components/InquiryForm";
import Disciplines from "@/components/Disciplines";
import AgeGroups from "@/components/AgeGroups";
import Coaches from "@/components/Coaches";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* Fixed Fullscreen Video Layer (Mobile GPU Accelerated & 100dvh) */}
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
        {/* Mobile-Optimized Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-zinc-950/40 to-black/80 pointer-events-none" />
      </div>

      {/* Scrollable Page Sections */}
      <div className="relative z-10 space-y-0">
        <Navbar />
        <Hero />
        <InquiryForm />
        <Disciplines />
        <AgeGroups />
        <Coaches />
        <Footer />
      </div>
    </main>
  );
}

