"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Loader2, Plus, Save, Search, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { useToast } from "@/components/ui/Toast";
import { BrandIcon, SocialLinks } from "@/components/site/SocialLinks";
import { PLATFORMS, findPlatform, luminance, resolveSocial } from "@/lib/socials";
import { saveSocials, useSite } from "@/lib/store";
import type { SocialLink } from "@/lib/types";
import { adminBtnPrimary, adminCard, adminInput, adminLabel } from "@/lib/ui";
import { cn } from "@/lib/utils";

const MAX_HANDLE = 40;
const MAX_URL = 300;
const MAX_RESULTS = 24;

interface CatalogItem {
  slug: string;
  label: string;
  path: string;
  hex: string;
}

const CURATED: CatalogItem[] = PLATFORMS.map((p) => ({ slug: p.key, label: p.label, path: p.path, hex: p.hex }));
const curatedSlugs = new Set(CURATED.map((c) => c.slug));

// Tüm marka logoları yalnızca admin'de, arama yapılınca yüklenir; ana sayfa pakete dahil etmez.
let catalogPromise: Promise<CatalogItem[]> | null = null;
function loadCatalog() {
  catalogPromise ??= import("simple-icons").then((mod) =>
    Object.values(mod)
      .filter((icon): icon is (typeof mod)["siX"] => Boolean(icon && typeof icon === "object" && "path" in icon))
      .map((icon) => ({ slug: icon.slug, label: icon.title, path: icon.path, hex: icon.hex })),
  );
  return catalogPromise;
}

function tileColor(hex: string) {
  return luminance(hex) > 0.75 ? "#1A1A1A" : `#${hex}`;
}

function validateHandle(slug: string, raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Kullanıcı adı boş olamaz.";
  if (value.length > MAX_HANDLE) return `En fazla ${MAX_HANDLE} karakter.`;
  if (findPlatform(slug) && /[\s/\\:]/.test(value)) return "Bağlantı değil, yalnızca kullanıcı adını yaz.";
  if (slug === "whatsapp" && value.replace(/\D/g, "").length < 7) return "Geçerli bir telefon numarası yaz.";
  return null;
}

function normalizeUrl(raw: string): { url: string | null; error?: string } {
  const value = raw.trim();
  if (!value) return { url: null, error: "Profil bağlantısı boş olamaz." };
  if (value.length > MAX_URL) return { url: null, error: "Bağlantı çok uzun." };
  try {
    const parsed = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    if (!/^https?:$/.test(parsed.protocol) || !parsed.hostname.includes(".")) throw new Error("invalid");
    return { url: parsed.toString() };
  } catch {
    return { url: null, error: "Geçerli bir bağlantı yaz (ör. https://site.com/profilim)." };
  }
}

export function SocialsView() {
  const { ready, socials } = useSite();
  if (!ready) return <GlobeLoader label="Hesaplar yükleniyor" />;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Topluluk</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Sosyal Hesaplar</h1>
        <p className="mt-2 text-sm text-slate-400">
          {socials.length} hesap · Ana sayfada konum bilgisinin yanında, Hakkımda sayfasında ve altbilgide görünür.
        </p>
      </header>

      <div className={cn(adminCard, "relative overflow-hidden p-5 sm:p-6")}>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sitede böyle görünür</p>
        <div className="mt-4 rounded-2xl bg-[#F7F4EE] p-4 sm:p-5">
          {socials.length > 0 ? (
            <SocialLinks socials={socials} variant="dock" />
          ) : (
            <p className="text-sm text-ink/50">Henüz hesap eklenmedi.</p>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        <AnimatePresence initial={false}>
          {socials.map((social) => (
            <motion.div
              key={social.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <SocialRow social={social} all={socials} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AddSocial socials={socials} />
    </div>
  );
}

function SocialRow({ social, all }: { social: SocialLink; all: SocialLink[] }) {
  const toast = useToast();
  const resolved = resolveSocial(social);
  const isCustom = !findPlatform(social.platform);
  const [value, setValue] = useState(social.handle);
  const [url, setUrl] = useState(social.url ?? "");
  if (!resolved) return null;

  const dirty = value.trim() !== social.handle || (isCustom && url.trim() !== (social.url ?? ""));
  const handleError = dirty ? validateHandle(social.platform, value) : null;
  const urlError = dirty && isCustom ? normalizeUrl(url).error ?? null : null;
  const error = handleError ?? urlError;
  const prefix = findPlatform(social.platform)?.prefix;

  function save() {
    const problem = validateHandle(social.platform, value) ?? (isCustom ? normalizeUrl(url).error : null);
    if (problem) return toast(problem, "error");
    const nextUrl = isCustom ? normalizeUrl(url).url ?? undefined : social.url;
    const failure = saveSocials(
      all.map((s) => (s.id === social.id ? { ...s, handle: value.trim(), url: nextUrl } : s)),
    );
    if (failure) return toast(failure, "error");
    toast(`${resolved?.label} güncellendi`, "success");
  }

  function remove() {
    const failure = saveSocials(all.filter((s) => s.id !== social.id));
    if (failure) return toast(failure, "error");
    toast(`${resolved?.label} kaldırıldı`, "info");
  }

  return (
    <div className={cn(adminCard, "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5")}>
      <div className="flex min-w-0 items-center gap-3 sm:w-52 sm:shrink-0">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-lg shadow-black/20"
          style={{ color: tileColor(resolved.hex) }}
        >
          <BrandIcon path={resolved.path} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{resolved.label}</p>
          <a
            href={resolved.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 text-xs text-slate-400 transition hover:text-teal-300"
          >
            <span className="truncate">{resolved.display}</span> <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              {prefix}
            </span>
          )}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && dirty && save()}
            maxLength={MAX_HANDLE + 10}
            aria-label={`${resolved.label} kullanıcı adı`}
            aria-invalid={Boolean(handleError)}
            className={cn(adminInput, prefix && "pl-9", handleError && "ring-rose-400/60")}
          />
        </div>
        {isCustom && (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && dirty && save()}
            maxLength={MAX_URL + 20}
            placeholder="https://..."
            aria-label={`${resolved.label} profil bağlantısı`}
            aria-invalid={Boolean(urlError)}
            className={cn(adminInput, urlError && "ring-rose-400/60")}
          />
        )}
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>

      <div className="flex gap-2 sm:shrink-0">
        <AnimatePresence initial={false}>
          {dirty && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.8, width: 0 }}
              onClick={save}
              disabled={Boolean(error)}
              className={cn(adminBtnPrimary, "overflow-hidden whitespace-nowrap disabled:opacity-50")}
            >
              <Save className="h-4 w-4" /> Kaydet
            </motion.button>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={remove}
          aria-label={`${resolved.label} hesabını kaldır`}
          className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/20 transition hover:bg-rose-500/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AddSocial({ socials }: { socials: SocialLink[] }) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<CatalogItem[] | null>(null);
  const [picked, setPicked] = useState<CatalogItem | null>(null);
  const [handle, setHandle] = useState("");
  const [url, setUrl] = useState("");

  const used = new Set(socials.map((s) => s.platform));
  const term = query.trim().toLowerCase();
  const pool = term && catalog ? [...CURATED, ...catalog.filter((c) => !curatedSlugs.has(c.slug))] : CURATED;
  const matches = pool.filter(
    (item) => !used.has(item.slug) && (!term || item.label.toLowerCase().includes(term) || item.slug.includes(term)),
  );
  // Katalogdaki platformlar arama sonuçlarında öne çıkar.
  const results = (term ? [...matches].sort((a, b) => Number(curatedSlugs.has(b.slug)) - Number(curatedSlugs.has(a.slug))) : matches).slice(
    0,
    term ? MAX_RESULTS : CURATED.length,
  );
  const loadingCatalog = Boolean(term) && !catalog;
  const isCustom = picked ? !findPlatform(picked.slug) : false;
  const curatedPick = picked ? findPlatform(picked.slug) : undefined;

  function onSearch(value: string) {
    setQuery(value);
    if (value.trim() && !catalog) {
      loadCatalog().then(setCatalog).catch(() => toast("Logo kataloğu yüklenemedi.", "error"));
    }
  }

  function pick(item: CatalogItem) {
    setPicked(item);
    setHandle("");
    setUrl("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!picked) return toast("Önce bir platform seç.", "error");
    const handleProblem = validateHandle(picked.slug, handle);
    if (handleProblem) return toast(handleProblem, "error");

    let entry: SocialLink = { id: `soc-${picked.slug}`, platform: picked.slug, handle: handle.trim() };
    if (isCustom) {
      const parsed = normalizeUrl(url);
      if (!parsed.url) return toast(parsed.error ?? "Geçersiz bağlantı.", "error");
      entry = { ...entry, label: picked.label, path: picked.path, hex: picked.hex, url: parsed.url };
    }

    const failure = saveSocials([...socials, entry]);
    if (failure) return toast(failure, "error");
    toast(`${picked.label} eklendi 🎉`, "success");
    setPicked(null);
    setHandle("");
    setUrl("");
    setQuery("");
  }

  return (
    <form onSubmit={submit} className={cn(adminCard, "space-y-5 p-5 sm:p-6")}>
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Yeni hesap ekle</h2>
        <p className="mt-1 text-sm text-slate-400">
          Listede yoksa adını ara; 3.400&apos;den fazla markanın logosu ve rengi otomatik gelir.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => !catalog && loadCatalog().then(setCatalog).catch(() => {})}
          placeholder="Platform ara: Reddit, Kick, Behance, Steam…"
          aria-label="Platform ara"
          className={cn(adminInput, "pl-11 pr-10")}
        />
        {loadingCatalog && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
          {results.map((item) => {
            const active = item.slug === picked?.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => pick(item)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-medium ring-1 transition duration-300 hover:-translate-y-0.5",
                  active
                    ? "bg-teal-400/15 text-white ring-teal-300/60"
                    : "bg-white/[0.04] text-slate-300 ring-white/10 hover:bg-white/[0.08]",
                )}
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white"
                  style={{ color: tileColor(item.hex) }}
                >
                  <BrandIcon path={item.path} className="h-5 w-5" />
                </span>
                <span className="line-clamp-2 break-words">{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl bg-white/[0.03] p-5 text-center text-sm text-slate-400 ring-1 ring-white/10">
          {loadingCatalog ? "Logolar yükleniyor…" : "Eşleşen platform bulunamadı. Farklı bir ad dene."}
        </p>
      )}

      <AnimatePresence initial={false}>
        {picked && (
          <motion.div
            key={picked.slug}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-1">
              <div>
                <label htmlFor="social-handle" className={adminLabel}>
                  {picked.label} {isCustom ? "görünen ad" : "kullanıcı adı"}
                </label>
                <div className="relative mt-2">
                  {curatedPick?.prefix && (
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      {curatedPick.prefix}
                    </span>
                  )}
                  <input
                    id="social-handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder={curatedPick?.placeholder ?? "@kullanici_adi"}
                    autoFocus
                    className={cn(adminInput, curatedPick?.prefix && "pl-9")}
                  />
                </div>
              </div>
              {isCustom && (
                <div>
                  <label htmlFor="social-url" className={adminLabel}>
                    Profil bağlantısı
                  </label>
                  <input
                    id="social-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className={cn(adminInput, "mt-2")}
                  />
                </div>
              )}
              <button type="submit" className={cn(adminBtnPrimary, "w-full justify-center sm:w-auto")}>
                <Plus className="h-4 w-4" /> Ekle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
