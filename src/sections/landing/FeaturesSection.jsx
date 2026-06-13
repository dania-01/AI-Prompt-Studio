"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Zap, GitCompare, Clock, Sliders, Download, Moon,
  Mic, BookOpen, Share2, Pin, Star, Key, Check,
  ThumbsUp, ThumbsDown, Copy, Lock, Unlock, ChevronsDown,
} from "lucide-react";

// ── Animated previews ─────────────────────────────────────────────

function StreamingPreview() {
  const words = ["Transformers", "use", "self-attention", "to", "weigh", "each", "token…"];
  const [count, setCount] = useState(0);
  useEffect(() => { const t = setInterval(() => setCount((c) => (c >= words.length ? 0 : c + 1)), 480); return () => clearInterval(t); }, []);
  return (
    <div className="space-y-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
      <div className="flex flex-wrap gap-1">
        {words.map((w, i) => (
          <motion.span key={i} animate={{ opacity: i < count ? 1 : 0.15 }} transition={{ duration: 0.3 }} className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{w}</motion.span>
        ))}
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.55, repeat: Infinity }} className="inline-block h-3.5 w-0.5 self-center rounded-sm bg-violet-500" />
      </div>
      <div className="flex items-center gap-1.5">
        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-violet-500" />
        <span className="text-[10px] text-violet-500">~280 tok/s</span>
      </div>
    </div>
  );
}

function ComparePreview() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[{ label: "Llama 3.3", lines: [3,4,2], winner: true }, { label: "DeepSeek", lines: [4,3,3], winner: false }].map(({ label, lines, winner }) => (
        <div key={label} className={`rounded-xl border p-2.5 ${winner ? "border-violet-300 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/8" : "border-zinc-200 bg-zinc-50 dark:border-white/8 dark:bg-white/3"}`}>
          <p className={`mb-1.5 text-[10px] font-bold ${winner ? "text-violet-600 dark:text-violet-400" : "text-zinc-400"}`}>{label}</p>
          {lines.map((w, i) => <div key={i} className="mb-1 h-1.5 rounded-full bg-zinc-200 dark:bg-white/10" style={{ width: `${w * 25}%` }} />)}
          {winner && <div className="mt-1.5 flex items-center gap-1"><div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500"><Check size={8} className="text-white" /></div><span className="text-[9px] font-bold text-violet-600 dark:text-violet-400">Winner</span></div>}
        </div>
      ))}
    </div>
  );
}

function HistoryPreview() {
  return (
    <div className="space-y-1.5">
      {["Debug React hooks", "Python web scraper", "Explain transformers"].map((c, i) => (
        <motion.div key={c} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
          className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] ${i === 0 ? "bg-violet-50 text-violet-700 dark:bg-violet-500/12 dark:text-violet-300" : "bg-zinc-50 text-zinc-500 dark:bg-white/4 dark:text-zinc-400"}`}>
          <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-violet-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />{c}
        </motion.div>
      ))}
    </div>
  );
}

function FineTunePreview() {
  const [active, setActive] = useState(1);
  useEffect(() => { const t = setInterval(() => setActive((a) => (a + 1) % 3), 1400); return () => clearInterval(t); }, []);
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {["Precise", "Balanced", "Creative"].map((m, i) => (
          <motion.div key={m} animate={{ backgroundColor: i === active ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0)" }}
            className={`flex-1 rounded-lg border px-1 py-2 text-center text-[10px] font-semibold transition-colors ${i === active ? "border-violet-400/60 text-violet-600 dark:text-violet-300" : "border-zinc-200 text-zinc-400 dark:border-white/8"}`}>{m}</motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-400">Length</span>
        <div className="relative h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-white/10">
          <motion.div animate={{ width: ["30%","60%","90%","60%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-y-0 left-0 rounded-full bg-violet-500" />
        </div>
        <span className="text-[10px] text-zinc-400">Long</span>
      </div>
    </div>
  );
}

function VoicePreview() {
  return (
    <div className="flex items-center justify-center gap-6 py-1">
      <div className="relative flex h-12 w-12 items-center justify-center">
        {[1,2,3].map((i) => (
          <motion.div key={i} animate={{ scale:[1,1.5+i*0.3,1], opacity:[0.5,0,0.5] }} transition={{ duration:1.8, repeat:Infinity, delay:i*0.3 }}
            className="absolute inset-0 rounded-full border-2 border-violet-400 dark:border-violet-500" />
        ))}
        <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 shadow-lg shadow-violet-500/30"><Mic size={16} className="text-white" /></div>
      </div>
      <div className="flex items-end gap-0.5">
        {[4,7,5,9,6,8,4,7,5].map((h, i) => (
          <motion.div key={i} animate={{ height:[h,h*1.6,h] }} transition={{ duration:0.7, repeat:Infinity, delay:i*0.08 }} className="w-1.5 rounded-full bg-violet-400" style={{ height:h }} />
        ))}
      </div>
    </div>
  );
}

function LibraryPreview() {
  return (
    <div className="space-y-2">
      {["Explain like I'm 5…", "Write unit tests for…", "Translate to French…"].map((p, i) => (
        <motion.div key={p} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
          className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white px-3 py-2 dark:border-white/6 dark:bg-white/4">
          <span className="text-[11px] text-zinc-600 dark:text-zinc-300">{p}</span>
          <BookOpen size={11} className="text-violet-400" />
        </motion.div>
      ))}
    </div>
  );
}

function PinPreview() {
  const [liked, setLiked] = useState(false);
  useEffect(() => { const t = setInterval(() => setLiked((v) => !v), 1500); return () => clearInterval(t); }, []);
  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-3 dark:border-white/6 dark:bg-white/4">
      <div className="mb-2 space-y-1.5">{[3,4,2].map((w,i) => <div key={i} className="h-1.5 rounded-full bg-zinc-100 dark:bg-white/8" style={{width:`${w*22}%`}} />)}</div>
      <div className="flex items-center gap-3">
        <motion.div animate={{ scale: liked ? [1,1.3,1] : 1 }} transition={{ duration:0.3 }} className="flex items-center gap-1">
          <ThumbsUp size={13} className={liked ? "text-violet-500" : "text-zinc-400"} />
          <span className={`text-[10px] ${liked ? "text-violet-500" : "text-zinc-400"}`}>Helpful</span>
        </motion.div>
        <ThumbsDown size={13} className="text-zinc-300 dark:text-zinc-600" />
        <div className="ml-auto flex items-center gap-1"><Pin size={11} className="text-violet-400" /><span className="text-[10px] text-zinc-400">Pinned</span></div>
      </div>
    </div>
  );
}

function SharePreview() {
  const [copied, setCopied] = useState(false);
  useEffect(() => { const t = setInterval(() => { setCopied(true); setTimeout(() => setCopied(false), 1000); }, 2200); return () => clearInterval(t); }, []);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-white/8 dark:bg-white/4">
        <Share2 size={11} className="text-violet-400" />
        <span className="flex-1 truncate text-[10px] text-zinc-400">studio.app/share?s=eJyb…</span>
        <motion.div animate={{ scale: copied ? [1,1.2,1] : 1 }} transition={{ duration:0.25 }}>
          {copied ? <Check size={11} className="text-violet-500" /> : <Copy size={11} className="text-zinc-400" />}
        </motion.div>
      </div>
      <AnimatePresence>
        {copied && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="text-center text-[10px] font-semibold text-violet-500">Link copied!</motion.p>}
      </AnimatePresence>
    </div>
  );
}

function ModelsPreview() {
  const models = ["Llama 3.3 70B","DeepSeek R1","Gemma 2 9B","Mixtral 8×7B","Qwen QwQ 32B"];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i+1)%models.length), 900); return () => clearInterval(t); }, []);
  return (
    <div className="space-y-2">
      {models.map((m, i) => (
        <motion.div key={m} animate={{ opacity:i===idx?1:0.3, x:i===idx?4:0 }} transition={{ duration:0.3 }} className="flex items-center gap-2">
          <motion.div animate={{ backgroundColor: i===idx?"rgb(139,92,246)":"rgb(228,228,231)" }} className="h-1.5 w-1.5 rounded-full" />
          <span className={`text-[11px] font-medium ${i===idx?"text-zinc-800 dark:text-zinc-100":"text-zinc-400 dark:text-zinc-600"}`}>{m}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SlashPreview() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-md dark:border-white/8 dark:bg-[#111]">
      <div className="flex items-center gap-1.5 border-b border-zinc-100 px-3 py-2 dark:border-white/5">
        <span className="text-[11px] font-bold text-violet-500">/</span>
        <span className="text-[11px] text-zinc-400">command</span>
        <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:0.6, repeat:Infinity }} className="ml-0.5 inline-block h-3 w-0.5 rounded-sm bg-violet-500" />
      </div>
      {["/compare — run two models","/library — saved prompts","/clear — new chat"].map((c,i) => (
        <motion.div key={c} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.15 }}
          className={`px-3 py-2 text-[10px] ${i===0?"bg-violet-50 text-violet-700 dark:bg-violet-500/12 dark:text-violet-300":"text-zinc-500 dark:text-zinc-400"}`}>{c}</motion.div>
      ))}
    </div>
  );
}

function KeyPreview() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => { const t = setInterval(() => setUnlocked((v) => !v), 1600); return () => clearInterval(t); }, []);
  return (
    <div className="flex items-center justify-center gap-6 py-1">
      <motion.div animate={{ rotate: unlocked ? -20 : 0 }} transition={{ duration:0.4 }} className="flex flex-col items-center gap-1">
        <Key size={28} className="text-violet-500" /><span className="text-[9px] text-zinc-400">Your key</span>
      </motion.div>
      <motion.div animate={{ x: unlocked?0:-6, opacity: unlocked?1:0.3 }} transition={{ duration:0.4 }} className="h-px w-10 bg-violet-300" />
      <motion.div animate={{ scale: unlocked?[1,1.15,1]:1 }} transition={{ duration:0.4 }} className="flex flex-col items-center gap-1">
        {unlocked ? <Unlock size={28} className="text-violet-500" /> : <Lock size={28} className="text-zinc-300 dark:text-zinc-600" />}
        <span className="text-[9px] text-zinc-400">{unlocked?"Unlocked":"Locked"}</span>
      </motion.div>
    </div>
  );
}

function ThemePreview() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const t = setInterval(() => setDark((v) => !v), 1500); return () => clearInterval(t); }, []);
  return (
    <motion.div animate={{ backgroundColor: dark?"#0d0d0d":"#ffffff" }} transition={{ duration:0.6 }}
      className="overflow-hidden rounded-xl border border-zinc-200 p-3 dark:border-white/8">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="h-1.5 w-5 rounded-sm" style={{ backgroundColor: dark?"#333":"#e4e4e7" }} />)}</div>
        <motion.div animate={{ backgroundColor: dark?"#1a1a2e":"#f5f3ff" }} className="flex h-4 w-8 items-center rounded-full p-0.5">
          <motion.div animate={{ x: dark?14:0, backgroundColor: dark?"#8b5cf6":"#a78bfa" }} transition={{ duration:0.4 }} className="h-3 w-3 rounded-full" />
        </motion.div>
      </div>
      <div className="space-y-1.5">{[3,5,4].map((w,i) => <motion.div key={i} animate={{ backgroundColor: dark?"#2a2a3a":"#f4f4f5" }} transition={{ duration:0.6 }} className="h-1.5 rounded-full" style={{ width:`${w*16}%` }} />)}</div>
      <div className="mt-2 text-center text-[9px] font-semibold" style={{ color: dark?"#8b5cf6":"#7c3aed" }}>{dark?"Dark Mode":"Light Mode"}</div>
    </motion.div>
  );
}

const PREVIEWS = [StreamingPreview, ComparePreview, HistoryPreview, FineTunePreview, VoicePreview, LibraryPreview, PinPreview, SharePreview, ModelsPreview, SlashPreview, KeyPreview, ThemePreview];

const FEATURES = [
  { Icon: Zap,        title: "Real-Time Streaming",    desc: "Watch the AI think word by word. Powered by Groq's LPU™ — up to 10× faster than GPU-based APIs." },
  { Icon: GitCompare, title: "Side-by-Side Compare",   desc: "Send one prompt to two models simultaneously. See who wins on quality, speed, and style." },
  { Icon: Clock,      title: "Conversation History",   desc: "Every chat is auto-saved. Search, star, rename, and organise into folders for instant recall." },
  { Icon: Sliders,    title: "Fine-Tune Creativity",   desc: "Choose Precise, Balanced, or Creative mode. Adjust response length from Short to Long." },
  { Icon: Mic,        title: "Voice Input",            desc: "Click the mic and speak your prompt. Transcribed instantly via the Web Speech API — hands-free prompting." },
  { Icon: BookOpen,   title: "Prompt Library",         desc: "Save your best prompts. One click to name, tag, search, and reuse them across any conversation." },
  { Icon: Pin,        title: "Pin & React",            desc: "Pin key AI responses to keep them visible. Thumbs-up or thumbs-down to rate answers." },
  { Icon: Share2,     title: "Share & Export",         desc: "Share a conversation via encoded link, or export as .txt, Markdown, or print-to-PDF — no account needed." },
  { Icon: Download,   title: "7 AI Models",            desc: "Llama, DeepSeek, Gemma, Mixtral, Qwen and more — all on Groq's blazing-fast inference hardware." },
  { Icon: Star,       title: "Slash Commands",         desc: "Type / to open the command palette. Clear chat, switch mode, open library — all from the keyboard." },
  { Icon: Key,        title: "Bring Your Own Key",     desc: "Optionally supply your own Groq API key via Settings. It stays local — never sent to any server." },
  { Icon: Moon,       title: "Dark & Light Mode",      desc: "Beautiful in both themes. Toggle anytime — preference persists between sessions automatically." },
];

const TOTAL = FEATURES.length;
const VH_PER_SLOT = 250;

// Direction-aware horizontal slide variants
const slideVariants = {
  enter: (d) => ({ x: d > 0 ? 280 : -280, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d) => ({ x: d > 0 ? -280 : 280, opacity: 0, scale: 0.96 }),
};

export function FeaturesSection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const lastApplied = useRef(0);
  const pending = useRef(0);
  const cooling = useRef(false);
  const direction = useRef(1);
  const isAutoAdvancing = useRef(false);
  const lastManualScroll = useRef(0);

  const applySlot = (target) => {
    if (cooling.current) { pending.current = target; return; }
    const curr = lastApplied.current;
    let next;
    if (target > curr)      { next = curr + 1; direction.current = 1;  }
    else if (target < curr) { next = curr - 1; direction.current = -1; }
    else return;

    next = Math.min(Math.max(next, 0), FEATURES.length - 1);
    if (next === curr) return;

    lastApplied.current = next;
    pending.current = target;
    setActiveIndex(next);
    cooling.current = true;
    setTimeout(() => {
      cooling.current = false;
      if (pending.current !== lastApplied.current) applySlot(pending.current);
    }, 700);
  };

  const skipSection = () => {
    if (!containerRef.current) return;
    const bottom = containerRef.current.offsetTop + containerRef.current.offsetHeight;
    window.scrollTo({ top: bottom, behavior: "smooth" });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isAutoAdvancing.current) lastManualScroll.current = Date.now();
    const slot = Math.min(Math.max(Math.round(v * (TOTAL - 1)), 0), FEATURES.length - 1);
    pending.current = slot;
    applySlot(slot);
  });

  // Auto-advance after 3.5s of idle time
  useEffect(() => {
    const IDLE_MS = 3500;
    const id = setInterval(() => {
      const prog = scrollYProgress.get();
      if (prog <= 0.01 || prog >= 0.98) return;
      if (lastApplied.current >= FEATURES.length - 1) return;
      if (Date.now() - lastManualScroll.current < IDLE_MS) return;
      isAutoAdvancing.current = true;
      const sectionH = containerRef.current?.offsetHeight ?? 0;
      window.scrollBy({ top: sectionH / (TOTAL - 1), behavior: "smooth" });
      setTimeout(() => { isAutoAdvancing.current = false; }, 1200);
    }, IDLE_MS);
    return () => clearInterval(id);
  }, [scrollYProgress]);

  const feature = FEATURES[activeIndex];
  const Preview = PREVIEWS[activeIndex];

  return (
    <section id="features" ref={containerRef} style={{ height: `${TOTAL * VH_PER_SLOT}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#faf9ff] dark:bg-[#05050f]">

        {/* Dot grid */}
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 dark:opacity-100" />

        <div className="flex h-full flex-col items-center">

          {/* ── Header — always visible, centered ── */}
          <div className="w-full shrink-0 pt-16 pb-8 text-center sm:pt-20">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-linear-to-r from-transparent to-violet-500/50" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">Features</span>
              <div className="h-px w-10 bg-linear-to-l from-transparent to-violet-500/50" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
              Everything you need to<br />
              <span className="gradient-text">craft perfect prompts</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              A full-featured AI studio in your browser. No account. No cost. Just results.
            </p>
          </div>

          {/* ── Horizontal sliding card ── */}
          <div className="relative mx-auto w-full max-w-lg flex-1 overflow-hidden px-5 sm:px-0">
            <AnimatePresence custom={direction.current} initial={false} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction.current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-white/8 dark:bg-[#0f0d1f]">
                  {/* Icon + counter */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/15">
                      <feature.Icon size={18} className="text-violet-600 dark:text-violet-400" strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(FEATURES.length).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Title + desc */}
                  <h3 className="mb-2 text-xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mb-5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {feature.desc}
                  </p>
                  {/* Animated preview */}
                  <div className="mt-auto rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-white/5 dark:bg-white/3">
                    <Preview />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Progress dots + skip ── */}
          <div className="flex shrink-0 items-center justify-center gap-3 py-6">
            <div className="flex items-center gap-1.5">
              {FEATURES.map((_, i) => (
                <div key={i} className={["rounded-full transition-all duration-300",
                  i === activeIndex ? "h-1.5 w-6 bg-violet-500"
                    : i < activeIndex ? "h-1.5 w-1.5 bg-violet-400/40"
                    : "h-1.5 w-1.5 bg-zinc-300 dark:bg-white/10",
                ].join(" ")} />
              ))}
            </div>

            <AnimatePresence>
              {activeIndex >= 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={skipSection}
                  className="ml-2 flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium text-zinc-400 shadow-sm backdrop-blur-sm transition-all hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500 dark:hover:border-violet-500/40 dark:hover:text-violet-400"
                >
                  Skip <ChevronsDown size={11} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
