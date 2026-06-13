"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group my-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/8">
      <div className="flex items-center justify-between bg-zinc-100 px-4 py-1.5 dark:bg-zinc-800/80">
        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8rem", lineHeight: "1.6" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownRenderer({ content = "" }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-200">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 leading-7 text-zinc-800 last:mb-0 dark:text-zinc-200">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 ml-5 list-disc space-y-1 text-zinc-800 dark:text-zinc-200">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 ml-5 list-decimal space-y-1 text-zinc-800 dark:text-zinc-200">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-7">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="my-3 border-l-4 border-violet-400 pl-4 italic text-zinc-600 dark:border-violet-500/60 dark:text-zinc-400">
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 underline underline-offset-2 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/8">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-white/8 dark:bg-zinc-800/60 dark:text-zinc-400">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-zinc-100 px-4 py-2 text-zinc-700 last:border-0 dark:border-white/5 dark:text-zinc-300">
            {children}
          </td>
        ),
        hr: () => <hr className="my-4 border-zinc-200 dark:border-white/8" />,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            return <CodeBlock language={match[1]}>{children}</CodeBlock>;
          }
          return (
            <code
              className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.82em] text-violet-700 dark:bg-white/8 dark:text-violet-300"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
