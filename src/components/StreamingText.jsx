"use client";

import { motion } from "framer-motion";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export function StreamingText({ text = "", isStreaming = false }) {
  return (
    <div className="relative text-sm leading-7">
      <MarkdownRenderer content={text} />
      {isStreaming && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          className="ml-0.5 inline-block h-3.5 w-0.5 rounded-sm bg-violet-500 align-text-bottom"
        />
      )}
    </div>
  );
}
