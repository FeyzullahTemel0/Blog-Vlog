"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useSite } from "@/lib/store";
import { ease } from "@/lib/motion";
import { osmEmbedUrl } from "@/lib/geo";
import { cn, flagEmoji, publishedPosts } from "@/lib/utils";
import { LiveLocationCard } from "./LiveLocationCard";

export function RotaView() {
  const { posts, location } = useSite();
  const published = useMemo(() => publishedPosts(posts), [posts]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = published.find((p) => p.id === selectedId) ?? published[0];

  const countries = useMemo(() => {
    const map = new Map<string, { name: string; code: string; posts: typeof published }>();
    published.forEach((post) => {
      const key = post.place.countryCode;
      const entry = map.get(key) ?? { name: post.place.country, code: key, posts: [] };
      entry.posts.push(post);
      map.set(key, entry);
    });
    return [...map.values()].sort((a, b) => b.posts.length - a.posts.length);
  }, [published]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-12 max-w-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Rota</p>
        <h1 className="font-display mt-3 text-5xl font-semibold tracking-tight text-ink md:text-6xl">Gezilen haritam</h1>
        <p className="mt-4 text-lg text-ink/60">
          {countries.length} ülke, {published.length} durak. Bir şehri seçerek haritada yerini gör.
        </p>
      </motion.header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {selected && (
            <Reveal>
              <div className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-line shadow-xl shadow-ink/5">
                <iframe
                  key={selected.id}
                  title={`${selected.place.city} harita`}
                  src={osmEmbedUrl(selected.place.lat, selected.place.lng, 0.6)}
                  className="h-[420px] w-full border-0 animate-[fade-in_0.6s_ease-out]"
                  loading="lazy"
                />
                <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Seçili durak</p>
                    <p className="font-display mt-1 text-2xl font-semibold text-ink">
                      {flagEmoji(selected.place.countryCode)} {selected.place.city}
                    </p>
                    <p className="text-sm text-ink/55">{selected.title}</p>
                  </div>
                  <Link
                    href={`/blog/${selected.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal"
                  >
                    Yazıyı oku <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {countries.map((country, i) => (
              <Reveal key={country.code} delay={i * 0.05}>
                <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-semibold text-ink">
                      {flagEmoji(country.code)} {country.name}
                    </p>
                    <span className="rounded-full bg-teal-soft/70 px-2.5 py-1 text-xs font-semibold text-teal">
                      {country.posts.length} durak
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1">
                    {country.posts.map((post) => {
                      const isActive = selected?.id === post.id;
                      return (
                        <li key={post.id}>
                          <button
                            onClick={() => setSelectedId(post.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition",
                              isActive ? "bg-teal-soft/70 text-teal" : "text-ink/70 hover:bg-ink/[0.03] hover:text-ink",
                            )}
                          >
                            <MapPin className={cn("h-4 w-4 shrink-0", isActive ? "text-teal" : "text-ink/30")} />
                            <span className="font-medium">{post.place.city}</span>
                            <span className="ml-auto truncate text-xs text-ink/40">{post.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <LiveLocationCard location={location} />
        </aside>
      </div>
    </div>
  );
}
