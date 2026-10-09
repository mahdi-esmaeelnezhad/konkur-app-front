"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface NotificationItem {
  id: string;
  title?: string;
  body?: string;
  message?: string;
  is_read?: boolean;
  read_at?: string | null;
  created_at?: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  async function load() {
    const data = await api<NotificationItem[] | { results: NotificationItem[] }>(
      "/messaging/notifications/",
    );
    setItems(Array.isArray(data) ? data : data.results || []);
  }

  useEffect(() => {
    void load().catch(() => setItems([]));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black">اعلان‌ها</h1>
          <p className="text-sm text-slate-400">پیام‌های سیستم و فعالیت‌ها</p>
        </div>
        <Button
          variant="soft"
          onClick={() =>
            void api("/messaging/notifications/read-all/", { method: "POST", body: "{}" })
              .then(load)
              .catch(() => undefined)
          }
        >
          خواندن همه
        </Button>
      </div>

      {items.map((n) => (
        <Card key={n.id} className="space-y-1 py-3">
          <p className="text-sm font-bold">{n.title || "اعلان"}</p>
          <p className="text-xs text-slate-400">{n.body || n.message || "—"}</p>
        </Card>
      ))}
      {items.length === 0 && <Card className="text-sm text-slate-400">اعلانی نیست.</Card>}
    </div>
  );
}
