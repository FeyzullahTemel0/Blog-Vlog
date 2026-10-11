"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { luminance, resolveSocial, type ResolvedSocial } from "@/lib/socials";
import { useSite } from "@/lib/store";
import type { SocialLink } from "@/lib/types";
import { cn } from "@/lib/utils";

type Variant = "dock" | "dark" | "chips";

export function BrandIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" fill="currentColor" className={className}>
      <path d={path} />
    </svg>
  );
}

// Marka rengi zeminle çakışıyorsa (siyah/beyaz/sarı gibi) okunur bir renge çevrilir.
export function brandStyle(item: ResolvedSocial, onDark: boolean) {
  const lum = luminance(item.hex);
  const fill = item.fill ?? (onDark && lum < 0.08 ? "#FFFFFF" : `#${item.hex}`);
  const on = item.onFill ?? (onDark && lum < 0.08 ? "#111111" : lum > 0.6 ? "#111111" : "#FFFFFF");
  const icon = onDark ? "#FFFFFFBF" : lum > 0.75 ? "#1A1A1A" : `#${item.hex}`;
  return { "--fill": fill, "--on": on, "--icon": icon } as CSSProperties;
}

export function SiteSocialLinks(props: Omit<Parameters<typeof SocialLinks>[0], "socials">) {
  const { socials } = useSite();
  return <SocialLinks socials={socials} {...props} />;
}

export function SocialLinks({
  socials,
  variant = "dock",
  className,
}: {
  socials: SocialLink[];
  variant?: Variant;
  className?: string;
}) {
  const items = socials.flatMap((s) => resolveSocial(s) ?? []);
  if (items.length === 0) return null;
  const onDark = variant === "dark";

  if (variant === "chips") {
    return (
      <ul className={cn("flex flex-wrap gap-2.5", className)}>
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.05 }}
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label}: ${item.display}`}
              style={brandStyle(item, false)}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/10"
            >
              <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-paper">
                <span
                  className="absolute inset-0 scale-50 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100"
                  style={{ background: "var(--fill)" }}
                />
                <BrandIcon
                  path={item.path}
                  className="relative h-4 w-4 text-[var(--icon)] transition-colors duration-300 group-hover:text-[var(--on)]"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] font-medium uppercase tracking-wider text-ink/40">{item.label}</span>
                <span className="max-w-[9.5rem] truncate">{item.display}</span>
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        variant === "dock" && "rounded-3xl bg-white/70 p-1.5 ring-1 ring-line backdrop-blur sm:rounded-full",
        className,
      )}
    >
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.25 + i * 0.06 }}
          className="relative"
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label}: ${item.display}`}
            style={brandStyle(item, onDark)}
            className={cn(
              "group peer relative grid h-9 w-9 place-items-center overflow-hidden rounded-full transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 sm:h-10 sm:w-10",
              onDark ? "bg-white/[0.07] ring-1 ring-white/10" : "bg-transparent",
            )}
          >
            <span
              className="absolute inset-0 scale-50 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
              style={{ background: "var(--fill)" }}
            />
            <BrandIcon
              path={item.path}
              className="relative h-[18px] w-[18px] text-[var(--icon)] transition-colors duration-300 group-hover:text-[var(--on)] group-focus-visible:text-[var(--on)]"
            />
          </a>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100 sm:block"
          >
            {item.display}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}
