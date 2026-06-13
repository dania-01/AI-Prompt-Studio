"use client";

export function Select({ value, onChange, options = [], label, disabled = false, className = "" }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-500">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          "w-full rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none appearance-none",
          "border-zinc-200 bg-zinc-50/80 text-zinc-800",
          "hover:border-violet-300 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20",
          "dark:border-white/7 dark:bg-zinc-950/60 dark:text-zinc-200",
          "dark:hover:border-violet-500/30 dark:focus:border-violet-500/40 dark:focus:ring-violet-500/15",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
