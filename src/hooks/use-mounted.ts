"use client";

import { useSyncExternalStore } from "react";

/** No external store — the snapshot is read directly instead of subscribed. */
const subscribe = () => () => {};

const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` only after React has hydrated on the client.
 *
 * Persisted client state (e.g. the Zustand cart) is not available during
 * server/static rendering, so any UI that derives from it must wait for
 * hydration — otherwise the first client render mismatches the SSR markup.
 *
 * Implemented with `useSyncExternalStore`, which renders the server
 * snapshot during hydration and only switches to `true` afterwards, so no
 * effect (and no hydration mismatch) is involved.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}