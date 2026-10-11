"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useSite } from "@/lib/store";
import { ease } from "@/lib/motion";
import { cn, findCategory, publishedPosts } from "@/lib/utils";
import { PostCard } from "./PostCard";

export function BlogView() {
  const { categories, posts } = useSite();
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("kategori") ?? "";
  const [query, setQuery] = useState("");

  const published = useMemo(() => publishedPosts(posts), [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return published.filter((post) => {
      if (active && post.categoryId !== active) return false;
      if (!q) return true;
      return [post.title, post.excerpt, post.place.city, post.place.country, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [published, active, query]);

  function select(id: string) {
    router.replace(id ? `/blog?kategori=${id}` : "/blog", { scroll: false });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-12 max-w-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Yazılar</p>
        <h1 className="font-display mt-3 text-5xl font-semibold tracking-tight text-ink md:text-6xl">Defterden sayfalar</h1>
        <p className="mt-4 text-lg text-ink/60">Şehirler, yemekler, dağ patikaları ve yolda kalan küçük anılar.</p>
      </motion.header>

      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ id: "", name: "Tümü", emoji: "✨", color: "#0F766E" }, ...categories].map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id || "all"}
                onClick={() => select(cat.id)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive ? "text-white" : "bg-white text-ink/70 ring-1 ring-line hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="blog-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{cat.emoji}</span>
                <span className="relative">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <label className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Şehir, yemek, başlık ara…"
            className="w-full rounded-full border border-line bg-white py-2.5 pl-11 pr-10 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-4 focus:ring-teal/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink/40 hover:bg-ink/5 hover:text-ink"
              aria-label="Aramayı temizle"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05, ease }}
              >
                <PostCard post={post} category={findCategory(categories, post.categoryId)} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center rounded-[2rem] border border-dashed border-line bg-white/60 px-6 py-20 text-center"
          >
            <span className="text-5xl">🧭</span>
            <p className="font-display mt-4 text-2xl font-semibold text-ink">Bu rotada henüz yazı yok</p>
            <p className="mt-2 text-sm text-ink/55">Farklı bir kategori seçmeyi ya da aramayı temizlemeyi dene.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Reveal className="mt-16 text-center text-sm text-ink/40">
        {filtered.length} yazı listeleniyor
      </Reveal>
    </div>
  );
}
