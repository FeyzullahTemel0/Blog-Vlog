"use client";

import { ArrowLeft, Crosshair, ImagePlus, Loader2, MapPin, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CoverArt } from "@/components/ui/CoverArt";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { useToast } from "@/components/ui/Toast";
import { LOCATION_PRESETS } from "@/data/seed";
import { getCurrentPosition, osmEmbedUrl, reverseGeocode } from "@/lib/geo";
import { renderContent } from "@/lib/render";
import { isSlugTaken, savePost, useSite } from "@/lib/store";
import type { Category, LiveLocation, Post, PostStatus } from "@/lib/types";
import { adminBtnGhost, adminBtnPrimary, adminCard, adminInput, adminLabel } from "@/lib/ui";
import { findCategory, slugify, uid } from "@/lib/utils";
import { ImageDropzone } from "./ImageDropzone";

interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  tags: string;
  content: string;
  cover: string;
  gallery: string[];
  city: string;
  country: string;
  countryCode: string;
  lat: string;
  lng: string;
}

function toDraft(post: Post | undefined, location: LiveLocation, fallbackCategory: string): Draft {
  if (post) {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      categoryId: post.categoryId,
      tags: post.tags.join(", "),
      content: post.content,
      cover: post.cover,
      gallery: post.gallery,
      city: post.place.city,
      country: post.place.country,
      countryCode: post.place.countryCode,
      lat: String(post.place.lat),
      lng: String(post.place.lng),
    };
  }
  return {
    title: "",
    slug: "",
    excerpt: "",
    categoryId: fallbackCategory,
    tags: "",
    content: "",
    cover: "",
    gallery: [],
    city: location.city,
    country: location.country,
    countryCode: location.countryCode,
    lat: String(location.lat),
    lng: String(location.lng),
  };
}

function parseCoord(value: string, limit: number) {
  if (value.trim() === "") return NaN;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : NaN;
}

const MARKDOWN_TOOLS = [
  { label: "H2", title: "Başlık", before: "## ", after: "", placeholder: "Bölüm başlığı", atLineStart: true },
  { label: "H3", title: "Alt başlık", before: "### ", after: "", placeholder: "Alt başlık", atLineStart: true },
  { label: "❝", title: "Alıntı", before: "> ", after: "", placeholder: "Alıntı", atLineStart: true },
  { label: "•", title: "Liste", before: "- ", after: "", placeholder: "Madde", atLineStart: true },
  { label: "B", title: "Kalın", before: "**", after: "**", placeholder: "kalın metin", atLineStart: false },
];

export function PostForm({ postId }: { postId?: string }) {
  const { ready, posts, categories, location } = useSite();

  if (!ready) return <GlobeLoader label="Yazı hazırlanıyor" />;

  if (!postId) {
    return <Editor categories={categories} location={location} />;
  }

  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return (
      <div className={`${adminCard} grid place-items-center p-12 text-center`}>
        <p className="text-5xl">🧭</p>
        <h1 className="mt-4 text-xl font-semibold text-white">Yazı bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-400">Bu yazı silinmiş veya bağlantı hatalı olabilir.</p>
        <Link href="/admin/yazilar" className={`${adminBtnGhost} mt-6`}>
          Yazılara dön
        </Link>
      </div>
    );
  }

  return <Editor key={post.id} post={post} categories={categories} location={location} />;
}

function Editor({
  post,
  categories,
  location,
}: {
  post?: Post;
  categories: Category[];
  location: LiveLocation;
}) {
  const router = useRouter();
  const toast = useToast();
  const [id] = useState(() => post?.id ?? uid());
  const [draft, setDraft] = useState<Draft>(() => toDraft(post, location, categories[0]?.id ?? ""));
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState<PostStatus | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const lat = parseCoord(draft.lat, 90);
  const lng = parseCoord(draft.lng, 180);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const category = findCategory(categories, draft.categoryId);
  const slugPreview = draft.slug.trim() || slugify(draft.title);
  const slugConflict = slugPreview !== "" && isSlugTaken(slugPreview, id);
  const isEdit = !!post;

  function onTitleChange(value: string) {
    set("title", value);
    if (!slugTouched) set("slug", slugify(value));
  }

  function insertMarkdown(before: string, after = "", placeholder = "metin", atLineStart = false) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end) || placeholder;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const insertAt = atLineStart ? lineStart : start;
    const head = value.slice(0, insertAt);
    const tail = value.slice(end);
    const middle = atLineStart ? value.slice(insertAt, start) + before + selected : before + selected;
    const next = head + middle + after + tail;
    set("content", next);
    const caret = head.length + middle.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret - selected.length, caret);
    });
  }

  function applyPreset(index: string) {
    const preset = LOCATION_PRESETS[Number(index)];
    if (!preset) return;
    setDraft((d) => ({
      ...d,
      city: preset.city,
      country: preset.country,
      countryCode: preset.countryCode,
      lat: String(preset.lat),
      lng: String(preset.lng),
    }));
  }

  async function useMyLocation() {
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      const found = await reverseGeocode(latitude, longitude);
      setDraft((d) => ({
        ...d,
        lat: latitude.toFixed(5),
        lng: longitude.toFixed(5),
        city: found?.city ?? d.city,
        country: found?.country ?? d.country,
        countryCode: found?.countryCode ?? d.countryCode,
      }));
      toast("Konumunuz yazının yerine eklendi.", "success");
    } catch {
      toast("Konum alınamadı. Tarayıcı izinlerini kontrol edin.", "error");
    } finally {
      setLocating(false);
    }
  }

  async function save(status: PostStatus) {
    if (!draft.title.trim()) return toast("Başlık boş bırakılamaz.", "error");
    if (!draft.content.trim()) return toast("Yazı içeriği boş olamaz.", "error");
    if (!draft.categoryId) return toast("Lütfen bir kategori seçin.", "error");
    if (!slugPreview) return toast("Bağlantı (slug) oluşturulamadı.", "error");
    if (slugConflict) return toast("Bu bağlantı başka bir yazıda kullanılıyor.", "error");
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return toast("Koordinatlar geçersiz. Enlem -90 ile 90, boylam -180 ile 180 arasında olmalı.", "error");
    }

    const now = new Date().toISOString();
    const next: Post = {
      id,
      slug: slugPreview,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content,
      categoryId: draft.categoryId,
      tags: Array.from(new Set(draft.tags.split(",").map((t) => t.trim()).filter(Boolean))),
      status,
      cover: draft.cover,
      gallery: draft.gallery,
      place: {
        city: draft.city.trim() || "Bilinmeyen konum",
        country: draft.country.trim(),
        countryCode: draft.countryCode.trim().toUpperCase(),
        lat,
        lng,
      },
      createdAt: post?.createdAt ?? now,
      updatedAt: now,
    };

    setSaving(status);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    const error = savePost(next);
    setSaving(null);
    if (error) return toast(error, "error");

    set("slug", next.slug);
    toast(status === "published" ? "Yazı yayında." : "Taslak kaydedildi.", "success");
    if (!isEdit) router.replace(`/admin/yazilar/${id}`);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/yazilar" className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-teal-300">
            <ArrowLeft className="h-4 w-4" /> Yazılara dön
          </Link>
          <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">
            {isEdit ? "Yazıyı düzenle" : "Yeni bir rota anlat"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isEdit ? "Değişiklikler yayındaki sayfaya anında yansır." : "Başlık, içerik ve konumu doldur; sağda canlı önizlemeyi gör."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => save("draft")}
            disabled={saving !== null}
            className={`${adminBtnGhost} disabled:opacity-60`}
          >
            {saving === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Taslak kaydet
          </button>
          <button
            type="button"
            onClick={() => save("published")}
            disabled={saving !== null}
            className={`${adminBtnPrimary} disabled:opacity-60`}
          >
            {saving === "published" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {post?.status === "published" ? "Güncelle" : "Yayınla"}
          </button>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="space-y-6">
          <section className={`${adminCard} space-y-6 p-6 md:p-8`}>
            <div>
              <label htmlFor="title" className={adminLabel}>Başlık</label>
              <input
                id="title"
                value={draft.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Örn. Kapadokya'da sabahın ilk ışığı"
                className={`${adminInput} font-display text-lg`}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="slug" className={adminLabel}>Bağlantı (slug)</label>
                <input
                  id="slug"
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  placeholder="otomatik-olusur"
                  className={`${adminInput} ${slugConflict ? "ring-rose-400/60" : ""}`}
                />
                <p className={`mt-2 text-xs ${slugConflict ? "text-rose-300" : "text-slate-500"}`}>
                  {slugConflict ? "Bu bağlantı zaten kullanılıyor." : `/blog/${slugPreview || "..."}`}
                </p>
              </div>
              <div>
                <label htmlFor="category" className={adminLabel}>Kategori</label>
                <select
                  id="category"
                  value={draft.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                  className={adminInput}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className={adminLabel}>Özet</label>
              <textarea
                id="excerpt"
                rows={2}
                value={draft.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Listede ve paylaşımlarda görünecek kısa tanıtım cümlesi"
                className={`${adminInput} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="tags" className={adminLabel}>Etiketler</label>
              <input
                id="tags"
                value={draft.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="kapadokya, sabah, balon"
                className={adminInput}
              />
              <p className="mt-2 text-xs text-slate-500">Virgülle ayırın.</p>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">İçerik</span>
                <div className="flex flex-wrap gap-1.5">
                  {MARKDOWN_TOOLS.map((tool) => (
                    <button
                      key={tool.title}
                      type="button"
                      title={tool.title}
                      onClick={() => insertMarkdown(tool.before, tool.after, tool.placeholder, tool.atLineStart)}
                      className="grid h-8 min-w-8 place-items-center rounded-lg bg-white/5 px-2 text-xs font-bold text-slate-300 ring-1 ring-white/10 transition hover:bg-teal-400/15 hover:text-teal-200"
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                id="content"
                ref={textareaRef}
                rows={16}
                value={draft.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={"Hikayeni yaz...\n\n## Bir bölüm başlığı\n\nParagraflar boş satırla ayrılır."}
                className={`${adminInput} resize-y font-mono text-[13px] leading-relaxed`}
              />
              <p className="mt-2 text-xs text-slate-500">Desteklenen biçimler: başlık (##, ###), alıntı (&gt;), liste (-) ve **kalın**.</p>
            </div>
          </section>

          <section className={`${adminCard} space-y-6 p-6 md:p-8`}>
            <div className="flex items-center gap-2 text-white">
              <ImagePlus className="h-4 w-4 text-teal-300" />
              <h2 className="font-semibold">Görseller</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <ImageDropzone label="Kapak görseli" images={draft.cover ? [draft.cover] : []} onChange={(imgs) => set("cover", imgs[0] ?? "")} />
              <ImageDropzone label="Galeri" multiple images={draft.gallery} onChange={(imgs) => set("gallery", imgs)} hint="Birden fazla görsel seçebilirsiniz" />
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <section className={`${adminCard} space-y-5 p-6`}>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-amber-300" />
              <h2 className="font-semibold">Konum</h2>
            </div>

            <div>
              <label htmlFor="preset" className={adminLabel}>Hızlı seçim</label>
              <select id="preset" defaultValue="" onChange={(e) => applyPreset(e.target.value)} className={adminInput}>
                <option value="" disabled className="bg-slate-900">Bir yer seçin</option>
                {LOCATION_PRESETS.map((p, i) => (
                  <option key={p.city} value={i} className="bg-slate-900">
                    {p.city}, {p.country}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" onClick={useMyLocation} disabled={locating} className={`${adminBtnGhost} w-full disabled:opacity-60`}>
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
              Konumumu kullan
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label htmlFor="city" className={adminLabel}>Şehir</label>
                <input id="city" value={draft.city} onChange={(e) => set("city", e.target.value)} className={adminInput} />
              </div>
              <div>
                <label htmlFor="country" className={adminLabel}>Ülke</label>
                <input id="country" value={draft.country} onChange={(e) => set("country", e.target.value)} className={adminInput} />
              </div>
              <div>
                <label htmlFor="cc" className={adminLabel}>Kod</label>
                <input id="cc" maxLength={2} value={draft.countryCode} onChange={(e) => set("countryCode", e.target.value.toUpperCase())} className={adminInput} />
              </div>
              <div>
                <label htmlFor="lat" className={adminLabel}>Enlem</label>
                <input id="lat" inputMode="decimal" value={draft.lat} onChange={(e) => set("lat", e.target.value)} className={adminInput} />
              </div>
              <div>
                <label htmlFor="lng" className={adminLabel}>Boylam</label>
                <input id="lng" inputMode="decimal" value={draft.lng} onChange={(e) => set("lng", e.target.value)} className={adminInput} />
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
              {hasCoords ? (
                <iframe title="Konum önizlemesi" src={osmEmbedUrl(lat, lng, 0.08)} className="h-full w-full grayscale-[25%] contrast-[1.05]" loading="lazy" />
              ) : (
                <div className="grid h-full place-items-center bg-white/[0.03] text-xs text-slate-500">Geçerli koordinat girin</div>
              )}
            </div>
          </section>

          <section className={`${adminCard} overflow-hidden`}>
            <div className="border-b border-white/10 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Canlı önizleme</p>
            </div>
            <div className="relative aspect-[16/10]">
              <CoverArt src={draft.cover || undefined} title={draft.title || "Yazı"} category={category} className="h-full w-full" />
            </div>
            <div className="space-y-3 p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                {category.emoji} {category.name}
              </span>
              <h3 className="font-display text-xl font-semibold text-white">{draft.title || "Başlık burada görünecek"}</h3>
              {draft.excerpt && <p className="text-sm text-slate-400">{draft.excerpt}</p>}
              <div className="prose-yd max-h-72 overflow-y-auto pr-2 text-sm text-slate-300">
                {draft.content.trim() ? renderContent(draft.content) : <p className="text-slate-500">İçerik yazdıkça burada beliren önizleme.</p>}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
