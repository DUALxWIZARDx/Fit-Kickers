import { Users, Shield, Zap, Trophy, CheckCircle2 } from "lucide-react";

interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  badge: string;
  tagline: string;
  description: string;
  benefits: string[];
}

const AGE_GROUPS: AgeGroup[] = [
  {
    id: "little-champions",
    name: "Little Champions",
    ageRange: "Ages 4–7",
    badge: "Foundation Program",
    tagline: "Discipline, Focus & Fun Motor Skills",
    description:
      "A high-energy, fun curriculum designed specifically to build listening skills, motor balance, and early martial arts etiquette without harsh impact.",
    benefits: [
      "Core balance, posture, and coordination games",
      "Focus, eye-contact, and attentive listening habits",
      "Early anti-bullying principles & stranger danger rules",
      "Confidence-boosting white-to-yellow belt milestones",
    ],
  },
  {
    id: "juniors",
    name: "Juniors",
    ageRange: "Ages 8–15",
    badge: "Youth & Teens",
    tagline: "Anti-Bullying, Speed & Athletic Conditioning",
    description:
      "Structured martial arts and kickboxing drills teaching verbal assertiveness, decisive self-defense, and sport sparring under strict coach supervision.",
    benefits: [
      "Practical escapes against larger bullies & situational drills",
      "Cardiovascular stamina and athletic explosive agility",
      "Emotional resilience, respect, and peer leadership",
      "Certified belt ranking system and tournament prep",
    ],
  },
  {
    id: "adults",
    name: "Adults",
    ageRange: "Ages 16+",
    badge: "Mastery & Fight Team",
    tagline: "Combat Effectiveness, High-Burn & Stress Relief",
    description:
      "Intensive striking, takedowns, and cage-tested martial arts. Ideal for working professionals seeking intense fitness or aspiring fighters.",
    benefits: [
      "Heavy calorie burn: 700–900 kcal per training session",
      "Street-proven self-defense: Krav Maga, Boxing & MMA grappling",
      "Mental decompression and warrior mindset development",
      "Custom sparring tiers from beginner to competitive fight team",
    ],
  },
];

export default function AgeGroups() {
  return (
    <section
      id="age-groups"
      className="relative py-20 sm:py-28 bg-zinc-950/40 backdrop-blur-[2px] text-white overflow-hidden scroll-mt-12"
    >
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_15px_rgba(239,68,68,0.2)] mb-4">
            <Users className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              PROGRAMS FOR ALL AGES
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            TAILORED{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              AGE GROUPS
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            From playful motor coordination for young kids to intense fight camp conditioning for adults, our age-segmented syllabus ensures safe, rapid progression.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {AGE_GROUPS.map((group) => (
            <div
              key={group.id}
              className="p-6 sm:p-7 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group relative overflow-hidden shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700 uppercase tracking-wider">
                    {group.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-md">
                    {group.ageRange}
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase text-white mb-1">
                  {group.name}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-4">
                  {group.tagline}
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  {group.description}
                </p>

                <div className="space-y-2.5 mb-6 pt-4 border-t border-zinc-800/80">
                  {group.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-zinc-950 hover:bg-red-600 text-zinc-200 hover:text-white border border-zinc-800 hover:border-red-500 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]"
              >
                <span>Enroll in {group.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
