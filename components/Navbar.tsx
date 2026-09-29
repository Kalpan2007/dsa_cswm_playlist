"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

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
              3kz-sheet
            </span>
            <span className="site-brand-sub">// codestorywithMIK Playlist</span>
          </div>
        </Link>

        <div className="site-nav-links">
          <div className="site-nav-telemetry">
            <span className="terminal-status-dot" />
            <span>3KZ_SHEET // SYNC ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
