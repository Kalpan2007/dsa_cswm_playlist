"use client";

import { Globe, Heart, Terminal, Sparkles } from "lucide-react";
import { YoutubeIcon, LinkedinIcon } from "./BrandIcons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-top">
          {/* Creator Attribution */}
          <div className="site-footer-creator">
            <div className="creator-badge">
              <Terminal size={14} />
              <span>// DESIGNED & MAINTAINED BY</span>
            </div>
            <h3 className="creator-name">Kalpan Kaneriya</h3>
            <p className="creator-bio">
              Engineered as a clean, distraction-free DSA workspace for students and software engineers targeting algorithmic interview mastery.
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
                href="https://www.linkedin.com/in/kalpan-kaneriya/"
                target="_blank"
                rel="noreferrer"
                className="creator-link-pill linkedin-link"
              >
                <LinkedinIcon size={14} />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>

          {/* Educator Tribute */}
          <div className="site-footer-tribute">
            <div className="tribute-badge">
              <YoutubeIcon size={14} className="tribute-yt-icon" />
              <span>// FULL CURRICULUM & LECTURE CREDIT</span>
            </div>
            <h4 className="tribute-name">codestorywithMIK (Mazhar Imam Khan)</h4>
            <p className="tribute-desc">
              All problem breakdowns, algorithmic intuition, step-by-step whiteboard explanations, and curated problem sequences are authored by <strong>Mazhar Imam Khan (codestorywithMIK)</strong>.
            </p>
            <a
              href="https://www.youtube.com/@codestorywithMIK"
              target="_blank"
              rel="noreferrer"
              className="creator-link-pill yt-tribute-link"
            >
              <YoutubeIcon size={14} />
              <span>Visit codestorywithMIK on YouTube</span>
            </a>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} DSA.SYS // Next.js · TypeScript · Pure CSS Precision.</p>
          <p className="footer-love">
            Crafted with <Heart size={12} className="heart-icon" /> for the engineering community
          </p>
        </div>
      </div>
    </footer>
  );
}
