"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Star } from "lucide-react";
import Link from "next/link";

const PROMPTS = [
  "Explain quantum entanglement simply…",
  "Write a Python web scraper…",
  "Summarize this research paper…",
  "Create a 30-day fitness plan…",
  "Debug my React component…",
  "Translate this to French…",
];

function TypewriterPrompt() {
  const [display, setDisplay] = useState("");
  const [pi, setPi] = useState(0);
  const [ci, setCi] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = PROMPTS[pi];
    if (!deleting && ci < current.length) {
      const t = setTimeout(() => { setDisplay(current.slice(0, ci + 1)); setCi((c) => c + 1); }, 55);
      return () => clearTimeout(t);
    }
    if (!deleting && ci === current.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && ci > 0) {
      const t = setTimeout(() => { setDisplay(current.slice(0, ci - 1)); setCi((c) => c - 1); }, 28);
      return () => clearTimeout(t);
    }
    if (deleting && ci === 0) {
      setDeleting(false);
      setPi((p) => (p + 1) % PROMPTS.length);
    }
  }, [ci, pi, deleting]);

  return (
    <span className="text-zinc-400 dark:text-zinc-500">
      {display}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className="ml-0.5 inline-block h-4 w-0.5 rounded-sm bg-violet-500 align-text-bottom"
      />
    </span>
  );
}

/* ── Particle field animation ─────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    const COUNT = 55;
    const CONNECT_DIST = 130;
    const MOUSE = { x: -9999, y: -9999 };

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }));

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      MOUSE.x = e.clientX - rect.left;
      MOUSE.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      const w = W();
      const h = H();
      const dark = isDark();
      ctx.clearRect(0, 0, w, h);

      // Theme-aware colors
      const lineColor = dark ? "167,139,250" : "109,40,217";
      const lineMaxAlpha = dark ? 0.45 : 0.18;
      const particleCore = dark ? "216,180,254" : "109,40,217";
      const particleGlow = dark ? "192,132,252" : "124,58,237";
      const particleCoreAlpha = dark ? [0.85, 1.0] : [0.55, 0.7];
      const glowAlpha = dark ? [0.9, 1.0] : [0.25, 0.4];

      // Update & draw connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse repel
        const mdx = p.x - MOUSE.x;
        const mdy = p.y - MOUSE.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 80) {
          const force = (80 - md) / 80;
          p.x += (mdx / md) * force * 1.5;
          p.y += (mdy / md) * force * 1.5;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * lineMaxAlpha;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        const glow = (Math.sin(p.pulse) + 1) / 2;
        const r = p.r + glow * 0.8;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `rgba(${particleGlow},${glowAlpha[0] + glow * (glowAlpha[1] - glowAlpha[0])})`);
        grad.addColorStop(1, `rgba(${particleGlow},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleCore},${particleCoreAlpha[0] + glow * (particleCoreAlpha[1] - particleCoreAlpha[0])})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-6 rounded-3xl bg-violet-500/8 blur-[70px] dark:bg-violet-600/15" />

      {/* Canvas container */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-300/40 bg-white shadow-xl shadow-violet-200/60 dark:border-violet-500/20 dark:bg-[#08071a] dark:shadow-2xl dark:shadow-violet-900/40" style={{ height: "420px" }}>
        <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />

        {/* Corner label */}
        <div className="absolute left-4 top-4 flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-violet-400"
          />
          <span className="text-[11px] font-semibold text-violet-600/70 dark:text-violet-300/70">AI Neural Field</span>
        </div>

        {/* Bottom badge */}
        <div className="absolute inset-x-0 bottom-5 flex justify-center">
          <span className="rounded-full border border-violet-300/50 bg-violet-50/80 px-4 py-1.5 text-[11px] font-semibold text-violet-600/90 backdrop-blur-sm dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300/80">
            7 Models · Groq LPU™ · Free
          </span>
        </div>

        {/* Subtle radial center glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.07)_0%,transparent_70%)]" />
      </div>
    </motion.div>
  );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">

      {/* Ambient orbs — kept subtle */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-20 h-125 w-125 rounded-full bg-violet-600/6 blur-[140px] dark:bg-violet-600/10" />
        <div className="absolute -left-40 bottom-20 h-100 w-100 rounded-full bg-violet-600/4 blur-[120px] dark:bg-violet-600/8" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-0">

        {/* Left — copy */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6">

          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
              <Zap size={11} className="fill-current" />
              Powered by Groq — free &amp; blazing fast
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-1">
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
              Prompt Smarter.
            </h1>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">Create Faster.</span>
            </h1>
          </motion.div>

          <motion.p variants={fadeUp} className="max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            Stream real-time AI responses from 7 models, compare them side-by-side, save prompts, and export your work — all free, no login required.
          </motion.p>

          {/* Typewriter preview */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-white/8 dark:bg-white/3"
          >
            <span className="shrink-0 text-xs font-semibold text-violet-600 dark:text-violet-400">Try →</span>
            <TypewriterPrompt />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              Open Studio Free <ArrowRight size={14} />
            </Link>
            <Link
              href="/models"
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-violet-300 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300 dark:hover:border-violet-500/40"
            >
              Explore Models
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-zinc-400">Free to use</span>
            </div>
            <span className="text-zinc-200 dark:text-zinc-700">·</span>
            <span className="text-xs text-zinc-400">No API key needed</span>
            <span className="text-zinc-200 dark:text-zinc-700">·</span>
            <span className="text-xs text-zinc-400">7 AI models</span>
          </motion.div>
        </motion.div>

        {/* Right — particle animation */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <ParticleField />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-zinc-300 p-1 dark:border-zinc-600"
        >
          <div className="h-1.5 w-1 rounded-full bg-zinc-400 dark:bg-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
