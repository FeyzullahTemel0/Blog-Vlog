"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Tone = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

type ToastFn = (message: string, tone?: Tone) => void;

const ToastContext = createContext<ToastFn>(() => {});

export function useToast(): ToastFn {
  return useContext(ToastContext);
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONE_CLASS: Record<Tone, string> = {
  success: "text-emerald-600 bg-emerald-50",
  error: "text-rose-600 bg-rose-50",
  info: "text-teal bg-teal-soft/60",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback<ToastFn>(
    (message, tone = "info") => {
      counter.current += 1;
      const id = counter.current;
      setItems((list) => [...list.slice(-2), { id, message, tone }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss],
  );

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(92vw,380px)] flex-col gap-3">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = ICONS[item.tone];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-white/95 p-4 shadow-2xl shadow-ink/10 backdrop-blur"
                role="status"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${TONE_CLASS[item.tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="flex-1 pt-1.5 text-sm font-medium leading-snug text-ink">{item.message}</p>
                <button
                  onClick={() => dismiss(item.id)}
                  className="rounded-lg p-1 text-ink/40 transition hover:bg-ink/5 hover:text-ink"
                  aria-label="Kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
