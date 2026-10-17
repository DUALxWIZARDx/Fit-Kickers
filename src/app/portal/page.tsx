"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, type Profile } from "@/lib/supabase";
import {
  Award,
  Zap,
  Swords,
  Shield,
  Calendar,
  LogOut,
  Flame,
  CheckCircle,
  Clock,
  Target,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function PortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function checkAuthAndLoadProfile() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push("/login");
          return;
        }

        const user = session.user;

        // Fetch user profile from Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.warn("Profile fetch error:", error.message);
        }

        if (data) {
          if (data.membership_status !== "active") {
            router.push("/login");
            return;
          }
          setProfile(data as Profile);
        } else {
          // Provide default student profile if table record is being populated
          const defaultProfile: Profile = {
            id: user.id,
            full_name:
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "Taekwondo Student",
            phone: user.user_metadata?.phone || "",
            selected_batch: "Beginner Taekwondo (White to Green Belt)",
            membership_duration: "3_months",
            membership_status: "active",
            belt_rank: "White Belt (10th Geup)",
            attendance_count: 8,
            total_classes: 24,
            progress_percentage: 33,
          };
          setProfile(defaultProfile);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndLoadProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm uppercase tracking-widest text-zinc-400 font-mono">
          Authenticating Student Portal...
        </p>
      </div>
    );
  }

  const studentName = profile?.full_name || "Taekwondo Student";
  const beltRank = profile?.belt_rank || "White Belt (10th Geup)";
  const batchName =
    profile?.selected_batch || "Beginner Taekwondo (White to Green Belt)";
  const progressPct = profile?.progress_percentage ?? 35;
  const attendance = profile?.attendance_count ?? 6;
  const totalClasses = profile?.total_classes ?? 24;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-x-hidden">
      {/* Top Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Portal Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex flex-col group select-none">
            <div className="font-black italic tracking-wider text-xl sm:text-2xl uppercase leading-none">
              <span className="text-white">FIT </span>
              <span className="text-red-500">KICKERS</span>
            </div>
            <span className="text-[9px] font-bold tracking-[0.3em] text-zinc-400 uppercase mt-0.5">
              STUDENT PORTAL
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {studentName}
              </span>
              <span className="text-[11px] text-amber-400 font-mono font-semibold">
                {beltRank}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-red-600/20 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-500/50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        {/* Welcome Banner Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-900/80 border border-red-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/40 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider font-mono mb-3">
                <UserCheck className="w-3.5 h-3.5 text-red-400" />
                Active Student Member
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Welcome back, {studentName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                Enrolled in: <span className="text-white font-semibold">{batchName}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">
                    Current Belt Rank
                  </span>
                  <span className="text-sm font-black text-amber-400 uppercase tracking-wide">
                    {beltRank}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-red-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">
                    Attendance
                  </span>
                  <span className="text-sm font-black text-white uppercase tracking-wide">
                    {attendance} / {totalClasses} Sessions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Next Belt Grading Exam Progress
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide mt-1">
                Progression to Yellow Belt (9th Geup)
              </h2>
            </div>
            <span className="text-2xl font-black text-red-500 font-mono">
              {progressPct}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>White Belt Fundamentals</span>
              <span>Yellow Belt Stripe Testing</span>
              <span>Next Official Belt Exam</span>
            </div>
          </div>

          {/* 4 Pillars Evaluation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-red-500" /> Poomsae
                </span>
                <span className="text-emerald-400 font-mono">Passed</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Taegeuk Il Jang basic stances and low blocks verified by head master.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-red-500" /> Kyorugi
                </span>
                <span className="text-amber-400 font-mono">In Progress</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Front snap and roundhouse kicking combinations under evaluation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-500" /> Hosinsool
                </span>
                <span className="text-amber-400 font-mono">In Progress</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Single wrist grab release & breakaway counter-strike drills.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-500" /> Kyukpa
                </span>
                <span className="text-zinc-500 font-mono">Scheduled</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Introductory wooden board break planned for end-of-month review.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Training Schedule Quickview */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black uppercase text-white tracking-wider">
                Your Upcoming Training Sessions
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">DOJO SECTOR 14</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/90 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase font-mono block">
                  Monday
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Stance Precision & Taegeuk Forms
                </h4>
                <p className="text-xs text-zinc-400 mt-1">6:30 PM – 7:45 PM</p>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Booked
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/90 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase font-mono block">
                  Wednesday
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Olympic Kicking & Agility Drills
                </h4>
                <p className="text-xs text-zinc-400 mt-1">6:30 PM – 7:45 PM</p>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Booked
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/90 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase font-mono block">
                  Friday
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  Hosinsool Self-Defense & Sparring Pad Drills
                </h4>
                <p className="text-xs text-zinc-400 mt-1">6:30 PM – 7:45 PM</p>
              </div>
              <span className="text-[11px] text-amber-400 font-semibold mt-3 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Open Attendance
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
