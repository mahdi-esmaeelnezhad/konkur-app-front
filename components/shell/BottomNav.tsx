"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Calendar,
  Clock,
  Compass,
  Home,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";

const studentItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/study", label: "مطالعه", icon: Clock },
  { href: "/planner", label: "برنامه", icon: Calendar },
  { href: "/analytics", label: "تحلیل", icon: BarChart2 },
  { href: "/social", label: "جامعه", icon: Users },
  { href: "/profile", label: "پروفایل", icon: User },
];

const roleItems: Record<UserRole, { href: string; label: string; icon: typeof Home }[]> = {
  student: studentItems,
  coach: [
    { href: "/coach", label: "داشبورد", icon: Compass },
    { href: "/social", label: "جامعه", icon: Users },
    { href: "/profile", label: "پروفایل", icon: User },
  ],
  parent: [
    { href: "/parent", label: "فرزندان", icon: Users },
    { href: "/profile", label: "پروفایل", icon: User },
  ],
  teacher: [
    { href: "/coach", label: "کلاس‌ها", icon: Compass },
    { href: "/profile", label: "پروفایل", icon: User },
  ],
  admin: [
    { href: "/", label: "خانه", icon: Home },
    { href: "/profile", label: "پروفایل", icon: User },
  ],
};

export function BottomNav() {
  const pathname = usePathname();
  const { role } = useAuth();
  const items = roleItems[role] || studentItems;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-xl"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pt-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition",
                active ? "text-indigo-400" : "text-slate-400 hover:text-slate-200",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "scale-110")} />
              <span className="truncate text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
