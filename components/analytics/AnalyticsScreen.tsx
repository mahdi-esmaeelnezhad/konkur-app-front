"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatHours } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import type { StudySession } from "@/types";

export function AnalyticsScreen() {
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    api<StudySession[] | { results: StudySession[] }>("/study/sessions/")
      .then((data) => setSessions(Array.isArray(data) ? data : data.results || []))
      .catch(() => setSessions([]));
  }, []);

  const completed = sessions.filter((s) => s.status === "completed");
  const total = completed.reduce((a, s) => a + (s.active_seconds || 0), 0);
  const avg = completed.length ? Math.round(total / completed.length) : 0;

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of completed) {
      const day = (s.started_at || s.ended_at || "").slice(0, 10) || "نامشخص";
      map.set(day, (map.get(day) || 0) + (s.active_seconds || 0));
    }
    return [...map.entries()].slice(0, 7);
  }, [completed]);

  const max = Math.max(1, ...byDay.map(([, v]) => v));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">تحلیل</h1>
        <p className="text-sm text-slate-400">خلاصه عملکرد مطالعه</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-slate-400">کل زمان</p>
          <p className="mt-1 text-xl font-black">{formatHours(total)}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">میانگین جلسه</p>
          <p className="mt-1 text-xl font-black">{formatHours(avg)}</p>
        </Card>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-black">روزهای اخیر</h2>
        </div>
        {byDay.length === 0 && <p className="text-sm text-slate-400">داده‌ای نیست.</p>}
        {byDay.map(([day, seconds]) => (
          <div key={day} className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{day}</span>
              <span>{formatHours(seconds)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${(seconds / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
