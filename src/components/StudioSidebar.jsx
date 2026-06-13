"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Sun, Moon, Home, MessageSquare, Trash2, X, Search,
  Star, Pencil, Check, FolderOpen, Tag, GripVertical,
} from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { useTheme } from "@/context/ThemeContext";
import { usePromptContext } from "@/context/PromptContext";
import { useToast } from "@/context/ToastContext";

const FOLDER_OPTIONS = ["Work", "Personal", "Research", "Code", "Ideas"];
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 256;

function groupConversations(convs, starredIds) {
  const now = Date.now();
  const DAY = 86_400_000;
  const starred = convs.filter((c) => starredIds.includes(c.id));
  const rest = convs.filter((c) => !starredIds.includes(c.id));
  const groups = { "⭐ Starred": starred, Today: [], Yesterday: [], "Last 7 days": [], Older: [] };
  for (const c of rest) {
    const age = now - (c.updatedAt ?? 0);
    if (age < DAY)        groups["Today"].push(c);
    else if (age < 2*DAY) groups["Yesterday"].push(c);
    else if (age < 7*DAY) groups["Last 7 days"].push(c);
    else                  groups["Older"].push(c);
  }
  return groups;
}

// ── Portal folder dropdown — escapes overflow clipping ────────────
function FolderDropdown({ anchorRef, open, onClose, onSelect, current }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    // Prefer opening to the left so it stays inside the sidebar
    setPos({ top: rect.bottom + 4, left: Math.max(rect.right - 128, 4) });
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!anchorRef.current?.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.15 }}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 9999 }}
      className="w-32 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900"
    >
      <p className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Set folder</p>
      <button
        onClick={() => { onSelect(null); onClose(); }}
        className="flex w-full items-center px-3 py-1.5 text-[11px] text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/4"
      >
        No folder
      </button>
      {FOLDER_OPTIONS.map((f) => (
        <button
          key={f}
          onClick={() => { onSelect(f); onClose(); }}
          className={[
            "flex w-full items-center px-3 py-1.5 text-[11px] hover:bg-zinc-50 dark:hover:bg-white/4",
            current === f ? "font-semibold text-violet-600 dark:text-violet-400" : "text-zinc-600 dark:text-zinc-400",
          ].join(" ")}
        >
          {f}
        </button>
      ))}
    </motion.div>,
    document.body
  );
}

// ── Conversation item ─────────────────────────────────────────────
function ConvItem({ conv, isActive, onLoad, onDelete, onRename, onToggleStar, onSetFolder, isStarred, folder }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(conv.name);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const renameRef = useRef(null);
  const folderBtnRef = useRef(null);

  useEffect(() => { if (isRenaming) renameRef.current?.focus(); }, [isRenaming]);

  const handleRenameSubmit = () => {
    if (renameVal.trim()) onRename(conv.id, renameVal.trim());
    setIsRenaming(false);
  };

  const preview = conv.messages?.find((m) => m.role === "assistant")?.content?.slice(0, 140);

  return (
    <li className="relative">
      <div
        className={[
          "group flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
          isActive ? "bg-violet-100 dark:bg-violet-500/15" : "hover:bg-zinc-200 dark:hover:bg-white/6",
        ].join(" ")}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {isRenaming ? (
          <div className="flex flex-1 items-center gap-1.5">
            <input
              ref={renameRef}
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") setIsRenaming(false);
              }}
              onBlur={handleRenameSubmit}
              className="flex-1 rounded-md border border-violet-400 bg-white px-2 py-0.5 text-[12px] outline-none dark:border-violet-500/50 dark:bg-zinc-800 dark:text-zinc-200"
            />
            <button onClick={handleRenameSubmit} className="shrink-0 text-emerald-500">
              <Check size={12} />
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => onLoad(conv)} className="flex min-w-0 flex-1 items-start gap-2">
              <MessageSquare size={13} className={[
                "mt-0.5 shrink-0 transition-colors",
                isActive ? "text-violet-500 dark:text-violet-400" : "text-zinc-300 dark:text-zinc-700",
              ].join(" ")} />
              <div className="min-w-0 flex-1">
                <span className={[
                  "block truncate text-[12.5px] leading-snug",
                  isActive ? "font-medium text-violet-700 dark:text-violet-300" : "text-zinc-600 dark:text-zinc-400",
                ].join(" ")}>
                  {conv.name}
                </span>
                {folder && (
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600">
                    <Tag size={9} />{folder}
                  </span>
                )}
              </div>
            </button>

            {/* Action icons */}
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(conv.id); }}
                title={isStarred ? "Unstar" : "Star"}
                className="rounded p-1"
              >
                <Star size={11} className={isStarred ? "fill-amber-400 text-amber-400" : "text-zinc-400 hover:text-amber-400"} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsRenaming(true); setRenameVal(conv.name); }}
                title="Rename"
                className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <Pencil size={11} />
              </button>
              <div ref={folderBtnRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowFolderMenu((v) => !v); }}
                  title="Set folder"
                  className="rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <FolderOpen size={11} />
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                title="Delete"
                className="rounded p-1 text-zinc-400 hover:text-red-500"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Folder dropdown — portal to avoid overflow clipping */}
      <AnimatePresence>
        {showFolderMenu && (
          <FolderDropdown
            anchorRef={folderBtnRef}
            open={showFolderMenu}
            onClose={() => setShowFolderMenu(false)}
            onSelect={(f) => onSetFolder(conv.id, f)}
            current={folder}
          />
        )}
      </AnimatePresence>

      {/* Hover preview tooltip */}
      <AnimatePresence>
        {showPreview && preview && !isRenaming && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute left-full top-0 z-50 ml-2 w-52 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-white/8 dark:bg-zinc-800"
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Preview</p>
            <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">{preview}…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
export function StudioSidebar({ isOpen = false, onClose }) {
  const { isDark, toggleTheme } = useTheme();
  const {
    conversations, loadConversation, deleteConversation, renameConversation,
    currentConvId, resetMessages, setPrompt,
    starredConvIds, toggleStarConversation,
    convFolders, setConvFolder,
  } = usePromptContext();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const isResizing = useRef(false);

  const startResize = useCallback((e) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (e) => {
      if (!isResizing.current) return;
      setWidth(Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH));
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const handleNewChat = () => { resetMessages(); setPrompt(""); onClose?.(); };
  const handleLoad = (conv) => { loadConversation(conv); onClose?.(); };
  const handleDelete = (id) => { deleteConversation(id); toast({ message: "Conversation deleted", type: "info" }); };

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) => c.name?.toLowerCase().includes(q) ||
        c.messages?.some((m) => m.content?.toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const grouped = groupConversations(filtered, starredConvIds);
  const hasConvs = filtered.length > 0;

  const content = (sidebarWidth) => (
    <aside
      className="relative flex h-full flex-col border-r border-zinc-200 bg-zinc-50 dark:border-white/6 dark:bg-[#0a0a10]"
      style={{ width: sidebarWidth }}
    >
      {/* Gradient header */}
      <div className="relative overflow-hidden px-4 pb-3 pt-4">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-violet-100/60 via-purple-50/30 to-transparent dark:from-violet-900/20 dark:via-purple-900/10 dark:to-transparent" />
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 transition-opacity hover:opacity-75">
            <LogoMark />
            <div>
              <div className="gradient-text text-[13px] font-bold leading-tight">AI Prompt Studio</div>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-600">Powered by Groq</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 md:hidden"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* New chat */}
      <div className="px-3 pb-2 pt-1">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 shadow-sm transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-white/8 dark:bg-white/4 dark:text-zinc-300 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/8 dark:hover:text-violet-300"
        >
          <Plus size={15} />
          New chat
        </button>
      </div>

      {/* Search */}
      {conversations.length > 0 && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 dark:border-white/6 dark:bg-white/4">
            <Search size={12} className="shrink-0 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="flex-1 bg-transparent text-[12px] text-zinc-700 outline-none placeholder-zinc-400 dark:text-zinc-300 dark:placeholder-zinc-600"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600">
                <X size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3">
        {hasConvs ? (
          <div className="space-y-4 pb-2">
            {Object.entries(grouped).map(([label, convs]) => {
              if (convs.length === 0) return null;
              return (
                <div key={label}>
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                    {label}
                  </p>
                  <ul className="space-y-0.5">
                    {convs.map((conv) => (
                      <ConvItem
                        key={conv.id}
                        conv={conv}
                        isActive={currentConvId === conv.id}
                        isStarred={starredConvIds.includes(conv.id)}
                        folder={convFolders[conv.id] ?? null}
                        onLoad={handleLoad}
                        onDelete={handleDelete}
                        onRename={renameConversation}
                        onToggleStar={toggleStarConversation}
                        onSetFolder={setConvFolder}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="px-2 py-2 text-[12px] text-zinc-400 dark:text-zinc-600">
            {search ? "No conversations match your search" : "No conversations yet"}
          </p>
        )}
      </div>

      {/* Bottom nav */}
      <div className="space-y-0.5 border-t border-zinc-200 p-3 dark:border-white/6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
        >
          <Home size={14} />
          Home
        </Link>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
        >
          {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-violet-500" />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>

      {/* ── Resize handle ── */}
      <div
        onMouseDown={startResize}
        title="Drag to resize"
        className="absolute inset-y-0 right-0 flex w-2 cursor-col-resize items-center justify-center opacity-0 transition-opacity hover:opacity-100 group"
      >
        <div className="h-8 w-0.5 rounded-full bg-violet-400/50 group-hover:bg-violet-500 transition-colors" />
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block h-full">{content(width)}</div>

      {/* Mobile slide-in */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-30 md:hidden"
          >
            {content(DEFAULT_WIDTH)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
