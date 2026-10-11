"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { PROFILE } from "@/data/seed";
import { ease } from "@/lib/motion";
import { LiveLocationCard } from "./LiveLocationCard";
import { SocialLinks } from "./SocialLinks";
import { useSite } from "@/lib/store";

export function HakkimdaView() {
  const { location, socials } = useSite();

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10">
      <section className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease }}
          className="relative mx-auto aspect-square w-full max-w-sm"
        >
          <span className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-teal via-teal to-amber opacity-90 animate-blob" />
          <span className="absolute inset-3 grid place-items-center rounded-[2.5rem] bg-paper">
            <span className="font-display text-8xl font-semibold text-gradient">{PROFILE.initials}</span>
          </span>
          <span className="absolute -bottom-4 -right-4 grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-xl ring-1 ring-line animate-float">
            🧭
          </span>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-teal"
          >
            Hakkımda
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-3 text-5xl font-semibold tracking-tight text-ink md:text-6xl"
          >
            {PROFILE.name}
          </motion.h1>
          <p className="mt-3 text-lg font-medium text-ink/55">{PROFILE.title}</p>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink/70">
            {PROFILE.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {PROFILE.interests.map((interest) => (
              <span key={interest} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink/70 ring-1 ring-line transition hover:-translate-y-0.5 hover:text-teal hover:ring-teal/30">
                {interest}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <SocialLinks socials={socials} variant="chips" />
            <a href={PROFILE.links.email} className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-line transition hover:-translate-y-0.5 hover:text-teal">
              <Mail className="h-4 w-4" /> E-posta
            </a>
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-6 md:grid-cols-3">
        {[
          { value: PROFILE.stats.countries, label: "Ülke", tone: "bg-teal-soft/60 text-teal" },
          { value: PROFILE.stats.cities, label: "Şehir", tone: "bg-amber/15 text-amber" },
          { value: PROFILE.stats.km, label: "Kilometre", suffix: "+", tone: "bg-coral/10 text-coral" },
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <div className="rounded-[2rem] bg-white p-8 ring-1 ring-line transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${stat.tone}`}>{stat.label}</span>
              <p className="font-display mt-5 text-6xl font-semibold text-ink">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mt-24 grid gap-12 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Yolculuk</p>
            <h2 className="font-display mt-3 mb-10 text-3xl font-semibold text-ink md:text-4xl">Zaman çizgisi</h2>
          </Reveal>
          <ol className="relative space-y-10 border-l border-line pl-8">
            {PROFILE.timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.1}>
                <li className="relative">
                  <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-teal">
                    <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
                  </span>
                  <p className="text-sm font-semibold text-teal">{item.year}</p>
                  <h3 className="font-display mt-1 text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-ink/60">{item.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <aside>
          <LiveLocationCard location={location} />
        </aside>
      </section>
    </div>
  );
}
