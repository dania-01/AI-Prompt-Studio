"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "prompt-studio-history";
const MAX_HISTORY = 10;

export function usePromptHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deduplicate on load in case old duplicates exist in storage
        const seen = new Set();
        const clean = parsed.filter((h) => {
          const key = h.prompt.trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
        setHistory(clean);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const persist = useCallback((items) => {
    setHistory(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addToHistory = useCallback((entry) => {
    setHistory((prev) => {
      // Remove duplicate with same prompt text, then prepend new entry
      const deduped = prev.filter((h) => h.prompt.trim() !== entry.prompt.trim());
      const updated = [entry, ...deduped].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  const loadFromHistory = useCallback((entry) => entry, []);

  return { history, addToHistory, clearHistory, loadFromHistory };
}
