"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Dumbbell, BookOpen, Bug, FileText, Lightbulb, Globe, Wand2, Brain, MessageCircle } from "lucide-react";
import { usePromptContext } from "@/context/PromptContext";

const ALL_SUGGESTIONS = [
  { Icon: Lightbulb, label: "Explain a concept",  text: "Explain quantum entanglement in simple, everyday terms." },
  { Icon: Code2,     label: "Write code",          text: "Write a Python function to scrape a webpage and extract all links." },
  { Icon: Dumbbell,  label: "Build a plan",        text: "Create a 5-day beginner workout plan I can do at home with no equipment." },
  { Icon: BookOpen,  label: "Summarize text",      text: "Summarize the key findings of recent AI research on large language models." },
  { Icon: Bug,       label: "Debug code",          text: "My React useEffect is running twice in development. Why does this happen and how do I fix it?" },
  { Icon: FileText,  label: "Write something",     text: "Write a compelling cover letter for a frontend developer role at a startup." },
  { Icon: Globe,     label: "Translate",           text: "Translate the following English paragraph into formal French." },
  { Icon: Wand2,     label: "Brainstorm ideas",    text: "Give me 10 creative startup ideas in the AI + education space." },
  { Icon: Brain,     label: "Teach me",            text: "Explain the difference between SQL and NoSQL databases with real examples." },
  { Icon: MessageCircle, label: "Role-play",       text: "Act as a senior software engineer and review my code architecture decisions." },
];

function pickSix(seed) {
  const arr = [...ALL_SUGGESTIONS];
  const result = [];
  let s = seed;
  while (result.length < 6 && arr.length > 0) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const idx = Math.abs(s) % arr.length;
    result.push(arr.splice(idx, 1)[0]);
  }
  return result;
}

export function WelcomeSection() {
  const { messages, setPrompt } = usePromptContext();
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 9999));
  const [suggestions, setSuggestions] = useState(() => pickSix(seed));

  // Rotate one random chip every 8s
  useEffect(() => {
    const id = setInterval(() => {
      setSeed((s) => {
        const next = (s * 1664525 + 1013904223) & 0xffffffff;
        setSuggestions(pickSix(Math.abs(next)));
        return next;
      });
    }, 8000);
    return () => clearInterval(id);
  }, []);

  if (messages.length > 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center gap-8 py-12 text-center"
    >
      {/* Animated orb */}
      <div>
        <div className="relative mb-5 inline-flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.15, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-28 w-28 rounded-full bg-violet-400/30 dark:bg-violet-500/20"
          />
          <motion.div
            animate={{ scale: [1, 1.32, 1], opacity: [0.2, 0.06, 0.2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute h-28 w-28 rounded-full bg-purple-400/20 dark:bg-purple-500/15"
          />
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-purple-700 shadow-2xl shadow-violet-500/40"
          >
            <Lightbulb size={28} className="text-white" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          What would you like to explore?
        </h2>
        <p className="mt-1.5 text-sm text-zinc-400 dark:text-zinc-500">
          Type a prompt below, try a suggestion, or type <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 font-mono text-[11px] dark:border-white/8 dark:bg-zinc-800">/</kbd> for commands
        </p>
      </div>

      {/* Suggestion chips — rotate periodically */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {suggestions.map((s, i) => (
            <motion.button
              key={s.label}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              onClick={() => setPrompt(s.text)}
              className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-white/7 dark:bg-white/3 dark:hover:border-violet-500/35 dark:hover:bg-white/6"
            >
              <div className="mt-0.5 rounded-lg bg-violet-100 p-1.5 transition-colors group-hover:bg-violet-200 dark:bg-violet-500/15 dark:group-hover:bg-violet-500/25">
                <s.Icon size={13} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{s.label}</p>
                <p className="mt-0.5 truncate text-[12px] text-zinc-700 dark:text-zinc-300">{s.text.slice(0, 52)}…</p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
