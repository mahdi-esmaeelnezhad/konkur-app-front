import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "soft";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-50",
        variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20",
        variant === "ghost" && "bg-transparent text-slate-300 hover:bg-slate-800",
        variant === "soft" && "bg-slate-800 text-slate-100 border border-slate-700",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-500",
        className,
      )}
      {...props}
    />
  );
}
