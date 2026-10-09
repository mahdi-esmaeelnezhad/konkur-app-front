"use client";

import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function ProfileScreen() {
  const { user, logout, refreshMe } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDisplayName(user?.profile?.display_name || "");
    setBio(user?.profile?.bio || "");
  }, [user]);

  async function save() {
    setMessage("");
    try {
      await api("/me/profile/", {
        method: "PATCH",
        body: JSON.stringify({ display_name: displayName, bio }),
      });
      await refreshMe();
      setMessage("ذخیره شد");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "خطا");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">پروفایل</h1>
        <p className="text-sm text-slate-400">پاسپورت مطالعاتی شما</p>
      </div>

      <Card className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-300">
          <UserRound className="h-7 w-7" />
        </div>
        <div>
          <p className="font-black">{user?.username}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
      </Card>

      <Card className="space-y-3">
        <Input
          placeholder="نام نمایشی"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input placeholder="بیو" value={bio} onChange={(e) => setBio(e.target.value)} />
        {message && <p className="text-xs font-bold text-emerald-400">{message}</p>}
        <Button className="w-full" onClick={() => void save()}>
          ذخیره
        </Button>
      </Card>

      <Button
        variant="soft"
        className="w-full"
        onClick={async () => {
          await logout();
          router.replace("/login");
        }}
      >
        <LogOut className="h-4 w-4" /> خروج
      </Button>
    </div>
  );
}
