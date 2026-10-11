import {
  siBluesky,
  siDiscord,
  siFacebook,
  siFlickr,
  siGithub,
  siInstagram,
  siMedium,
  siPinterest,
  siReddit,
  siSnapchat,
  siSpotify,
  siTelegram,
  siThreads,
  siTiktok,
  siTwitch,
  siWhatsapp,
  siX,
  siYoutube,
} from "simple-icons";
import type { SocialLink } from "./types";

export interface Platform {
  key: string;
  label: string;
  path: string;
  /** Marka rengi (hex, # olmadan). */
  hex: string;
  /** Hover dolgusu için özel arka plan (ör. Instagram gradyanı). */
  fill?: string;
  /** Hover durumunda logo rengi; varsayılan beyaz. */
  onFill?: string;
  /** Kullanıcı adının başına eklenen işaret. */
  prefix: string;
  placeholder: string;
  url: (handle: string) => string;
}

const clean = (handle: string) => handle.trim().replace(/^@/, "");

export const PLATFORMS: Platform[] = [
  {
    key: "instagram",
    label: "Instagram",
    path: siInstagram.path,
    hex: "E4405F",
    fill: "linear-gradient(45deg,#FEDA75 0%,#FA7E1E 25%,#D62976 50%,#962FBF 75%,#4F5BD5 100%)",
    prefix: "@",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.instagram.com/${clean(h)}`,
  },
  {
    key: "youtube",
    label: "YouTube",
    path: siYoutube.path,
    hex: "FF0000",
    prefix: "@",
    placeholder: "kanal_adi",
    url: (h) => `https://www.youtube.com/@${clean(h)}`,
  },
  {
    key: "x",
    label: "X",
    path: siX.path,
    hex: "000000",
    prefix: "@",
    placeholder: "kullanici_adi",
    url: (h) => `https://x.com/${clean(h)}`,
  },
  {
    key: "tiktok",
    label: "TikTok",
    path: siTiktok.path,
    hex: "000000",
    fill: "linear-gradient(135deg,#25F4EE 0%,#111 45%,#FE2C55 100%)",
    prefix: "@",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.tiktok.com/@${clean(h)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    path: siFacebook.path,
    hex: "0866FF",
    prefix: "",
    placeholder: "sayfa.adi",
    url: (h) => `https://www.facebook.com/${clean(h)}`,
  },
  {
    key: "threads",
    label: "Threads",
    path: siThreads.path,
    hex: "000000",
    prefix: "@",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.threads.net/@${clean(h)}`,
  },
  {
    key: "pinterest",
    label: "Pinterest",
    path: siPinterest.path,
    hex: "E60023",
    prefix: "",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.pinterest.com/${clean(h)}`,
  },
  {
    key: "spotify",
    label: "Spotify",
    path: siSpotify.path,
    hex: "1DB954",
    prefix: "",
    placeholder: "kullanici_id",
    url: (h) => `https://open.spotify.com/user/${clean(h)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    path: siTelegram.path,
    hex: "26A5E4",
    prefix: "@",
    placeholder: "kullanici_adi",
    url: (h) => `https://t.me/${clean(h)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    path: siWhatsapp.path,
    hex: "25D366",
    prefix: "+",
    placeholder: "905551234567",
    url: (h) => `https://wa.me/${h.replace(/\D/g, "")}`,
  },
  {
    key: "snapchat",
    label: "Snapchat",
    path: siSnapchat.path,
    hex: "FFFC00",
    onFill: "#111111",
    prefix: "",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.snapchat.com/add/${clean(h)}`,
  },
  {
    key: "twitch",
    label: "Twitch",
    path: siTwitch.path,
    hex: "9146FF",
    prefix: "",
    placeholder: "kanal_adi",
    url: (h) => `https://www.twitch.tv/${clean(h)}`,
  },
  {
    key: "medium",
    label: "Medium",
    path: siMedium.path,
    hex: "000000",
    prefix: "@",
    placeholder: "kullanici_adi",
    url: (h) => `https://medium.com/@${clean(h)}`,
  },
  {
    key: "bluesky",
    label: "Bluesky",
    path: siBluesky.path,
    hex: "1185FE",
    prefix: "@",
    placeholder: "kullanici.bsky.social",
    url: (h) => `https://bsky.app/profile/${clean(h)}`,
  },
  {
    key: "discord",
    label: "Discord",
    path: siDiscord.path,
    hex: "5865F2",
    prefix: "",
    placeholder: "davet_kodu",
    url: (h) => `https://discord.gg/${clean(h)}`,
  },
  {
    key: "reddit",
    label: "Reddit",
    path: siReddit.path,
    hex: "FF4500",
    prefix: "u/",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.reddit.com/user/${clean(h)}`,
  },
  {
    key: "flickr",
    label: "Flickr",
    path: siFlickr.path,
    hex: "0063DC",
    prefix: "",
    placeholder: "kullanici_adi",
    url: (h) => `https://www.flickr.com/photos/${clean(h)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    hex: "0A66C2",
    prefix: "",
    placeholder: "kullanici-adi",
    url: (h) => `https://www.linkedin.com/in/${clean(h)}`,
  },
  {
    key: "github",
    label: "GitHub",
    path: siGithub.path,
    hex: "181717",
    prefix: "",
    placeholder: "kullanici_adi",
    url: (h) => `https://github.com/${clean(h)}`,
  },
];

export interface SocialPlatformRef {
  label: string;
  path: string;
  hex: string;
  fill?: string;
  onFill?: string;
}

export interface ResolvedSocial extends SocialPlatformRef {
  id: string;
  href: string;
  display: string;
}

/** Katalogdaki platformlar kullanıcı adından bağlantı üretir; diğerleri kayıtlı logo ve bağlantıyı kullanır. */
export function resolveSocial(social: SocialLink): ResolvedSocial | null {
  const handle = social.handle.trim();
  if (!handle) return null;
  const known = findPlatform(social.platform);
  if (known) {
    return { id: social.id, ...known, href: known.url(handle), display: displayHandle(known, handle) };
  }
  if (!social.path || !social.url || !/^https?:\/\//i.test(social.url)) return null;
  return {
    id: social.id,
    label: social.label || social.platform,
    path: social.path,
    hex: (social.hex || "555555").replace("#", ""),
    href: social.url,
    display: handle,
  };
}

export function luminance(hex: string) {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function findPlatform(key: string) {
  return PLATFORMS.find((p) => p.key === key);
}

export function displayHandle(platform: Platform, handle: string) {
  const value = platform.key === "whatsapp" ? handle.replace(/\D/g, "") : clean(handle);
  return `${platform.prefix}${value}`;
}
