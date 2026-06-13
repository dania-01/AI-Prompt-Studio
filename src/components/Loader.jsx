"use client";

const sizeMap = { sm: 16, md: 24, lg: 40 };

export function Loader({ size = "md", color = "text-violet-500", className = "" }) {
  const px = sizeMap[size] ?? sizeMap.md;
  return (
    <svg
      className={["animate-spin", color, className].join(" ")}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
