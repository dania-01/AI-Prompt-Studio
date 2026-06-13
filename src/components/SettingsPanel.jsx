"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Key, Eye, EyeOff, BarChart2, MessageSquare, Layers, CheckCircle2 } from "lucide-react";
import { usePromptContext } from "@/context/PromptContext";
import { useToast } from "@/context/ToastContext";

export function SettingsPanel({ open, onClose }) {
  const { apiKey, setApiKey, usageStats, conversations } = usePromptContext();
  const { toast } = useToast();

  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    setApiKey(keyInput.trim());
    setSaved(true);
    toast({ message: "API key saved", type: "success" });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearKey = () => {
    setKeyInput("");
    setApiKey("");
    toast({ message: "API key cleared — using default", type: "info" });
  };

  const totalMessages = conversations.reduce((acc, c) => acc + (c.messages?.length ?? 0), 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/8 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                  <Settings size={14} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Settings</span>
              </div>
              <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* API Key section */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Key size={14} className="text-zinc-500 dark:text-zinc-400" />
                  <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Custom API Key</span>
                </div>
                <p className="mb-3 text-[12px] text-zinc-400 dark:text-zinc-600">
                  Provide your own Groq API key to use instead of the default. Your key is stored locally and never sent to our servers.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? "text" : "password"}
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="gsk_…"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 pr-9 text-[13px] font-mono outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10 dark:border-white/8 dark:bg-white/4 dark:text-zinc-200 dark:placeholder-zinc-600"
                    />
                    <button
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveKey}
                    className={[
                      "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-medium transition-all",
                      saved
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-violet-600 text-white hover:bg-violet-700",
                    ].join(" ")}
                  >
                    {saved ? <CheckCircle2 size={13} /> : <Key size={13} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
                {apiKey && (
                  <button
                    onClick={handleClearKey}
                    className="mt-2 text-[11px] text-zinc-400 underline-offset-2 hover:text-red-500 hover:underline dark:text-zinc-600 dark:hover:text-red-400"
                  >
                    Clear saved key (revert to default)
                  </button>
                )}
              </div>

              <div className="h-px bg-zinc-100 dark:bg-white/6" />

              {/* Usage stats */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <BarChart2 size={14} className="text-zinc-500 dark:text-zinc-400" />
                  <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Usage Statistics</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Prompts sent", value: usageStats.totalPrompts ?? 0, Icon: MessageSquare },
                    { label: "Conversations", value: conversations.length, Icon: Layers },
                    { label: "Total messages", value: totalMessages, Icon: MessageSquare },
                  ].map(({ label, value, Icon }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-white/6 dark:bg-white/3"
                    >
                      <p className="text-xl font-bold text-zinc-800 tabular-nums dark:text-zinc-200">{value.toLocaleString()}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-600">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-600">
                  Stats are stored locally and reset if you clear browser data.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
