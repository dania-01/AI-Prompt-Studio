"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = "info", duration = 2500 }) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className={[
                "pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-[13px] font-medium shadow-lg backdrop-blur-md",
                t.type === "success"
                  ? "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-950/80 dark:text-emerald-300"
                  : t.type === "error"
                  ? "border-red-200/80 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-950/80 dark:text-red-300"
                  : "border-zinc-200 bg-white text-zinc-700 dark:border-white/8 dark:bg-zinc-900 dark:text-zinc-200",
              ].join(" ")}
            >
              {t.type === "success" && <Check size={13} className="shrink-0" />}
              {t.type === "error" && <AlertCircle size={13} className="shrink-0" />}
              {t.type === "info" && <Info size={13} className="shrink-0" />}
              <span>{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-1 shrink-0 opacity-50 transition-opacity hover:opacity-100"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};
