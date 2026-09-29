"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getPlaylist, itemsOf, playlists, youtubeLink } from "@/lib/playlists";
import { resetPlaylist, setAll, toggle, useProgress } from "@/lib/progress";
import { getVideoDetail, Difficulty } from "@/lib/videoData";
import VideoModal from "./VideoModal";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  Play,
  RotateCcw,
  Search,
  CheckCheck,
  LayoutGrid,
  List,
  Code2,
} from "lucide-react";
import { YoutubeIcon } from "./BrandIcons";

type FilterStatus = "all" | "unsolved" | "solved";
type FilterDifficulty = "all" | Difficulty;
type ViewMode = "sheet" | "grid";

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

  // Video modal state
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  // Filters & View state
  const [viewMode, setViewMode] = useState<ViewMode>("sheet");
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

  // Modal navigation
  const currentSelectedIdx = items.indexOf(selectedVideoId ?? -1);
  const hasPrev = currentSelectedIdx > 0;
  const hasNext = currentSelectedIdx >= 0 && currentSelectedIdx < items.length - 1;

  const handlePrevVideo = () => {
    if (hasPrev) setSelectedVideoId(items[currentSelectedIdx - 1]);
  };

  const handleNextVideo = () => {
    if (hasNext) setSelectedVideoId(items[currentSelectedIdx + 1]);
  };

  // Difficulty counts
  const easyCount = videoItems.filter((v) => v.detail.difficulty === "Easy").length;
  const medCount = videoItems.filter((v) => v.detail.difficulty === "Medium").length;
  const hardCount = videoItems.filter((v) => v.detail.difficulty === "Hard").length;
  const percentDone = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="playlist-page-view">
      {/* Prominent Back Button & Navigation Trail */}
      <div className="pl-nav-header">
        <Link href="/" className="crumb-back-btn" title="Back to all 36 playlists">
          <ArrowLeft size={16} />
          <span>All Playlists</span>
        </Link>
        <div className="crumb-trail">
          <span className="crumb-group">{p.group}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{p.name}</span>
        </div>
      </div>

      {/* Playlist Hero Header */}
      <header className="pl-detail-header">
        <div className="pl-detail-top">
          <div className="pl-detail-info">
            <span className="pl-order-tag">
              Playlist #{index + 1} of {playlists.length} · {p.group}
            </span>
            <h1 className="pl-detail-title">{p.name}</h1>
            <p className="pl-detail-desc">
              Curated lecture playlist by codestorywithMIK. Click any question to open the lecture video, solve on LeetCode, and write personal notes.
            </p>
          </div>

          <div className="pl-detail-actions">
            <a
              className="pl-action-btn yt-btn"
              href={youtubeLink(p)}
              target="_blank"
              rel="noreferrer"
            >
              <YoutubeIcon size={16} />
              <span>Open on YouTube</span>
              <ExternalLink size={13} className="opacity-70" />
            </a>

            {!whole && done < items.length && (
              <button
                type="button"
                className="pl-action-btn tick-all-btn"
                onClick={() => setAll(slug, items)}
              >
                <CheckCheck size={16} />
                <span>Mark All Complete</span>
              </button>
            )}

            {done > 0 && (
              <button
                type="button"
                className="pl-action-btn reset-btn"
                onClick={() => {
                  if (confirm(`Reset and clear all ticks for ${p.name}?`)) resetPlaylist(slug);
                }}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress & Difficulty Breakdown */}
        <div className="pl-progress-banner">
          <div className="pl-progress-info">
            <div className="pl-progress-text">
              <span className="pl-progress-percent">{percentDone}% Complete</span>
              <span className="pl-progress-fraction">
                ({done} of {items.length} {whole ? "playlist" : "videos"})
              </span>
            </div>

            <div className="pl-progress-track">
              <div className="pl-progress-bar" style={{ width: `${percentDone}%` }} />
            </div>
          </div>

          {!whole && (easyCount > 0 || medCount > 0 || hardCount > 0) && (
            <div className="pl-diff-chips">
              {easyCount > 0 && (
                <span className="diff-chip chip-easy">
                  <span className="chip-dot dot-easy" />
                  {easyCount} Easy
                </span>
              )}
              {medCount > 0 && (
                <span className="diff-chip chip-medium">
                  <span className="chip-dot dot-med" />
                  {medCount} Medium
                </span>
              )}
              {hardCount > 0 && (
                <span className="diff-chip chip-hard">
                  <span className="chip-dot dot-hard" />
                  {hardCount} Hard
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Playlist Content */}
      {whole ? (
        <div className="whole-playlist-card">
          <label className={`whole-toggle ${doneIds.has(0) ? "is-done" : ""}`}>
            <input type="checkbox" checked={doneIds.has(0)} onChange={() => toggle(slug, 0)} />
            <div className="whole-check-box">
              {doneIds.has(0) ? <CheckCircle2 size={28} /> : <Circle size={28} />}
            </div>
            <div className="whole-text">
              <strong>I&apos;ve completed this entire playlist on YouTube</strong>
              <span>This topic is covered in full without individual problem numbers.</span>
            </div>
          </label>
        </div>
      ) : (
        <>
          {/* Controls Bar: Search, Filters, View Modes */}
          <div className="pl-toolbar">
            <div className="pl-search-container">
              <Search size={16} className="pl-search-icon" />
              <input
                type="search"
                className="pl-search-box"
                placeholder="Search problem title, LC #, or company..."
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

            <div className="pl-filters-wrap">
              {/* Status Filter */}
              <div className="filter-pill-group">
                <button
                  type="button"
                  className={`filter-pill ${statusFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({items.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${statusFilter === "unsolved" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("unsolved")}
                >
                  Unsolved ({items.length - done})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${statusFilter === "solved" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("solved")}
                >
                  Solved ({done})
                </button>
              </div>

              {/* Difficulty Filter */}
              {(easyCount > 0 || medCount > 0 || hardCount > 0) && (
                <div className="filter-pill-group">
                  <button
                    type="button"
                    className={`filter-pill ${diffFilter === "all" ? "is-active" : ""}`}
                    onClick={() => setDiffFilter("all")}
                  >
                    All Levels
                  </button>
                  {easyCount > 0 && (
                    <button
                      type="button"
                      className={`filter-pill pill-easy ${diffFilter === "Easy" ? "is-active" : ""}`}
                      onClick={() => setDiffFilter(diffFilter === "Easy" ? "all" : "Easy")}
                    >
                      Easy
                    </button>
                  )}
                  {medCount > 0 && (
                    <button
                      type="button"
                      className={`filter-pill pill-med ${diffFilter === "Medium" ? "is-active" : ""}`}
                      onClick={() => setDiffFilter(diffFilter === "Medium" ? "all" : "Medium")}
                    >
                      Medium
                    </button>
                  )}
                  {hardCount > 0 && (
                    <button
                      type="button"
                      className={`filter-pill pill-hard ${diffFilter === "Hard" ? "is-active" : ""}`}
                      onClick={() => setDiffFilter(diffFilter === "Hard" ? "all" : "Hard")}
                    >
                      Hard
                    </button>
                  )}
                </div>
              )}

              {/* View Switcher */}
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "sheet" ? "is-active" : ""}`}
                  onClick={() => setViewMode("sheet")}
                  title="Table Sheet View"
                >
                  <List size={16} />
                  <span>Sheet</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "grid" ? "is-active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Numbered Squares Grid View"
                >
                  <LayoutGrid size={16} />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sheet / Table View (Default Modern NeetCode / Striver Style) */}
          {viewMode === "sheet" && (
            <div className="modern-sheet-container">
              <table className="modern-sheet-table">
                <thead>
                  <tr>
                    <th className="th-status">Status</th>
                    <th className="th-num">#</th>
                    <th className="th-title">Problem &amp; LeetCode Link</th>
                    <th className="th-difficulty">Difficulty</th>
                    <th className="th-pattern">Pattern / Companies</th>
                    <th className="th-action">Lecture</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(({ id, detail, isDone }) => {
                    const diffClass = detail.difficulty
                      ? detail.difficulty === "Easy"
                        ? "diff-chip-easy"
                        : detail.difficulty === "Medium"
                        ? "diff-chip-med"
                        : "diff-chip-hard"
                      : "";

                    return (
                      <tr
                        key={id}
                        className={`modern-sheet-row ${isDone ? "is-row-done" : ""}`}
                        onClick={() => setSelectedVideoId(id)}
                      >
                        {/* Checkbox */}
                        <td className="td-status" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={`row-check-btn ${isDone ? "is-ticked" : ""}`}
                            onClick={() => toggle(slug, id)}
                            aria-label={`Toggle status for video ${id}`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={19} className="check-icon-done" />
                            ) : (
                              <Circle size={19} className="check-icon-pending" />
                            )}
                          </button>
                        </td>

                        {/* Lecture # */}
                        <td className="td-num">
                          <span className="lec-pill">#{id}</span>
                        </td>

                        {/* Problem Title & LeetCode link */}
                        <td className="td-title">
                          <div className="prob-title-row">
                            <span className="prob-name">
                              {detail.leetcodeNum ? `${detail.leetcodeNum}. ` : ""}
                              {detail.leetcodeTitle || detail.title}
                            </span>

                            {detail.leetcodeUrl && (
                              <a
                                href={detail.leetcodeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="prob-lc-badge"
                                onClick={(e) => e.stopPropagation()}
                                title="Solve on LeetCode"
                              >
                                <span>LeetCode</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="td-difficulty">
                          {detail.difficulty ? (
                            <span className={`diff-pill-badge ${diffClass}`}>
                              <span className="diff-dot" />
                              {detail.difficulty}
                            </span>
                          ) : (
                            <span className="diff-none">—</span>
                          )}
                        </td>

                        {/* Pattern / Companies */}
                        <td className="td-pattern">
                          <div className="pattern-cell">
                            {detail.pattern && (
                              <span className="pattern-tag">{detail.pattern}</span>
                            )}
                            {detail.companies && detail.companies.length > 0 && (
                              <span className="companies-preview">
                                {detail.companies.slice(0, 2).join(", ")}
                                {detail.companies.length > 2 && " +more"}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action Watch */}
                        <td className="td-action">
                          <button
                            type="button"
                            className="sheet-watch-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVideoId(id);
                            }}
                          >
                            <Play size={13} fill="currentColor" />
                            <span>Watch</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Grid View (Enhanced Square Tiles) */}
          {viewMode === "grid" && (
            <div className="modern-grid-container">
              <ul className="modern-tiles-grid">
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
                        className={`tile-box ${isDone ? "is-ticked" : ""}`}
                        title={`${detail.title}${
                          detail.difficulty ? ` (${detail.difficulty})` : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="tile-surface-btn"
                          onClick={() => setSelectedVideoId(id)}
                          aria-label={`Open video ${id}: ${detail.title}`}
                        >
                          <span className="tile-id-text">{id}</span>
                          {diffDot && <span className={`tile-dot ${diffDot}`} />}
                        </button>

                        <button
                          type="button"
                          className={`tile-corner-tick ${isDone ? "is-done" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(slug, id);
                          }}
                          title={isDone ? "Mark as unsolved" : "Mark as solved"}
                        >
                          {isDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="empty-search-state">
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

      {/* Video Modal (Zero-Scroll Wireframe Landscape Modal) */}
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

      {/* Pager Footer Navigation */}
      <nav className="pl-bottom-pager">
        {prev ? (
          <Link href={`/${prev.slug}`} className="pl-pager-link prev-link">
            <ArrowLeft size={16} />
            <div className="pager-text-block">
              <span className="pager-sub">Previous Playlist</span>
              <span className="pager-title">{prev.name}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link href={`/${next.slug}`} className="pl-pager-link next-link">
            <div className="pager-text-block text-right">
              <span className="pager-sub">Next Playlist</span>
              <span className="pager-title">{next.name}</span>
            </div>
            <ArrowRight size={16} />
          </Link>
        ) : (
          <Link href="/" className="pl-pager-link next-link">
            <div className="pager-text-block text-right">
              <span className="pager-sub">End of Curriculum</span>
              <span className="pager-title">Back to All Playlists</span>
            </div>
            <ArrowRight size={16} />
          </Link>
        )}
      </nav>
    </div>
  );
}
