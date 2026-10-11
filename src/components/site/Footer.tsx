import { Mail } from "lucide-react";
import Link from "next/link";
import { PROFILE } from "@/data/seed";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";
import { SiteSocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-night text-white">
      <span className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-teal/30 blur-3xl animate-blob" />
      <span className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl animate-blob" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            Yolda yazılan notlar, rotalar ve küçük hikâyeler. Dünyayı acele etmeden keşfetmeye davet.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Keşfet</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li>
              <Link href="/blog" className="transition hover:text-amber-300">
                Tüm yazılar
              </Link>
            </li>
            <li>
              <Link href="/rota" className="transition hover:text-amber-300">
                Gezdiğim rotalar
              </Link>
            </li>
            <li>
              <Link href="/hakkimda" className="transition hover:text-amber-300">
                Hakkımda
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Bağlantılar</h4>
          <div className="mt-4 flex flex-col items-start gap-3">
            <SiteSocialLinks variant="dark" />
            <a
              href={PROFILE.links.email}
              aria-label="E-posta"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-sm font-medium text-white/75 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-amber-300"
            >
              <Mail className="h-4 w-4" /> merhaba@yolcunundefteri.com
            </a>
          </div>
          <p className="mt-6 text-xs text-white/35">© <CurrentYear /> Yolcunun Defteri. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
