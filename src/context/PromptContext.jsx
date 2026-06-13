"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { DEFAULT_MODEL } from "@/constants/models";

const PromptContext = createContext(null);

const CONV_STORAGE_KEY = "ai-studio-conversations";
const STARRED_KEY = "ai-studio-starred";
const FOLDERS_KEY = "ai-studio-folders";
const APIKEY_KEY = "ai-studio-apikey";
const LIBRARY_KEY = "ai-studio-prompt-library";
const STATS_KEY = "ai-studio-usage-stats";

function generateName(messages) {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.content.slice(0, 46);
  return text.length < first.content.length ? text + "…" : text;
}

export function PromptProvider({ children }) {
  // ── Input ──────────────────────────────────────────────────
  const [prompt, setPrompt] = useState("");
  const [attachment, setAttachment] = useState(null);

  // ── Model config ───────────────────────────────────────────
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [systemPrompt, setSystemPrompt] = useState("");

  // ── UI prefs ───────────────────────────────────────────────
  const [density, setDensity] = useState("comfortable");
  const [wideLayout, setWideLayout] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // ── Streaming ──────────────────────────────────────────────
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  // ── Messages ───────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);

  // ── Conversations ──────────────────────────────────────────
  const [conversations, setConversations] = useState([]);

  // ── Starred conversation IDs ───────────────────────────────
  const [starredConvIds, setStarredConvIds] = useState([]);

  // ── Folder tags: { [convId]: folderName } ─────────────────
  const [convFolders, setConvFoldersState] = useState({});

  // ── Custom API key ─────────────────────────────────────────
  const [apiKey, setApiKeyState] = useState("");

  // ── Prompt library: { id, title, content, createdAt }[] ───
  const [promptLibrary, setPromptLibrary] = useState([]);

  // ── Usage stats ────────────────────────────────────────────
  const [usageStats, setUsageStats] = useState({ totalPrompts: 0, totalConversations: 0 });

  // ── Compare winner ─────────────────────────────────────────
  const [compareWinner, setCompareWinner] = useState(null); // "A" | "B" | null

  // Load all persisted data on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONV_STORAGE_KEY);
      if (raw) setConversations(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem(STARRED_KEY);
      if (raw) setStarredConvIds(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem(FOLDERS_KEY);
      if (raw) setConvFoldersState(JSON.parse(raw));
    } catch {}
    try {
      const key = localStorage.getItem(APIKEY_KEY);
      if (key) setApiKeyState(key);
    } catch {}
    try {
      const raw = localStorage.getItem(LIBRARY_KEY);
      if (raw) setPromptLibrary(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) setUsageStats(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist conversations
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-save current conversation on message change
  useEffect(() => {
    if (messages.length === 0) return;
    const name = generateName(messages);
    const now = Date.now();

    if (currentConvId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConvId ? { ...c, messages, name, updatedAt: now } : c
        )
      );
    } else {
      const newId = `conv-${now}`;
      setCurrentConvId(newId);
      setConversations((prev) => [
        { id: newId, name, messages, model, systemPrompt, createdAt: now, updatedAt: now },
        ...prev,
      ]);
      // track new conversation
      setUsageStats((prev) => {
        const next = { ...prev, totalConversations: (prev.totalConversations || 0) + 1 };
        localStorage.setItem(STATS_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Conversation actions ────────────────────────────────────
  const loadConversation = useCallback((conv) => {
    setMessages(conv.messages ?? []);
    setModel(conv.model ?? DEFAULT_MODEL);
    setSystemPrompt(conv.systemPrompt ?? "");
    setCurrentConvId(conv.id);
    setPrompt("");
    setAttachment(null);
  }, []);

  const deleteConversation = useCallback(
    (id) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      // clean up related starred/folder data
      setStarredConvIds((prev) => {
        const next = prev.filter((s) => s !== id);
        localStorage.setItem(STARRED_KEY, JSON.stringify(next));
        return next;
      });
      if (currentConvId === id) {
        setMessages([]);
        setCurrentConvId(null);
      }
    },
    [currentConvId]
  );

  const renameConversation = useCallback((id, newName) => {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name: newName } : c));
      localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([]);
    setCurrentConvId(null);
    setPrompt("");
    setAttachment(null);
  }, []);

  // ── Starred ─────────────────────────────────────────────────
  const toggleStarConversation = useCallback((id) => {
    setStarredConvIds((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      localStorage.setItem(STARRED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Folders ─────────────────────────────────────────────────
  const setConvFolder = useCallback((convId, folder) => {
    setConvFoldersState((prev) => {
      const next = folder
        ? { ...prev, [convId]: folder }
        : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== convId));
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── API Key ──────────────────────────────────────────────────
  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
    localStorage.setItem(APIKEY_KEY, key || "");
  }, []);

  // ── Message reactions ────────────────────────────────────────
  const setMessageReaction = useCallback((msgId, reaction) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, reaction } : m))
    );
  }, []);

  // ── Pinned messages ──────────────────────────────────────────
  const togglePinMessage = useCallback((msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, pinned: !m.pinned } : m))
    );
  }, []);

  // ── Prompt library ───────────────────────────────────────────
  const addPromptToLibrary = useCallback((item) => {
    setPromptLibrary((prev) => {
      const next = [{ ...item, id: `lib-${Date.now()}`, createdAt: Date.now() }, ...prev];
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removePromptFromLibrary = useCallback((id) => {
    setPromptLibrary((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Track usage ──────────────────────────────────────────────
  const trackPromptSent = useCallback(() => {
    setUsageStats((prev) => {
      const next = { ...prev, totalPrompts: (prev.totalPrompts || 0) + 1 };
      localStorage.setItem(STATS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Compare state ─────────────────────────────────────────────
  const [compareResponseA, setCompareResponseA] = useState("");
  const [compareResponseB, setCompareResponseB] = useState("");
  const [isStreamingA, setIsStreamingA] = useState(false);
  const [isStreamingB, setIsStreamingB] = useState(false);
  const [compareErrorA, setCompareErrorA] = useState(null);
  const [compareErrorB, setCompareErrorB] = useState(null);

  return (
    <PromptContext.Provider
      value={{
        prompt, setPrompt,
        attachment, setAttachment,
        model, setModel,
        temperature, setTemperature,
        maxTokens, setMaxTokens,
        systemPrompt, setSystemPrompt,
        density, setDensity,
        wideLayout, setWideLayout,
        compareMode, setCompareMode,
        isStreaming, setIsStreaming,
        abortRef,
        messages, setMessages, resetMessages,
        currentConvId,
        conversations, setConversations,
        loadConversation,
        deleteConversation,
        renameConversation,
        starredConvIds,
        toggleStarConversation,
        convFolders,
        setConvFolder,
        apiKey, setApiKey,
        promptLibrary,
        addPromptToLibrary,
        removePromptFromLibrary,
        usageStats,
        trackPromptSent,
        setMessageReaction,
        togglePinMessage,
        compareWinner, setCompareWinner,
        compareResponseA, setCompareResponseA,
        compareResponseB, setCompareResponseB,
        isStreamingA, setIsStreamingA,
        isStreamingB, setIsStreamingB,
        compareErrorA, setCompareErrorA,
        compareErrorB, setCompareErrorB,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export const usePromptContext = () => {
  const ctx = useContext(PromptContext);
  if (!ctx) throw new Error("usePromptContext must be used within PromptProvider");
  return ctx;
};
