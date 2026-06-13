"use client";

import { Loader2 } from "lucide-react";

const variantClasses = {
  primary: [
    "bg-linear-to-r from-violet-600 to-purple-600 text-white border-transparent",
    "hover:from-violet-500 hover:to-purple-500",
    "shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    "active:scale-[0.98]",
  ].join(" "),

  secondary: [
    "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200",
    "dark:bg-white/7 dark:text-zinc-300 dark:border-white/8 dark:hover:bg-white/11",
  ].join(" "),

  ghost: [
    "bg-transparent text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900",
    "dark:text-zinc-400 dark:border-white/8 dark:hover:bg-white/6 dark:hover:text-zinc-200",
  ].join(" "),

  danger: [
    "bg-red-500 text-white border-transparent hover:bg-red-600",
    "shadow-md shadow-red-500/20 hover:shadow-red-500/30",
  ].join(" "),
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm gap-2 rounded-xl",
  lg: "px-6 py-3 text-sm gap-2 rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  onClick,
  disabled,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center border font-medium",
        "transition-all duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {isLoading
        ? <Loader2 className="animate-spin" size={14} />
        : Icon
        ? <Icon size={14} strokeWidth={2.2} />
        : null}
      {children}
    </button>
  );
}
