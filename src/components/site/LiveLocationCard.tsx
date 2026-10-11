"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Eye, EyeOff, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { useNow } from "@/lib/hooks";
import type { LiveLocation } from "@/lib/types";
import { flagEmoji, relativeTime } from "@/lib/utils";
import { osmEmbedUrl } from "@/lib/geo";

export function LiveLocationCard({ location }: { location: LiveLocation }) {
  const now = useNow();
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-night p-6 text-white shadow-2xl shadow-night/30 ring-1 ring-white/10 md:p-8">
      <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal/40 blur-3xl animate-blob" />
      <span className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl animate-blob" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
          {location.visible ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-ring" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Canlı konum
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-white/60" /> Gizli
            </>
          )}
        </div>
        <Navigation className="h-5 w-5 text-amber-300" />
      </div>

      {location.visible ? (
        <>
          <div className="relative mt-7 flex items-end gap-4">
            <span className="text-5xl drop-shadow-lg">{flagEmoji(location.countryCode)}</span>
            <div>
              <p className="font-display text-3xl font-semibold leading-none">{location.city}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                <MapPin className="h-3.5 w-3.5" /> {location.country}
              </p>
            </div>
          </div>

          <p className="relative mt-6 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-white/85 ring-1 ring-white/10">
            {location.status}
          </p>

          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock3 className="h-3.5 w-3.5" />
              {now === null ? "Güncelleniyor…" : `Güncellendi · ${relativeTime(location.updatedAt, now)}`}
            </span>
            <button
              onClick={() => setShowMap((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-night transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              {showMap ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showMap ? "Haritayı kapat" : "Haritada gör"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <iframe
                  title={`${location.city} harita`}
                  src={osmEmbedUrl(location.lat, location.lng)}
                  className="mt-5 h-56 w-full rounded-2xl ring-1 ring-white/10"
                  loading="lazy"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <p className="relative mt-7 text-sm leading-relaxed text-white/60">
          Gezgin şu anda konumunu paylaşmıyor. Yeni bir durak olduğunda burada görünecek.
        </p>
      )}
    </div>
  );
}
