"use client";

import { estimateTokens } from "@/utils/tokenCounter";

export function TokenCounter({ value = "", maxTokens = 500 }) {
  const tokens = estimateTokens(value);
  const pct = Math.min((tokens / maxTokens) * 100, 100);
  const isWarn = pct >= 70;
  const isDanger = pct >= 90;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/6">
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            isDanger ? "bg-red-500" : isWarn ? "bg-amber-400" : "bg-linear-to-r from-violet-500 to-purple-500",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={[
        "shrink-0 text-[11px] tabular-nums font-mono font-medium",
        isDanger ? "text-red-500" : isWarn ? "text-amber-500" : "text-zinc-400 dark:text-zinc-500",
      ].join(" ")}>
        ~{tokens} <span className="text-zinc-300 dark:text-zinc-700">/</span> {maxTokens}
      </span>
    </div>
  );
}
