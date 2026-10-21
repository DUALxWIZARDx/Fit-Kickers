"use client";

import { Award, ArrowRight, Shield, Zap, Swords, Flame } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pt-20">

      {/* Overlay Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Badge: ELITE MARTIAL ARTS ACADEMY */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 shadow-[0_0_20px_rgba(245,158,11,0.15)] mb-8">
          <Award className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
            ELITE MARTIAL ARTS ACADEMY
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white max-w-4xl leading-[1.08] mb-6">
          BUILD DISCIPLINE.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-amber-500">
            MASTER SELF-DEFENSE.
          </span>{" "}
          UNLEASH YOUR POTENTIAL.
        </h1>

        {/* Subhead with Taekwondo Core Pillars */}
        <p className="text-base sm:text-xl font-medium tracking-wide text-zinc-300 max-w-3xl mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 text-zinc-200">
            <Zap className="w-4 h-4 text-red-500 inline" /> Poomsae (Forms)
          </span>
          <span className="text-zinc-600 font-bold">•</span>
          <span className="inline-flex items-center gap-1.5 text-zinc-200">
            <Swords className="w-4 h-4 text-red-500 inline" /> Kyorugi (Sparring)
          </span>
          <span className="text-zinc-600 font-bold">•</span>
          <span className="inline-flex items-center gap-1.5 text-zinc-200">
            <Shield className="w-4 h-4 text-red-500 inline" /> Hosinsool (Self-Defense)
          </span>
          <span className="text-zinc-600 font-bold">•</span>
          <span className="inline-flex items-center gap-1.5 text-zinc-200">
            <Flame className="w-4 h-4 text-red-500 inline" /> Kyukpa (Board Breaking)
          </span>
        </p>

        {/* CTA Group: smooth scroll to #contact */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Primary red glow button */}
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase text-sm sm:text-base tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <span>Claim Your Free Trial</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          {/* Secondary outlined button */}
          <a
            href="#disciplines"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold uppercase text-sm sm:text-base tracking-wider border border-zinc-700/80 hover:border-zinc-500 transition-all duration-200 backdrop-blur-sm"
          >
            Explore 4 Pillars
          </a>
        </div>

        {/* Trust Stats Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">100%</span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 mt-1">Certified Coaches</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-red-500 font-mono">4</span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 mt-1">Core Pillars</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">4-65</span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 mt-1">All Age Groups</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">Free</span>
            <span className="text-xs uppercase tracking-wider text-zinc-400 mt-1">Trial Session</span>
          </div>
        </div>
      </div>
    </section>
  );
}
