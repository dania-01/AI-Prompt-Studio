"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, ChevronRight, History } from "lucide-react";
import { usePromptHistory } from "@/hooks/usePromptHistory";
import { usePromptContext } from "@/context/PromptContext";
import { MODELS } from "@/constants/models";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const modelLabel = (id) => MODELS.find((m) => m.id === id)?.label ?? id;

export function HistorySection() {
  const { history, clearHistory } = usePromptHistory();
  const { setPrompt, setModel } = usePromptContext();

  if (history.length === 0) return null;

  const handleLoad = (entry) => {
    setPrompt(entry.prompt);
    if (entry.model) setModel(entry.model);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/8">
              <History size={12} className="text-zinc-500 dark:text-zinc-400" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              History
            </span>
            <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              {history.length}
            </span>
          </div>
        </div>

        {/* List */}
        <div className="flex max-h-[420px] flex-col gap-1.5 overflow-y-auto pr-0.5">
          <AnimatePresence>
            {history.map((entry, i) => (
              <motion.button
                key={entry.timestamp ?? i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleLoad(entry)}
                className={[
                  "group relative flex w-full items-start gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                  "border-zinc-100 bg-zinc-50/60 hover:border-violet-200 hover:bg-violet-50",
                  "dark:border-white/5 dark:bg-white/3 dark:hover:border-violet-500/25 dark:hover:bg-violet-500/8",
                ].join(" ")}
              >
                {/* Left accent */}
                <div className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="h-full w-0.5 rounded-full bg-violet-500" />
                </div>

                <Clock size={13} className="mt-0.5 shrink-0 text-zinc-400 transition-colors group-hover:text-violet-500 dark:text-zinc-600 dark:group-hover:text-violet-400" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-zinc-700 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                    {entry.prompt}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="purple">{modelLabel(entry.model)}</Badge>
                    {entry.timestamp && (
                      <span className="text-[10px] tabular-nums text-zinc-400 dark:text-zinc-600">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight size={13} className="mt-0.5 shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-violet-500 dark:text-zinc-700 dark:group-hover:text-violet-400" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-white/5">
          <Button variant="danger" size="sm" icon={Trash2} onClick={clearHistory} className="w-full justify-center">
            Clear History
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
