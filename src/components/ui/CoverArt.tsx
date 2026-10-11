"use client";

import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Img } from "./Img";

// Kapak görseli yoksa kategori rengine göre üretilen, hareketli bir yüzey gösterilir.
export function CoverArt({
  src,
  title,
  category,
  className,
  emojiSize = "text-6xl",
}: {
  src?: string;
  title: string;
  category?: Category;
  className?: string;
  emojiSize?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-ink/5", className)}>
        <Img src={src} alt={title} className="transition duration-700 group-hover:scale-105" />
      </div>
    );
  }

  const base = category?.color ?? "#0F766E";

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, ${base}cc 0%, transparent 60%), linear-gradient(140deg, ${base} 0%, #0B1020 120%)`,
      }}
      aria-hidden
    >
      <span className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl animate-blob" />
      <span
        className="absolute -bottom-12 -right-6 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl animate-blob"
        style={{ animationDelay: "-5s" }}
      />
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="absolute inset-0 grid place-items-center">
        <span className={cn("animate-float drop-shadow-[0_14px_22px_rgba(0,0,0,0.35)]", emojiSize)}>
          {category?.emoji ?? "🧭"}
        </span>
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
