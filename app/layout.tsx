import type { Metadata } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700", "800"] });
const body = Atkinson_Hyperlegible({ subsets: ["latin"], variable: "--font-body", weight: ["400", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "3kz-sheet · codestorywithMIK DSA Playlist & Problem Tracker",
  description: "3kz-sheet is the premier curated DSA sheet for the complete codestorywithMIK playlist. Track interview algorithmic problem patterns across 36 structured playlists with direct LeetCode problem links, difficulty filters, and auto-saving personal notes. Created by Kalpan Kaneriya (kalpankaneriya3ks).",
  keywords: [
    "3kz-sheet",
    "3kz sheet",
    "3kz_sheet",
    "3k-sheet",
    "3k sheet",
    "codestorywithMIK",
    "codestorywithMIK playlist",
    "codestorywithMIK sheet",
    "codestorywithMIK DSA playlist",
    "codestorywithMIK DSA sheet",
    "DSA tracker",
    "LeetCode roadmap",
    "DSA playlist tracker",
    "Kalpan Kaneriya",
    "kalpankaneriya3ks",
    "interview preparation",
    "DSA sheet"
  ],
  authors: [{ name: "Kalpan Kaneriya", url: "https://kalpankaneriya.in" }],
  creator: "Kalpan Kaneriya",
  openGraph: {
    title: "3kz-sheet · codestorywithMIK DSA Playlist Tracker",
    description: "The complete 3kz-sheet curriculum tracking the codestorywithMIK DSA playlist with LeetCode links, video hubs, and notes.",
    url: "https://kalpankaneriya.in",
    siteName: "3kz-sheet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3kz-sheet · codestorywithMIK DSA Playlist Tracker",
    description: "Track the codestorywithMIK DSA playlist with 3kz-sheet: video hubs, LeetCode mappings, and personal notes.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="site-body">
        <Navbar />
        <main className="page">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
