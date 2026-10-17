"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Sparkles,
  ShieldCheck,
  Send,
  CheckCircle,
  AlertCircle,
  Flame,
} from "lucide-react";

// Academy phone number for WhatsApp API (Indian country code format)
const ACADEMY_WHATSAPP_NUMBER = "919876543210";

const DISCIPLINES = [
  "Taekwondo",
  "Kickboxing",
  "Self-Defense",
  "MMA",
];

interface FormState {
  fullName: string;
  phone: string;
  age: string;
  locality: string;
  discipline: string;
}

export default function InquiryForm() {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    phone: "",
    age: "",
    locality: "",
    discipline: "Taekwondo",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate required fields
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.age.trim() ||
      !formData.locality.trim() ||
      !formData.discipline.trim()
    ) {
      setErrorMessage("Please fill out all required fields before submitting.");
      return;
    }

    // 2. Format phone with Indian country code (+91)
    const cleanedDigits = formData.phone.replace(/\D/g, "");
    const formattedPhone = cleanedDigits.startsWith("91") && cleanedDigits.length > 10
      ? `+${cleanedDigits}`
      : `+91 ${cleanedDigits}`;

    // 3. Construct WhatsApp Message format
    const message = [
      "Hi Fit Kickers! I would like to book a Free Trial Class.",
      `• Name: ${formData.fullName.trim()}`,
      `• Phone: ${formattedPhone}`,
      `• Age: ${formData.age.trim()}`,
      `• Locality: ${formData.locality.trim()}`,
      `• Selected Sport: ${formData.discipline}`,
    ].join("\n");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ACADEMY_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // 4. Mark submitted and open WhatsApp
    setSubmitted(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 bg-zinc-950/40 backdrop-blur-[2px] text-white overflow-hidden scroll-mt-12"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              START YOUR JOURNEY
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            BOOK YOUR FREE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              TRIAL CLASS
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Experience our combat training mats firsthand. Fill in your details below to
            directly connect with our head coaches and reserve your complimentary slot via
            WhatsApp.
          </p>
        </div>

        {/* Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Left Side: Academy details, address, hours, high-trust callout */}
          <div className="flex flex-col gap-6">
            {/* High-Trust Callout Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-red-950/40 via-zinc-900/90 to-zinc-900 border border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.15)] relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <Flame className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono">
                    HIGH-TRUST GUARANTEE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                    100% Free First Class • No Commitment Required
                  </h3>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Step onto the mat with confidence. Our world-class coaches provide complete loaner
                gear, personal onboarding, and an encouraging, high-energy environment for your
                first session.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Olympic Mats & Safety Gear</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Age-Appropriate Groups</span>
                </div>
              </div>
            </div>

            {/* Academy Contact & Address Block */}
            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900/85 border border-zinc-800/80 space-y-5 backdrop-blur-md shadow-xl">
              <h4 className="text-base font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                Academy Headquarters
              </h4>

              {/* Physical Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    Physical Address
                  </span>
                  <p className="text-sm text-zinc-200 font-semibold leading-snug mt-0.5">
                    Fit Kickers Martial Arts Academy, Main Boulevard, City Center
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    Operating Hours
                  </span>
                  <p className="text-sm text-zinc-200 font-semibold mt-0.5">
                    Mon - Sat: 6:00 AM - 9:30 PM | Sun: Closed
                  </p>
                </div>
              </div>

              {/* Direct Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-zinc-400 block">
                      Direct Contact
                    </span>
                    <a
                      href="tel:+919876543210"
                      className="text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-zinc-400 block">
                      Official Email
                    </span>
                    <a
                      href="mailto:contact@fitkickers.com"
                      className="text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors truncate block"
                    >
                      contact@fitkickers.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: The Interactive Lead Capture Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 shadow-2xl relative">
            <div className="mb-6 pb-4 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono">
                INSTANT RESERVATION
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
                Claim Your Free Trial Pass
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Submitting opens WhatsApp with your pre-filled details for instant confirmation.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted && (
              <div className="mb-5 p-3.5 rounded-xl bg-green-950/40 border border-green-500/50 flex items-center gap-2.5 text-xs text-green-300">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                <span>
                  WhatsApp opened! If the chat did not launch automatically, tap the button again.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className="w-full min-h-[48px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-colors"
                />
              </div>

              {/* Phone Number with +91 Indian Prefix Badge & Age Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center min-h-[48px] rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-colors overflow-hidden">
                    <span className="px-3.5 py-3 text-xs sm:text-sm font-bold text-red-400 bg-zinc-850/80 border-r border-zinc-800 select-none">
                      +91
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="w-full h-full px-3.5 py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                  >
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="4"
                    max="99"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 14 or 28"
                    className="w-full min-h-[48px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Locality / Area */}
              <div>
                <label
                  htmlFor="locality"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Locality / Area <span className="text-red-500">*</span>
                </label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  required
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="Downtown, Westside"
                  className="w-full min-h-[48px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-colors"
                />
              </div>

              {/* Preferred Discipline Dropdown */}
              <div>
                <label
                  htmlFor="discipline"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Preferred Discipline <span className="text-red-500">*</span>
                </label>
                <select
                  id="discipline"
                  name="discipline"
                  required
                  value={formData.discipline}
                  onChange={handleChange}
                  className="w-full min-h-[48px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-colors cursor-pointer"
                >
                  {DISCIPLINES.map((d) => (
                    <option key={d} value={d} className="bg-zinc-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs sm:text-sm tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.65)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>CLAIM FREE TRIAL VIA WHATSAPP</span>
                  <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>

              <p className="text-center text-[11px] text-zinc-500 pt-1">
                🔒 Privacy guaranteed. No spam, only direct coordinator assistance.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
