"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock3, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CoverArt } from "@/components/ui/CoverArt";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { useSite } from "@/lib/store";
import { ease } from "@/lib/motion";
import { renderContent } from "@/lib/render";
import type { Category, Post } from "@/lib/types";
import { findCategory, flagEmoji, formatDate, readingMinutes } from "@/lib/utils";
import { osmEmbedUrl } from "@/lib/geo";
import { PostCard } from "./PostCard";
import { ShareButtons } from "./ShareButtons";

export function PostView({ slug }: { slug: string }) {
  const { ready, categories, posts } = useSite();

  if (!ready) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <GlobeLoader />
      </div>
    );
  }

  const post = posts.find((p) => p.slug === slug && p.status === "published");
  if (!post) return <NotFound />;

  const related = posts
    .filter((p) => p.status === "published" && p.id !== post.id)
    .sort((a, b) => Number(b.categoryId === post.categoryId) - Number(a.categoryId === post.categoryId))
    .slice(0, 3);

  return <PostArticle post={post} category={findCategory(categories, post.categoryId)} related={related} categories={categories} />;
}

function PostArticle({
  post,
  category,
  related,
  categories,
}: {
  post: Post;
  category: Category;
  related: Post[];
  categories: Category[];
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const path = `/blog/${post.slug}`;

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % post.gallery.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + post.gallery.length) % post.gallery.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, post.gallery.length]);

  return (
    <article className="pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className="relative mx-auto max-w-6xl px-5 pt-8"
      >
        <Link href="/blog" className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-teal">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Tüm yazılar
        </Link>

        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white"
              style={{ backgroundColor: category.color }}
            >
              <span>{category.emoji}</span> {category.name}
            </span>
            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink/65">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink/55">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal" />
                {flagEmoji(post.place.countryCode)} {post.place.city}, {post.place.country}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-teal" />
                {readingMinutes(post.content)} dk okuma
              </span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/15 ring-1 ring-line"
          >
            <CoverArt src={post.cover || undefined} title={post.title} category={category} emojiSize="text-8xl" className="h-full w-full" />
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <Reveal>
            <div className="prose-yd">{renderContent(post.content)}</div>
          </Reveal>

          {post.gallery.length > 0 && (
            <Reveal className="mt-16">
              <h2 className="font-display mb-6 text-2xl font-semibold text-ink">Karelerden</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {post.gallery.map((src, i) => (
                  <button
                    key={`${src.slice(0, 32)}-${i}`}
                    onClick={() => setLightbox(i)}
                    className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-line"
                    aria-label={`Fotoğrafı büyüt ${i + 1}`}
                  >
                    <Img src={src} alt={`${post.title} ${i + 1}`} className="transition duration-700 group-hover:scale-110" />
                    <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/20" />
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="mt-16 border-t border-line pt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Bu yazıyı paylaş</p>
            <ShareButtons title={post.title} path={path} />
          </Reveal>

          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-teal-soft/60 px-3 py-1 text-xs font-medium text-teal">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              <iframe
                title={`${post.place.city} harita`}
                src={osmEmbedUrl(post.place.lat, post.place.lng, 0.08)}
                className="h-56 w-full border-0"
                loading="lazy"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Konum</p>
                <p className="font-display mt-1 text-xl font-semibold text-ink">
                  {flagEmoji(post.place.countryCode)} {post.place.city}
                </p>
                <p className="text-sm text-ink/55">{post.place.country}</p>
              </div>
            </div>
          </Reveal>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-6xl px-5">
          <Reveal>
            <h2 className="font-display mb-10 text-3xl font-semibold text-ink">Bunlarla da devam et</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <PostCard post={p} category={findCategory(categories, p.categoryId)} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-6 backdrop-blur-md"
          >
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Img src={post.gallery[lightbox]} alt={`${post.title} ${lightbox + 1}`} className="object-contain" />
            </motion.div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
            {post.gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((i) => (i === null ? null : (i - 1 + post.gallery.length) % post.gallery.length));
                  }}
                  className="absolute left-6 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Önceki fotoğraf"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((i) => (i === null ? null : (i + 1) % post.gallery.length));
                  }}
                  className="absolute right-6 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Sonraki fotoğraf"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-8 text-sm text-white/70">
                  {lightbox + 1} / {post.gallery.length}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <span className="text-6xl">🗺️</span>
        <h1 className="font-display mt-6 text-4xl font-semibold text-ink">Bu sayfa defterde yok</h1>
        <p className="mt-3 text-ink/55">Yazı taşınmış ya da henüz yayınlanmamış olabilir.</p>
        <Link href="/blog" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal">
          <ArrowLeft className="h-4 w-4" /> Yazılara dön
        </Link>
      </div>
    </div>
  );
}
