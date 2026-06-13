"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Share2 } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import Link from "next/link";

const LINKS = {
  Product: [
    { label: "Open Studio", href: "/studio" },
    { label: "Explore Models", href: "/models" },
    { label: "Features", href: "/#features" },
    { label: "How it Works", href: "/#how-it-works" },
  ],
  Resources: [
    { label: "Groq Console", href: "https://console.groq.com" },
    { label: "Groq Docs", href: "https://console.groq.com/docs" },
    { label: "Llama Models", href: "https://ai.meta.com" },
    { label: "DeepSeek", href: "https://deepseek.com" },
  ],
};

export function FooterSection() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-white/6 dark:bg-[#05050f]">

      {/* CTA banner */}
      <div className="border-b border-zinc-200 dark:border-white/6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-16 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Ready to prompt smarter?
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Free forever. No account required. Start in seconds.
            </p>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              Open Studio Free <ArrowRight size={14} />
            </Link>
            <Link
              href="/models"
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-violet-300 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300 dark:hover:border-violet-500/40"
            >
              Explore Models
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <LogoMark />
              <span className="gradient-text text-sm font-bold">AI Prompt Studio</span>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              A free, open-source AI prompt studio powered by Groq's blazing-fast inference API.
              Stream responses, compare 7 models, and build better.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://github.com"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-white/8 dark:text-zinc-400 dark:hover:border-violet-500/40 dark:hover:text-violet-400"
                aria-label="Source code"
              >
                <Code2 size={14} />
              </a>
              <a
                href="https://twitter.com"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-white/8 dark:text-zinc-400 dark:hover:border-violet-500/40 dark:hover:text-violet-400"
                aria-label="Share"
              >
                <Share2 size={14} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row dark:border-white/6">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} AI Prompt Studio. Free and open source.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Built with{" "}
            <span className="gradient-text font-semibold">Next.js + Groq + Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
