"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LETTERS = "Yükleniyor".split("");

export function GlobeLoader({
  label = "Yükleniyor",
  fullscreen = false,
  className,
}: {
  label?: string;
  fullscreen?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-7",
        fullscreen && "fixed inset-0 z-[100] bg-paper grain",
        className,
      )}
    >
      <div className="relative h-28 w-28">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-teal/40"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}

        <div className="absolute inset-4 overflow-hidden rounded-full bg-gradient-to-br from-teal-400 via-teal-700 to-night shadow-[inset_-8px_-10px_22px_rgba(0,0,0,0.35),0_18px_40px_-12px_rgba(15,118,110,0.6)]">
          <div
            className="absolute inset-0 animate-drift opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 1.5px, transparent 1.5px 22px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 20px)",
            }}
          />
          <div className="absolute left-[18%] top-[22%] h-[18%] w-[26%] rounded-[50%] bg-amber-300/25 blur-[1px]" />
        </div>

        <div className="absolute inset-0 animate-orbit">
          <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_18px_5px_rgba(251,191,36,0.55)]" />
        </div>

        <motion.div
          className="absolute -inset-1 rounded-full border border-dashed border-ink/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -bottom-1 right-[14%] h-2 w-2 rounded-full bg-coral" />
        </motion.div>
      </div>

      <div className="flex items-center gap-[2px] text-sm font-semibold tracking-wide text-ink" aria-hidden>
        {LETTERS.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block"
            animate={{ y: [0, -7, 0], color: ["#1C1A17", "#0F766E", "#1C1A17"] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.075,
              ease: "easeInOut",
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
