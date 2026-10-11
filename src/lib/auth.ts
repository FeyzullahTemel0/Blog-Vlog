import { useSyncExternalStore } from "react";

const KEY = "yolcunun-defteri:admin";
const EVENT = "yd-auth-change";

// Demo amaçlıdır. Gerçek bir projede kimlik doğrulama sunucu tarafında yapılmalıdır.
export const DEMO_EMAIL = "deniz@yolcunundefteri.com";
export const DEMO_PASSWORD = "demo123";

export type AuthState = "unknown" | "in" | "out";

export function getAuthState(): AuthState {
  try {
    return window.sessionStorage.getItem(KEY) === "1" ? "in" : "out";
  } catch {
    return "out";
  }
}

export function signIn(password: string): boolean {
  if (password !== DEMO_PASSWORD) return false;
  window.sessionStorage.setItem(KEY, "1");
  window.dispatchEvent(new Event(EVENT));
  return true;
}

export function signOut() {
  window.sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

function subscribeAuth(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribeAuth, getAuthState, () => "unknown" as AuthState);
}
