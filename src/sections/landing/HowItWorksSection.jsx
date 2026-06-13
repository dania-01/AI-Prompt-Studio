"use client";

import { motion } from "framer-motion";
import { PenLine, Cpu, Waves, ArrowRight } from "lucide-react";

const STEPS = [
  {
    n: "01",
    Icon: PenLine,
    title: "Write Your Prompt",
    desc: "Type any question, task, or instruction. The live token counter shows how much context you're using.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
    border: "border-violet-200 dark:border-violet-500/20",
  },
  {
    n: "02",
    Icon: Cpu,
    title: "Pick a Model",
    desc: "Choose from Llama 3.3 70B, Llama 3.1 8B, or DeepSeek R1. Toggle Compare Mode to run two at once.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
    border: "border-violet-200 dark:border-violet-500/20",
  },
  {
    n: "03",
    Icon: Waves,
    title: "Stream the Response",
    desc: "Hit Generate and watch the response stream in real time, word by word, powered by Groq's ultra-fast inference.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/15",
    border: "border-violet-200 dark:border-violet-500/20",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">

      {/* Separator */}
      <div className="mx-auto mb-24 max-w-7xl px-5 sm:px-8">
        <div className="h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-white/8" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-linear-to-r from-transparent to-violet-500/50" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">How it Works</span>
            <div className="h-px w-10 bg-linear-to-l from-transparent to-violet-500/50" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            From idea to answer<br />
            <span className="gradient-text">in three steps</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute left-1/6 right-1/6 top-12 -z-10 hidden h-px bg-zinc-300 opacity-40 md:block dark:bg-white/10 dark:opacity-100" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative flex flex-col items-center gap-5 text-center"
            >
              {/* Arrow between steps */}
              {i < STEPS.length - 1 && (
                <ArrowRight
                  size={16}
                  className="absolute -right-6 top-11 hidden -translate-y-1/2 text-zinc-300 md:block dark:text-zinc-700"
                />
              )}

              {/* Step number + icon */}
              <div className={`relative z-10 flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border ${step.bg} ${step.border}`}>
                <span className={`text-[10px] font-black tracking-widest ${step.color}`}>{step.n}</span>
                <step.Icon size={26} className={step.color} strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="mb-2 text-base font-bold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
