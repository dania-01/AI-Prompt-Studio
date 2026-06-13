"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, Download, Clock, BrainCircuit, RotateCcw, Pencil, StopCircle,
  ThumbsUp, ThumbsDown, Pin, PinOff, Share2, FileText,
} from "lucide-react";
import { useStreamingResponse } from "@/hooks/useStreamingResponse";
import { usePromptContext } from "@/context/PromptContext";
import { exportChatAsTxt, exportConversationAsPDF } from "@/utils/exportChat";
import { StreamingText } from "@/components/StreamingText";
import { ShareModal } from "@/components/ShareModal";
import { useToast } from "@/context/ToastContext";

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:ring-violet-500/30">
      D
    </div>
  );
}

export function ResponseSection() {
  const { messages, isStreaming, startStream, stopGeneration } = useStreamingResponse();
  const { model, temperature, setMessages, density, setMessageReaction, togglePinMessage } = usePromptContext();
  const { toast } = useToast();

  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showShare, setShowShare] = useState(false);

  if (messages.length === 0) return null;

  const gap = density === "compact" ? "gap-4" : "gap-8";

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ message: "Copied to clipboard!", type: "success" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReaction = (msgId, reaction) => {
    const msg = messages.find((m) => m.id === msgId);
    const next = msg?.reaction === reaction ? null : reaction;
    setMessageReaction(msgId, next);
    if (next === "up") toast({ message: "Marked as helpful", type: "success" });
    if (next === "down") toast({ message: "Feedback noted", type: "info" });
  };

  const handlePin = (msgId) => {
    const msg = messages.find((m) => m.id === msgId);
    togglePinMessage(msgId);
    toast({ message: msg?.pinned ? "Unpinned message" : "Message pinned", type: "info" });
  };

  const handleEditStart = (msg) => { setEditingId(msg.id); setEditValue(msg.content); };

  const handleEditSubmit = async (msg) => {
    if (!editValue.trim() || isStreaming) return;
    setEditingId(null);
    const editedIdx = messages.findIndex((m) => m.id === msg.id);
    const previousMessages = messages.slice(0, editedIdx);
    setMessages(messages.slice(0, editedIdx));
    await startStream({ prompt: editValue.trim(), model, temperature, attachment: null, previousMessages });
  };

  const handleRegenerate = async () => {
    if (isStreaming) return;
    const lastUserEntry = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserEntry) return;
    const lastUserIdx = messages.findLastIndex((m) => m.role === "user");
    const previousMessages = messages.slice(0, lastUserIdx);
    setMessages(messages.slice(0, lastUserIdx));
    await startStream({
      prompt: lastUserEntry.content,
      model,
      temperature,
      attachment: lastUserEntry.attachmentUrl || null,
      previousMessages,
    });
  };

  const handleExportTxt = (content) => {
    exportChatAsTxt(content.slice(0, 60), content, model);
    toast({ message: "Exported as .txt", type: "success" });
  };

  const handleExportPDF = () => {
    exportConversationAsPDF(messages, model);
    toast({ message: "Opening print dialog…", type: "info" });
  };

  // Pinned messages banner
  const pinnedMsgs = messages.filter((m) => m.pinned && m.role === "assistant" && m.content);

  return (
    <>
      {/* Pinned messages banner */}
      {pinnedMsgs.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/8">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <Pin size={11} /> Pinned
          </p>
          {pinnedMsgs.map((m) => (
            <p key={m.id} className="text-[12px] text-amber-800 dark:text-amber-300 line-clamp-2">
              {m.content.slice(0, 120)}…
            </p>
          ))}
        </div>
      )}

      <div className={`flex flex-col ${gap} py-2`}>
        {messages.map((msg, i) => {
          const isLastMsg = i === messages.length - 1;
          const isLastAssistant = isLastMsg && msg.role === "assistant";

          if (msg.role === "user") {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="group flex items-end justify-end gap-2"
              >
                {editingId === msg.id ? (
                  <div className="flex w-full max-w-[85%] flex-col gap-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSubmit(msg); }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      rows={3}
                      className="w-full resize-none rounded-xl border border-violet-400 bg-zinc-50 px-4 py-3 text-sm outline-none dark:border-violet-500/50 dark:bg-zinc-900 dark:text-zinc-200"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingId(null)} className="rounded-lg border border-zinc-200 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-white/8 dark:text-zinc-400">Cancel</button>
                      <button onClick={() => handleEditSubmit(msg)} className="rounded-lg bg-violet-600 px-3 py-1 text-xs text-white hover:bg-violet-700">Send</button>
                    </div>
                  </div>
                ) : (
                  <div className="group/msg flex items-end gap-2">
                    <button
                      onClick={() => handleEditStart(msg)}
                      title="Edit message"
                      className="mb-1 opacity-0 transition-opacity group-hover/msg:opacity-100"
                    >
                      <Pencil size={12} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                    </button>
                    <div className="max-w-[80%] space-y-2 rounded-2xl rounded-br-sm bg-zinc-100 px-4 py-3 text-sm text-zinc-800 dark:bg-white/8 dark:text-zinc-200">
                      {msg.attachmentUrl && (
                        <img src={msg.attachmentUrl} alt="attachment" className="max-h-48 rounded-lg object-contain" />
                      )}
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    </div>
                    <UserAvatar />
                  </div>
                )}

                {!editingId && (
                  <span className="mb-1 self-end text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </motion.div>
            );
          }

          // Assistant message
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={[
                "group flex gap-3",
                msg.pinned ? "rounded-xl border border-amber-200/50 bg-amber-50/30 p-3 dark:border-amber-500/10 dark:bg-amber-500/5" : "",
              ].join(" ")}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-700 shadow-sm shadow-violet-500/20">
                <BrainCircuit size={13} className="text-white" />
              </div>

              <div className="min-w-0 flex-1">
                {isLastAssistant && isStreaming && !msg.content && <ThinkingDots />}

                {isLastAssistant && isStreaming && msg.content && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-violet-500">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                      Generating…
                    </span>
                    <button
                      onClick={stopGeneration}
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-2 py-0.5 text-[11px] text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/8"
                    >
                      <StopCircle size={10} />
                      Stop
                    </button>
                  </div>
                )}

                {msg.error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/8 dark:text-red-300">
                    {msg.error}
                  </div>
                )}

                {msg.content && <StreamingText text={msg.content} isStreaming={isLastAssistant && isStreaming} />}

                {msg.stopped && !isStreaming && (
                  <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-600">— stopped by user</p>
                )}

                {/* Action bar */}
                {msg.content && !isStreaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-3 flex flex-wrap items-center gap-2"
                  >
                    {msg.responseTime && (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Clock size={11} />
                        {(msg.responseTime / 1000).toFixed(2)}s
                      </span>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-700 dark:border-white/8 dark:text-zinc-500 dark:hover:border-white/12 dark:hover:text-zinc-300"
                      >
                        <AnimatePresence mode="wait">
                          {copiedId === msg.id ? (
                            <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check size={11} className="text-emerald-500" />
                            </motion.span>
                          ) : (
                            <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Copy size={11} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {copiedId === msg.id ? "Copied!" : "Copy"}
                      </button>

                      {/* Reactions */}
                      <button
                        onClick={() => handleReaction(msg.id, "up")}
                        className={[
                          "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[12px] transition-all",
                          msg.reaction === "up"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "border-zinc-200 text-zinc-500 hover:border-emerald-300 hover:text-emerald-600 dark:border-white/8 dark:text-zinc-500",
                        ].join(" ")}
                      >
                        <ThumbsUp size={11} />
                      </button>
                      <button
                        onClick={() => handleReaction(msg.id, "down")}
                        className={[
                          "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[12px] transition-all",
                          msg.reaction === "down"
                            ? "border-red-300 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400"
                            : "border-zinc-200 text-zinc-500 hover:border-red-300 hover:text-red-500 dark:border-white/8 dark:text-zinc-500",
                        ].join(" ")}
                      >
                        <ThumbsDown size={11} />
                      </button>

                      {/* Pin */}
                      <button
                        onClick={() => handlePin(msg.id)}
                        className={[
                          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] transition-all",
                          msg.pinned
                            ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400"
                            : "border-zinc-200 text-zinc-500 hover:border-amber-300 hover:text-amber-600 dark:border-white/8 dark:text-zinc-500",
                        ].join(" ")}
                        title={msg.pinned ? "Unpin" : "Pin message"}
                      >
                        {msg.pinned ? <PinOff size={11} /> : <Pin size={11} />}
                      </button>

                      {/* Regenerate (last msg only) */}
                      {isLastAssistant && (
                        <button
                          onClick={handleRegenerate}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-700 dark:border-white/8 dark:text-zinc-500 dark:hover:border-white/12 dark:hover:text-zinc-300"
                        >
                          <RotateCcw size={11} /> Regenerate
                        </button>
                      )}

                      {/* Export .txt */}
                      <button
                        onClick={() => handleExportTxt(msg.content)}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-700 dark:border-white/8 dark:text-zinc-500 dark:hover:border-white/12 dark:hover:text-zinc-300"
                      >
                        <Download size={11} /> .txt
                      </button>

                      {/* Export PDF (full conversation) */}
                      {isLastAssistant && (
                        <button
                          onClick={handleExportPDF}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-700 dark:border-white/8 dark:text-zinc-500 dark:hover:border-white/12 dark:hover:text-zinc-300"
                        >
                          <FileText size={11} /> PDF
                        </button>
                      )}

                      {/* Share */}
                      {isLastAssistant && (
                        <button
                          onClick={() => setShowShare(true)}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] text-zinc-500 transition-all hover:border-violet-300 hover:text-violet-600 dark:border-white/8 dark:text-zinc-500 dark:hover:border-violet-500/30 dark:hover:text-violet-400"
                        >
                          <Share2 size={11} /> Share
                        </button>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="ml-auto text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <ShareModal open={showShare} onClose={() => setShowShare(false)} />
    </>
  );
}
