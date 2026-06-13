"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { LogoMark } from "@/components/LogoMark";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Models", href: "/models" },
];

export function LandingNav() {
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={[
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-black/8 bg-white/90 shadow-sm backdrop-blur-xl dark:border-white/6 dark:bg-[#05050f]/90"
            : "border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#05050f]/80",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <LogoMark className="group-hover:shadow-violet-500/50" />
            <span className="gradient-text text-sm font-bold">AI Prompt Studio</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/6 dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-white/8 dark:text-zinc-400 dark:hover:border-violet-500/40 dark:hover:text-violet-400"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* CTA — hidden on smallest screens to save space */}
            <Link
              href="/studio"
              className="hidden items-center gap-1.5 rounded-lg bg-linear-to-r from-violet-600 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 sm:flex"
            >
              Open Studio <ArrowRight size={12} />
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-violet-300 dark:border-white/8 dark:text-zinc-400 md:hidden"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            {/* Slide-down panel */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="fixed left-4 right-4 top-16 z-50 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/8 dark:bg-zinc-900 md:hidden"
            >
              <div className="flex flex-col p-3">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-[15px] font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-zinc-100 dark:bg-white/6" />
                <Link
                  href="/studio"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
                >
                  Open Studio Free <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
