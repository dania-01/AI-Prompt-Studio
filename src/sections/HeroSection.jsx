"use client";

import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft, Zap } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export function HeroSection() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#07070d]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Left — logo + back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-violet-600 dark:hover:text-violet-400"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:bg-white/10" />

          <div className="flex items-center gap-2.5">
            <LogoMark />
            <div>
              <div className="flex items-center gap-2">
                <span className="gradient-text text-[14px] font-bold leading-none">Studio</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <Zap size={8} className="fill-current" /> Beta
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Powered by Groq</span>
            </div>
          </div>
        </motion.div>

        {/* Right — theme toggle */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-all hover:border-violet-300 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-violet-500/40 dark:hover:bg-white/8"
          >
            {isDark
              ? <><Sun size={13} className="text-amber-400" /> Light</>
              : <><Moon size={13} className="text-violet-500" /> Dark</>
            }
          </button>
        </motion.div>
      </div>
    </header>
  );
}
