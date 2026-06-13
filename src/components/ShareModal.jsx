"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check, Link, Download } from "lucide-react";
import { usePromptContext } from "@/context/PromptContext";
import { useToast } from "@/context/ToastContext";
import { exportConversationAsMarkdown } from "@/utils/exportChat";
import { MODELS } from "@/constants/models";

export function ShareModal({ open, onClose }) {
  const { messages, model } = usePromptContext();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? model;

  const generateShareUrl = () => {
    const exportable = messages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content)
      .map((m) => ({ role: m.role, content: m.content }));
    const payload = JSON.stringify({ model: modelLabel, messages: exportable, exportedAt: Date.now() });
    try {
      const encoded = btoa(unescape(encodeURIComponent(payload)));
      return `${window.location.origin}/studio?share=${encoded}`;
    } catch {
      return null;
    }
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl();
    if (!url) {
      toast({ message: "Could not generate link — conversation too large", type: "error" });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ message: "Share link copied!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMd = () => {
    exportConversationAsMarkdown(messages, modelLabel);
    toast({ message: "Exported as Markdown", type: "success" });
    onClose();
  };

  const userMsgCount = messages.filter((m) => m.role === "user").length;

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/8 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                  <Share2 size={14} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Share Conversation</span>
              </div>
              <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-white/6 dark:bg-white/3">
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{userMsgCount} exchange{userMsgCount !== 1 ? "s" : ""}</span>
                  {" "}·{" "}
                  <span>{modelLabel}</span>
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-white/8 dark:bg-white/3 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/8"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Link size={14} className="text-violet-600 dark:text-violet-400" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{copied ? "Link copied!" : "Copy share link"}</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-600">Shareable URL with conversation encoded</p>
                  </div>
                </button>

                <button
                  onClick={handleExportMd}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/8 dark:bg-white/3 dark:hover:bg-white/6"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/8">
                    <Download size={14} className="text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">Export as Markdown</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-600">Download a .md file with full conversation</p>
                  </div>
                </button>
              </div>

              <p className="mt-4 text-center text-[11px] text-zinc-400 dark:text-zinc-600">
                Share links encode conversation data in the URL — no server required.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
