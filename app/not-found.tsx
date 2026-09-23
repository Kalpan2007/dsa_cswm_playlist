import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty">
      <h1>No playlist at this address</h1>
      <p>Check the link, or pick a playlist from the full list.</p>
      <Link className="btn" href="/">See all playlists</Link>
    </div>
  );
}
