"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, Mail, MapPin, Radio, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { useToast } from "@/components/ui/Toast";
import { PROFILE } from "@/data/seed";
import { removeSubscriber, useSite } from "@/lib/store";
import { adminBtnGhost, adminCard } from "@/lib/ui";
import { cn, findCategory, flagEmoji, formatShortDate, relativeTime } from "@/lib/utils";
import { useNow } from "@/lib/hooks";
import { ease } from "@/lib/motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function DashboardView() {
  const { ready, posts, categories, location, subscribers } = useSite();
  const toast = useToast();
  const now = useNow();

  if (!ready) return <GlobeLoader label="Panel hazırlanıyor" />;

  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");
  const countries = new Set(published.map((p) => p.place.countryCode)).size;
  const recent = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const byCategory = categories
    .map((c) => ({ category: c, count: published.filter((p) => p.categoryId === c.id).length }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...byCategory.map((x) => x.count));
  const stats = [
    { label: "Yayındaki yazı", value: published.length, icon: Globe2, glow: "from-teal-400/30", text: "text-teal-300" },
    { label: "Taslak", value: drafts.length, icon: MapPin, glow: "from-amber-400/30", text: "text-amber-300" },
    { label: "Ziyaret edilen ülke", value: countries, icon: Radio, glow: "from-indigo-400/30", text: "text-indigo-300" },
    { label: "Takipçi", value: subscribers.length, icon: Users, glow: "from-rose-400/30", text: "text-rose-300" },
  ];

  function remove(id: string, email: string) {
    const error = removeSubscriber(id);
    toast(error ?? `${email} listeden çıkarıldı.`, error ? "error" : "info");
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Hoş geldin {PROFILE.name.split(" ")[0]}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Yolculuk özetin</h1>
        <p className="mt-2 text-sm text-slate-400">Yazılarının, konumunun ve takipçilerinin genel görünümü.</p>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={item} className={cn(adminCard, "relative overflow-hidden p-5")}>
              <div className={cn("pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br to-transparent blur-xl", s.glow)} />
              <span className={cn("grid h-11 w-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10", s.text)}>
                <Icon className="h-5 w-5" />
              </span>
              <AnimatedNumber value={s.value} className="mt-5 block font-display text-4xl font-semibold text-white" />
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.section variants={item} initial="hidden" animate="show" className={cn(adminCard, "p-6 xl:col-span-2")}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Son yazılar</h2>
              <p className="text-xs text-slate-500">En yeni eklenen 5 içerik</p>
            </div>
            <Link href="/admin/yazilar" className="inline-flex items-center gap-1 text-sm text-teal-300 transition hover:gap-2">
              Tümü <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {recent.map((post) => {
              const category = findCategory(categories, post.categoryId);
              return (
                <li key={post.id}>
                  <Link href={`/admin/yazilar/${post.id}`} className="group flex items-center gap-4 py-3.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl" style={{ background: `${category.color}33` }}>
                      {category.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-100 transition group-hover:text-teal-200">{post.title}</p>
                      <p className="text-xs text-slate-500">
                        {post.place.city} · {formatShortDate(post.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                        post.status === "published" ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20" : "bg-amber-400/10 text-amber-300 ring-amber-400/20",
                      )}
                    >
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.section>

        <motion.section variants={item} initial="hidden" animate="show" className={cn(adminCard, "p-6")}>
          <h2 className="font-semibold text-white">Kategori dağılımı</h2>
          <p className="mb-6 text-xs text-slate-500">Yayındaki yazılara göre</p>
          <div className="space-y-4">
            {byCategory.map(({ category, count }) => (
              <div key={category.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-slate-300">
                    {category.emoji} {category.name}
                  </span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 1.1, ease, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${category.color}, ${category.color}aa)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.section variants={item} initial="hidden" animate="show" className={cn(adminCard, "relative overflow-hidden p-6")}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-400/20 blur-3xl animate-blob" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Canlı konum</h2>
              <span className="relative flex h-2.5 w-2.5">
                <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-70", location.visible ? "animate-ping bg-emerald-400" : "bg-slate-500")} />
                <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", location.visible ? "bg-emerald-400" : "bg-slate-500")} />
              </span>
            </div>
            <p className="mt-5 font-display text-2xl text-white">
              {flagEmoji(location.countryCode)} {location.city}
            </p>
            <p className="text-sm text-slate-400">{location.status}</p>
            <p className="mt-4 text-xs text-slate-500">
              {location.visible ? "Sitede görünür" : "Sitede gizli"} · {relativeTime(location.updatedAt, now ?? Date.parse(location.updatedAt))}
            </p>
            <Link href="/admin/konum" className={`${adminBtnGhost} mt-6 w-full`}>
              Konumu yönet
            </Link>
          </div>
        </motion.section>

        <motion.section variants={item} initial="hidden" animate="show" className={cn(adminCard, "p-6 xl:col-span-2")}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Takipçiler</h2>
              <p className="text-xs text-slate-500">Yeni yazılar için bültene kayıtlı adresler</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-400/10 text-rose-300">
              <Mail className="h-4 w-4" />
            </span>
          </div>
          {subscribers.length === 0 ? (
            <p className="rounded-2xl bg-white/[0.03] p-6 text-center text-sm text-slate-500">Henüz takipçi yok.</p>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {subscribers.slice(0, 8).map((s) => (
                <li key={s.id} className="group flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400/40 to-amber-400/30 text-xs font-bold text-white">
                    {s.email.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">{s.email}</p>
                    <p className="text-xs text-slate-500">{formatShortDate(s.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => remove(s.id, s.email)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-300 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`${s.email} adresini çıkar`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {subscribers.length > 8 && <p className="mt-4 text-center text-xs text-slate-500">+{subscribers.length - 8} takipçi daha</p>}
        </motion.section>
      </div>
    </div>
  );
}
