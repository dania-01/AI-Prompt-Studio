"use client";

export function Card({ title, children, className = "", accent = false }) {
  return (
    <div
      className={[
        "relative rounded-2xl transition-all duration-300",
        // Light
        "border border-black/6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]",
        // Dark — floating glassmorphism
        "dark:border-white/8 dark:bg-white/4 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_48px_rgba(0,0,0,0.4)] dark:backdrop-blur-2xl",
        "dark:hover:border-violet-500/30 dark:hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(124,58,237,0.1)]",
        className,
      ].join(" ")}
    >
      {/* Subtle top gradient accent line */}
      {accent && (
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
      )}

      <div className="p-5 sm:p-6">
        {title && (
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3.5 w-0.5 rounded-full bg-linear-to-b from-violet-500 to-purple-600" />
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {title}
            </h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
