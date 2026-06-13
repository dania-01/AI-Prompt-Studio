"use client";

import { motion } from "framer-motion";
import {
  Brain, Zap, Cpu, Sparkles, Globe, Eye, ArrowRight,
  Check, ChevronRight, MessageSquare, Code2, Calculator, Image,
} from "lucide-react";
import Link from "next/link";
import { MODELS } from "@/constants/models";
import { LandingNav } from "@/sections/landing/LandingNav";
import { FooterSection } from "@/sections/landing/FooterSection";

// ── Model metadata ──────────────────────────────────────────────────
const MODEL_META = {
  "llama-3.3-70b-versatile": {
    badge: "Most Capable",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~280 tok/s",
    speedRating: 4,
    capabilityRating: 5,
    context: "128K tokens",
    provider: "Meta",
    Icon: Brain,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Complex reasoning", "Long-form writing", "Code review", "Analysis"],
    bestFor: "In-depth research, complex multi-step reasoning, and detailed technical answers.",
  },
  "llama-3.1-8b-instant": {
    badge: "Fastest",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~450 tok/s",
    speedRating: 5,
    capabilityRating: 3,
    context: "128K tokens",
    provider: "Meta",
    Icon: Zap,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Quick answers", "Chat", "Summaries", "Simple tasks"],
    bestFor: "Fast prototyping, quick Q&A, chat applications, and simple summarization.",
  },
  "deepseek-r1-distill-llama-70b": {
    badge: "Best Reasoning",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~180 tok/s",
    speedRating: 3,
    capabilityRating: 5,
    context: "128K tokens",
    provider: "DeepSeek",
    Icon: Cpu,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Math", "Step-by-step logic", "STEM problems", "Chain-of-thought"],
    bestFor: "Mathematical proofs, logic puzzles, scientific reasoning, and chain-of-thought tasks.",
  },
  "gemma2-9b-it": {
    badge: "Efficient",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~320 tok/s",
    speedRating: 4,
    capabilityRating: 3,
    context: "8K tokens",
    provider: "Google DeepMind",
    Icon: Sparkles,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Instruction following", "Structured output", "Concise answers"],
    bestFor: "Precise instruction following, structured JSON output, and concise focused responses.",
  },
  "mixtral-8x7b-32768": {
    badge: "Multilingual",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~240 tok/s",
    speedRating: 4,
    capabilityRating: 4,
    context: "32K tokens",
    provider: "Mistral AI",
    Icon: Globe,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Multilingual", "Long context", "Creative writing", "MoE architecture"],
    bestFor: "Non-English tasks, long-document analysis, diverse creative projects.",
  },
  "qwen-qwq-32b": {
    badge: "Deep Thinker",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~200 tok/s",
    speedRating: 3,
    capabilityRating: 5,
    context: "32K tokens",
    provider: "Alibaba Cloud",
    Icon: Brain,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Extended reasoning", "Coding", "Math", "Deep analysis"],
    bestFor: "Problems requiring deep logical reasoning, advanced coding, and thorough analysis.",
  },
  "llama-3.2-11b-vision-preview": {
    badge: "Vision",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    speed: "~150 tok/s",
    speedRating: 2,
    capabilityRating: 4,
    context: "128K tokens",
    provider: "Meta",
    Icon: Eye,
    accentClass: "from-violet-500 to-purple-600",
    tags: ["Image understanding", "Visual Q&A", "OCR", "Charts & diagrams"],
    bestFor: "Analyzing images, reading screenshots, understanding charts, and visual question answering.",
    vision: true,
  },
};

// ── Rating dots ────────────────────────────────────────────────────
function RatingDots({ rating, max = 5, colorClass = "bg-violet-500" }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-1.5 w-1.5 rounded-full transition-all",
            i < rating ? colorClass : "bg-zinc-200 dark:bg-white/10",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ── Model card ────────────────────────────────────────────────────
function ModelCard({ model, index }) {
  const meta = MODEL_META[model.id];
  if (!meta) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/7 dark:bg-white/3"
    >
      {/* Top gradient accent */}
      <div className={`h-1 w-full bg-linear-to-r ${meta.accentClass} opacity-70 group-hover:opacity-100`} />

      <div className="flex flex-1 flex-col gap-5 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${meta.accentClass} shadow-md`}>
            <meta.Icon size={20} className="text-white" strokeWidth={1.8} />
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}>
            {meta.badge}
          </span>
        </div>

        {/* Name & provider */}
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{model.label}</h3>
          <p className="mt-0.5 text-[12px] text-zinc-400 dark:text-zinc-600">{meta.provider}</p>
        </div>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{meta.bestFor}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-zinc-50 p-3 dark:bg-white/4">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Speed</p>
            <RatingDots rating={meta.speedRating} colorClass="bg-violet-400" />
            <p className="mt-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">{meta.speed}</p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-3 dark:bg-white/4">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Capability</p>
            <RatingDots rating={meta.capabilityRating} colorClass="bg-violet-500" />
            <p className="mt-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">{meta.context}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-white/8 dark:text-zinc-400">
              {tag}
            </span>
          ))}
          {meta.vision && (
            <span className="flex items-center gap-1 rounded-lg bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
              <Eye size={9} /> Vision
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/studio"
          className={`mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r ${meta.accentClass} py-2.5 text-[13px] font-semibold text-white opacity-90 shadow-md transition-all hover:opacity-100 hover:shadow-lg`}
        >
          Try in Studio <ChevronRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Comparison table ────────────────────────────────────────────────
function ComparisonTable() {
  const rows = MODELS.map((m) => ({ ...m, meta: MODEL_META[m.id] })).filter((m) => m.meta);

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-white/8">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-white/6 dark:bg-white/3">
            {["Model", "Provider", "Context", "Speed", "Vision", "Best For"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
          {rows.map((m, i) => (
            <motion.tr
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white transition-colors hover:bg-zinc-50 dark:bg-transparent dark:hover:bg-white/3"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${m.meta.accentClass}`}>
                    <m.meta.Icon size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{m.label}</p>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${m.meta.badgeClass}`}>{m.meta.badge}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] text-zinc-500 dark:text-zinc-400">{m.meta.provider}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-zinc-600 dark:text-zinc-400">{m.meta.context}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <RatingDots rating={m.meta.speedRating} colorClass="bg-violet-400" />
                  <span className="text-[11px] text-zinc-400">{m.meta.speed}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                {m.vision ? (
                  <span className="inline-flex items-center justify-center rounded-full bg-violet-100 p-1 dark:bg-violet-500/15">
                    <Check size={12} className="text-violet-600 dark:text-violet-400" />
                  </span>
                ) : (
                  <span className="text-zinc-300 dark:text-zinc-700">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-[12px] text-zinc-500 dark:text-zinc-400">{m.meta.tags.slice(0, 2).join(", ")}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Use-case guide ─────────────────────────────────────────────────
const USE_CASES = [
  {
    Icon: MessageSquare,
    title: "For everyday chat & Q&A",
    recommendation: "Llama 3.1 8B ⚡",
    reason: "Fastest responses, great for conversational tasks and quick lookups.",
    color: "violet",
  },
  {
    Icon: Calculator,
    title: "For math & reasoning",
    recommendation: "DeepSeek R1 70B",
    reason: "Purpose-built for chain-of-thought reasoning, logic, and STEM problems.",
    color: "violet",
  },
  {
    Icon: Code2,
    title: "For coding & deep analysis",
    recommendation: "Llama 3.3 70B or Qwen QwQ 32B",
    reason: "Both excel at code generation, review, and complex multi-step analysis.",
    color: "violet",
  },
  {
    Icon: Image,
    title: "For image understanding",
    recommendation: "Llama 3.2 Vision",
    reason: "The only model with vision — reads screenshots, charts, and images.",
    color: "violet",
  },
];

const colorMap = {
  violet: { bg: "bg-violet-50 dark:bg-violet-500/8", border: "border-violet-200 dark:border-violet-500/20", icon: "bg-violet-100 dark:bg-violet-500/15", iconText: "text-violet-600 dark:text-violet-400", badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400" },
};

function UseCaseGuide() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {USE_CASES.map((uc, i) => {
        const c = colorMap[uc.color];
        return (
          <motion.div
            key={uc.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.icon}`}>
                <uc.Icon size={16} className={c.iconText} />
              </div>
              <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">{uc.title}</p>
            </div>
            <span className={`mb-2 inline-block rounded-lg px-2.5 py-1 text-[12px] font-bold ${c.badge}`}>
              → {uc.recommendation}
            </span>
            <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">{uc.reason}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="mb-12 text-center"
    >
      <div className="mb-4 flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-linear-to-r from-transparent to-violet-500/50" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">{eyebrow}</span>
        <div className="h-px w-10 bg-linear-to-l from-transparent to-violet-500/50" />
      </div>
      <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">{sub}</p>}
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export function ModelsPage() {
  return (
    <div className="relative min-h-screen bg-[#faf9ff] text-zinc-900 dark:bg-[#05050f] dark:text-zinc-100">

      {/* Background */}
      <div className="bg-dot-grid pointer-events-none fixed inset-0 -z-10 opacity-50 dark:opacity-100" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-80 -top-80 h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[140px] dark:bg-violet-600/12" />
        <div className="absolute -bottom-80 -left-80 h-[500px] w-[500px] rounded-full bg-indigo-600/6 blur-[130px] dark:bg-indigo-600/10" />
      </div>

      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-5 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-linear-to-r from-transparent to-violet-500/50" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">AI Models</span>
              <div className="h-px w-10 bg-linear-to-l from-transparent to-violet-500/50" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
              Choose the right model<br />
              <span className="gradient-text">for your task</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
              7 world-class models, all running on Groq's LPU™ hardware for up to 10× faster inference than GPU-based APIs. Pick one — or compare two side-by-side.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/studio"
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500"
              >
                Try All Models Free <ArrowRight size={14} />
              </Link>
              <a
                href="#compare"
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-violet-300 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300"
              >
                View Comparison Table
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-200 bg-white dark:border-white/6 dark:bg-white/2">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 divide-x divide-zinc-200 sm:grid-cols-4 dark:divide-white/6">
            {[
              { label: "Models Available", value: "7" },
              { label: "Max Speed", value: "~450 tok/s" },
              { label: "Max Context", value: "128K tokens" },
              { label: "Cost", value: "Free" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 px-4 py-6">
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model cards */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeader
            eyebrow="All Models"
            title={<>Explore all <span className="gradient-text">7 models</span></>}
            sub="All models run on Groq's ultra-fast LPU™ inference engine — no GPU bottlenecks."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MODELS.map((model, i) => (
              <ModelCard key={model.id} model={model} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-white/8" />
      </div>

      {/* Comparison table */}
      <section id="compare" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeader
            eyebrow="Comparison"
            title={<>Side-by-side <span className="gradient-text">spec sheet</span></>}
            sub="All the numbers in one place. Scroll right on mobile."
          />
          <ComparisonTable />
        </div>
      </section>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-white/8" />
      </div>

      {/* Use-case guide */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionHeader
            eyebrow="Guide"
            title={<>Not sure which to pick? <span className="gradient-text">We've got you.</span></>}
            sub="Quick recommendations based on your use case."
          />
          <UseCaseGuide />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 to-purple-700 p-10 text-center shadow-2xl shadow-violet-500/25"
          >
            <h2 className="text-2xl font-black text-white sm:text-3xl">Ready to try them all?</h2>
            <p className="mt-3 text-sm text-violet-200">
              Open the Studio and switch models instantly. Free, no login required.
            </p>
            <Link
              href="/studio"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition-all hover:bg-violet-50 active:scale-[0.98]"
            >
              Open Studio Free <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
