"use client";

import { useCallback, useEffect, useState } from "react";
import { Pause, Play, Square, Timer } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { formatMinutes } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { StudySession } from "@/types";

export function StudyScreen() {
  const [live, setLive] = useState<StudySession | null>(null);
  const [history, setHistory] = useState<StudySession[]>([]);
  const [localExtra, setLocalExtra] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await api<StudySession[] | { results: StudySession[] }>("/study/sessions/");
    const list = Array.isArray(data) ? data : data.results || [];
    setHistory(list);
    const current = list.find((s) => s.status === "active" || s.status === "paused") || null;
    setLive(current);
    setLocalExtra(0);
  }, []);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  useEffect(() => {
    if (!live || live.status !== "active") return;
    const id = window.setInterval(() => setLocalExtra((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const displaySeconds = (live?.active_seconds || 0) + (live?.status === "active" ? localExtra : 0);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "خطا در عملیات جلسه");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">مطالعه</h1>
        <p className="text-sm text-slate-400">تایمر تمرکز و ثبت جلسه</p>
      </div>

      <Card className="space-y-4 bg-gradient-to-b from-slate-900 to-slate-950 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
          <Timer className="h-7 w-7" />
        </div>
        <p className="font-mono text-5xl font-black tracking-tight text-white">
          {formatMinutes(displaySeconds)}
        </p>
        <p className="text-xs font-bold text-slate-400">
          {live ? (live.status === "active" ? "در حال مطالعه" : "متوقف") : "آماده شروع"}
        </p>
        {error && <p className="text-xs font-bold text-rose-400">{error}</p>}

        <div className="flex gap-2">
          {!live && (
            <Button
              className="flex-1"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api("/study/sessions/start/", {
                    method: "POST",
                    body: JSON.stringify({}),
                  });
                })
              }
            >
              <Play className="h-4 w-4" /> شروع
            </Button>
          )}
          {live?.status === "active" && (
            <Button
              className="flex-1"
              variant="soft"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/study/sessions/${live.id}/pause/`, {
                    method: "POST",
                    body: "{}",
                  });
                })
              }
            >
              <Pause className="h-4 w-4" /> توقف
            </Button>
          )}
          {live?.status === "paused" && (
            <Button
              className="flex-1"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/study/sessions/${live.id}/resume/`, {
                    method: "POST",
                    body: "{}",
                  });
                })
              }
            >
              <Play className="h-4 w-4" /> ادامه
            </Button>
          )}
          {live && (
            <Button
              className="flex-1"
              variant="danger"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/study/sessions/${live.id}/complete/`, {
                    method: "POST",
                    body: "{}",
                  });
                })
              }
            >
              <Square className="h-4 w-4" /> پایان
            </Button>
          )}
        </div>
      </Card>

      <section className="space-y-2">
        <h2 className="text-sm font-black">تاریخچه</h2>
        {history
          .filter((s) => s.status === "completed")
          .slice(0, 8)
          .map((s) => (
            <Card key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold">{s.title || s.activity_type || "جلسه مطالعه"}</p>
                <p className="text-[11px] text-slate-400">{s.started_at?.slice(0, 16) || "—"}</p>
              </div>
              <span className="text-sm font-black text-indigo-300">
                {formatMinutes(s.active_seconds || 0)}
              </span>
            </Card>
          ))}
      </section>
    </div>
  );
}
