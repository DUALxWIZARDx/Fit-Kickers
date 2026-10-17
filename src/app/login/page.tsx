"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Award,
  Zap,
} from "lucide-react";

const BATCH_OPTIONS = [
  "Beginner Taekwondo (White to Green Belt)",
  "Advanced Taekwondo (Blue to Black Belt)",
  "Olympic Sparring & Competition Batch",
  "Poomsae & Belt Progression Batch",
];

const DURATION_OPTIONS = [
  { label: "1 Month Trial", value: "1_month" },
  { label: "3 Months (Standard)", value: "3_months" },
  { label: "6 Months (Intensive)", value: "6_months" },
  { label: "12 Months (Black Belt Track)", value: "12_months" },
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "enroll">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Enrollment form state
  const [enrollName, setEnrollName] = useState("");
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollPhone, setEnrollPhone] = useState("");
  const [enrollPassword, setEnrollPassword] = useState("");
  const [enrollBatch, setEnrollBatch] = useState(BATCH_OPTIONS[0]);
  const [enrollDuration, setEnrollDuration] = useState(DURATION_OPTIONS[1].value);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Unable to authenticate user.");
      }

      // Query student profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.warn("Profile query error:", profileError.message);
      }

      // Validate membership status if profile exists
      if (profile && profile.membership_status !== "active") {
        throw new Error(
          "Your membership is currently inactive or pending. Please contact academy staff."
        );
      }

      // If no profile record exists yet, create an active one or allow portal entry
      if (!profile) {
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: authData.user.email?.split("@")[0] || "Taekwondo Student",
          membership_status: "active",
          belt_rank: "White Belt",
          selected_batch: BATCH_OPTIONS[0],
          progress_percentage: 25,
        });
      }

      router.push("/portal");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: enrollEmail,
        password: enrollPassword,
        options: {
          data: {
            full_name: enrollName,
            phone: enrollPhone,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const user = authData.user;
      if (!user) {
        throw new Error("Enrollment registered, but user object was not returned.");
      }

      // 2. Insert into profiles table
      const { error: profileInsertError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: enrollName,
        phone: enrollPhone,
        selected_batch: enrollBatch,
        membership_duration: enrollDuration,
        membership_status: "active",
        belt_rank: "White Belt (10th Geup)",
        attendance_count: 1,
        total_classes: 24,
        progress_percentage: 15,
      });

      if (profileInsertError) {
        console.warn("Profile creation notice:", profileInsertError.message);
      }

      // 3. If session established automatically, redirect to portal
      if (authData.session) {
        router.push("/portal");
      } else {
        // If Supabase has email confirmation enabled
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: enrollEmail,
          password: enrollPassword,
        });

        if (!signInError) {
          router.push("/portal");
        } else {
          setSuccessMessage(
            "Enrollment created! Please check your email to confirm your account or sign in with your credentials."
          );
          setActiveTab("login");
          setLoginEmail(enrollEmail);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An error occurred during enrollment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 text-center mb-8">
        <Link href="/" className="inline-block group focus:outline-none select-none">
          <div className="font-black italic tracking-wider text-3xl sm:text-4xl uppercase leading-none">
            <span className="text-white group-hover:text-zinc-100 transition-colors">FIT </span>
            <span className="text-red-500 group-hover:text-red-400 transition-colors">KICKERS</span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase block mt-1">
            TAEKWONDO ACADEMY PORTAL
          </span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950/70 rounded-xl border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMessage("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "login"
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("enroll");
              setErrorMessage("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "enroll"
                ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            New Enrollment
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Form 1: Student Login */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="loginEmail"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="loginEmail"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@fitkickers.com"
                  className="w-full min-h-[46px] pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="loginPassword"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="loginPassword"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[46px] pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] mt-2 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold uppercase text-xs sm:text-sm tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.65)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Form 2: New Student Enrollment */}
        {activeTab === "enroll" && (
          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label
                htmlFor="enrollName"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="enrollName"
                  type="text"
                  required
                  value={enrollName}
                  onChange={(e) => setEnrollName(e.target.value)}
                  placeholder="Jin-Woo Park"
                  className="w-full min-h-[46px] pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="enrollEmail"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="enrollEmail"
                    type="email"
                    required
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full min-h-[46px] pl-10 pr-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="enrollPhone"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="enrollPhone"
                    type="tel"
                    required
                    value={enrollPhone}
                    onChange={(e) => setEnrollPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full min-h-[46px] pl-10 pr-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="enrollPassword"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
              >
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="enrollPassword"
                  type="password"
                  required
                  minLength={6}
                  value={enrollPassword}
                  onChange={(e) => setEnrollPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full min-h-[46px] pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="enrollBatch"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
              >
                Selected Taekwondo Batch
              </label>
              <select
                id="enrollBatch"
                value={enrollBatch}
                onChange={(e) => setEnrollBatch(e.target.value)}
                className="w-full min-h-[46px] px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500 text-xs sm:text-sm cursor-pointer"
              >
                {BATCH_OPTIONS.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="enrollDuration"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
              >
                Membership Tier
              </label>
              <select
                id="enrollDuration"
                value={enrollDuration}
                onChange={(e) => setEnrollDuration(e.target.value)}
                className="w-full min-h-[46px] px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500 text-xs sm:text-sm cursor-pointer"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] mt-2 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold uppercase text-xs sm:text-sm tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.65)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enrolling Student...</span>
                </>
              ) : (
                <>
                  <span>Complete Enrollment & Enter</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            ← Back to Fit Kickers Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
