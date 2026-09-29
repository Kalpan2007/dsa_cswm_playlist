"use client";

import Link from "next/link";
import { Code2, ExternalLink, Terminal } from "lucide-react";
import { YoutubeIcon, GitHubIcon } from "./BrandIcons";

export default function Navbar() {
  return (
    <header className="site-nav">
      <div className="site-nav-container">
        <Link href="/" className="site-brand">
          <div className="site-logo-icon">
            <Terminal size={19} />
          </div>
          <div className="site-brand-text">
            <span className="site-brand-title">
              DSA.SYS
              <span className="brand-terminal-tag">v2.0</span>
            </span>
            <span className="site-brand-sub">// codestorywithMIK Curriculum</span>
          </div>
        </Link>

        <div className="site-nav-links">
          <div className="site-nav-telemetry">
            <span className="terminal-status-dot" />
            <span>LOCAL_SYNC // ACTIVE</span>
          </div>

          <a
            href="https://www.youtube.com/@codestorywithMIK"
            target="_blank"
            rel="noreferrer"
            className="site-nav-btn yt-link"
            title="codestorywithMIK YouTube Channel"
          >
            <YoutubeIcon size={16} />
            <span>codestorywithMIK</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>

          <a
            href="https://github.com/MAZHARMIK/Interview_DS_Algo"
            target="_blank"
            rel="noreferrer"
            className="site-nav-btn gh-link"
            title="Official Interview_DS_Algo GitHub Repo"
          >
            <GitHubIcon size={15} />
            <span>Official Repo</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
}
