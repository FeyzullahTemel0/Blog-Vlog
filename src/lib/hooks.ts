import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Returns the current time rounded to `intervalMs`; `null` on the server and during hydration. */
export function useNow(intervalMs = 30000): number | null {
  const bucket = useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, intervalMs);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs),
    () => -1
  );
  return bucket < 0 ? null : bucket * intervalMs;
}

export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
