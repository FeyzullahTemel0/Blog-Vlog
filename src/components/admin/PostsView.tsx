"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, FilePenLine, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CoverArt } from "@/components/ui/CoverArt";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { useToast } from "@/components/ui/Toast";
import { deletePost, useSite } from "@/lib/store";
import type { Post, PostStatus } from "@/lib/types";
import { adminBtnPrimary, adminCard, adminInput } from "@/lib/ui";
import { cn, findCategory, formatShortDate } from "@/lib/utils";

type Filter = "all" | PostStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "published", label: "Yayında" },
  { value: "draft", label: "Taslak" },
];

export function PostsView() {
  const { ready, posts, categories } = useSite();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return [...posts]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((p) => filter === "all" || p.status === filter)
      .filter((p) => !q || `${p.title} ${p.place.city} ${p.tags.join(" ")}`.toLocaleLowerCase("tr-TR").includes(q));
  }, [posts, query, filter]);

  if (!ready) return <GlobeLoader label="Yazılar yükleniyor" />;

  function confirmDelete() {
    if (!pendingDelete) return;
    const error = deletePost(pendingDelete.id);
    toast(error ?? "Yazı silindi.", error ? "error" : "success");
    setPendingDelete(null);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">İçerik</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Yazılar</h1>
          <p className="mt-2 text-sm text-slate-400">
            {counts.published} yayında, {counts.draft} taslak. Her yazı bir rota ve bir konum taşır.
          </p>
        </div>
        <Link href="/admin/yazilar/yeni" className={adminBtnPrimary}>
          <Plus className="h-4 w-4" /> Yeni yazı
        </Link>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Başlık, şehir veya etiket ara..."
            className={`${adminInput} pl-11`}
            aria-label="Yazılarda ara"
          />
        </div>
        <div role="tablist" className="flex gap-1 rounded-2xl bg-white/[0.04] p-1 ring-1 ring-white/10">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "relative rounded-xl px-4 py-2 text-sm font-medium transition",
                  active ? "text-slate-950" : "text-slate-400 hover:text-white",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="post-filter"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-300 to-emerald-300"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {f.label} <span className="ml-1 text-xs opacity-70">{counts[f.value]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={`${adminCard} grid place-items-center px-6 py-16 text-center`}>
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-400/10 text-teal-300">
            <FilePenLine className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-white">
            {posts.length === 0 ? "Henüz yazı yok" : "Eşleşen yazı bulunamadı"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            {posts.length === 0 ? "İlk rotanı anlatarak başla." : "Arama veya filtreyi değiştirmeyi dene."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {rows.map((post) => {
              const category = findCategory(categories, post.categoryId);
              const published = post.status === "published";
              return (
                <motion.li
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35 }}
                  className={cn(adminCard, "group flex flex-col gap-4 p-4 transition hover:bg-white/[0.07] sm:flex-row sm:items-center")}
                >
                  <Link href={`/admin/yazilar/${post.id}`} className="relative h-20 w-full shrink-0 overflow-hidden rounded-2xl sm:w-28">
                    <CoverArt src={post.cover || undefined} title={post.title} category={category} emojiSize="text-3xl" className="h-full w-full" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1",
                          published ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20" : "bg-amber-400/10 text-amber-300 ring-amber-400/20",
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-emerald-400" : "bg-amber-400")} />
                        {published ? "Yayında" : "Taslak"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {category.emoji} {category.name}
                      </span>
                    </div>
                    <Link href={`/admin/yazilar/${post.id}`} className="mt-1.5 block truncate font-display text-lg font-semibold text-white transition hover:text-teal-200">
                      {post.title}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {formatShortDate(post.createdAt)}
                      </span>
                      <span>📍 {post.place.city}</span>
                      <span>{post.gallery.length} galeri görseli</span>
                    </p>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center">
                    <Link
                      href={`/admin/yazilar/${post.id}`}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-teal-400/15 hover:text-teal-200"
                      aria-label="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setPendingDelete(post)}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-rose-500/15 hover:text-rose-300"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Yazı silinsin mi?"
        description={`"${pendingDelete?.title ?? ""}" kalıcı olarak kaldırılacak. Bu işlem geri alınamaz.`}
        confirmLabel="Evet, sil"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
