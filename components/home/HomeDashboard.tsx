"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame, Play, Target, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { formatHours } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Goal, StudySession } from "@/types";

export function HomeDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    Promise.all([
      api<StudySession[] | { results: StudySession[] }>("/study/sessions/"),
      api<Goal[] | { results: Goal[] }>("/study/goals/"),
      api<unknown>("/study/streaks/").catch(() => null),
    ]).then(([s, g, st]) => {
      setSessions(Array.isArray(s) ? s : s.results || []);
      setGoals(Array.isArray(g) ? g : g.results || []);
      if (Array.isArray(st) && st[0] && typeof st[0] === "object" && "current_streak" in st[0]) {
        setStreak(Number((st[0] as { current_streak: number }).current_streak || 0));
      } else if (st && typeof st === "object" && "current_streak" in (st as object)) {
        setStreak(Number((st as { current_streak: number }).current_streak || 0));
      }
    });
  }, []);

  const todaySeconds = sessions
    .filter((s) => s.status === "completed" || s.status === "active")
    .slice(0, 8)
    .reduce((acc, s) => acc + (s.active_seconds || 0), 0);

  return (
    <div className="space-y-4">
      <section>
        <p className="text-xs font-bold text-indigo-400">سلام 👋</p>
        <h1 className="text-2xl font-black text-white">
          {user?.profile?.display_name || user?.username}
        </h1>
        <p className="mt-1 text-sm text-slate-400">امروز را با یک جلسه متمرکز شروع کن.</p>
      </section>

      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-950/80 to-slate-900">
        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-400">زمان مطالعه اخیر</p>
            <p className="mt-1 text-3xl font-black text-white">{formatHours(todaySeconds)}</p>
          </div>
          <div className="flex items-center gap-1 rounded-2xl bg-orange-500/15 px-3 py-2 text-orange-300">
            <Flame className="h-5 w-5 animate-flame" />
            <span className="text-lg font-black">{streak}</span>
          </div>
        </div>
        <Link href="/study" className="mt-4 block">
          <Button className="w-full">
            <Play className="h-4 w-4" />
            شروع جلسه مطالعه
          </Button>
        </Link>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <Target className="mb-2 h-5 w-5 text-emerald-400" />
          <p className="text-xs text-slate-400">اهداف فعال</p>
          <p className="text-xl font-black">{goals.filter((g) => g.status === "active").length}</p>
        </Card>
        <Card>
          <TrendingUp className="mb-2 h-5 w-5 text-sky-400" />
          <p className="text-xs text-slate-400">جلسات</p>
          <p className="text-xl font-black">{sessions.length}</p>
        </Card>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black">اهداف</h2>
          <Link href="/planner" className="text-[11px] font-bold text-indigo-400">
            همه
          </Link>
        </div>
        {goals.slice(0, 3).map((goal) => {
          const progress = Math.min(
            100,
            (Number(goal.current_value) / Math.max(Number(goal.target_value), 1)) * 100,
          );
          return (
            <Card key={goal.id} className="space-y-2 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{goal.title}</p>
                <span className="text-[10px] text-slate-400">{goal.unit}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
              </div>
            </Card>
          );
        })}
        {goals.length === 0 && (
          <Card className="text-sm text-slate-400">هنوز هدفی ثبت نشده.</Card>
        )}
      </section>
    </div>
  );
}
