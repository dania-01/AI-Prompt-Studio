"use client";

export function Textarea({
  value,
  onChange,
  placeholder = "Enter your prompt…",
  rows = 5,
  disabled = false,
  error,
  className = "",
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <div className={[
        "relative rounded-xl transition-all duration-200",
        "ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-violet-500/60",
        "dark:ring-white/7 dark:focus-within:ring-violet-500/40",
        "focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)] dark:focus-within:shadow-[0_0_20px_rgba(124,58,237,0.12)]",
        error ? "ring-red-400 dark:ring-red-500/50" : "",
      ].join(" ")}>
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={[
            "w-full rounded-xl px-4 py-3.5 text-sm leading-relaxed resize-none transition-colors outline-none",
            "bg-zinc-50/80 text-zinc-900 placeholder-zinc-400",
            "dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder-zinc-600",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          ].join(" ")}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}
