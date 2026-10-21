'use client';

import Link from 'next/link';

export default function InquiryForm() {
  return (
    <section id="enrollment" className="relative bg-transparent py-16 text-white sm:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="relative mb-16 text-center">
          <div className="relative z-10">
            <span className="bg-red-950/60 text-red-500 border border-red-800/40 font-mono text-xs uppercase px-4 py-1.5 rounded-full tracking-widest inline-block mb-3">
              TAEKWONDO ACADEMY PORTAL
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase">
              BOOK YOUR <span className="text-red-600">FREE TRIAL CLASS</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
              Experience our combat training mats firsthand. Connect directly with our certified head coaches and register for your complimentary slot.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          
          {/* Left Column: Academy Info & Guarantee */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-md">
              <div className="inline-flex items-center space-x-2 text-red-500 text-xs font-mono uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>HIGH-TRUST GUARANTEE</span>
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-3">
                100% FREE FIRST CLASS • NO COMMITMENT REQUIRED
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Step onto the mat with confidence. Our WT-certified coaches provide complete loaner gear, personal onboarding, and an encouraging, high-energy environment for your introductory session.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-zinc-300">
                <div className="flex items-center space-x-2 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <span className="text-red-500 text-lg">🛡️</span>
                  <span>Olympic Mats & Safety Gear</span>
                </div>
                <div className="flex items-center space-x-2 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <span className="text-red-500 text-lg">🥋</span>
                  <span>Age-Appropriate Batches</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-md">
              <h4 className="text-sm font-mono uppercase text-zinc-400 tracking-wider">
                ACADEMY HEADQUARTERS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-300">
                <div>
                  <p className="text-xs text-zinc-500 font-mono uppercase">PHYSICAL ADDRESS</p>
                  <p className="font-medium mt-1">Fit Kickers Martial Arts Academy, Main Boulevard, City Center</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono uppercase">OPERATING HOURS</p>
                  <p className="font-medium mt-1">Mon - Sat: 6:00 AM - 9:30 PM</p>
                  <p className="text-xs text-zinc-500">Sun: Closed</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono uppercase">DIRECT CONTACT</p>
                  <p className="font-medium mt-1">+91 98765 43210</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-mono uppercase">OFFICIAL EMAIL</p>
                  <p className="font-medium mt-1">contact@fitkickers.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Catchy CTA Card Redirecting to /login */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-md transition-all hover:border-red-600/40">
            <div>
              <span className="bg-red-600/20 text-red-500 text-xs font-mono font-bold px-3 py-1 rounded-md uppercase tracking-widest inline-block mb-4 border border-red-500/30">
                BEGIN YOUR TRAINING
              </span>
              
              <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-4">
                START YOUR TAEKWONDO JOURNEY
              </h3>
              
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Step onto the mat with world-class coaches. Register today to gain instant access to structured belt progression, academy schedules, and personal student tracking.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3 text-sm text-zinc-200">
                  <span className="text-xl">🥋</span>
                  <div>
                    <span className="font-bold block text-white">100% Free Introductory Session</span>
                    <span className="text-xs text-zinc-400">Experience trial training with certified instructors.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm text-zinc-200">
                  <span className="text-xl">📊</span>
                  <div>
                    <span className="font-bold block text-white">Personalized Belt & Skill Tracker</span>
                    <span className="text-xs text-zinc-400">Track Poomsae forms, sparring logs, and grading dates in real-time.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm text-zinc-200">
                  <span className="text-xl">🏆</span>
                  <div>
                    <span className="font-bold block text-white">State & National Tournament Access</span>
                    <span className="text-xs text-zinc-400">Official registration pipeline for WT/Kup-Dan competitive events.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <Link
                href="/login"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center space-x-2 text-center uppercase tracking-wider"
              >
                <span>JOIN THE ACADEMY NOW</span>
                <span>➔</span>
              </Link>
              <p className="text-center text-xs text-zinc-500">
                Already a member? Click above to sign in to your student portal.
              </p>
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}