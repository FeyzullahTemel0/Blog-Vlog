"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Year is read on the client only, so prerendering never bakes in a build-time date. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => null
  );
  return <>{year ?? ""}</>;
}
