export function LogoMark({ className = "" }) {
  return (
    <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-700 shadow-md shadow-violet-500/30 transition-shadow ${className}`}>
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
        {/* > prompt chevron */}
        <path d="M2.5 3L9 8L2.5 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* _ cursor bar */}
        <rect x="11" y="11.2" width="4.5" height="1.8" rx="0.9" fill="white" />
      </svg>
    </div>
  );
}
