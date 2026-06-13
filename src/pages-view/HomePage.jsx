"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, Maximize2, Minimize2, Keyboard, Settings } from "lucide-react";
import { StudioSidebar } from "@/components/StudioSidebar";
import { PromptSection } from "@/sections/PromptSection";
import { ResponseSection } from "@/sections/ResponseSection";
import { CompareSection } from "@/sections/CompareSection";
import { WelcomeSection } from "@/sections/WelcomeSection";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Tooltip } from "@/components/Tooltip";
import { usePromptContext } from "@/context/PromptContext";
import { MODELS, VISION_MODEL_ID } from "@/constants/models";

export function HomePage() {
  const {
    model, setModel, messages, isStreaming,
    wideLayout, setWideLayout,
    density, setDensity,
    resetMessages,
    setPrompt, setAttachment,
  } = usePromptContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const userScrolledUp = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    userScrolledUp.current = !atBottom;
    setShowScrollBtn(!atBottom);
  }, []);

  const scrollToBottom = () => {
    userScrolledUp.current = false;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        setShowShortcuts(true);
      }
      if (mod && e.key === "k") { e.preventDefault(); resetMessages(); }
      if (mod && e.key === "/") { e.preventDefault(); document.querySelector("textarea")?.focus(); }
      if (mod && e.key === ",") { e.preventDefault(); setShowSettings(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resetMessages]);

  // Drag & drop image
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith("image/"));
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment(ev.target.result);
      const def = MODELS.find((m) => m.id === model);
      if (!def?.vision) setModel(VISION_MODEL_ID);
    };
    reader.readAsDataURL(file);
  };

  const maxW = wideLayout ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="flex h-screen overflow-hidden bg-white text-zinc-900 dark:bg-[#0d0d0d] dark:text-zinc-100">

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
          />
        )}
      </AnimatePresence>

      <StudioSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex shrink-0 items-center gap-2 border-b border-zinc-100/80 bg-white/80 px-3 py-2 backdrop-blur-md dark:border-white/5 dark:bg-[#0d0d0d]/80 sm:px-4">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/6 dark:hover:text-zinc-200 md:hidden"
          >
            <Menu size={18} />
          </button>

          {/* Model selector — grows to fill space on mobile */}
          <div className="relative min-w-0 flex-1 sm:flex-none sm:mx-auto">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full appearance-none truncate rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-3 pr-7 text-[12px] font-medium text-zinc-700 outline-none transition-all hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-white/8 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-violet-500/40 sm:w-auto sm:text-[13px] sm:pr-8"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-white dark:bg-zinc-900">
                  {m.label}{m.vision ? " 👁" : ""}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Right controls */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            {/* Density — hidden on xs */}
            <Tooltip label={density === "compact" ? "Switch to comfortable spacing" : "Switch to compact spacing"} side="top">
              <button
                onClick={() => setDensity((d) => d === "compact" ? "comfortable" : "compact")}
                className="hidden rounded-lg px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-white/6 dark:hover:text-zinc-300 sm:block"
              >
                {density === "compact" ? "Compact" : "Cozy"}
              </button>
            </Tooltip>

            {/* Wide layout — hidden on xs */}
            <Tooltip label={wideLayout ? "Narrow layout" : "Wide layout"} side="top">
              <button
                onClick={() => setWideLayout((v) => !v)}
                className="hidden rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-white/6 dark:hover:text-zinc-300 sm:flex"
              >
                {wideLayout ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </Tooltip>

            <Tooltip label="Settings (⌘,)" side="top">
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-white/6 dark:hover:text-zinc-300"
              >
                <Settings size={15} />
              </button>
            </Tooltip>

            <Tooltip label="Keyboard shortcuts (?)" side="top">
              <button
                onClick={() => setShowShortcuts(true)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-white/6 dark:hover:text-zinc-300"
              >
                <Keyboard size={15} />
              </button>
            </Tooltip>

            {/* User avatar */}
            <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:ring-violet-500/30">
              D
            </div>
          </div>
        </div>

        {/* Scrollable chat area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative flex-1 overflow-y-auto bg-dot-grid"
        >
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-violet-500/10 backdrop-blur-sm"
              >
                <div className="rounded-2xl border-2 border-dashed border-violet-400 bg-white/80 px-10 py-8 text-center shadow-xl dark:bg-zinc-900/80">
                  <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">Drop image here</p>
                  <p className="mt-1 text-sm text-zinc-500">Vision model will be selected automatically</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`mx-auto ${maxW} px-4 py-10 pb-4`}>
            <AnimatePresence mode="wait">
              <WelcomeSection />
            </AnimatePresence>
            <ResponseSection />
            <AnimatePresence>
              <CompareSection />
            </AnimatePresence>
            <div ref={bottomRef} className="h-4" />
          </div>

          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={scrollToBottom}
                className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-600 shadow-md transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <ChevronUp size={13} className="rotate-180" />
                Scroll to bottom
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky input bar */}
        <div className="shrink-0 border-t border-zinc-100/80 bg-white/80 px-4 pb-5 pt-3 backdrop-blur-xl dark:border-white/5 dark:bg-[#0d0d0d]/85">
          <div className={`mx-auto ${maxW}`}>
            <PromptSection />
          </div>
        </div>

      </div>

      <KeyboardShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
