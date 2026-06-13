"use client";

export function Tooltip({ label, children, side = "top" }) {
  return (
    <div className="group/tip relative flex items-center justify-center">
      {children}
      <div
        className={[
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg",
          "opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100",
          "dark:bg-zinc-700",
          side === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : "top-full mt-2 left-1/2 -translate-x-1/2",
        ].join(" ")}
      >
        {label}
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
            side === "top"
              ? "top-full border-t-zinc-900 dark:border-t-zinc-700"
              : "bottom-full border-b-zinc-900 dark:border-b-zinc-700",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
