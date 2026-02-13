import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("id");

  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("oEmbed failed");
    const data = await res.json();

    const fullTitle: string = data.title || "Unknown";
    const author: string = data.author_name || "Unknown Artist";

    let title = fullTitle;
    let artist = author;

    const dashMatch = fullTitle.match(/^(.+?)\s*[-–—]\s*(.+)$/);
    if (dashMatch) {
      artist = dashMatch[1].trim();
      title = dashMatch[2].trim();
    }

    const parenMatch = title.match(/\s*\(.*?(official|video|audio|lyric|visuali|hd|hq|4k).*?\)\s*$/i);
    if (parenMatch) title = title.replace(parenMatch[0], "").trim();
    const bracketMatch = title.match(/\s*\[.*?(official|video|audio|lyric|visuali|hd|hq|4k).*?\]\s*$/i);
    if (bracketMatch) title = title.replace(bracketMatch[0], "").trim();

    return NextResponse.json({ title, artist, fullTitle });
  } catch {
    return NextResponse.json({ title: "Unknown Song", artist: "Unknown Artist", fullTitle: "" });
  }
}
