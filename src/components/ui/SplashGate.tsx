"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useSite } from "@/lib/store";
import { GlobeLoader } from "./GlobeLoader";

const SEEN_KEY = "yolcunun-defteri:splash-seen";
const MIN_MS = 1400;

const noopSubscribe = () => () => {};
const readSeen = () => window.sessionStorage.getItem(SEEN_KEY) === "1";
const isAdminPath = () => window.location.pathname.startsWith("/admin");

// Açılış ekranı oturumda bir kez gösterilir. Sunucu HTML'i içeriği zaten taşır;
// overlay yalnızca üstte durur, SEO ve ilk boyama bozulmaz.
export function SplashGate({ children }: { children: React.ReactNode }) {
  const isAdmin = useSyncExternalStore(noopSubscribe, isAdminPath, () => false);
  const seen = useSyncExternalStore(noopSubscribe, readSeen, () => false);
  const { ready } = useSite();
  const [minElapsed, setMinElapsed] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = minElapsed && ready;

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!finished || isAdmin) return;
    window.sessionStorage.setItem(SEEN_KEY, "1");
    const t = setTimeout(() => setGone(true), 750);
    return () => clearTimeout(t);
  }, [finished, isAdmin]);

  const showSplash = !isAdmin && !seen && !gone;

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-paper grain"
            initial={{ opacity: 1 }}
            animate={finished ? { opacity: 0, filter: "blur(10px)", scale: 1.04 } : { opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            exit={{ opacity: 0 }}
            aria-busy={!finished}
          >
            <div className="flex flex-col items-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal to-teal-700 text-white shadow-lg shadow-teal/30">
                  <Compass className="h-5 w-5" />
                </span>
                <span className="font-display text-2xl font-semibold tracking-tight">Yolcunun Defteri</span>
              </motion.div>

              <GlobeLoader label="Site hazırlanıyor" />

              <div className="h-[3px] w-56 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal via-teal-400 to-amber-400"
                  initial={{ width: "0%" }}
                  animate={{ width: finished ? "100%" : "88%" }}
                  transition={{ duration: finished ? 0.35 : MIN_MS / 1000, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
