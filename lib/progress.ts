"use client";

import { useSyncExternalStore } from "react";

// Shape saved in localStorage: { "sliding-window": [1, 3, 4], "trie": [0], ... }
export type Progress = Record<string, number[]>;

const KEY = "dsa-tracker:v1";
const EMPTY: Progress = {};
const listeners = new Set<() => void>();

let cache: Progress | null = null;
let cacheRaw: string | null = null;

function read(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cacheRaw && cache) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    cache = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    cache = {};
  }
  return cache!;
}

function write(next: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep going in memory */
    cache = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // keeps several open tabs in sync
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggle(slug: string, id: number) {
  const cur = read();
  const set = new Set(cur[slug] ?? []);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  write({ ...cur, [slug]: [...set].sort((a, b) => a - b) });
}

export function setAll(slug: string, ids: number[]) {
  write({ ...read(), [slug]: [...ids] });
}

export function resetPlaylist(slug: string) {
  const next = { ...read() };
  delete next[slug];
  write(next);
}

export function resetEverything() {
  write({});
}

export function exportProgress(): string {
  return JSON.stringify(read(), null, 2);
}

export function importProgress(json: string) {
  const parsed = JSON.parse(json);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("This file is not a progress backup.");
  }
  write(parsed);
}
