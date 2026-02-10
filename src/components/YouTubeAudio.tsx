"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type YouTubeAudioProps = {
  videoId: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  startPlaying?: boolean;
};

type YTPlayer = {
  destroy?: () => void;
  mute?: () => void;
  unMute?: () => void;
  playVideo?: () => void;
  setVolume?: (volume: number) => void;
};

type YTNamespace = {
  Player?: new (
    elementId: string,
    options: {
      width: string;
      height: string;
      videoId: string;
      playerVars: Record<string, unknown>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function YouTubeAudio({
  videoId,
  className,
  autoPlay,
  loop,
  startPlaying,
}: YouTubeAudioProps) {
  const [playing, setPlaying] = useState(Boolean(startPlaying));
  const [enabled, setEnabled] = useState(false);
  const reactId = useId();
  const containerId = `yt-audio-${videoId}-${reactId.replaceAll(":", "")}`;
  const playerRef = useRef<YTPlayer | null>(null);
  const unmutedRef = useRef(false);

  const src = useMemo(() => {
    const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const params = new URLSearchParams({
      autoplay: autoPlay || startPlaying ? "1" : "0",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });

    if (loop) {
      params.set("loop", "1");
      params.set("playlist", videoId);
    }

    if (startPlaying) {
      params.set("mute", "1");
      params.set("enablejsapi", "1");
      params.set("origin", typeof window !== "undefined" ? window.location.origin : "");
    }

    return `${base}?${params.toString()}`;
  }, [videoId, autoPlay, loop, startPlaying]);

  useEffect(() => {
    if (!startPlaying) return;

    const ensureApi = () => {
      if (window.YT?.Player) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const existing = document.querySelector('script[data-youtube-iframe-api="true"]');
        if (existing) {
          const prev = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            prev?.();
            resolve();
          };
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        tag.dataset.youtubeIframeApi = "true";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          prev?.();
          resolve();
        };
      });
    };

    let cancelled = false;

    ensureApi().then(() => {
      if (cancelled) return;
      if (playerRef.current) return;

      const Player = window.YT?.Player;
      if (!Player) return;

      playerRef.current = new Player(containerId, {
        width: "0",
        height: "0",
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          playsinline: 1,
          loop: loop ? 1 : 0,
          playlist: loop ? videoId : undefined,
          mute: 1,
        },
        events: {
          onReady: (e) => {
            try {
              e.target.mute?.();
              e.target.playVideo?.();
              setEnabled(true);
            } catch {
              // ignore
            }
          },
        },
      });
    });

    const tryUnmute = () => {
      if (unmutedRef.current) return;
      const p = playerRef.current;
      if (!p) return;
      try {
        p.unMute?.();
        p.setVolume?.(70);
        p.playVideo?.();
        unmutedRef.current = true;
      } catch {
        // ignore
      }
    };

    const onUserGesture = () => tryUnmute();

    window.addEventListener("pointerdown", onUserGesture, { once: true });
    window.addEventListener("keydown", onUserGesture, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      try {
        playerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, [startPlaying, videoId, loop, containerId]);

  return (
    <div className={className ? className : ""}>
      {startPlaying ? (
        <>
          <div id={containerId} />
          <button
            type="button"
            onClick={() => {
              const p = playerRef.current;
              if (!p) return;
              try {
                p.unMute?.();
                p.setVolume?.(70);
                p.playVideo?.();
                unmutedRef.current = true;
              } catch {
                // ignore
              }
            }}
            className={
              "mt-6 w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-soft " +
              (enabled ? "accent-bg text-white" : "glass")
            }
          >
            Enable music
          </button>
        </>
      ) : (
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
      )}

      {!startPlaying && playing ? (
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
