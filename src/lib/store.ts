import { useSyncExternalStore } from "react";
import { SEED } from "@/data/seed";
import type { Category, LiveLocation, Post, SiteData, SocialLink, Subscriber } from "./types";

// Demo: veriler tarayıcının localStorage alanında tutulur. Gerçek projede bu modül
// bir API / veritabanı katmanıyla değiştirilir; bileşenler aynı hook'ları kullanmaya devam eder.
const STORAGE_KEY = "yolcunun-defteri:data:v1";

export interface SiteState extends SiteData {
  ready: boolean;
}

const serverState: SiteState = { ...SEED, ready: false };
let state: SiteState = serverState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readFromStorage(): SiteState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Partial<SiteData>) : {};
    return { ...SEED, ...stored, ready: true };
  } catch {
    return { ...SEED, ready: true };
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = readFromStorage();
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      state = readFromStorage();
      emit();
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const wasHydrated = hydrated;
  ensureHydrated();
  if (!wasHydrated) listener();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return serverState;
}

export function useSite(): SiteState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function current(): SiteData {
  ensureHydrated();
  return state;
}

function commit(data: SiteData): string | null {
  ensureHydrated();
  const payload: SiteData = {
    socials: data.socials,
    categories: data.categories,
    posts: data.posts,
    location: data.location,
    subscribers: data.subscribers,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    return "Tarayıcı depolama alanı dolu. Lütfen daha küçük bir görsel kullanın.";
  }
  state = { ...payload, ready: true };
  emit();
  return null;
}

export function isSlugTaken(slug: string, exceptId?: string) {
  return current().posts.some((p) => p.slug === slug && p.id !== exceptId);
}

export function savePost(post: Post): string | null {
  const data = current();
  const exists = data.posts.some((p) => p.id === post.id);
  const posts = exists
    ? data.posts.map((p) => (p.id === post.id ? post : p))
    : [post, ...data.posts];
  return commit({ ...data, posts });
}

export function deletePost(id: string): string | null {
  const data = current();
  return commit({ ...data, posts: data.posts.filter((p) => p.id !== id) });
}

export function saveLocation(location: LiveLocation): string | null {
  return commit({ ...current(), location });
}

export function saveSocials(socials: SocialLink[]): string | null {
  return commit({ ...current(), socials });
}

export function saveCategory(category: Category): string | null {
  const data = current();
  const exists = data.categories.some((c) => c.id === category.id);
  const categories = exists
    ? data.categories.map((c) => (c.id === category.id ? category : c))
    : [...data.categories, category];
  return commit({ ...data, categories });
}

export function deleteCategory(id: string): string | null {
  const data = current();
  return commit({ ...data, categories: data.categories.filter((c) => c.id !== id) });
}

export function addSubscriber(email: string): string | null {
  const data = current();
  const normalized = email.trim().toLowerCase();
  if (data.subscribers.some((s) => s.email === normalized)) {
    return "Bu e-posta adresi zaten takip listesinde.";
  }
  const subscriber: Subscriber = {
    id: `s-${Date.now().toString(36)}`,
    email: normalized,
    createdAt: new Date().toISOString(),
  };
  return commit({ ...data, subscribers: [subscriber, ...data.subscribers] });
}

export function removeSubscriber(id: string): string | null {
  const data = current();
  return commit({ ...data, subscribers: data.subscribers.filter((s) => s.id !== id) });
}

export function resetData() {
  ensureHydrated();
  window.localStorage.removeItem(STORAGE_KEY);
  state = { ...SEED, ready: true };
  emit();
}
