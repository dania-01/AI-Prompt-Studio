"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");
const mod = isMac ? "⌘" : "Ctrl";

const SHORTCUTS = [
  { keys: ["Enter"],            label: "Send message" },
  { keys: ["Shift", "Enter"],   label: "Insert newline" },
  { keys: [mod, "K"],           label: "New conversation" },
  { keys: [mod, "/"],           label: "Focus input" },
  { keys: [mod, "Shift", "C"],  label: "Toggle compare mode" },
  { keys: ["Esc"],              label: "Cancel edit / close modal" },
  { keys: ["?"],                label: "Open this shortcuts panel" },
];

export function KeyboardShortcutsModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/8 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                  <Keyboard size={14} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Keyboard Shortcuts</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Shortcut list */}
            <div className="p-3">
              {SHORTCUTS.map(({ keys, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/4"
                >
                  <span className="text-[13px] text-zinc-600 dark:text-zinc-400">{label}</span>
                  <div className="flex items-center gap-1">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-white/8 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-4 pt-1">
              <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
                Press <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 font-mono text-[10px] dark:border-white/8 dark:bg-zinc-800">?</kbd> anywhere to open this panel
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
