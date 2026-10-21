"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteField,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Award,
  Zap,
  Swords,
  Shield,
  LogOut,
  Flame,
  Clock,
  UserCheck,
  TrendingUp,
  Mail,
  Phone,
  Users,
  CalendarDays,
} from "lucide-react";

interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  selectedBatch: string;
  beltEligibility: string;
  membershipDuration: string;
  totalFee: string;
  membershipStatus: string;
  beltRank: string;
  examsPassed?: number;
  progressPercentage: number;
  createdAt: string;
}

interface Announcement {
  id: string;
  title: string;
  category: string;
  description: string;
  statusTag: string;
  dateTime: string;
  venue: string;
  requirement: string;
  isPinned: boolean;
  createdAt: Timestamp | string | null;
}

type AttendanceStatus = "attended" | "missed";

interface TrainingSession {
  date: Date;
  dateKey: string;
}

interface AttendanceRemovalConfirmation {
  sessionId: string;
  sessionNumber: number;
  currentStatus: AttendanceStatus;
}

const attendanceMilestones = [
  { percentage: 25, title: "Stance & Form Clearance" },
  { percentage: 50, title: "Kyorugi Sparring Readiness" },
  { percentage: 75, title: "Belt Exam Clearance" },
  { percentage: 100, title: "Tournament Selection" },
] as const;

const getMembershipMonths = (membershipDuration: string) => {
  const duration = membershipDuration.toLowerCase();
  if (duration.includes("12") || duration.includes("year")) return 12;
  if (duration.includes("6")) return 6;
  return 3;
};

const announcementCategories = ["All", "Exams", "Tournaments", "Camps", "Notices"] as const;
type AnnouncementCategory = (typeof announcementCategories)[number];

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addCalendarMonths = (date: Date, months: number) => {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  return result;
};

const getTrainingDays = (batchName: string) => {
  const batch = batchName.toLowerCase();
  if (batch.includes("elite")) return [1, 2, 3, 4, 5, 6];
  if (batch.includes("advanced")) return [1, 2, 3, 4, 5];
  if (batch.includes("intermediate")) return [1, 2, 4, 5];
  return [1, 3, 5];
};

const getBatchCurriculum = (batchName: string) => {
  const batch = batchName.toLowerCase();
  if (batch.includes("elite")) {
    return "Competition electronic sparring, WT scoring tactics, and tournament strategy.";
  }
  if (batch.includes("advanced")) {
    return "Red to Black belt development, advanced Poomsae, and Dan preparation.";
  }
  if (batch.includes("intermediate")) {
    return "Green to Blue belt development, combination kicking, and Poomsae.";
  }
  return "White to Green belt fundamentals, stances, basic kicks, and foundational forms.";
};

const getTrainingSessions = (
  enrollmentDate: string,
  batchName: string,
  membershipMonths: number,
) => {
  const parsedStartDate = enrollmentDate ? new Date(enrollmentDate) : new Date();
  const startDate = Number.isNaN(parsedStartDate.getTime())
    ? new Date()
    : parsedStartDate;
  startDate.setHours(0, 0, 0, 0);

  const endDate = addCalendarMonths(startDate, membershipMonths);
  const trainingDays = getTrainingDays(batchName);
  const sessions: TrainingSession[] = [];

  for (const currentDate = new Date(startDate); currentDate < endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    if (trainingDays.includes(currentDate.getDay())) {
      sessions.push({
        date: new Date(currentDate),
        dateKey: getDateKey(currentDate),
      });
    }
  }

  return sessions;
};

const sampleAnnouncements: Announcement[] = [
  {
    id: "sample-exam",
    title: "Upcoming Belt Grading Exam",
    category: "Exams",
    description: "Students ready for their next belt level can register for the upcoming grading.",
    statusTag: "Registration Open",
    dateTime: "Date to be confirmed",
    venue: "Fit Kickers Academy",
    requirement: "Confirm your eligibility with your coach.",
    isPinned: true,
    createdAt: "2026-10-21T00:00:00.000Z",
  },
  {
    id: "sample-tournament",
    title: "District Taekwondo Tournament",
    category: "Tournaments",
    description: "Competition details and registration information will be shared by your coach.",
    statusTag: "Coming Soon",
    dateTime: "Date to be confirmed",
    venue: "To be announced",
    requirement: "Speak with your coach about participation.",
    isPinned: false,
    createdAt: "2026-10-20T00:00:00.000Z",
  },
  {
    id: "sample-notice",
    title: "Welcome to the Student Portal",
    category: "Notices",
    description: "Check this page regularly for academy announcements and important updates.",
    statusTag: "Notice",
    dateTime: "Ongoing",
    venue: "Fit Kickers Academy",
    requirement: "No requirements.",
    isPinned: false,
    createdAt: "2026-10-19T00:00:00.000Z",
  },
];

const createFallbackProfile = (fullName: string, email: string): StudentProfile => ({
  fullName,
  email,
  phone: "",
  selectedBatch: "Beginner Foundation",
  beltEligibility: "White to Green Stripe (10th – 7th Kup)",
  membershipDuration: "3 Months (Standard)",
  totalFee: "₹6,500",
  membershipStatus: "active",
  beltRank: "NOT GRADED YET (WHITE BELT)",
  examsPassed: 0,
  progressPercentage: 0,
  createdAt: "",
});

export default function PortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceError, setAttendanceError] = useState("");
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [attendanceRemovalConfirmation, setAttendanceRemovalConfirmation] =
    useState<AttendanceRemovalConfirmation | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(false);
  const [activeTab, setActiveTab] = useState<"updates" | "progress">("updates");
  const [announcementCategory, setAnnouncementCategory] =
    useState<AnnouncementCategory>("All");

  useEffect(() => {
    let isMounted = true;
    const announcementsQuery = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      announcementsQuery,
      (snapshot) => {
        if (!isMounted) return;
        const results = snapshot.docs.map((announcementDoc) => {
          const data = announcementDoc.data();
          const createdAt = data.createdAt;

          return {
            id: announcementDoc.id,
            title: typeof data.title === "string" ? data.title : "Untitled announcement",
            category: typeof data.category === "string" ? data.category : "Notices",
            description: typeof data.description === "string" ? data.description : "",
            statusTag: typeof data.statusTag === "string" ? data.statusTag : "",
            dateTime: typeof data.dateTime === "string" ? data.dateTime : "",
            venue: typeof data.venue === "string" ? data.venue : "",
            requirement: typeof data.requirement === "string" ? data.requirement : "",
            isPinned: data.isPinned === true,
            createdAt:
              createdAt instanceof Timestamp || typeof createdAt === "string"
                ? createdAt
                : null,
          };
        });

        setAnnouncements(results.length > 0 ? results : sampleAnnouncements);
        setAnnouncementsError(false);
        setAnnouncementsLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.error("Announcements fetch error:", error);
        setAnnouncementsError(true);
        setAnnouncementsLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.uid);

      const fallback = createFallbackProfile(
        user.displayName || user.email?.split("@")[0] || "Taekwondo Student",
        user.email || "",
      );

      try {
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (!isMounted) return;

        if (!profileSnap.exists()) {
          setProfileExists(false);
          setProfile(fallback);
          return;
        }

        setProfileExists(true);
        const data = profileSnap.data();
        const storedAttendance =
          typeof data.attendance === "object" && data.attendance !== null
            ? data.attendance as Record<string, unknown>
            : {};
        setAttendance(
          Object.fromEntries(
            Object.entries(storedAttendance).filter(
              (entry): entry is [string, AttendanceStatus] =>
                entry[1] === "attended" || entry[1] === "missed",
            ),
          ),
        );
        const createdAt = data.createdAt;
        setProfile({
          ...fallback,
          fullName: data.fullName || fallback.fullName,
          email: data.email || fallback.email,
          phone: data.phone || fallback.phone,
          selectedBatch: data.selectedBatch || fallback.selectedBatch,
          beltEligibility: data.beltEligibility || fallback.beltEligibility,
          membershipDuration: data.membershipDuration || fallback.membershipDuration,
          totalFee: data.totalFee || fallback.totalFee,
          membershipStatus: data.membershipStatus || fallback.membershipStatus,
          beltRank: data.beltRank || fallback.beltRank,
          examsPassed:
            typeof data.examsPassed === "number" && data.examsPassed > 0
              ? data.examsPassed
              : 0,
          progressPercentage:
            typeof data.progressPercentage === "number"
              ? Math.min(100, Math.max(0, data.progressPercentage))
              : fallback.progressPercentage,
          createdAt:
            typeof createdAt === "string"
              ? createdAt
              : createdAt?.toDate?.().toISOString() || fallback.createdAt,
        });
      } catch (err) {
        if (!isMounted) return;
        console.error("Profile fetch error:", err);
        setProfile(fallback);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/login");
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

  const studentName = profile?.fullName || "Taekwondo Student";
  const beltRank =
    profile?.examsPassed && profile.examsPassed > 0
      ? profile.beltRank
      : "NOT GRADED YET (WHITE BELT)";
  const batchName = profile?.selectedBatch || "Beginner Foundation";
  const membershipMonths = getMembershipMonths(profile?.membershipDuration || "");
  const batchCurriculum = getBatchCurriculum(batchName);
  const trainingSessions = getTrainingSessions(
    profile?.createdAt || "",
    batchName,
    membershipMonths,
  );
  const milestones = attendanceMilestones.map((milestone) => ({
    ...milestone,
    sessionNumber: Math.ceil((trainingSessions.length * milestone.percentage) / 100),
  }));
  const attendedCount = trainingSessions.filter(
    (session) => attendance[session.dateKey] === "attended",
  ).length;
  const missedCount = trainingSessions.filter(
    (session) => attendance[session.dateKey] === "missed",
  ).length;
  const totalSessions = trainingSessions.length;
  const dynamicProgressPercentage =
    totalSessions > 0
      ? Math.round((attendedCount / totalSessions) * 100)
      : 0;
  const todayDateKey = getDateKey(new Date());
  const numberedTrainingSessions = trainingSessions.map((session, index) => ({
    session,
    sessionNumber: index + 1,
  }));
  const recentAndTodaySessions = numberedTrainingSessions
    .filter(({ session }) => session.dateKey <= todayDateKey)
    .slice(-10);
  const displayedTrainingSessions = showFullSchedule
    ? numberedTrainingSessions
    : recentAndTodaySessions;
  const enrollmentDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not available";
  const totalFee = profile?.totalFee
    ? profile.totalFee.includes("₹")
      ? profile.totalFee
      : `₹${Number(profile.totalFee.replace(/[^\d.]/g, "")).toLocaleString("en-IN")}`
    : "Not available";
  const visibleAnnouncements =
    announcementCategory === "All"
      ? announcements
      : announcements.filter(
          (announcement) =>
            announcement.category.toLowerCase().replace(/s$/, "") ===
            announcementCategory.toLowerCase().replace(/s$/, ""),
        );

  const formatAnnouncementDate = (announcement: Announcement) => {
    if (announcement.dateTime) return announcement.dateTime;
    if (announcement.createdAt instanceof Timestamp) {
      return announcement.createdAt.toDate().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    if (typeof announcement.createdAt === "string") {
      const date = new Date(announcement.createdAt);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
      }
    }
    return "Date to be announced";
  };

  const saveAttendanceStatus = async (
    dateKey: string,
    status: AttendanceStatus | null,
  ) => {
    if (!userId) return;

    const previousStatus = attendance[dateKey];
    setAttendance((currentAttendance) => {
      const nextAttendance = { ...currentAttendance };
      if (status) nextAttendance[dateKey] = status;
      else delete nextAttendance[dateKey];
      return nextAttendance;
    });
    setAttendanceError("");
    setAttendanceSaving(true);

    try {
      const profileRef = doc(db, "profiles", userId);
      if (profileExists) {
        await updateDoc(
          profileRef,
          status
            ? { [`attendance.${dateKey}`]: status }
            : { [`attendance.${dateKey}`]: deleteField() },
        );
      } else {
        await setDoc(profileRef, {
          fullName: profile?.fullName || "Taekwondo Student",
          email: profile?.email || "",
          phone: profile?.phone || "",
          selectedBatch: profile?.selectedBatch || "Beginner Foundation",
          beltEligibility: profile?.beltEligibility || "",
          membershipDuration: profile?.membershipDuration || "",
          totalFee: profile?.totalFee || "",
          membershipStatus: profile?.membershipStatus || "active",
          beltRank: profile?.beltRank || "NOT GRADED YET (WHITE BELT)",
          examsPassed: profile?.examsPassed || 0,
          progressPercentage: profile?.progressPercentage || 0,
          createdAt: profile?.createdAt || new Date().toISOString(),
          attendance: status ? { ...attendance, [dateKey]: status } : attendance,
        });
        setProfileExists(true);
      }
      return true;
    } catch (error) {
      console.error("Attendance update error:", error);
      setAttendance((currentAttendance) => {
        const currentStatus = currentAttendance[dateKey];
        if (currentStatus !== (status || undefined)) return currentAttendance;
        const nextAttendance = { ...currentAttendance };
        if (previousStatus) nextAttendance[dateKey] = previousStatus;
        else delete nextAttendance[dateKey];
        return nextAttendance;
      });
      setAttendanceError("Attendance could not be saved. Please try again.");
      return false;
    } finally {
      setAttendanceSaving(false);
    }
  };

  const toggleAttendance = (
    sessionId: string,
    sessionNumber: number,
    targetStatus: AttendanceStatus,
  ) => {
    const currentStatus = attendance[sessionId];
    if (currentStatus === targetStatus) {
      setAttendanceRemovalConfirmation({
        sessionId,
        sessionNumber,
        currentStatus,
      });
      return;
    }
    void saveAttendanceStatus(sessionId, targetStatus);
  };

  const confirmAttendanceRemoval = async () => {
    if (!attendanceRemovalConfirmation) return;
    const saved = await saveAttendanceStatus(
      attendanceRemovalConfirmation.sessionId,
      null,
    );
    if (saved) setAttendanceRemovalConfirmation(null);
  };

  const formatSessionDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-2 sm:gap-2 sm:px-3">
                <Award className="h-4 w-4 text-red-500" />
                <span className="text-[9px] font-bold uppercase tracking-wide text-zinc-300 sm:text-[11px] sm:tracking-wider">
                  <span className="sm:hidden">WT Kup-Dan</span>
                  <span className="hidden sm:inline">WT Kup-Dan Tracker</span>
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
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-3 backdrop-blur-md">
            <nav aria-label="Student portal sections" className="flex gap-2 lg:flex-col">
              <button
                type="button"
                aria-pressed={activeTab === "updates"}
                onClick={() => setActiveTab("updates")}
                className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-black tracking-wide transition-colors lg:flex-none ${
                  activeTab === "updates"
                    ? "border-red-500/60 bg-red-600/20 text-red-300"
                    : "border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-white"
                }`}
              >
                📰 UPDATES
              </button>
              <button
                type="button"
                aria-pressed={activeTab === "progress"}
                onClick={() => setActiveTab("progress")}
                className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-black tracking-wide transition-colors lg:flex-none ${
                  activeTab === "progress"
                    ? "border-red-500/60 bg-red-600/20 text-red-300"
                    : "border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-white"
                }`}
              >
                📊 PROGRESS
              </button>
            </nav>
            <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <Award className="h-4 w-4 text-amber-500" />
                Current Belt Rank
              </div>
              <p className="mt-2 text-xs font-black uppercase leading-relaxed text-amber-300">
                {beltRank}
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-8">
        {/* Athlete Profile Header Card */}
        {activeTab === "progress" && (
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
                <span className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-zinc-300">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-red-400" />{profile?.email || "Email not provided"}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-red-400" />{profile?.phone || "Phone not provided"}</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-red-400" />{batchName}</span>
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">
                    CURRENT BELT RANK
                  </span>
                  <span className="text-sm font-black text-amber-400 uppercase tracking-wide">
                    {beltRank}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
        )}

        {/* Academy Announcements */}
        {activeTab === "updates" && (
        <section
          aria-labelledby="announcements-heading"
          className="space-y-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono">
                Stay up to date
              </span>
              <h2
                id="announcements-heading"
                className="mt-1 text-xl font-black uppercase tracking-wide text-white sm:text-2xl"
              >
                Academy Announcements
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter announcements">
              {announcementCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={announcementCategory === category}
                  onClick={() => setAnnouncementCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    announcementCategory === category
                      ? "border-red-500 bg-red-600 text-white"
                      : "border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-red-500/60 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {announcementsError ? (
            <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
              Announcements could not be loaded. Please try again later.
            </p>
          ) : announcementsLoading ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
              Loading announcements...
            </p>
          ) : visibleAnnouncements.length === 0 ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
              No announcements in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {visibleAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className={`rounded-2xl border bg-zinc-900/80 p-5 backdrop-blur-md ${
                    announcement.isPinned
                      ? "border-red-600/80 shadow-[0_0_20px_rgba(220,38,38,0.12)]"
                      : "border-zinc-800/80"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                      {announcement.category}
                    </span>
                    {announcement.statusTag && (
                      <span className="rounded-full bg-red-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                        {announcement.statusTag}
                      </span>
                    )}
                    {announcement.isPinned && (
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-400">
                        Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white">{announcement.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                    {announcement.description}
                  </p>
                  <dl className="mt-4 grid gap-3 border-t border-zinc-800 pt-4 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="font-bold uppercase tracking-wider text-zinc-500">Date &amp; Time</dt>
                      <dd className="mt-1 text-zinc-300">{formatAnnouncementDate(announcement)}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-wider text-zinc-500">Venue</dt>
                      <dd className="mt-1 text-zinc-300">{announcement.venue || "To be announced"}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-bold uppercase tracking-wider text-zinc-500">Requirement</dt>
                      <dd className="mt-1 text-zinc-300">{announcement.requirement || "No requirements listed."}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
        )}

        {/* Progress Tracker Card */}
        {activeTab === "progress" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Next Belt Grading Exam Progress
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide mt-1">
                PROGRESSION TO NEXT BELT LEVEL
              </h2>
            </div>
            <span className="text-2xl font-black text-red-500 font-mono">
              {dynamicProgressPercentage}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                style={{ width: `${dynamicProgressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>Current Belt Fundamentals</span>
              <span>Stripe Testing</span>
              <span>Next Belt Exam</span>
            </div>
          </div>

          <section aria-labelledby="attendance-heading" className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
                  <CalendarDays className="h-4 w-4" />
                  {membershipMonths}-MONTH TRAINING SCHEDULE
                </span>
                <h3
                  id="attendance-heading"
                  className="mt-1 text-lg font-black uppercase tracking-wide text-white"
                >
                  Attendance Calendar
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                {totalSessions} total · {attendedCount} attended · {missedCount} missed
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {milestones.map((milestone) => {
                const isUnlocked = attendedCount >= milestone.sessionNumber;

                return (
                  <div
                    key={milestone.sessionNumber}
                    className={`rounded-lg border p-2.5 sm:p-3 ${
                      isUnlocked
                        ? "border-amber-400/50 bg-amber-950/30"
                        : "border-zinc-800 bg-zinc-950/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="text-base leading-none">
                          {isUnlocked ? "🏅" : "🔒"}
                        </span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide ${
                          isUnlocked ? "text-amber-300" : "text-zinc-500"
                        }`}
                        >
                          {isUnlocked ? "Unlocked" : "Locked"}
                        </span>
                      </span>
                      <span className="rounded-full bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[8px] text-zinc-500">
                        {milestone.percentage}% · {milestone.sessionNumber} sessions
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-bold leading-tight text-white">
                      {milestone.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {attendanceError && (
              <p role="alert" className="rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-200">
                {attendanceError}
              </p>
            )}

            {trainingSessions.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
                No training sessions are scheduled for this enrollment period.
              </p>
            ) : (
              <>
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-expanded={showFullSchedule}
                  onClick={() => setShowFullSchedule((isShowingFullSchedule) => !isShowingFullSchedule)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-red-500/60 hover:text-white"
                >
                  {showFullSchedule ? "Show Recent & Today Only" : "View Full Schedule"}
                </button>
              </div>
              <div
                aria-label="Scheduled training sessions"
                className="max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/50 p-3"
              >
                {displayedTrainingSessions.map(({ session, sessionNumber }) => {
                  const milestone = milestones.find(
                    (item) => item.sessionNumber === sessionNumber,
                  );
                  const isFuture = session.dateKey > todayDateKey;
                  const status = attendance[session.dateKey];

                  return (
                    <div key={session.dateKey} className="space-y-2">
                      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex min-w-0 items-center gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-950/50 text-sm font-bold text-red-300">
                            {sessionNumber}
                          </span>
                          <div className="min-w-0">
                            <p className="text-base font-black text-white sm:text-lg">
                              {formatSessionDate(session.date)}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                              60-minute WT Taekwondo session
                              {isFuture && " · Upcoming"}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isFuture || !userId || attendanceSaving}
                            aria-pressed={status === "attended"}
                            onClick={() => toggleAttendance(session.dateKey, sessionNumber, "attended")}
                            className={`inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-xs font-bold tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                              status === "attended"
                                ? "border-emerald-500 bg-emerald-600 text-white"
                                : "border-emerald-800/70 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/60"
                            }`}
                          >
                            {status === "attended" ? "✓ ATTENDED" : "ATTENDED"}
                          </button>
                          <button
                            type="button"
                            disabled={isFuture || !userId || attendanceSaving}
                            aria-pressed={status === "missed"}
                            onClick={() => toggleAttendance(session.dateKey, sessionNumber, "missed")}
                            className={`inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-xs font-bold tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                              status === "missed"
                                ? "border-red-500 bg-red-600 text-white"
                                : "border-red-900/70 bg-red-950/30 text-red-300 hover:bg-red-900/60"
                            }`}
                          >
                            {status === "missed" ? "✕ MISSED" : "MISSED"}
                          </button>
                        </div>
                      </div>
                      {milestone && (
                        <div
                          className={`rounded-lg border p-2.5 sm:p-3 ${
                            attendedCount >= milestone.sessionNumber
                              ? "border-amber-400/50 bg-amber-950/30"
                              : "border-zinc-700 bg-zinc-900/60"
                          }`}
                        >
                          <p className="flex items-center gap-1.5">
                            <span aria-hidden="true" className="text-base leading-none">
                              {attendedCount >= milestone.sessionNumber ? "🏅" : "🔒"}
                            </span>
                            <span
                              className={`rounded-full px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide ${
                                attendedCount >= milestone.sessionNumber
                                  ? "text-amber-300"
                                  : "text-zinc-500"
                              }`}
                            >
                              {attendedCount >= milestone.sessionNumber ? "Unlocked" : "Locked"}
                            </span>
                          </p>
                          <p className="mt-1 text-[11px] font-bold leading-tight text-white">
                            {milestone.percentage}% · Session {milestone.sessionNumber}: {milestone.title}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </>
            )}
          </section>

          <section aria-labelledby="session-syllabus-heading" className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                Tailored for {batchName}
              </span>
              <h3
                id="session-syllabus-heading"
                className="mt-1 text-lg font-black uppercase tracking-wide text-white"
              >
                60-Minute Session Syllabus
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[
                { duration: "10m", label: "Warm-Up & Mobility", width: "w-1/6" },
                { duration: "15m", label: "Kicking Drills", width: "w-1/4" },
                { duration: "20m", label: batchCurriculum, width: "w-1/3" },
                { duration: "10m", label: "Martial Conditioning", width: "w-1/6" },
                { duration: "5m", label: "Cool Down & Debrief", width: "w-[8.333333%]" },
              ].map(({ duration, label, width }) => (
                <article
                  key={label}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-lg font-black text-white">{duration}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      of 60 min
                    </span>
                  </div>
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className={`h-full bg-red-500 ${width}`} />
                  </div>
                  <h4 className="text-xs leading-relaxed text-zinc-300 sm:text-sm">{label}</h4>
                </article>
              ))}
            </div>
          </section>

          {/* 4 Pillars Evaluation Grid */}
          <section aria-labelledby="curriculum-heading" className="space-y-4 pt-2">
            <h3
              id="curriculum-heading"
              className="text-sm font-black uppercase tracking-widest text-white"
            >
              Curriculum Checklist
            </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-red-500" /> Poomsae Forms (Taegeuk)
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
                  <Swords className="w-4 h-4 text-red-500" /> Kyorugi Sparring Drills
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
                  <Shield className="w-4 h-4 text-red-500" /> Hosinsool Self-Defense
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
                  <Flame className="w-4 h-4 text-red-500" /> Attendance Record
                </span>
                <span className="text-emerald-400 font-mono">Tracked</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Your class participation is reviewed as part of grading readiness.
              </p>
            </div>
          </div>
          </section>
        </div>
        )}

        {/* Membership & Subscription Summary */}
        {activeTab === "progress" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black uppercase text-white tracking-wider">
                Membership &amp; Subscription
              </h3>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${profile?.membershipStatus === "active" ? "bg-emerald-950 text-emerald-400" : "bg-zinc-800 text-zinc-300"}`}>
              {profile?.membershipStatus || "Active"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-b border-zinc-800 py-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Selected Batch</span>
              <p className="mt-1 text-sm font-bold text-white">{batchName}</p>
            </div>
            <div className="border-b border-zinc-800 py-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Membership Duration</span>
              <p className="mt-1 text-sm font-bold text-white">{profile?.membershipDuration || "Not available"}</p>
            </div>
            <div className="border-b border-zinc-800 py-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Course Fee</span>
              <p className="mt-1 text-sm font-bold text-white">{totalFee}</p>
            </div>
            <div className="py-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Enrollment Date</span>
              <p className="mt-1 text-sm font-bold text-white">{enrollmentDate}</p>
            </div>
            <div className="py-4 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Upcoming WT Kup Grading Exam</span>
              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-red-300">
                <Award className="h-4 w-4 shrink-0" /> Exam date to be confirmed by your coach
              </p>
            </div>
          </div>
        </div>
        )}
          </div>
        </div>
      </main>
      {attendanceRemovalConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-session-heading"
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
          >
            <h2
              id="remove-session-heading"
              className="text-lg font-black uppercase tracking-wide text-white"
            >
              ⚠️ REMOVE SESSION LOG?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Are you sure you want to remove the{" "}
              {attendanceRemovalConfirmation.currentStatus} status for Session #
              {attendanceRemovalConfirmation.sessionNumber}? This will update your belt
              progress bar.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={attendanceSaving}
                onClick={() => setAttendanceRemovalConfirmation(null)}
                className="rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-bold tracking-wider text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={attendanceSaving}
                onClick={confirmAttendanceRemoval}
                className="rounded-xl border border-red-500/50 bg-red-600 px-4 py-2.5 text-xs font-bold tracking-wider text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {attendanceSaving ? "REMOVING..." : "YES, REMOVE"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
