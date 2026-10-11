export type PostStatus = "published" | "draft";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface Place {
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string[];
  status: PostStatus;
  cover: string;
  gallery: string[];
  place: Place;
  createdAt: string;
  updatedAt: string;
}

export interface LiveLocation extends Place {
  status: string;
  visible: boolean;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  /** Katalogda olmayan platformlar için: logo yolu, marka rengi, ad ve profil bağlantısı. */
  label?: string;
  path?: string;
  hex?: string;
  url?: string;
}

export interface SiteData {
  socials: SocialLink[];
  categories: Category[];
  posts: Post[];
  location: LiveLocation;
  subscribers: Subscriber[];
}
