"use client";

import { useEffect, useState } from "react";
import { VideoDetail } from "@/lib/videoData";
import { useVideoNote } from "@/lib/notes";
import {
  X,
  Code2,
  CheckCircle2,
  Circle,
  Lightbulb,
  FileEdit,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Share2,
  Check,
} from "lucide-react";
import { YoutubeIcon, LeetCodeIcon } from "./BrandIcons";

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
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

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

          <div className="vmodal-head-actions">
            <button
              type="button"
              className="vmodal-icon-btn"
              onClick={handleCopyLink}
              title="Copy link"
            >
              {isCopied ? <Check size={16} className="text-green" /> : <Share2 size={16} />}
            </button>

            <button
              type="button"
              className="vmodal-close"
              onClick={onClose}
              aria-label="Close dialog"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2-Column Landscape Body (No Vertical Scrollbar on Desktop!) */}
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
                  <YoutubeIcon size={38} className="vmodal-ph-yt-icon" />
                  <h3 className="vmodal-ph-title">{video.title}</h3>
                  <p className="vmodal-ph-sub">Lecture #{video.id} · codestorywithMIK</p>
                  {ytWatchUrl && (
                    <a
                      href={ytWatchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="vmodal-ph-btn"
                    >
                      <YoutubeIcon size={16} />
                      <span>Watch Lecture on YouTube</span>
                      <ExternalLink size={13} />
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
                  <Lightbulb size={16} className="vmodal-summary-icon" />
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
                  <YoutubeIcon size={18} className="btn-svg-icon" />
                  <span>Watch on YouTube</span>
                  <ExternalLink size={14} className="vmodal-btn-arrow" />
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
                  <LeetCodeIcon size={18} className="btn-svg-icon" />
                  <span>Solve on LeetCode</span>
                  <ExternalLink size={14} className="vmodal-btn-arrow" />
                </a>
              )}

              <button
                type="button"
                className={`btn vmodal-btn-done ${isDone ? "is-solved" : ""}`}
                onClick={onToggleDone}
                title="Toggle solved status (Spacebar)"
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="btn-svg-icon check-done" />
                ) : (
                  <Circle size={18} className="btn-svg-icon" />
                )}
                <span>{isDone ? "Solved! (Click to unmark)" : "Mark as Solved"}</span>
              </button>
            </div>

            {/* Personal Notes Box (fills remaining height) */}
            <div className="vmodal-notes-container">
              <div className="vmodal-notes-head">
                <div className="vmodal-notes-title-wrap">
                  <FileEdit size={14} />
                  <span className="vmodal-notes-title">Personal Scratchpad &amp; Notes</span>
                </div>
                <span className="vmodal-notes-status">Auto-saved locally</span>
              </div>
              <textarea
                id="student-note"
                className="vmodal-notes-editor"
                placeholder="Write your personal notes, edge cases, or complexity analysis here (e.g. Time: O(N), Space: O(1))..."
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
            className="vmodal-nav-btn prev-btn"
            disabled={!onPrev}
            onClick={onPrev}
            title="Previous video (Left Arrow)"
          >
            <ArrowLeft size={15} />
            <span>Previous Video</span>
          </button>

          <span className="vmodal-kbd-hint">
            <kbd>Space</kbd> toggle solved · <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>Esc</kbd> close
          </span>

          <button
            type="button"
            className="vmodal-nav-btn next-btn"
            disabled={!onNext}
            onClick={onNext}
            title="Next video (Right Arrow)"
          >
            <span>Next Video</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
