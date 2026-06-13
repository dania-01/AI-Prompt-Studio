"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Zap, Brain, Cpu } from "lucide-react";
import { MODELS } from "@/constants/models";

const MODEL_META = {
  "llama-3.3-70b-versatile": {
    Icon: Brain,
    speed: "Fast",
    speedColor: "text-zinc-500 dark:text-zinc-400",
    tags: ["Reasoning", "Long-form", "Code"],
    badge: "Most Capable",
    badgeColor: "bg-zinc-100 text-zinc-600 dark:bg-white/8 dark:text-zinc-300",
  },
  "llama-3.1-8b-instant": {
    Icon: Zap,
    speed: "Ultra Fast",
    speedColor: "text-zinc-500 dark:text-zinc-400",
    tags: ["Quick answers", "Chat", "Summaries"],
    badge: "Fastest",
    badgeColor: "bg-zinc-100 text-zinc-600 dark:bg-white/8 dark:text-zinc-300",
  },
  "deepseek-r1-distill-llama-70b": {
    Icon: Cpu,
    speed: "Moderate",
    speedColor: "text-zinc-500 dark:text-zinc-400",
    tags: ["Math", "Step-by-step", "Analysis"],
    badge: "Best Reasoning",
    badgeColor: "bg-zinc-100 text-zinc-600 dark:bg-white/8 dark:text-zinc-300",
  },
};

function TiltCard({ children, className = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [8, -8]);
  const rotateY = useTransform(x, [-80, 80], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ModelsSection() {
  return (
    <section id="models" className="py-24 sm:py-32">

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
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">Models</span>
            <div className="h-px w-10 bg-linear-to-l from-transparent to-violet-500/50" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            Powered by the world's<br />
            <span className="gradient-text">fastest AI inference</span>
          </h2>
          <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
            All models run on Groq's LPU™ hardware — up to 10× faster than GPU-based APIs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {MODELS.map((model, i) => {
            const meta = MODEL_META[model.id];
            if (!meta) return null;
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col gap-5 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-white/7 dark:bg-white/3">

                    {/* Icon */}
                    <div className="w-fit rounded-xl bg-violet-50 p-3 dark:bg-violet-500/15">
                      <meta.Icon size={22} className="text-violet-600 dark:text-violet-400" strokeWidth={1.8} />
                    </div>

                    {/* Badge */}
                    <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.badgeColor}`}>
                      {meta.badge}
                    </span>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="mb-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{model.label}</h3>
                      <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{model.description}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {meta.tags.map(tag => (
                        <span key={tag} className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-white/8 dark:text-zinc-400">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Speed */}
                    <div className="flex items-center gap-1.5 border-t border-zinc-100 pt-4 dark:border-white/5">
                      <Zap size={11} className={meta.speedColor} />
                      <span className={`text-xs font-semibold ${meta.speedColor}`}>{meta.speed}</span>
                      <span className="text-xs text-zinc-400">response time</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
