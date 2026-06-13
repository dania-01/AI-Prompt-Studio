"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/hooks/useCompare";
import { MODELS, COMPARE_MODEL_A, COMPARE_MODEL_B } from "@/constants/models";
import { StreamingText } from "@/components/StreamingText";
import { GitCompare, CheckCircle2, ThumbsUp } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const labelFor = (id) => MODELS.find((m) => m.id === id)?.label ?? id;

function ComparePane({ label, response, isStreaming, error, isWinner, onVote, votingDone }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-white/5">
        <div className={[
          "h-1.5 w-1.5 rounded-full",
          isWinner ? "bg-emerald-500" : "bg-violet-500",
        ].join(" ")} />
        <span className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>
        {isStreaming && (
          <span className="flex items-center gap-1 text-[11px] text-violet-500">
            <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-violet-500" />
            Generating…
          </span>
        )}
        {!isStreaming && response && !isWinner && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={11} /> Done
          </span>
        )}
        {isWinner && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <CheckCircle2 size={11} /> Winner
          </span>
        )}
      </div>

      <div className={[
        "min-h-36 text-sm transition-colors",
        isStreaming ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-700 dark:text-zinc-300",
      ].join(" ")}>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {!error && !response && !isStreaming && (
          <p className="text-sm italic text-zinc-400 dark:text-zinc-600">Response will appear here…</p>
        )}
        {(response || isStreaming) && (
          <StreamingText text={response} isStreaming={isStreaming} />
        )}
      </div>

      {/* Vote button */}
      {!isStreaming && response && !votingDone && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onVote}
          className="mt-4 flex items-center gap-1.5 self-start rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-500 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/8 dark:text-zinc-500 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/8 dark:hover:text-emerald-400"
        >
          <ThumbsUp size={12} />
          This one&apos;s better
        </motion.button>
      )}
    </div>
  );
}

export function CompareSection() {
  const {
    compareMode, responseA, responseB,
    isStreamingA, isStreamingB,
    errorA, errorB,
    compareWinner, setCompareWinner,
  } = useCompare();
  const { toast } = useToast();

  if (!compareMode) return null;

  const bothDone = !isStreamingA && !isStreamingB && (responseA || errorA) && (responseB || errorB);
  const votingDone = !!compareWinner;

  const handleVote = (winner) => {
    setCompareWinner(winner);
    const label = winner === "A" ? labelFor(COMPARE_MODEL_A) : labelFor(COMPARE_MODEL_B);
    toast({ message: `Voted: ${label} wins!`, type: "success" });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/8 dark:bg-zinc-900/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-5 py-3 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-500/15">
              <GitCompare size={11} className="text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Model Comparison
            </span>
          </div>
          {votingDone && (
            <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
              You preferred: <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {compareWinner === "A" ? labelFor(COMPARE_MODEL_A) : labelFor(COMPARE_MODEL_B)}
              </span>
            </span>
          )}
          {bothDone && !votingDone && (
            <span className="text-[11px] text-zinc-400 dark:text-zinc-600">Which response was better?</span>
          )}
        </div>

        {/* Side-by-side panes */}
        <div className="flex divide-x divide-zinc-100 dark:divide-white/5">
          <div className="flex-1 p-5">
            <ComparePane
              label={labelFor(COMPARE_MODEL_A)}
              response={responseA}
              isStreaming={isStreamingA}
              error={errorA}
              isWinner={compareWinner === "A"}
              votingDone={votingDone}
              onVote={() => handleVote("A")}
            />
          </div>
          <div className="flex-1 p-5">
            <ComparePane
              label={labelFor(COMPARE_MODEL_B)}
              response={responseB}
              isStreaming={isStreamingB}
              error={errorB}
              isWinner={compareWinner === "B"}
              votingDone={votingDone}
              onVote={() => handleVote("B")}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
