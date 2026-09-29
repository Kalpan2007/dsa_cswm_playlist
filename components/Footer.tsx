"use client";

import { Globe, Heart, Terminal, ExternalLink } from "lucide-react";
import { YoutubeIcon, LinkedinIcon, GitHubIcon } from "./BrandIcons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-top">
          {/* Creator Attribution */}
          <div className="site-footer-creator">
            <div className="creator-badge">
              <Terminal size={14} />
              <span>// 3KZ-SHEET CREATOR &amp; DESIGNER</span>
            </div>
            <h3 className="creator-name">Kalpan Kaneriya</h3>
            <p className="creator-bio">
              Creator of <strong>3kz-sheet</strong> — an open-source, high-efficiency algorithmic problem-solving workspace designed for students and software engineers targeting tech interviews.
            </p>

            <div className="creator-links">
              <a
                href="https://kalpankaneriya.in"
                target="_blank"
                rel="noreferrer"
                className="creator-link-pill portfolio-link"
              >
                <Globe size={14} />
                <span>kalpankaneriya.in</span>
              </a>

              <a
                href="https://www.linkedin.com/in/kalpankaneriya3ks/"
                target="_blank"
                rel="noreferrer"
                className="creator-link-pill linkedin-link"
              >
                <LinkedinIcon size={14} />
                <span>kalpankaneriya3ks</span>
              </a>
            </div>
          </div>

          {/* Curriculum & Playlist Credit */}
          <div className="site-footer-tribute">
            <div className="tribute-badge">
              <YoutubeIcon size={14} className="tribute-yt-icon" />
              <span>// PLAYLIST CURRICULUM &amp; VIDEOS</span>
            </div>
            <h4 className="tribute-name">codestorywithMIK</h4>
            <p className="tribute-desc">
              All video explanations, intuition walkthroughs, whiteboard breakdowns, and playlist sequencing are created by <strong>codestorywithMIK</strong>. 3kz-sheet organizes this complete playlist curriculum into a structured, trackable LeetCode sheet.
            </p>

            <div className="creator-links">
              <a
                href="https://www.youtube.com/@codestorywithMIK"
                target="_blank"
                rel="noreferrer"
                className="creator-link-pill yt-tribute-link"
              >
                <YoutubeIcon size={14} />
                <span>codestorywithMIK YouTube</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>

              <a
                href="https://github.com/MAZHARMIK/Interview_DS_Algo"
                target="_blank"
                rel="noreferrer"
                className="creator-link-pill gh-link"
              >
                <GitHubIcon size={14} />
                <span>Official GitHub Repo</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} 3kz-sheet · Dedicated to the codestorywithMIK developer community.</p>
          <p className="footer-love">
            Crafted with <Heart size={12} className="heart-icon" /> by Kalpan Kaneriya
          </p>
        </div>
      </div>
    </footer>
  );
}
