import Link from "next/link";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="relative bg-zinc-950/75 backdrop-blur-sm text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <span className="font-black italic tracking-wider text-2xl uppercase text-white">
                FIT <span className="text-red-500">KICKERS</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Premier traditional and Olympic Taekwondo academy. Building discipline, strength, and belt mastery across all ages.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#disciplines" className="hover:text-red-400 transition-colors">
                  4 Pillars of Taekwondo
                </a>
              </li>
              <li>
                <a href="#age-groups" className="hover:text-red-400 transition-colors">
                  Age Groups & Belt Levels
                </a>
              </li>
              <li>
                <a href="#coaches" className="hover:text-red-400 transition-colors">
                  Certified Black Belt Staff
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-red-400 transition-colors">
                  Book Free Trial
                </a>
              </li>
            </ul>
          </div>

          {/* Disciplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4 font-mono">
              Core Pillars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Poomsae (Forms & Belt Progression)</li>
              <li>Kyorugi (Olympic Sparring)</li>
              <li>Hosinsool (Taekwondo Self-Defense)</li>
              <li>Kyukpa (Board Breaking & Demonstration)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4 font-mono">
              Academy Info
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Sector 14 Combat Center, Main Avenue</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>admissions@fitkickers.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {currentYear} Fit Kickers Academy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="text-red-500 font-semibold">100% Free First Trial</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
