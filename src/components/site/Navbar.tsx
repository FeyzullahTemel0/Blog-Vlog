"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/blog", label: "Yazılar" },
  { href: "/rota", label: "Rota" },
  { href: "/hakkimda", label: "Hakkımda" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div
        className={cn(
          "mx-4 md:mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6",
          scrolled ? "glass shadow-xl shadow-ink/5 ring-1 ring-line" : "bg-transparent",
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Ana menü">
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "text-teal" : "text-ink/65 hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-teal-soft/70"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/#takip"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-teal"
          >
            Takip Et
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/80 ring-1 ring-line md:hidden"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass mx-4 mt-2 rounded-3xl p-3 shadow-xl ring-1 ring-line md:hidden"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-base font-medium",
                  pathname === link.href ? "bg-teal-soft/70 text-teal" : "text-ink/75",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#takip"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-2xl bg-ink px-4 py-3 text-center text-base font-semibold text-white"
            >
              Takip Et
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
