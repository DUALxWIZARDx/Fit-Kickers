"use client";

import { useState } from "react";
import {
  Flame,
  Zap,
  Swords,
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  MessageSquare,
} from "lucide-react";

interface DisciplineData {
  id: string;
  name: string;
  shortTag: string;
  icon: typeof Zap;
  bullets: {
    tag: string;
    text: string;
  }[];
  batches: {
    title: string;
    days: string;
    time: string;
    badge: string;
  }[];
}

const DISCIPLINES: DisciplineData[] = [
  {
    id: "poomsae",
    name: "Poomsae (Traditional Forms)",
    shortTag: "Stances, Patterns & Belt Progression",
    icon: Zap,
    bullets: [
      {
        tag: "Traditional Stances",
        text: "Master precise balance, posture, and alignment fundamentals",
      },
      {
        tag: "Block-and-Strike Patterns",
        text: "Execute seamless defensive blocks and counter-attacks",
      },
      {
        tag: "Belt Progression",
        text: "Official Kukkiwon-recognized forms from White to Black Belt",
      },
    ],
    batches: [
      {
        title: "Morning Poomsae Precision Batch",
        days: "Mon / Wed / Fri",
        time: "6:30 AM – 7:45 AM",
        badge: "All Ranks",
      },
      {
        title: "Evening Belt Progression Batch",
        days: "Tue / Thu / Sat",
        time: "4:30 PM – 5:45 PM",
        badge: "Little Champions & Juniors",
      },
      {
        title: "Black Belt Mastery & Dan Prep",
        days: "Mon / Wed / Fri",
        time: "7:00 PM – 8:30 PM",
        badge: "Advanced & Dan Ranks",
      },
    ],
  },
  {
    id: "kyorugi",
    name: "Kyorugi (Olympic Sparring)",
    shortTag: "Fast Footwork & Electronic Scoring",
    icon: Swords,
    bullets: [
      {
        tag: "Olympic Dynamic Kicking",
        text: "High-speed roundhouse, cut kicks, and explosive spin head kicks",
      },
      {
        tag: "Tactical Footwork",
        text: "Distance management, clinches, and tactical counter-striking",
      },
      {
        tag: "Electronic Scoring Drills",
        text: "Official WT sparring rules, chest guard target accuracy, and agility",
      },
    ],
    batches: [
      {
        title: "Cadet & Junior Sparring Prep",
        days: "Tue / Thu",
        time: "5:00 PM – 6:15 PM",
        badge: "Ages 8–15",
      },
      {
        title: "Senior Elite Sparring Camp",
        days: "Mon / Wed / Fri",
        time: "6:30 PM – 8:00 PM",
        badge: "Teens & Adults",
      },
      {
        title: "Saturday Competition Sparring Clinic",
        days: "Saturday",
        time: "9:00 AM – 11:00 AM",
        badge: "Tournament Team",
      },
    ],
  },
  {
    id: "hosinsool",
    name: "Hosinsool (Taekwondo Self-Defense)",
    shortTag: "Joint Locks & Practical Defense",
    icon: Shield,
    bullets: [
      {
        tag: "Joint Locks & Escapes",
        text: "Neutralize wrist grabs, collar grabs, and choke holds effortlessly",
      },
      {
        tag: "Counter-Strikes",
        text: "Apply explosive Taekwondo elbow, knee, and open-hand strikes",
      },
      {
        tag: "Situational De-escalation",
        text: "Real-world environmental awareness and verbal boundary control",
      },
    ],
    batches: [
      {
        title: "Practical Self-Defense & Anti-Bullying",
        days: "Tue / Thu",
        time: "4:00 PM – 5:00 PM",
        badge: "Kids & Juniors",
      },
      {
        title: "Adult Tactical Defense Workshop",
        days: "Mon / Wed / Fri",
        time: "6:00 PM – 7:15 PM",
        badge: "Teens & Adults",
      },
      {
        title: "Weekend Practical Defense Clinic",
        days: "Sunday",
        time: "10:00 AM – 11:30 AM",
        badge: "Open Batch",
      },
    ],
  },
  {
    id: "kyukpa",
    name: "Kyukpa (Power & Demonstration)",
    shortTag: "Board Breaking & Aerial Tricking",
    icon: Flame,
    bullets: [
      {
        tag: "Board Breaking Techniques",
        text: "Focus kinetic energy into timber breaking using fists, palms, and feet",
      },
      {
        tag: "Aerial Tricking Kicks",
        text: "Acrobatic jump spin kicks, 540s, and demonstration choreography",
      },
      {
        tag: "Focus Power",
        text: "Build supreme mental clarity, commitment, and impact delivery",
      },
    ],
    batches: [
      {
        title: "Kyukpa Power Breaking Fundamentals",
        days: "Wed / Fri",
        time: "5:30 PM – 6:45 PM",
        badge: "Intermediate & Above",
      },
      {
        title: "Demo Team Aerial & Jump Kicks",
        days: "Saturday",
        time: "11:30 AM – 1:30 PM",
        badge: "Demonstration Squad",
      },
      {
        title: "Sunday Breaking & Power Conditioning",
        days: "Sunday",
        time: "4:00 PM – 5:30 PM",
        badge: "Teens & Adults",
      },
    ],
  },
];

export default function Disciplines() {
  const [activeId, setActiveId] = useState<string>("poomsae");

  const currentDiscipline =
    DISCIPLINES.find((d) => d.id === activeId) || DISCIPLINES[0];

  const handleInquireAvailability = (batchTitle?: string) => {
    const detail = batchTitle
      ? ` for the *${batchTitle}*`
      : "";
    const text = encodeURIComponent(
      `Hello Fit Kickers! I'd like to check current open slot availability for *${currentDiscipline.name}*${detail}. Please share details for our age group.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <section
      id="disciplines"
      className="relative py-20 sm:py-28 bg-zinc-950/40 backdrop-blur-[2px] text-white overflow-hidden"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              TRADITIONAL & OLYMPIC MASTERY
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            THE 4 PILLARS OF{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              TAEKWONDO
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Master the complete traditional and Olympic martial art of Taekwondo. Select a specialized module below to explore curriculum milestones, combat drills, and scheduled batches.
          </p>
        </div>

        {/* 1. Discipline Card Selection Styling (No dots/pulsing, clean crimson border & subtle dark highlight) */}
        <div className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {DISCIPLINES.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`w-full min-h-[58px] sm:min-h-[72px] p-4 rounded-xl text-left transition-all duration-200 border flex items-center gap-3.5 cursor-pointer ${
                    isActive
                      ? "border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                      : "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-sm sm:text-base text-white uppercase tracking-wider truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 uppercase tracking-wider truncate font-medium">
                      {item.shortTag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Crisp, High-Impact Content (3 short bullet points with bold leading tags) */}
        <div className="bg-zinc-900/85 border border-zinc-800/80 rounded-2xl p-5 sm:p-7 mb-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono">
                DISCIPLINE HIGHLIGHTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-0.5">
                {currentDiscipline.name}
              </h3>
            </div>
            <span className="text-xs text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 self-start sm:self-auto font-medium">
              3 Core Focus Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentDiscipline.bullets.map((b, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                <div className="text-xs sm:text-sm text-zinc-300 leading-snug">
                  <span className="font-black text-white uppercase tracking-wide block mb-1">
                    {b.tag}
                  </span>
                  <span>{b.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Flexible Schedule Layout (Placeholder Friendly) */}
        <div className="bg-zinc-900/85 border border-zinc-800/80 rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-500 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                  Schedule & Batches: {currentDiscipline.name}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Choose a preferred training slot or inquire for custom age group timings.
                </p>
              </div>
            </div>

            {/* Inquire CTA Button */}
            <button
              type="button"
              onClick={() => handleInquireAvailability()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] shrink-0 self-start sm:self-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Check Slot Availability</span>
            </button>
          </div>

          {/* Clean Batch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {currentDiscipline.batches.map((batch, index) => (
              <div
                key={index}
                className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-colors duration-150"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-200 truncate">
                      {batch.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700 shrink-0">
                      {batch.badge}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{batch.days}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-200">
                      <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-mono font-bold text-white">{batch.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleInquireAvailability(batch.title)}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Select Batch</span>
                  <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Helper Note */}
          <div className="flex items-start sm:items-center gap-2.5 p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-zinc-400 text-xs">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <p>
              <strong className="text-zinc-300">Note:</strong> Batch timings are customized by age group. Inquire for current open slot availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
