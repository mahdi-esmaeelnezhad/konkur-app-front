"use client";

import Link from "next/link";
import { Bell, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";

const roles: { id: UserRole; label: string; color: string }[] = [
  { id: "student", label: "دانش‌آموز", color: "text-indigo-400" },
  { id: "coach", label: "مشاور", color: "text-emerald-400" },
  { id: "parent", label: "والدین", color: "text-amber-400" },
  { id: "teacher", label: "دبیر", color: "text-sky-400" },
  { id: "admin", label: "مدیر", color: "text-rose-400" },
];

export function TopBar({ unread = 0 }: { unread?: number }) {
  const { role, setRole, user } = useAuth();
  const [open, setOpen] = useState(false);
  const current = roles.find((r) => r.id === role) || roles[0];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-black text-white">کنکور ترکر</p>
            <p className="text-[10px] font-bold text-indigo-400">
              {user?.profile?.display_name || user?.username || "مهمان"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold"
            >
              <span className={current.color}>{current.label}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {open && (
              <div className="absolute left-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`block w-full px-3 py-2 text-right text-xs font-bold hover:bg-slate-800 ${r.color}`}
                    onClick={() => {
                      setRole(r.id);
                      setOpen(false);
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/notifications"
            className="relative rounded-2xl border border-slate-800 bg-slate-900 p-2 text-slate-300"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                {unread}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
