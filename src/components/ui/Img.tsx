import { cn } from "@/lib/utils";

// Veri URL'leri (yüklenen görseller) için düz <img> kullanılır; next/image bunları desteklemez.
export function Img({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
}
