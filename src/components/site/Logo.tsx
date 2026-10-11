import { Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 text-white shadow-lg shadow-teal/30 transition duration-500 group-hover:rotate-[20deg] group-hover:scale-105">
        <Compass className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-lg font-semibold tracking-tight", light ? "text-white" : "text-ink")}>
          Yolcunun Defteri
        </span>
        <span className={cn("mt-1 block text-[11px] font-medium uppercase tracking-[0.2em]", light ? "text-white/50" : "text-ink/45")}>
          Deniz Arslan
        </span>
      </span>
    </Link>
  );
}
