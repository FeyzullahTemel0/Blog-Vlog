"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, FileText, LayoutDashboard, LogOut, MapPin, Menu, Share2, Tags, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { GlobeLoader } from "@/components/ui/GlobeLoader";
import { DEMO_EMAIL, signOut, useAuth } from "@/lib/auth";
import { PROFILE } from "@/data/seed";
import { useSite } from "@/lib/store";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/yazilar", label: "Yazılar", icon: FileText },
  { href: "/admin/konum", label: "Canlı Konum", icon: MapPin },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Tags },
  { href: "/admin/sosyal", label: "Sosyal Hesaplar", icon: Share2 },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { ready } = useSite();
  const [drawer, setDrawer] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (auth === "out" && !isLogin) router.replace("/admin/login");
  }, [auth, isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (auth !== "in" || !ready) return <GlobeLoader fullscreen />;

  function logout() {
    signOut();
    router.replace("/admin/login");
  }

  const body = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="px-2 pb-8 pt-2">
        <Logo light />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Yönetim Paneli</p>
      </div>

      <nav className="space-y-1" aria-label="Yönetim menüsü">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active ? "text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/25 to-emerald-500/5 ring-1 ring-teal-400/25"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <Icon className={cn("relative h-[18px] w-[18px] transition group-hover:scale-110", active && "text-teal-300")} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
        >
          Siteyi görüntüle <ExternalLink className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-amber-400 text-sm font-bold text-slate-950">
            {PROFILE.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{PROFILE.name}</p>
            <p className="truncate text-xs text-slate-500">{DEMO_EMAIL}</p>
          </div>
          <button
            onClick={logout}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <span className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal-500/15 blur-3xl animate-blob" />
        <span className="absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-3xl animate-blob [animation-delay:-9s]" />
        <span className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-blob [animation-delay:-16s]" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/5 bg-slate-950/70 p-5 backdrop-blur-xl lg:block">
        {body()}
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo light />
        <button
          onClick={() => setDrawer(true)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 p-5 shadow-2xl lg:hidden"
            >
              <button
                onClick={() => setDrawer(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-white/5"
                aria-label="Menüyü kapat"
              >
                <X className="h-4 w-4" />
              </button>
              {body(() => setDrawer(false))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="relative lg:pl-72">
        <div className="mx-auto max-w-6xl p-5 md:p-10">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
