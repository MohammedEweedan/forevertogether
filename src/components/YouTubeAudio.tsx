"use client";

import { useMemo, useState } from "react";

type YouTubeAudioProps = {
  videoId: string;
  className?: string;
};

export default function YouTubeAudio({ videoId, className }: YouTubeAudioProps) {
  const [playing, setPlaying] = useState(false);

  const src = useMemo(() => {
    const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const params = new URLSearchParams({
      autoplay: "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });

    return `${base}?${params.toString()}`;
  }, [videoId]);

  return (
    <div className={className ? className : ""}>
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className={
          "w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-soft " +
          (playing ? "glass" : "accent-bg text-white")
        }
      >
        {playing ? "Pause" : "Play me before going further"}
      </button>

      {playing ? (
        <div className="sr-only" aria-hidden>
          <iframe
            src={src}
            title="YouTube audio"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : null}
    </div>
  );
}
