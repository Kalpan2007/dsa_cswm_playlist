"use client";

import Link from "next/link";
import { getPlaylist, itemsOf, playlists, youtubeLink } from "@/lib/playlists";
import { resetPlaylist, setAll, toggle, useProgress } from "@/lib/progress";

export default function PlaylistView({ slug }: { slug: string }) {
  const p = getPlaylist(slug)!;
  const progress = useProgress();
  const doneIds = new Set(progress[slug] ?? []);

  const items = itemsOf(p);
  const done = items.filter((id) => doneIds.has(id)).length;
  const whole = p.videos === "all";

  const index = playlists.findIndex((x) => x.slug === slug);
  const prev = playlists[index - 1];
  const next = playlists[index + 1];

  return (
    <>
      <nav className="crumb">
        <Link href="/">All playlists</Link>
      </nav>

      <header className="pl-head">
        <p className="pl-pos">
          Playlist {index + 1} of {playlists.length}, in {p.group}
        </p>
        <h1>{p.name}</h1>
        <p className="pl-meta" aria-live="polite">
          {whole
            ? done
              ? "You've finished this playlist."
              : "Watch the whole playlist, then tick it off."
            : `${done} of ${items.length} videos watched`}
        </p>

        {!whole && (
          <div className="pl-bar" aria-hidden>
            <span style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
        )}

        <div className="actions">
          <a className="btn" href={youtubeLink(p)} target="_blank" rel="noreferrer">
            Open on YouTube
          </a>
          {!whole && done < items.length && (
            <button className="btn" onClick={() => setAll(slug, items)}>
              Tick all
            </button>
          )}
          {done > 0 && (
            <button
              className="btn btn-quiet"
              onClick={() => {
                if (confirm(`Clear your ticks for ${p.name}?`)) resetPlaylist(slug);
              }}
            >
              Clear ticks
            </button>
          )}
        </div>
      </header>

      {whole ? (
        <label className={`whole${doneIds.has(0) ? " is-done" : ""}`}>
          <input type="checkbox" checked={doneIds.has(0)} onChange={() => toggle(slug, 0)} />
          <span className="whole-box" aria-hidden />
          <span>
            <strong>I've watched every video in this playlist</strong>
            <small>This playlist is covered in full, so it has one tick.</small>
          </span>
        </label>
      ) : (
        <>
          <p className="hint">Numbers are the video numbers inside the YouTube playlist. Tap one when it&apos;s done.</p>
          <ul className="grid">
            {items.map((id) => {
              const on = doneIds.has(id);
              return (
                <li key={id}>
                  <button
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`Video ${id}`}
                    className={`tile${on ? " is-done" : ""}`}
                    onClick={() => toggle(slug, id)}
                  >
                    {id}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <nav className="pager">
        {prev ? (
          <Link href={`/${prev.slug}`} className="pager-link">
            <small>Previous</small>
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/${next.slug}`} className="pager-link pager-next">
            <small>Next</small>
            {next.name}
          </Link>
        ) : (
          <Link href="/" className="pager-link pager-next">
            <small>That&apos;s the last one</small>
            Back to all playlists
          </Link>
        )}
      </nav>
    </>
  );
}
