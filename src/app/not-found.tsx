import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-paper px-6 grain">
      <span className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-soft blur-3xl animate-blob" />
      <span className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl animate-blob" />
      <div className="relative text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-xl shadow-ink/10 animate-float">
          <Compass className="h-9 w-9 text-teal" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">Yanlış rota</p>
        <h1 className="mt-3 font-display text-6xl font-semibold tracking-tight md:text-7xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/60">
          Aradığınız sayfa haritada görünmüyor. Belki de yeni bir keşfe çıkmıştır.
        </p>
        <Link href="/" className={`${btnPrimary} mt-8`}>
          <ArrowLeft className="h-4 w-4" /> Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
