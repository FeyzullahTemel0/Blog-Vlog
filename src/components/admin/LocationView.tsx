"use client";

import { motion } from "framer-motion";
import { Crosshair, Eye, EyeOff, Loader2, Radio, Save } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { useToast } from "@/components/ui/Toast";
import { LOCATION_PRESETS } from "@/data/seed";
import { getCurrentPosition, osmEmbedUrl, reverseGeocode } from "@/lib/geo";
import { useNow } from "@/lib/hooks";
import { saveLocation, useSite } from "@/lib/store";
import type { LiveLocation, Place } from "@/lib/types";
import { adminBtnGhost, adminBtnPrimary, adminCard, adminInput, adminLabel } from "@/lib/ui";
import { cn, flagEmoji, relativeTime } from "@/lib/utils";

const TRACK_INTERVAL_MS = 10000;

export function LocationView() {
  const { ready } = useSite();
  if (!ready) return <GlobeLoader label="Konum yükleniyor" />;
  return <LocationEditor />;
}

function LocationEditor() {
  const { location } = useSite();
  const toast = useToast();
  const now = useNow();

  const [status, setStatus] = useState(location.status);
  const [visible, setVisible] = useState(location.visible);
  const [city, setCity] = useState(location.city);
  const [country, setCountry] = useState(location.country);
  const [countryCode, setCountryCode] = useState(location.countryCode);
  const [busy, setBusy] = useState(false);
  const [tracking, setTracking] = useState(false);

  const latestRef = useRef(location);
  const lastSavedRef = useRef(0);

  useEffect(() => {
    latestRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!tracking) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const timestamp = Date.now();
        if (timestamp - lastSavedRef.current < TRACK_INTERVAL_MS) return;
        lastSavedRef.current = timestamp;
        const error = saveLocation({
          ...latestRef.current,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          updatedAt: new Date(timestamp).toISOString(),
        });
        if (error) toast(error, "error");
      },
      () => {
        setTracking(false);
        toast("Canlı konum alınamadı. Tarayıcı izinlerini kontrol edin.", "error");
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [tracking, toast]);

  function applyPlace(place: Place) {
    const error = saveLocation({ ...location, ...place, updatedAt: new Date().toISOString() });
    if (error) {
      toast(error, "error");
      return;
    }
    setCity(place.city);
    setCountry(place.country);
    setCountryCode(place.countryCode);
    toast(`Konum ${place.city} olarak güncellendi.`, "success");
  }

  async function updateNow() {
    setBusy(true);
    try {
      const pos = await getCurrentPosition();
      const { latitude: lat, longitude: lng } = pos.coords;
      const geo = await reverseGeocode(lat, lng);
      const next: LiveLocation = {
        ...location,
        city: geo?.city ?? city,
        country: geo?.country ?? country,
        countryCode: geo?.countryCode ?? countryCode,
        lat,
        lng,
        updatedAt: new Date().toISOString(),
      };
      const error = saveLocation(next);
      if (error) throw new Error(error);
      setCity(next.city);
      setCountry(next.country);
      setCountryCode(next.countryCode);
      toast(
        geo ? `Konum güncellendi: ${geo.city}` : "Koordinat güncellendi; şehir adı alınamadı.",
        geo ? "success" : "info"
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Konum alınamadı. Tarayıcı izinlerini kontrol edin.", "error");
    } finally {
      setBusy(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!city.trim() || !country.trim()) {
      toast("Şehir ve ülke boş bırakılamaz.", "error");
      return;
    }
    const error = saveLocation({
      ...location,
      status: status.trim() || location.status,
      visible,
      city: city.trim(),
      country: country.trim(),
      countryCode: countryCode.trim().slice(0, 2).toUpperCase(),
      updatedAt: new Date().toISOString(),
    });
    toast(error ?? "Canlı konum bilgileri kaydedildi.", error ? "error" : "success");
  }

  const mapKey = `${location.lat},${location.lng}`;
  const updatedLabel = relativeTime(location.updatedAt, now ?? Date.parse(location.updatedAt));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Canlı konum</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Şu an neredeyim?</h1>
        <p className="mt-2 text-sm text-slate-400">Sitedeki canlı konum kartı bu bilgilerle güncellenir.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(adminCard, "overflow-hidden p-3")}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900">
              <motion.iframe
                key={mapKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                title="Canlı konum haritası"
                src={osmEmbedUrl(location.lat, location.lng, 0.08)}
                className="h-full w-full border-0 grayscale-[30%] saturate-[1.1]"
                loading="lazy"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  {tracking && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full",
                      tracking ? "bg-emerald-400" : location.visible ? "bg-teal-400" : "bg-slate-500"
                    )}
                  />
                </span>
                {tracking ? "Canlı takip açık" : location.visible ? "Sitede görünür" : "Sitede gizli"}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-4">
              <div>
                <p className="font-display text-xl font-semibold text-white">
                  {flagEmoji(location.countryCode)} {location.city}, {location.country}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)} · {updatedLabel}
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(adminCard, "flex flex-wrap items-center justify-between gap-4 p-5")}
          >
            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ring-white/10 transition",
                  tracking ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-slate-400"
                )}
              >
                <Radio className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-white">Canlı takip</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
                  Tarayıcı izin verdiği sürece konumun her {TRACK_INTERVAL_MS / 1000} saniyede bir güncellenir. Şehir
                  bilgisi korunur.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={tracking}
                onClick={() => setTracking((v) => !v)}
                className={cn(
                  "relative inline-flex h-11 w-20 items-center rounded-full p-1 transition",
                  tracking ? "bg-emerald-400/30 ring-1 ring-emerald-400/40" : "bg-white/10 ring-1 ring-white/10"
                )}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className={cn(
                    "h-9 w-9 rounded-full shadow-lg",
                    tracking ? "ml-auto bg-emerald-400" : "bg-slate-300"
                  )}
                />
                <span className="sr-only">Canlı takibi aç/kapat</span>
              </button>
              <button type="button" onClick={updateNow} disabled={busy} className={adminBtnGhost}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                Konumumu güncelle
              </button>
            </div>
          </motion.section>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <motion.form
            onSubmit={save}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={cn(adminCard, "space-y-5 p-6")}
          >
            <div>
              <label htmlFor="loc-status" className={adminLabel}>
                Durum metni
              </label>
              <input
                id="loc-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Örn. Kapadokya'da gün batımı"
                className={adminInput}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="loc-city" className={adminLabel}>
                  Şehir
                </label>
                <input id="loc-city" value={city} onChange={(e) => setCity(e.target.value)} className={adminInput} />
              </div>
              <div>
                <label htmlFor="loc-country" className={adminLabel}>
                  Ülke
                </label>
                <input
                  id="loc-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={adminInput}
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] items-end gap-4">
              <div>
                <label htmlFor="loc-code" className={adminLabel}>
                  Ülke kodu
                </label>
                <input
                  id="loc-code"
                  value={countryCode}
                  maxLength={2}
                  onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                  className={cn(adminInput, "uppercase")}
                />
              </div>
              <span className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-white/5 text-2xl ring-1 ring-white/10">
                {flagEmoji(countryCode)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="text-sm font-semibold text-white">Sitede göster</p>
                <p className="mt-0.5 text-xs text-slate-400">Kapalıyken canlı konum kartı gizlenir.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={visible}
                onClick={() => setVisible((v) => !v)}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full ring-1 transition",
                  visible ? "bg-teal-400/20 text-teal-300 ring-teal-400/40" : "bg-white/5 text-slate-400 ring-white/10"
                )}
              >
                {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="sr-only">Göster</span>
              </button>
            </div>

            <button type="submit" className={cn(adminBtnPrimary, "w-full")}>
              <Save className="h-4 w-4" />
              Kaydet
            </button>
          </motion.form>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(adminCard, "p-6")}
      >
        <h2 className="font-display text-xl font-semibold text-white">Hızlı konum seçimi</h2>
        <p className="mt-1 text-xs text-slate-400">Bir şehre tıklayarak konumunu anında değiştir.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {LOCATION_PRESETS.map((place) => {
            const active = place.city === location.city && place.countryCode === location.countryCode;
            return (
              <motion.button
                key={`${place.city}-${place.countryCode}`}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyPlace(place)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                  active
                    ? "border-teal-400/50 bg-teal-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                )}
              >
                <span className="text-2xl">{flagEmoji(place.countryCode)}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">{place.city}</span>
                  <span className="block truncate text-xs text-slate-400">{place.country}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
