"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Plus, Trash2, Search, ClipboardCopy } from "lucide-react";
import { usePromptContext } from "@/context/PromptContext";
import { useToast } from "@/context/ToastContext";

export function PromptLibraryModal({ open, onClose, onInsert }) {
  const { promptLibrary, addPromptToLibrary, removePromptFromLibrary, prompt } = usePromptContext();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return promptLibrary;
    const q = search.toLowerCase();
    return promptLibrary.filter(
      (p) => p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q)
    );
  }, [promptLibrary, search]);

  const handleSaveCurrent = () => {
    if (!prompt.trim()) {
      toast({ message: "Type a prompt first to save it", type: "error" });
      return;
    }
    addPromptToLibrary({ title: prompt.slice(0, 50), content: prompt });
    toast({ message: "Prompt saved to library", type: "success" });
  };

  const handleAdd = () => {
    if (!newContent.trim()) return;
    addPromptToLibrary({ title: newTitle.trim() || newContent.slice(0, 50), content: newContent.trim() });
    toast({ message: "Prompt added to library", type: "success" });
    setNewTitle("");
    setNewContent("");
    setShowAdd(false);
  };

  const handleInsert = (content) => {
    onInsert(content);
    toast({ message: "Prompt inserted", type: "success" });
    onClose();
  };

  const handleDelete = (id) => {
    removePromptFromLibrary(id);
    toast({ message: "Removed from library", type: "info" });
  };

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/8 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/15">
                  <BookOpen size={14} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Prompt Library</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-white/8 dark:text-zinc-400">
                  {promptLibrary.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {prompt.trim() && (
                  <button
                    onClick={handleSaveCurrent}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-100 px-2.5 py-1 text-[12px] font-medium text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/25"
                  >
                    <Plus size={12} />
                    Save current
                  </button>
                )}
                <button
                  onClick={() => setShowAdd((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-white/8 dark:text-zinc-400 dark:hover:bg-white/4"
                >
                  <Plus size={12} />
                  New
                </button>
                <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Add new prompt */}
            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-zinc-100 dark:border-white/6"
                >
                  <div className="space-y-2 p-4">
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Title (optional)"
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[13px] outline-none focus:border-violet-400 dark:border-white/8 dark:bg-white/4 dark:text-zinc-200 dark:placeholder-zinc-600"
                    />
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Prompt content…"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[13px] outline-none focus:border-violet-400 dark:border-white/8 dark:bg-white/4 dark:text-zinc-200 dark:placeholder-zinc-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowAdd(false)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-500 hover:bg-zinc-50 dark:border-white/8 dark:text-zinc-400">
                        Cancel
                      </button>
                      <button
                        onClick={handleAdd}
                        disabled={!newContent.trim()}
                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-[12px] text-white hover:bg-violet-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search */}
            {promptLibrary.length > 3 && (
              <div className="border-b border-zinc-100 px-4 py-2 dark:border-white/6">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 dark:border-white/6 dark:bg-white/4">
                  <Search size={12} className="shrink-0 text-zinc-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search prompts…"
                    className="flex-1 bg-transparent text-[12px] text-zinc-700 outline-none placeholder-zinc-400 dark:text-zinc-300 dark:placeholder-zinc-600"
                  />
                  {search && <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600"><X size={11} /></button>}
                </div>
              </div>
            )}

            {/* List */}
            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <BookOpen size={24} className="text-zinc-300 dark:text-zinc-700" />
                  <p className="text-[13px] text-zinc-400 dark:text-zinc-600">
                    {promptLibrary.length === 0 ? "No saved prompts yet" : "No prompts match your search"}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-white/4">
                  {filtered.map((item) => (
                    <li key={item.id} className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-white/3">
                      <button
                        onClick={() => handleInsert(item.content)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{item.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-zinc-400 dark:text-zinc-600">{item.content.slice(0, 80)}</p>
                      </button>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleInsert(item.content)}
                          title="Insert"
                          className="rounded p-1 text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400"
                        >
                          <ClipboardCopy size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="rounded p-1 text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
