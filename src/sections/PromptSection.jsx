"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, RotateCcw, GitCompare, Target, Scale, Sparkles as SparklesIcon,
  Paperclip, X, Settings2, StopCircle, Terminal, BookOpen, Mic, MicOff,
  ChevronRight,
} from "lucide-react";
import { usePromptContext } from "@/context/PromptContext";
import { usePrompt } from "@/hooks/usePrompt";
import { useCompare } from "@/hooks/useCompare";
import { MODELS, VISION_MODEL_ID } from "@/constants/models";
import { TokenCounter } from "@/components/TokenCounter";
import { Tooltip } from "@/components/Tooltip";
import { PromptLibraryModal } from "@/components/PromptLibraryModal";
import { useToast } from "@/context/ToastContext";
import { estimateTokens } from "@/utils/tokenCounter";

const RESPONSE_LENGTHS = [
  { label: "Short",  tokens: 512  },
  { label: "Medium", tokens: 1024 },
  { label: "Long",   tokens: 4096 },
];

const TEMPERATURE_PRESETS = [
  { label: "Precise",  Icon: Target,       value: 0.2 },
  { label: "Balanced", Icon: Scale,        value: 0.7 },
  { label: "Creative", Icon: SparklesIcon, value: 1.0 },
];

const SLASH_COMMANDS = [
  { cmd: "/compare",  label: "Toggle compare mode",    icon: GitCompare },
  { cmd: "/system",   label: "Open system prompt",     icon: Terminal },
  { cmd: "/library",  label: "Open prompt library",    icon: BookOpen },
  { cmd: "/clear",    label: "Clear conversation",     icon: RotateCcw },
];

function TokenRing({ tokens, max = 500 }) {
  const pct = Math.min(tokens / max, 1);
  const r = 13;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct >= 0.9 ? "#ef4444" : pct >= 0.7 ? "#f59e0b" : "#7c3aed";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0 -rotate-90">
      <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="2"
        className="text-zinc-200 dark:text-zinc-700" />
      <circle cx="16" cy="16" r={r} fill="none" stroke={color} strokeWidth="2"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.35s, stroke 0.35s" }} />
    </svg>
  );
}

export function PromptSection() {
  const {
    model, setModel, temperature, setTemperature,
    maxTokens, setMaxTokens, systemPrompt, setSystemPrompt,
    attachment, setAttachment, isStreaming,
  } = usePromptContext();
  const { prompt, setPrompt, handleSubmit, isLoading, validationErrors, reset, stopGeneration } = usePrompt();
  const { compareMode, toggleCompare, runComparison } = useCompare();
  const { toast } = useToast();

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Auto-resize textarea (max 6 lines ≈ 144px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [prompt]);

  // Slash command palette visibility
  const slashQuery = prompt.startsWith("/") && !prompt.includes(" ") ? prompt : null;
  const slashMatches = slashQuery
    ? SLASH_COMMANDS.filter((c) => c.cmd.startsWith(slashQuery))
    : [];

  const handleSlashSelect = useCallback((cmd) => {
    setPrompt("");
    if (cmd === "/compare") { toggleCompare(); toast({ message: compareMode ? "Compare mode off" : "Compare mode on", type: "info" }); }
    if (cmd === "/system")  { setShowSystemPrompt(true); }
    if (cmd === "/library") { setShowLibrary(true); }
    if (cmd === "/clear")   { reset(); }
  }, [compareMode, toggleCompare, reset, setPrompt, toast]);

  // Voice input
  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast({ message: "Voice input not supported in this browser", type: "error" }); return; }
    if (isListening) { recognitionRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => { setIsListening(false); toast({ message: "Voice input failed", type: "error" }); };
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setPrompt((p) => (p ? p + " " + t : t));
    };
    rec.start();
    recognitionRef.current = rec;
  }, [isListening, setPrompt, toast]);

  const onSubmit = async (e) => {
    e?.preventDefault();
    if (compareMode) await runComparison(prompt);
    else await handleSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (slashMatches.length > 0) { handleSlashSelect(slashMatches[0].cmd); return; }
      if (!isLoading && !isStreaming && prompt.trim()) onSubmit();
    }
    if (e.key === "Escape" && slashMatches.length > 0) setPrompt("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment(ev.target.result);
      const def = MODELS.find((m) => m.id === model);
      if (!def?.vision) setModel(VISION_MODEL_ID);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const currentLength = RESPONSE_LENGTHS.find((l) => l.tokens === maxTokens) ?? RESPONSE_LENGTHS[1];
  const busy = isLoading || isStreaming;
  const tokenCount = estimateTokens(prompt);

  return (
    <div className="flex flex-col gap-2">

      {/* System prompt — collapsible */}
      <AnimatePresence>
        {showSystemPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-1 rounded-xl border border-zinc-200 bg-zinc-50/80 dark:border-white/8 dark:bg-zinc-950/50">
              <div className="flex items-center gap-1.5 border-b border-zinc-200 px-3 py-1.5 dark:border-white/6">
                <Terminal size={11} className="text-zinc-400" />
                <span className="text-[11px] font-medium text-zinc-500">System prompt</span>
                <span className="text-[10px] text-zinc-400">(sets AI persona/instructions)</span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful assistant…"
                rows={2}
                className="w-full resize-none bg-transparent px-3 py-2 text-xs leading-relaxed text-zinc-700 outline-none placeholder-zinc-400 dark:text-zinc-300 dark:placeholder-zinc-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image preview */}
      {attachment && (
        <div className="relative w-fit">
          <img src={attachment} alt="preview" className="h-20 w-20 rounded-xl border border-zinc-200 object-cover dark:border-white/10" />
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="absolute -right-2 -top-2 rounded-full bg-zinc-700 p-0.5 text-white transition-colors hover:bg-red-500"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* Main input box */}
      <form onSubmit={onSubmit}>
        <div className="relative rounded-2xl border border-zinc-200 bg-zinc-50/80 transition-all focus-within:border-violet-400 focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.08)] dark:border-white/8 dark:bg-zinc-950/60 dark:focus-within:border-violet-500/50">

          {/* Slash command palette */}
          <AnimatePresence>
            {slashMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 2, scale: 0.97 }}
                className="absolute bottom-full left-0 mb-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-white/8 dark:bg-zinc-900"
              >
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Commands</p>
                {slashMatches.map((c) => (
                  <button
                    key={c.cmd}
                    type="button"
                    onClick={() => handleSlashSelect(c.cmd)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/8"
                  >
                    <c.icon size={13} className="shrink-0 text-violet-500" />
                    <span className="font-mono text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{c.cmd}</span>
                    <span className="ml-auto text-[11px] text-zinc-400">{c.label}</span>
                    <ChevronRight size={11} className="shrink-0 text-zinc-300" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… or type / for commands"
            disabled={busy}
            rows={1}
            className="w-full resize-none rounded-2xl bg-transparent px-4 pb-2 pt-3.5 text-sm leading-relaxed text-zinc-900 outline-none placeholder-zinc-400 disabled:opacity-50 dark:text-zinc-100 dark:placeholder-zinc-600"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-3 pb-2.5">
            {/* Attach image */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Tooltip label={attachment ? "Change image" : "Attach image"}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={busy || compareMode}
                className={[
                  "rounded-lg p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  attachment ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400",
                ].join(" ")}
              >
                <Paperclip size={15} />
              </button>
            </Tooltip>

            {/* System prompt toggle */}
            <Tooltip label="System prompt / persona">
              <button
                type="button"
                onClick={() => setShowSystemPrompt((v) => !v)}
                className={[
                  "rounded-lg p-1.5 transition-colors",
                  showSystemPrompt || systemPrompt.trim()
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400",
                ].join(" ")}
              >
                <Terminal size={15} />
              </button>
            </Tooltip>

            {/* Prompt library */}
            <Tooltip label="Prompt library">
              <button
                type="button"
                onClick={() => setShowLibrary(true)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:text-violet-600 dark:text-zinc-600 dark:hover:text-violet-400"
              >
                <BookOpen size={15} />
              </button>
            </Tooltip>

            {/* Voice input */}
            <Tooltip label={isListening ? "Stop listening" : "Voice input"}>
              <button
                type="button"
                onClick={startVoice}
                disabled={busy}
                className={[
                  "rounded-lg p-1.5 transition-colors disabled:opacity-40",
                  isListening
                    ? "animate-pulse text-red-500"
                    : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400",
                ].join(" ")}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>
            </Tooltip>

            {/* Settings popover */}
            <div className="relative">
              <Tooltip label="Creativity & response length">
                <button
                  type="button"
                  onClick={() => setShowSettings((v) => !v)}
                  className={[
                    "rounded-lg p-1.5 transition-colors",
                    showSettings ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400",
                  ].join(" ")}
                >
                  <Settings2 size={15} />
                </button>
              </Tooltip>

              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-white/8 dark:bg-zinc-900"
                >
                  <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Creativity</p>
                  <div className="mb-3 flex gap-1">
                    {TEMPERATURE_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setTemperature(p.value)}
                        className={[
                          "flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-all",
                          temperature === p.value
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                            : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/6",
                        ].join(" ")}
                      >
                        <p.Icon size={13} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Response length</p>
                  <div className="flex gap-1">
                    {RESPONSE_LENGTHS.map((l) => (
                      <button
                        key={l.tokens}
                        type="button"
                        onClick={() => { setMaxTokens(l.tokens); setShowSettings(false); }}
                        className={[
                          "flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-all",
                          maxTokens === l.tokens
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                            : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/6",
                        ].join(" ")}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Compare toggle */}
            <Tooltip label={compareMode ? "Compare ON — click to disable" : "Compare two models side-by-side"}>
              <button
                type="button"
                onClick={toggleCompare}
                disabled={busy}
                className={[
                  "rounded-lg p-1.5 transition-colors disabled:opacity-40",
                  compareMode ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400",
                ].join(" ")}
              >
                <GitCompare size={15} />
              </button>
            </Tooltip>

            {/* Reset */}
            <Tooltip label="Reset conversation">
              <button
                type="button"
                onClick={reset}
                disabled={busy}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:text-zinc-600 disabled:opacity-40 dark:text-zinc-600 dark:hover:text-zinc-400"
              >
                <RotateCcw size={15} />
              </button>
            </Tooltip>

            <div className="flex-1" />

            {/* Stop / Send with token ring */}
            {isStreaming ? (
              <Tooltip label="Stop generating">
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                  <StopCircle size={15} />
                </button>
              </Tooltip>
            ) : (
              <Tooltip label="Send message (Enter)">
                <div className="relative h-8 w-8">
                  {tokenCount > 0 && <TokenRing tokens={tokenCount} max={500} />}
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/30 transition-all hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {isLoading
                      ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      : <Send size={14} strokeWidth={2.2} />}
                  </button>
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        {validationErrors.prompt && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
            <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
            {validationErrors.prompt}
          </p>
        )}
      </form>

      {/* Footer row */}
      <div className="flex items-center gap-3 px-1">
        <TokenCounter value={prompt} maxTokens={500} />
        <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{currentLength.label} response</span>
        <span className="ml-auto text-[11px] text-zinc-400 dark:text-zinc-600">
          {compareMode ? "Compare mode ON" : isListening ? "🎤 Listening…" : "Shift+Enter for newline"}
        </span>
      </div>

      {/* Prompt Library Modal */}
      <PromptLibraryModal
        open={showLibrary}
        onClose={() => setShowLibrary(false)}
        onInsert={(text) => setPrompt(text)}
      />
    </div>
  );
}
