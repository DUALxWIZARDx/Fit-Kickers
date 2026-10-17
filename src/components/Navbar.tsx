"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShieldAlert, Calendar, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { name: "Disciplines", href: "#disciplines" },
  { name: "Age Groups", href: "#age-groups" },
  { name: "Coaches", href: "#coaches" },
  { name: "Location", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-md border-zinc-800 shadow-lg shadow-black/40"
            : "bg-zinc-950/85 backdrop-blur-md border-zinc-800/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Sporty Brand Typography (No icon block) */}
            <Link
              href="/"
              className="flex flex-col group focus:outline-none select-none"
              onClick={closeMenu}
              aria-label="Fit Kickers Academy Home"
            >
              <div className="font-black italic tracking-wider text-2xl sm:text-3xl uppercase leading-none">
                <span className="text-white group-hover:text-zinc-100 transition-colors">FIT </span>
                <span className="text-red-500 group-hover:text-red-400 transition-colors">KICKERS</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase block mt-1 hover:text-red-500 transition-colors">
                ACADEMY
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors duration-200 relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Action / CTA Desktop -> Smooth scroll to #contact */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_28px_rgba(239,68,68,0.6)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Book Free Trial
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {isOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Height Dark Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-20 z-40 bg-zinc-950/98 backdrop-blur-xl md:hidden transition-all duration-300 flex flex-col justify-between border-t border-zinc-850 ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-6 overflow-y-auto">
          {/* Mobile Drawer Brand Presentation Matching Desktop */}
          <div className="pb-4 border-b border-zinc-850">
            <div className="font-black italic tracking-wider text-2xl uppercase leading-none">
              <span className="text-white">FIT </span>
              <span className="text-red-500">KICKERS</span>
            </div>
            <span className="text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase block mt-1">
              ACADEMY
            </span>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between py-3.5 px-4 rounded-xl text-lg font-bold uppercase tracking-wider text-zinc-200 hover:text-white hover:bg-zinc-900/90 border border-transparent hover:border-zinc-800 transition-all duration-150"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-5 h-5 text-red-500/70" />
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-zinc-850">
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-500 tracking-wider mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Limited Free Slots</span>
              </div>
              <p className="text-xs text-zinc-400">
                Experience world-class Taekwondo, Kickboxing, Self-Defense & MMA classes today.
              </p>
            </div>

            <a
              href="#contact"
              onClick={closeMenu}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase text-sm tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book Free Trial
            </a>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            FIT KICKERS ACADEMY • EST. COMBAT EXCELLENCE
          </p>
        </div>
      </div>
    </>
  );
}
