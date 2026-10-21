"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";

interface Announcement {
  id: string;
  title: string;
  category: string;
  description: string;
  statusTag: string;
  dateTime: string;
  createdAt: Timestamp | string | null;
}

export default function NewsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const announcementsQuery = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(3),
    );

    const unsubscribe = onSnapshot(
      announcementsQuery,
      (snapshot) => {
        if (!isMounted) return;
        setAnnouncements(
          snapshot.docs.map((announcementDoc) => {
            const data = announcementDoc.data();
            const createdAt = data.createdAt;

            return {
              id: announcementDoc.id,
              title: typeof data.title === "string" ? data.title : "Untitled announcement",
              category: typeof data.category === "string" ? data.category : "Notice",
              description: typeof data.description === "string" ? data.description : "",
              statusTag: typeof data.statusTag === "string" ? data.statusTag : "",
              dateTime: typeof data.dateTime === "string" ? data.dateTime : "",
              createdAt:
                createdAt instanceof Timestamp || typeof createdAt === "string"
                  ? createdAt
                  : null,
            };
          }),
        );
        setError(false);
        setLoading(false);
      },
      (fetchError) => {
        if (!isMounted) return;
        console.error("Landing page announcements fetch error:", fetchError);
        setError(true);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const formatAnnouncementDate = (announcement: Announcement) => {
    if (announcement.dateTime) return announcement.dateTime;
    if (announcement.createdAt instanceof Timestamp) {
      return announcement.createdAt.toDate().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if (typeof announcement.createdAt === "string") {
      const date = new Date(announcement.createdAt);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    }
    return "";
  };

  return (
    <section
      aria-labelledby="news-heading"
      className="relative bg-transparent py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-block rounded-full border border-red-800/40 bg-red-950/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-red-500">
              Academy Updates
            </span>
            <h2
              id="news-heading"
              className="text-3xl font-black uppercase tracking-tight sm:text-5xl"
            >
              Latest <span className="text-red-600">News</span>
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Stay informed about upcoming exams, tournaments, camps, and academy notices.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
          >
            View all updates
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {error ? (
          <p role="alert" className="rounded-2xl border border-red-500/40 bg-zinc-900/80 p-5 text-sm text-red-200">
            News updates could not be loaded. Please try again later.
          </p>
        ) : loading ? (
          <p className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 text-sm text-zinc-400 backdrop-blur-md">
            Loading the latest updates...
          </p>
        ) : announcements.length === 0 ? (
          <p className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 text-sm text-zinc-400 backdrop-blur-md">
            New academy updates will appear here soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md p-6 transition-colors hover:border-red-500/40"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    {announcement.category}
                  </span>
                  {announcement.statusTag && (
                    <span className="rounded-full bg-red-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                      {announcement.statusTag}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-white">{announcement.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-zinc-400">
                  {announcement.description}
                </p>
                {formatAnnouncementDate(announcement) && (
                  <p className="mt-5 border-t border-zinc-800 pt-4 text-xs font-medium text-zinc-500">
                    {formatAnnouncementDate(announcement)}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
