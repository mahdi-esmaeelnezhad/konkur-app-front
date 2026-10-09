"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface StudentRel {
  id: string;
  student?: { id: string; username?: string };
  status: string;
}

export function CoachScreen() {
  const [students, setStudents] = useState<StudentRel[]>([]);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<{ headline?: string; bio?: string }>("/coaching/me/coach-profile/")
      .then((p) => {
        setHeadline(p.headline || "");
        setBio(p.bio || "");
      })
      .catch(() => undefined);
    api<StudentRel[] | { results: StudentRel[] }>("/coaching/students/")
      .then((data) => setStudents(Array.isArray(data) ? data : data.results || []))
      .catch(() => setStudents([]));
  }, []);

  async function saveProfile() {
    setMsg("");
    try {
      await api("/coaching/me/coach-profile/", {
        method: "PATCH",
        body: JSON.stringify({ headline, bio }),
      });
      setMsg("پروفایل مشاور ذخیره شد");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "خطا");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">داشبورد مشاور</h1>
        <p className="text-sm text-slate-400">دانش‌آموزان و پروفایل CRM</p>
      </div>

      <Card className="space-y-3">
        <Input placeholder="عنوان حرفه‌ای" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        <Input placeholder="بیو" value={bio} onChange={(e) => setBio(e.target.value)} />
        {msg && <p className="text-xs font-bold text-emerald-400">{msg}</p>}
        <Button className="w-full" onClick={() => void saveProfile()}>
          ذخیره پروفایل
        </Button>
      </Card>

      <section className="space-y-2">
        <h2 className="text-sm font-black">دانش‌آموزان</h2>
        {students.map((s) => (
          <Card key={s.id} className="flex items-center justify-between py-3">
            <p className="font-bold">{s.student?.username || "دانش‌آموز"}</p>
            <span className="text-[10px] text-emerald-400">{s.status}</span>
          </Card>
        ))}
        {students.length === 0 && (
          <Card className="text-sm text-slate-400">هنوز دانش‌آموزی متصل نیست.</Card>
        )}
      </section>
    </div>
  );
}
