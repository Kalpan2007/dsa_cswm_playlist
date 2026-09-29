"use client";

import { useEffect } from "react";
import { VideoDetail } from "@/lib/videoData";
import { useVideoNote } from "@/lib/notes";

type VideoModalProps = {
  video: VideoDetail;
  playlistName: string;
  slug: string;
  isDone: boolean;
  onToggleDone: () => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  totalVideos: number;
  currentIndex: number;
};

export default function VideoModal({
  video,
  playlistName,
  slug,
  isDone,
  onToggleDone,
  onClose,
  onPrev,
  onNext,
  totalVideos,
  currentIndex,
}: VideoModalProps) {
  const [note, setNote] = useVideoNote(slug, video.id);

  // Keyboard navigation: Escape to close, Left/Right arrows to paginate, Space to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keys if user is typing in notes textarea
      if (document.activeElement?.tagName === "TEXTAREA" || document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape") onClose();
        return;
      }

      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onToggleDone();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, onToggleDone]);

  // Lock background scrolling while modal is open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  const difficultyClass = video.difficulty
    ? video.difficulty === "Easy"
      ? "diff-easy"
      : video.difficulty === "Medium"
      ? "diff-medium"
      : "diff-hard"
    : "";

  const ytWatchUrl = video.youtubeId
    ? `https://www.youtube.com/watch?v=${video.youtubeId}`
    : video.youtubeUrl;

  return (
    <div className="vmodal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="vmodal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="vmodal-head">
          <div className="vmodal-crumb">
            <span className="vmodal-tag">{playlistName}</span>
            <span className="vmodal-sep">/</span>
            <span className="vmodal-lec">Video #{video.id}</span>
            <span className="vmodal-page-count">
              ({currentIndex + 1} of {totalVideos})
            </span>
          </div>

          <button
            type="button"
            className="vmodal-close"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* 2-Column Landscape Body (No Scrolling Needed!) */}
        <div className="vmodal-landscape-grid">
          {/* LEFT COLUMN: Video Player (Top) + Description / Summary (Bottom) */}
          <div className="vmodal-col-left">
            <div className="vmodal-video-wrap">
              {video.youtubeId ? (
                <iframe
                  className="vmodal-iframe"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="vmodal-video-placeholder">
                  <div className="vmodal-play-icon">▶</div>
                  <h3 className="vmodal-ph-title">{video.title}</h3>
                  <p className="vmodal-ph-sub">Lecture #{video.id} · codestorywithMIK</p>
                  {ytWatchUrl && (
                    <a
                      href={ytWatchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn vmodal-btn-yt"
                    >
                      ▶ Watch on YouTube ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Description & Intuition directly below video */}
            <div className="vmodal-desc-box">
              <div className="vmodal-title-row">
                <h2 className="vmodal-title">
                  {video.leetcodeNum ? `${video.leetcodeNum}. ` : ""}
                  {video.leetcodeTitle || video.title}
                </h2>

                <div className="vmodal-badges">
                  {video.difficulty && (
                    <span className={`vmodal-badge ${difficultyClass}`}>
                      <span className="diff-dot" />
                      {video.difficulty}
                    </span>
                  )}
                  {video.pattern && (
                    <span className="vmodal-badge vmodal-pattern">{video.pattern}</span>
                  )}
                </div>
              </div>

              {/* Intuition Box */}
              {video.summary && (
                <div className="vmodal-summary">
                  <span className="vmodal-summary-icon">💡</span>
                  <div className="vmodal-summary-content">
                    <strong>Approach / Intuition:</strong>
                    <p>{video.summary}</p>
                  </div>
                </div>
              )}

              {/* Company Tags */}
              {video.companies && video.companies.length > 0 && (
                <div className="vmodal-companies">
                  <span className="vmodal-comp-label">Asked by:</span>
                  {video.companies.map((comp) => (
                    <span key={comp} className="vmodal-comp-pill">
                      {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Buttons (Top) + Notes Box (Bottom) */}
          <div className="vmodal-col-right">
            {/* Action Buttons: Red YouTube, Orange LeetCode, Green Solved */}
            <div className="vmodal-btn-stack">
              {ytWatchUrl && (
                <a
                  href={ytWatchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn vmodal-btn-yt"
                  title="Open video on YouTube"
                >
                  <span className="vmodal-btn-icon">▶</span>
                  <span>Watch on YouTube</span>
                  <span className="vmodal-btn-arrow">↗</span>
                </a>
              )}

              {video.leetcodeUrl && (
                <a
                  href={video.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn vmodal-btn-lc"
                  title="Solve this question on LeetCode"
                >
                  <span className="vmodal-btn-icon">&lt;/&gt;</span>
                  <span>Solve on LeetCode</span>
                  <span className="vmodal-btn-arrow">↗</span>
                </a>
              )}

              <button
                type="button"
                className={`btn vmodal-btn-done ${isDone ? "is-solved" : ""}`}
                onClick={onToggleDone}
                title="Toggle solved status (Spacebar)"
              >
                <span className="vmodal-btn-icon">{isDone ? "✓" : "○"}</span>
                <span>{isDone ? "Solved! (Click to unmark)" : "Mark as Solved"}</span>
              </button>
            </div>

            {/* Personal Notes Box (fills remaining height) */}
            <div className="vmodal-notes-container">
              <div className="vmodal-notes-head">
                <span className="vmodal-notes-title">📝 My Personal Notes</span>
                <span className="vmodal-notes-status">💾 Auto-saved</span>
              </div>
              <textarea
                id="student-note"
                className="vmodal-notes-editor"
                placeholder="Jot down time/space complexity (e.g. O(N)), key edge cases, or revision hints here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Modal Navigation Footer */}
        <div className="vmodal-foot">
          <button
            type="button"
            className="btn btn-quiet vmodal-nav-btn"
            disabled={!onPrev}
            onClick={onPrev}
            title="Previous video (Left Arrow)"
          >
            ← Previous Video
          </button>

          <span className="vmodal-kbd-hint">
            <kbd>Space</kbd> toggle solved · <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>Esc</kbd> close
          </span>

          <button
            type="button"
            className="btn btn-quiet vmodal-nav-btn"
            disabled={!onNext}
            onClick={onNext}
            title="Next video (Right Arrow)"
          >
            Next Video →
          </button>
        </div>
      </div>
    </div>
  );
}
