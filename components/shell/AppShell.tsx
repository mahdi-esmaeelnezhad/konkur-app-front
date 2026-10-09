"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { BottomNav } from "@/components/shell/BottomNav";
import { TopBar } from "@/components/shell/TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api<{ count?: number } | number>("/messaging/notifications/unread-count/")
      .then((data) => {
        if (typeof data === "number") setUnread(data);
        else setUnread(Number((data as { count?: number })?.count || 0));
      })
      .catch(() => setUnread(0));
  }, [user, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-300">
        <div className="animate-pulse text-sm font-bold">در حال بارگذاری…</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-lg bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
      <TopBar unread={unread} />
      <main
        className="relative px-4 py-4"
        style={{
          paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
