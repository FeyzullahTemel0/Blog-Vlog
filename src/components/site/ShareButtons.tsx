"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useToast } from "@/components/ui/Toast";

const noop = () => () => {};
const canShareNow = () => "share" in navigator;

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(noop, canShareNow, () => false);

  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  const fullUrl = `${origin}${path}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast("Bağlantı panoya kopyalandı.", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Bağlantı kopyalanamadı.", "error");
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url: fullUrl });
    } catch {
      // Kullanıcı paylaşımı iptal ettiğinde sessizce geçilir.
    }
  }

  const text = encodeURIComponent(title);


  const btn =
    "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink/75 transition hover:-translate-y-0.5 hover:border-teal/40 hover:text-teal";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={copy} className={btn}>
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Kopyalandı" : "Bağlantıyı kopyala"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}`}
        onClick={(e) => {
          e.preventDefault();
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, "_blank", "noopener,noreferrer");
        }}
        className={btn}
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        WhatsApp
      </a>
      {canNativeShare && (
        <button onClick={nativeShare} className={btn}>
          <Share2 className="h-3.5 w-3.5" /> Paylaş
        </button>
      )}
    </div>
  );
}
