import { Trophy, Award, Star, Flame } from "lucide-react";

interface Coach {
  name: string;
  role: string;
  disciplines: string;
  rank: string;
  experience: string;
  bio: string;
}

const COACHES: Coach[] = [
  {
    name: "Master Jin-Woo Park",
    role: "Head Taekwondo Director",
    disciplines: "Taekwondo & Agility",
    rank: "5th Dan Black Belt (Kukkiwon)",
    experience: "18+ Years Experience",
    bio: "Former national sparring gold medalist dedicated to teaching traditional high-velocity kicking techniques, belt discipline, and tournament poise.",
  },
  {
    name: "Coach Marcus Vance",
    role: "Striking & Kickboxing Coach",
    disciplines: "Dutch Kickboxing & Boxing",
    rank: "Pro Kickboxing Champion (WAKO)",
    experience: "12+ Years Experience",
    bio: "Specializes in explosive combination striking, heavy bag power drills, cardiovascular conditioning, and competitive ring fight strategy.",
  },
  {
    name: "Coach Sarah Reyes",
    role: "Tactical Self-Defense & CQB Lead",
    disciplines: "Krav Maga & Situational Defense",
    rank: "Certified Krav Maga Expert II",
    experience: "10+ Years Experience",
    bio: "Focuses on real-world situational awareness, threat de-escalation, rapid joint control, and practical self-preservation for all age demographics.",
  },
  {
    name: "Coach Alex Cruz",
    role: "MMA & Grappling Instructor",
    disciplines: "MMA, BJJ & Wrestling",
    rank: "BJJ Black Belt & Pro MMA Fighter",
    experience: "14+ Years Experience",
    bio: "Blends collegiate wrestling takedowns, submission grappling, and cage wall mechanics into a complete modern mixed martial arts curriculum.",
  },
];

export default function Coaches() {
  return (
    <section
      id="coaches"
      className="relative bg-transparent py-20 text-white sm:py-28 scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              WORLD-CLASS COACHING
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            MEET OUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              HEAD INSTRUCTORS
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Train under certified black-belt masters, former professional fighters, and self-defense specialists dedicated to your martial arts progression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COACHES.map((coach, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-6 backdrop-blur-md hover:border-zinc-700 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 relative group shadow-lg"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600/20 to-zinc-800 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 group-hover:scale-105 transition-transform duration-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <Flame className="w-7 h-7 text-red-500" />
                </div>

                <div className="mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                    {coach.role}
                  </span>
                  <h3 className="text-xl font-black uppercase text-white mt-0.5">
                    {coach.name}
                  </h3>
                </div>

                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{coach.rank}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{coach.experience}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed pt-3 border-t border-zinc-800">
                  {coach.bio}
                </p>
              </div>

              <a
                href="#contact"
                className="mt-6 w-full min-h-[44px] py-2.5 px-3 rounded-lg bg-zinc-950 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-red-500 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Train with Coach</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
