"use client";

import Link from "next/link";
import { groups, itemsOf, playlists } from "@/lib/playlists";
import { useProgress } from "@/lib/progress";
import Backup from "./Backup";

export default function Overview() {
  const progress = useProgress();

  const stats = playlists.map((p) => {
    const items = itemsOf(p);
    const done = items.filter((id) => progress[p.slug]?.includes(id)).length;
    return { p, done, total: items.length };
  });

  const finished = stats.filter((s) => s.done === s.total).length;
  const videoStats = stats.filter((s) => s.p.videos !== "all");
  const vDone = videoStats.reduce((a, s) => a + s.done, 0);
  const vTotal = videoStats.reduce((a, s) => a + s.total, 0);

  // first playlist that still has something left
  const next = stats.find((s) => s.done < s.total);

  let order = 0;

  return (
    <>
      <header className="hero">
        <h1>DSA checklist</h1>
        <p className="lede">
          Every codestorywithMIK playlist in the order to watch them. Tick a video when you finish it;
          your ticks stay in this browser.
        </p>

        <div className="tally" aria-live="polite">
          <div>
            <strong>{vDone}</strong>
            <span>of {vTotal} picked videos watched</span>
          </div>
          <div>
            <strong>{finished}</strong>
            <span>of {playlists.length} playlists complete</span>
          </div>
        </div>

        {next && (
          <Link className="btn btn-primary" href={`/${next.p.slug}`}>
            {next.done === 0 && vDone === 0 ? "Start with" : "Continue with"} {next.p.name}
          </Link>
        )}
      </header>

      {groups.map((g) => (
        <section key={g} className="group">
          <h2>{g}</h2>
          <ol className="rows">
            {stats
              .filter((s) => s.p.group === g)
              .map(({ p, done, total }) => {
                order += 1;
                const complete = done === total;
                return (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}`} className={`row${complete ? " is-complete" : ""}`}>
                      <span className="row-num">{order}</span>
                      <span className="row-name">{p.name}</span>
                      <span className="row-bar" aria-hidden>
                        <span style={{ width: `${(done / total) * 100}%` }} />
                      </span>
                      <span className="row-count">
                        {p.videos === "all" ? (complete ? "Done" : "Whole playlist") : `${done}/${total}`}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ol>
        </section>
      ))}

      <Backup />
    </>
  );
}
