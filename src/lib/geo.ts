export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Bu tarayıcı konum özelliğini desteklemiyor."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
      ...options,
    });
  });
}

export interface ReverseResult {
  city: string;
  country: string;
  countryCode: string;
}

/** OpenStreetMap Nominatim ile koordinattan şehir adı bulur. Hata durumunda null döner. */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=tr&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: Record<string, string>;
      error?: string;
    };
    if (!data.address) return null;
    const a = data.address;
    return {
      city: a.city ?? a.town ?? a.village ?? a.county ?? a.state ?? "Bilinmeyen konum",
      country: a.country ?? "",
      countryCode: (a.country_code ?? "").toUpperCase(),
    };
  } catch {
    return null;
  }
}

export function osmEmbedUrl(lat: number, lng: number, delta = 0.12) {
  const bbox = [lng - delta, lat - delta * 0.6, lng + delta, lat + delta * 0.6].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}
