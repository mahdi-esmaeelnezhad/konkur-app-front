"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(username, email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت‌نام ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-slate-950 px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-black">ثبت‌نام</h1>
      <Card>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input placeholder="نام کاربری" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="email" placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "…" : "ساخت حساب"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          حساب دارید؟{" "}
          <Link href="/login" className="font-bold text-indigo-400">
            ورود
          </Link>
        </p>
      </Card>
    </div>
  );
}
