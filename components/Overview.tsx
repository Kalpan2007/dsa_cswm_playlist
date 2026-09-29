"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { groups, itemsOf, playlists } from "@/lib/playlists";
import { useProgress } from "@/lib/progress";
import { videoDetailsMap } from "@/lib/videoData";
import Backup from "./Backup";
import {
  CheckCircle2,
  PlayCircle,
  Trophy,
  Flame,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
  Terminal,
} from "lucide-react";

export default function Overview() {
  const progress = useProgress();
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const stats = useMemo(() => {
    return playlists.map((p) => {
      const items = itemsOf(p);
      const done = items.filter((id) => progress[p.slug]?.includes(id)).length;
      return { p, done, total: items.length };
    });
  }, [progress]);

  const finished = stats.filter((s) => s.done === s.total).length;
  const videoStats = stats.filter((s) => s.p.videos !== "all");
  const vDone = videoStats.reduce((a, s) => a + s.done, 0);
  const vTotal = videoStats.reduce((a, s) => a + s.total, 0);
  const percentOverall = vTotal > 0 ? Math.round((vDone / vTotal) * 100) : 0;

  // Next playlist with remaining videos
  const nextIncomplete = stats.find((s) => s.done < s.total);

  // Filtered playlists
  const filteredPlaylists = useMemo(() => {
    return stats.filter(({ p }) => {
      if (selectedGroup !== "All" && p.group !== selectedGroup) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return p.name.toLowerCase().includes(q) || p.group.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stats, selectedGroup, searchQuery]);

  // Motivating milestone tier (No intimidating 700+ numbers!)
  const { rankTitle, motivationalQuote, tierProgress } = useMemo(() => {
    if (vDone === 0) {
      return {
        rankTitle: "Level 1 · Novice Explorer",
        motivationalQuote: "Every expert was once a beginner. Start with Topic #1!",
        tierProgress: 0,
      };
    }
    if (vDone < 20) {
      return {
        rankTitle: "Level 2 · Momentum Builder",
        motivationalQuote: "Great momentum! Consistency is building your mental muscle.",
        tierProgress: Math.min(100, Math.round((vDone / 20) * 100)),
      };
    }
    if (vDone < 60) {
      return {
        rankTitle: "Level 3 · Pattern Solver",
        motivationalQuote: "Consistency beats talent. Key patterns are clicking into place!",
        tierProgress: Math.min(100, Math.round(((vDone - 20) / 40) * 100)),
      };
    }
    if (vDone < 130) {
      return {
        rankTitle: "Level 4 · Problem Crusher",
        motivationalQuote: "Top-tier dedication. Interview questions are becoming natural!",
        tierProgress: Math.min(100, Math.round(((vDone - 60) / 70) * 100)),
      };
    }
    return {
      rankTitle: "Level 5 · Algorithm Master",
      motivationalQuote: "Elite mindset. Ready to crush top tech coding interviews!",
      tierProgress: 100,
    };
  }, [vDone]);

  // Active topics touched
  const activeTopics = stats.filter((s) => s.done > 0).length;

  return (
    <div className="overview-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-meta-bar">
          <div className="hero-telemetry-badge">
            <span className="terminal-status-dot" />
            <span>3KZ_SHEET // 36 CORE TOPICS · CONSISTENCY ROADMAP</span>
          </div>

          <div className="site-nav-telemetry">
            <span className="kbd-pill">/</span>
            <span>press slash to search</span>
          </div>
        </div>

        <h1 className="hero-heading">
          <span className="hero-highlight">3kz-sheet</span> · codestorywithMIK Playlist
        </h1>

        <p className="hero-subtitle">
          The official <strong>3kz-sheet</strong> roadmap for algorithmic interview preparation. Follow the complete <strong>codestorywithMIK</strong> playlist topic-by-topic in the battle-tested sequence. Watch lecture walkthroughs, solve directly on LeetCode, track your progress, and save your intuitions.
        </p>

        {/* 4-Card Telemetry Metrics Grid (Focus on Accomplishments, Not Giant Denominators) */}
        <div className="metrics-grid">
          {/* Metric 1: Overall Problems Solved with Motivational Tier */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">// PROBLEMS_SOLVED</span>
              <div className="metric-icon-box">
                <PlayCircle size={16} />
              </div>
            </div>
            <div className="metric-value-row">
              <span className="metric-main-num">{vDone}</span>
              <span className="metric-sub-num">solved</span>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-bar bar-emerald"
                style={{ width: `${vDone === 0 ? 0 : Math.max(8, tierProgress)}%` }}
              />
            </div>
            <span className="metric-footer-text">{rankTitle}</span>
          </div>

          {/* Metric 2: Playlists Done */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">// TOPICS_MASTERED</span>
              <div className="metric-icon-box">
                <Trophy size={16} />
              </div>
            </div>
            <div className="metric-value-row">
              <span className="metric-main-num">{finished}</span>
              <span className="metric-sub-num">/ {playlists.length} playlists</span>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-bar bar-amber"
                style={{ width: `${(finished / playlists.length) * 100}%` }}
              />
            </div>
            <span className="metric-footer-text">
              {playlists.length - finished} playlist streams to unlock
            </span>
          </div>

          {/* Metric 3: Active Patterns Touched */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">// PATTERNS_ACTIVE</span>
              <div className="metric-icon-box">
                <Code2 size={16} />
              </div>
            </div>
            <div className="metric-value-row">
              <span className="metric-main-num">{activeTopics}</span>
              <span className="metric-sub-num">/ {playlists.length} topics</span>
            </div>
            <div className="metric-progress-track">
              <div
                className="metric-progress-bar bar-cyan"
                style={{ width: `${(activeTopics / playlists.length) * 100}%` }}
              />
            </div>
            <span className="metric-footer-text">
              {activeTopics === 0 ? "Focus on 1 pattern at a time" : "Breadth across DSA patterns"}
            </span>
          </div>

          {/* Metric 4: Continue CTA */}
          {nextIncomplete ? (
            <Link href={`/${nextIncomplete.p.slug}`} className="metric-card metric-card-cta">
              <div className="metric-header">
                <span className="cta-tag">
                  {vDone === 0 ? "// INITIALIZE" : "// ACTIVE_STREAM"}
                </span>
                <Flame size={16} color="var(--accent-amber)" />
              </div>
              <h3 className="cta-title">{nextIncomplete.p.name}</h3>
              <div className="cta-action">
                <span>Continue Stream</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ) : (
            <div className="metric-card metric-card-cta">
              <div className="metric-header">
                <span className="cta-tag">// ALL_CLEAR</span>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
              </div>
              <h3 className="cta-title">Curriculum Finished!</h3>
              <div className="cta-action">
                <span>Ready for Interviews</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Directory Section */}
      <section className="topics-section">
        <div className="pl-section-header">
          <div className="pl-section-meta">
            <h2 className="pl-section-title">Playlists Directory</h2>
            <span className="pl-section-tag">
              {filteredPlaylists.length} of {playlists.length} SHOWN
            </span>
          </div>
        </div>

        {/* Category Navigation Bar & Search */}
        <div className="category-nav">
          <div className="category-tabs">
            <button
              type="button"
              className={`category-tab ${selectedGroup === "All" ? "is-active" : ""}`}
              onClick={() => setSelectedGroup("All")}
            >
              <Layers size={13} />
              <span>All ({playlists.length})</span>
            </button>

            {groups.map((group) => {
              const count = playlists.filter((p) => p.group === group).length;
              return (
                <button
                  key={group}
                  type="button"
                  className={`category-tab ${selectedGroup === group ? "is-active" : ""}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <span>{group}</span>
                  <span className="cat-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="pl-search-container">
            <Search size={15} className="pl-search-icon" />
            <input
              type="search"
              className="pl-search-box"
              placeholder="Search playlist or topic..."
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
        </div>

        {/* 3-Column Playlist Grid */}
        <div className="playlist-grid">
          {filteredPlaylists.map(({ p, done, total }) => {
            const isComplete = done === total;
            const hasSheet = Boolean(videoDetailsMap[p.slug]);
            const pct = Math.round((done / total) * 100);
            const globalIndex = playlists.findIndex((x) => x.slug === p.slug) + 1;
            const paddedNum = globalIndex < 10 ? `0${globalIndex}` : `${globalIndex}`;

            return (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className={`pl-card ${isComplete ? "is-complete" : ""}`}
              >
                <div className="pl-card-header">
                  <span className="pl-card-num">[{paddedNum}/36]</span>
                  <span className="pl-card-group-pill">{p.group}</span>
                </div>

                <h3 className="pl-card-title">{p.name}</h3>

                <div className="pl-card-footer">
                  <div className="pl-card-progress-row">
                    <span className="pl-done-count">
                      {p.videos === "all"
                        ? isComplete
                          ? "COMPLETED"
                          : "WHOLE_PLAYLIST"
                        : `${done}/${total} SOLVED`}
                    </span>
                    <span>{pct}%</span>
                  </div>

                  <div className="pl-card-track">
                    <div className="pl-card-bar" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredPlaylists.length === 0 && (
          <div className="empty-search-state" style={{ padding: "48px 0", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
              No playlists found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              className="pl-action-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedGroup("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Backup and Data Persistence section */}
      <Backup />
    </div>
  );
}
