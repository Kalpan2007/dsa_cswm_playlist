import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlaylist, playlists } from "@/lib/playlists";
import PlaylistView from "@/components/PlaylistView";

export function generateStaticParams() {
  return playlists.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlaylist(slug);
  return { title: p ? `${p.name} · DSA checklist` : "Not found" };
}

export default async function PlaylistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPlaylist(slug);
  if (!p) notFound();
  return <PlaylistView slug={p.slug} />;
}
