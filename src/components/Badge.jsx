"use client";

const variantClasses = {
  default: "bg-zinc-100 text-zinc-600 dark:bg-white/8 dark:text-zinc-400",
  purple:  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  green:   "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  yellow:  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  red:     "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
