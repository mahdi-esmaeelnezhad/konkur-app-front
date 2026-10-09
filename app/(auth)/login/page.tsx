"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("demo_student");
  const [password, setPassword] = useState("demo-pass-123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-slate-950 px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white shadow-lg shadow-indigo-600/30">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-white">کنکور ترکر</h1>
        <p className="mt-1 text-sm text-slate-400">ورود به اپ مطالعه</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input
            placeholder="نام کاربری"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "…" : "ورود"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          حساب ندارید؟{" "}
          <Link href="/register" className="font-bold text-indigo-400">
            ثبت‌نام
          </Link>
        </p>
      </Card>
    </div>
  );
}
