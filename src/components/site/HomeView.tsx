"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { PROFILE } from "@/data/seed";
import { useSite } from "@/lib/store";
import { btnGhost, btnPrimary } from "@/lib/ui";
import { ease } from "@/lib/motion";
import { findCategory, publishedPosts } from "@/lib/utils";
import { LiveLocationCard } from "./LiveLocationCard";
import { PostCard } from "./PostCard";
import { SocialLinks } from "./SocialLinks";
import { SubscribeForm } from "./SubscribeForm";

export function HomeView() {
  const { categories, posts, location, socials } = useSite();
  const published = publishedPosts(posts);
  const featured = published.slice(0, 3);

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-teal/15 blur-3xl animate-blob" />
          <span className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-amber/20 blur-3xl animate-blob [animation-delay:-6s]" />
          <span className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-coral/10 blur-3xl animate-blob [animation-delay:-12s]" />
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-5 pt-8 sm:flex-row sm:flex-wrap sm:items-center md:pt-12">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/80 px-4 py-2.5 text-xs font-semibold text-teal ring-1 ring-line"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            <span className="truncate">Şu an {location.city} · {location.status}</span>
          </motion.span>
          <SocialLinks socials={socials} variant="dock" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-8 md:grid-cols-[1.15fr_0.85fr] md:pt-10">
          <div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="font-display mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-7xl"
            >
              Dünyayı yavaş yavaş, <span className="text-gradient italic">defterime</span> yazarak geziyorum.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink/65"
            >
              {PROFILE.bio[0]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/blog" className={btnPrimary}>
                Yazıları oku <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/rota" className={btnGhost}>
                Rotamı gör
              </Link>
            </motion.div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-8">
              {[
                { value: PROFILE.stats.countries, label: "Ülke" },
                { value: PROFILE.stats.cities, label: "Şehir" },
                { value: PROFILE.stats.km, label: "Kilometre", suffix: "+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-ink md:text-4xl">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <LiveLocationCard location={location} />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Kategoriler</p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-ink md:text-4xl">Nereye bakmak istersin?</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:gap-2 transition-all">
              Tüm yazılar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((category, i) => {
            const count = published.filter((p) => p.categoryId === category.id).length;
            return (
              <Reveal key={category.id} delay={i * 0.06}>
                <Link
                  href={`/blog?kategori=${category.id}`}
                  className="group relative block overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-line transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
                >
                  <span
                    className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 transition duration-500 group-hover:scale-150"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="relative text-3xl transition duration-500 group-hover:scale-110 inline-block">{category.emoji}</span>
                  <p className="relative mt-4 font-semibold text-ink">{category.name}</p>
                  <p className="relative mt-1 text-xs text-ink/50">{count} yazı</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Öne çıkanlar</p>
          <h2 className="font-display mt-2 mb-10 text-3xl font-semibold text-ink md:text-4xl">Son yolculuklardan notlar</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.1}>
              <PostCard post={post} category={findCategory(categories, post.categoryId)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="takip" className="mx-auto mt-16 max-w-6xl scroll-mt-28 px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-night p-8 text-white shadow-2xl shadow-night/30 md:p-14">
            <span className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal/30 blur-3xl animate-blob" />
            <span className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber/20 blur-3xl animate-blob [animation-delay:-8s]" />
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">Takipçi Defteri</p>
                <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">Yeni rotalar ve yazılar e-postana gelsin.</h2>
                <p className="mt-4 text-white/65">
                  Ayda bir kısa bülten: yeni yazılar, kapalı kalan rota notları ve yolda öğrendiğim küçük dersler.
                </p>
                <SocialLinks socials={socials} variant="dark" className="mt-6" />
              </div>
              <div className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur">
                <SubscribeForm />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
