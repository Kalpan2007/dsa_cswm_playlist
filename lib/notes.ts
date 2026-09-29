"use client";

import { useSyncExternalStore } from "react";

export type NotesMap = Record<string, string>;

const KEY = "dsa-tracker:notes:v1";
const EMPTY: NotesMap = {};
const listeners = new Set<() => void>();

let cache: NotesMap | null = null;
let cacheRaw: string | null = null;

function read(): NotesMap {
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

function write(next: NotesMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    cache = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAllNotes(): NotesMap {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useVideoNote(slug: string, id: number): [string, (text: string) => void] {
  const notes = useAllNotes();
  const noteKey = `${slug}:${id}`;
  const value = notes[noteKey] ?? "";

  const update = (text: string) => {
    const cur = read();
    if (!text.trim()) {
      const next = { ...cur };
      delete next[noteKey];
      write(next);
    } else {
      write({ ...cur, [noteKey]: text });
    }
  };

  return [value, update];
}
