"use client";

import { FormEvent, useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Post } from "@/types";

export function SocialScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const data = await api<Post[] | { results: Post[] }>("/social/posts/");
    setPosts(Array.isArray(data) ? data : data.results || []);
  }

  useEffect(() => {
    void load().catch(() => setPosts([]));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/social/posts/", {
        method: "POST",
        body: JSON.stringify({ body, visibility: "followers", post_type: "text" }),
      });
      setBody("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال ناموفق");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black">جامعه</h1>
        <p className="text-sm text-slate-400">فعالیت‌ها و پست‌های مطالعاتی</p>
      </div>

      <Card>
        <form className="space-y-3" onSubmit={onCreate}>
          <Input
            placeholder="چی خوندی امروز؟"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
          <Button type="submit" className="w-full">
            انتشار
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-indigo-300">
                @{post.author?.username || "کاربر"}
              </p>
              <span className="text-[10px] text-slate-500">{post.visibility}</span>
            </div>
            <p className="text-sm leading-6 text-slate-100">{post.body}</p>
            <div className="flex gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> {post.reaction_count || 0}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> {post.comment_count || 0}
              </span>
            </div>
          </Card>
        ))}
        {posts.length === 0 && <Card className="text-sm text-slate-400">پستی نیست.</Card>}
      </div>
    </div>
  );
}
