"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Goal } from "@/types";

interface GoalType {
  id: string;
  code: string;
  name: string;
  default_unit?: string;
}

export function PlannerScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [types, setTypes] = useState<GoalType[]>([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("60");
  const [error, setError] = useState("");

  async function load() {
    const [g, t] = await Promise.all([
      api<Goal[] | { results: Goal[] }>("/study/goals/"),
      api<GoalType[] | { results: GoalType[] }>("/study/goal-types/"),
    ]);
    setGoals(Array.isArray(g) ? g : g.results || []);
    setTypes(Array.isArray(t) ? t : t.results || []);
  }

  useEffect(() => {
    void load().catch(() => undefined);
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const goalType = types[0]?.id;
      if (!goalType) {
        setError("نوع هدف در سرور تعریف نشده. seed_dev را اجرا کنید.");
        return;
      }
      await api("/study/goals/", {
        method: "POST",
        body: JSON.stringify({
          title,
          goal_type: goalType,
          target_value: target,
          current_value: 0,
          unit: types[0]?.default_unit || "minutes",
          status: "active",
          visibility: "private",
        }),
      });
      setTitle("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت هدف ناموفق بود");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">برنامه‌ریز</h1>
        <p className="text-sm text-slate-400">اهداف و برنامه مطالعه</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={onCreate}>
          <Input placeholder="عنوان هدف" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input
            type="number"
            placeholder="مقدار هدف"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" /> افزودن هدف
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {goals.map((goal) => (
          <Card key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-bold">{goal.title}</p>
              <span className="text-[10px] text-slate-400">{goal.status}</span>
            </div>
            <p className="text-xs text-slate-400">
              {goal.current_value} / {goal.target_value} {goal.unit}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(
                    100,
                    (Number(goal.current_value) / Math.max(Number(goal.target_value), 1)) * 100,
                  )}%`,
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
