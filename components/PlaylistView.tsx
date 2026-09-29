"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getPlaylist, itemsOf, playlists, youtubeLink } from "@/lib/playlists";
import { resetPlaylist, setAll, toggle, useProgress } from "@/lib/progress";
import { getVideoDetail, Difficulty } from "@/lib/videoData";
import VideoModal from "./VideoModal";

type FilterStatus = "all" | "unsolved" | "solved";
type FilterDifficulty = "all" | Difficulty;
type ViewMode = "grid" | "sheet";

export default function PlaylistView({ slug }: { slug: string }) {
  const p = getPlaylist(slug)!;
  const progress = useProgress();
  const doneIds = useMemo(() => new Set(progress[slug] ?? []), [progress, slug]);

  const items = itemsOf(p);
  const done = items.filter((id) => doneIds.has(id)).length;
  const whole = p.videos === "all";

  const index = playlists.findIndex((x) => x.slug === slug);
  const prev = playlists[index - 1];
  const next = playlists[index + 1];

  // Video modal selection
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  // Filter & Search states
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [diffFilter, setDiffFilter] = useState<FilterDifficulty>("all");

  // Build items with details
  const videoItems = useMemo(() => {
    return items.map((id) => ({
      id,
      detail: getVideoDetail(slug, id, p.name, p.url),
      isDone: doneIds.has(id),
    }));
  }, [items, slug, p.name, p.url, doneIds]);

  // Filtered items based on search and filters
  const filteredItems = useMemo(() => {
    return videoItems.filter(({ id, detail, isDone }) => {
      // Status filter
      if (statusFilter === "solved" && !isDone) return false;
      if (statusFilter === "unsolved" && isDone) return false;

      // Difficulty filter
      if (diffFilter !== "all" && detail.difficulty !== diffFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = detail.title.toLowerCase().includes(q);
        const matchesLeetCode = detail.leetcodeTitle?.toLowerCase().includes(q);
        const matchesNum = String(detail.leetcodeNum ?? id).includes(q);
        const matchesCompanies = detail.companies?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesLeetCode && !matchesNum && !matchesCompanies) {
          return false;
        }
      }

      return true;
    });
  }, [videoItems, statusFilter, diffFilter, searchQuery]);

  // Selected video object for modal
  const selectedVideoObj = useMemo(() => {
    if (selectedVideoId === null) return null;
    return getVideoDetail(slug, selectedVideoId, p.name, p.url);
  }, [selectedVideoId, slug, p.name, p.url]);

  // Modal navigation (next/prev video in current item list)
  const currentSelectedIdx = items.indexOf(selectedVideoId ?? -1);
  const hasPrev = currentSelectedIdx > 0;
  const hasNext = currentSelectedIdx >= 0 && currentSelectedIdx < items.length - 1;

  const handlePrevVideo = () => {
    if (hasPrev) setSelectedVideoId(items[currentSelectedIdx - 1]);
  };

  const handleNextVideo = () => {
    if (hasNext) setSelectedVideoId(items[currentSelectedIdx + 1]);
  };

  // Difficulty counts for summary
  const easyCount = videoItems.filter((v) => v.detail.difficulty === "Easy").length;
  const medCount = videoItems.filter((v) => v.detail.difficulty === "Medium").length;
  const hardCount = videoItems.filter((v) => v.detail.difficulty === "Hard").length;

  return (
    <>
      <nav className="crumb">
        <Link href="/">← All playlists</Link>
      </nav>

      <header className="pl-head">
        <p className="pl-pos">
          Playlist {index + 1} of {playlists.length} · {p.group}
        </p>

        <div className="pl-title-wrap">
          <h1>{p.name}</h1>
        </div>

        <div className="pl-meta-row">
          <p className="pl-meta" aria-live="polite">
            {whole
              ? done
                ? "You've finished this playlist."
                : "Watch the whole playlist, then tick it off."
              : `${done} of ${items.length} videos completed (${Math.round(
                  (done / items.length) * 100
                )}%)`}
          </p>

          {!whole && (easyCount > 0 || medCount > 0 || hardCount > 0) && (
            <div className="pl-diff-breakdown">
              {easyCount > 0 && <span className="diff-pill diff-easy">{easyCount} Easy</span>}
              {medCount > 0 && <span className="diff-pill diff-medium">{medCount} Medium</span>}
              {hardCount > 0 && <span className="diff-pill diff-hard">{hardCount} Hard</span>}
            </div>
          )}
        </div>

        {!whole && (
          <div className="pl-bar" aria-hidden>
            <span style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
        )}

        <div className="actions">
          <a className="btn" href={youtubeLink(p)} target="_blank" rel="noreferrer">
            Open on YouTube ↗
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
            <strong>I&apos;ve watched every video in this playlist</strong>
            <small>This playlist is covered in full, so it has one tick.</small>
          </span>
        </label>
      ) : (
        <>
          {/* Controls Bar: Search, Filters, View Modes */}
          <div className="pl-controls">
            <div className="pl-search-wrap">
              <input
                type="search"
                className="pl-search-input"
                placeholder="Search problem name, LC #, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="pl-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="pl-filter-row">
              <div className="pl-filter-group">
                <button
                  type="button"
                  className={`pl-pill ${statusFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({items.length})
                </button>
                <button
                  type="button"
                  className={`pl-pill ${statusFilter === "unsolved" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("unsolved")}
                >
                  Unsolved ({items.length - done})
                </button>
                <button
                  type="button"
                  className={`pl-pill ${statusFilter === "solved" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("solved")}
                >
                  Solved ({done})
                </button>
              </div>

              {(easyCount > 0 || medCount > 0 || hardCount > 0) && (
                <div className="pl-filter-group">
                  <button
                    type="button"
                    className={`pl-pill ${diffFilter === "all" ? "is-active" : ""}`}
                    onClick={() => setDiffFilter("all")}
                  >
                    All Difficulties
                  </button>
                  {easyCount > 0 && (
                    <button
                      type="button"
                      className={`pl-pill pill-easy ${diffFilter === "Easy" ? "is-active" : ""}`}
                      onClick={() => setDiffFilter(diffFilter === "Easy" ? "all" : "Easy")}
                    >
                      Easy
                    </button>
                  )}
                  {medCount > 0 && (
                    <button
                      type="button"
                      className={`pl-pill pill-med ${diffFilter === "Medium" ? "is-active" : ""}`}
                      onClick={() => setDiffFilter(diffFilter === "Medium" ? "all" : "Medium")}
                    >
                      Medium
                    </button>
                  )}
                  {hardCount > 0 && (
                    <button
                      type="button"
                      className={`pl-pill pill-hard ${diffFilter === "Hard" ? "is-active" : ""}`}
                      onClick={() => setDiffFilter(diffFilter === "Hard" ? "all" : "Hard")}
                    >
                      Hard
                    </button>
                  )}
                </div>
              )}

              <div className="pl-view-switch">
                <button
                  type="button"
                  className={`pl-view-btn ${viewMode === "grid" ? "is-active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Notebook Grid View"
                >
                  ⊞ Grid
                </button>
                <button
                  type="button"
                  className={`pl-view-btn ${viewMode === "sheet" ? "is-active" : ""}`}
                  onClick={() => setViewMode("sheet")}
                  title="Problem Sheet View"
                >
                  ☰ Sheet
                </button>
              </div>
            </div>
          </div>

          <p className="hint">
            Click any video to open the <strong>Video Hub</strong> with lecture video, LeetCode link, intuition, and notes. Tap the checkmark icon to quick-toggle solved.
          </p>

          {/* Grid View */}
          {viewMode === "grid" && (
            <ul className="grid">
              {filteredItems.map(({ id, detail, isDone }) => {
                const diffDot = detail.difficulty
                  ? detail.difficulty === "Easy"
                    ? "dot-easy"
                    : detail.difficulty === "Medium"
                    ? "dot-med"
                    : "dot-hard"
                  : null;

                return (
                  <li key={id}>
                    <div
                      className={`tile-wrap${isDone ? " is-done" : ""}`}
                      title={`${detail.title}${detail.difficulty ? ` (${detail.difficulty})` : ""}`}
                    >
                      <button
                        type="button"
                        className="tile-main-btn"
                        onClick={() => setSelectedVideoId(id)}
                        aria-label={`Open video ${id}: ${detail.title}`}
                      >
                        <span className="tile-num">{id}</span>
                        {diffDot && <span className={`tile-diff-dot ${diffDot}`} />}
                      </button>

                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isDone}
                        aria-label={`Toggle Video ${id} completed`}
                        className={`tile-quick-tick${isDone ? " is-ticked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(slug, id);
                        }}
                        title={isDone ? "Mark as unsolved" : "Mark as solved"}
                      >
                        ✓
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Sheet / Table View */}
          {viewMode === "sheet" && (
            <div className="sheet-wrap">
              <div className="sheet-header">
                <span className="sheet-col-status">Status</span>
                <span className="sheet-col-lec">Lec #</span>
                <span className="sheet-col-problem">Problem & LeetCode</span>
                <span className="sheet-col-diff">Difficulty</span>
                <span className="sheet-col-pattern">Pattern / Companies</span>
                <span className="sheet-col-action">Action</span>
              </div>

              <div className="sheet-rows">
                {filteredItems.map(({ id, detail, isDone }) => (
                  <div
                    key={id}
                    className={`sheet-row ${isDone ? "is-done" : ""}`}
                    onClick={() => setSelectedVideoId(id)}
                  >
                    <div className="sheet-col-status" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(slug, id)}
                        aria-label={`Mark video ${id} done`}
                        className="sheet-checkbox"
                      />
                    </div>

                    <div className="sheet-col-lec">
                      <span className="sheet-lec-badge">#{id}</span>
                    </div>

                    <div className="sheet-col-problem">
                      <div className="sheet-prob-title">
                        {detail.leetcodeNum ? `${detail.leetcodeNum}. ` : ""}
                        {detail.leetcodeTitle || detail.title}
                      </div>

                      {detail.leetcodeUrl && (
                        <a
                          href={detail.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="sheet-lc-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          LeetCode ↗
                        </a>
                      )}
                    </div>

                    <div className="sheet-col-diff">
                      {detail.difficulty ? (
                        <span
                          className={`sheet-diff-pill ${
                            detail.difficulty === "Easy"
                              ? "diff-easy"
                              : detail.difficulty === "Medium"
                              ? "diff-medium"
                              : "diff-hard"
                          }`}
                        >
                          {detail.difficulty}
                        </span>
                      ) : (
                        <span className="sheet-diff-empty">—</span>
                      )}
                    </div>

                    <div className="sheet-col-pattern">
                      {detail.pattern && <span className="sheet-pattern-tag">{detail.pattern}</span>}
                      {detail.companies && detail.companies.length > 0 && (
                        <span className="sheet-comp-preview">
                          {detail.companies.slice(0, 2).join(", ")}
                          {detail.companies.length > 2 && " +more"}
                        </span>
                      )}
                    </div>

                    <div className="sheet-col-action">
                      <button
                        type="button"
                        className="btn btn-quiet sheet-play-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoId(id);
                        }}
                      >
                        ▶ Watch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="pl-empty-filter">
              <p>No questions matched your search or filters.</p>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDiffFilter("all");
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Video Modal */}
      {selectedVideoObj && selectedVideoId !== null && (
        <VideoModal
          video={selectedVideoObj}
          playlistName={p.name}
          slug={slug}
          isDone={doneIds.has(selectedVideoId)}
          onToggleDone={() => toggle(slug, selectedVideoId)}
          onClose={() => setSelectedVideoId(null)}
          onPrev={hasPrev ? handlePrevVideo : undefined}
          onNext={hasNext ? handleNextVideo : undefined}
          totalVideos={items.length}
          currentIndex={currentSelectedIdx}
        />
      )}

      {/* Pagination Footer */}
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
