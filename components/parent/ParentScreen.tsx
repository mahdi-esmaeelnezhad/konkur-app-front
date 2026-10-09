"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";

interface ChildRel {
  id: string;
  child?: { id: string; username?: string };
  status: string;
}

export function ParentScreen() {
  const [children, setChildren] = useState<ChildRel[]>([]);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<ChildRel[] | { results: ChildRel[] }>("/org/parent/children/")
      .then((data) => setChildren(Array.isArray(data) ? data : data.results || []))
      .catch(() => setChildren([]));
  }, []);

  async function openSummary(childId: string) {
    setError("");
    try {
      const data = await api<Record<string, unknown>>(`/org/parent/children/${childId}/summary/`);
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(err instanceof Error ? err.message : "دسترسی ندارید");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">والدین</h1>
        <p className="text-sm text-slate-400">پیشرفت فرزندان متصل</p>
      </div>

      {children.map((c) => (
        <Card
          key={c.id}
          className="flex cursor-pointer items-center justify-between py-3"
          onClick={() => c.child?.id && void openSummary(c.child.id)}
        >
          <p className="font-bold">{c.child?.username || "فرزند"}</p>
          <span className="text-[10px] text-amber-400">{c.status}</span>
        </Card>
      ))}

      {children.length === 0 && (
        <Card className="text-sm text-slate-400">فرزندی متصل نیست.</Card>
      )}

      {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
      {summary && (
        <Card className="space-y-2 text-sm">
          <h2 className="font-black">خلاصه</h2>
          <pre className="overflow-auto rounded-2xl bg-slate-950 p-3 text-[11px] text-slate-300">
            {JSON.stringify(summary, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
