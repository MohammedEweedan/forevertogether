"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Music, ChevronDown, Play, Pause, Sun, Moon } from "lucide-react";

/* ─── Types ─── */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  destroy(): void;
}
interface YTEvent {
  target: YTPlayer;
  data: number;
}
type Theme = "light" | "dark";

/* ─── Per-section playlist ─── */
const SECTION_SONGS = [
  {
    youtubeId: "5OIeIaAhQOg",
    title: "Idea 10",
    artist: "Gibran Alcocer",
  },
];

/* ─── Reasons I love you ─── */
const REASONS = [
  { emoji: "😂", text: "The way you make me laugh like nobody else ever could" },
  { emoji: "🌹", text: "Your beauty that takes my breath away every single time" },
  { emoji: "💫", text: "How you turn ordinary moments into something magical" },
  { emoji: "🤝", text: "The way you always know exactly what I need" },
  { emoji: "✨", text: "Your incredible mind and the way you see the world" },
  { emoji: "🏠", text: "How being with you feels like coming home" },
  { emoji: "💪", text: "The quiet strength you show me every day" },
  { emoji: "👁️", text: "The way your eyes light up when you truly smile" },
];

/* ─── Floating hearts config ─── */
const HEARTS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5.3 + 2) % 100}%`,
  delay: `${(i * 0.45) % 8}s`,
  duration: `${8 + (i * 0.38) % 8}s`,
  size: `${13 + (i * 2.6) % 18}px`,
  drift: `${(i % 2 === 0 ? 1 : -1) * (12 + (i * 6.1) % 40)}px`,
}));

/* ─── Component ─── */
export default function LoveLetter() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("love-theme") as Theme | null;
    const t: Theme = stored === "light" ? "light" : "dark";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(t);
    return t;
  });
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heartLit, setHeartLit] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const apiReady = useRef(false);
  const isPlayingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      localStorage.setItem("love-theme", next);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(next);
      return next;
    });
  };

  /* ─── YouTube IFrame API ─── */
  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;

    const createPlayer = () => {
      if (!playerDivRef.current) return;
      const YT = win.YT as {
        Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
      };
      if (!YT?.Player) return;

      new YT.Player(playerDivRef.current, {
        height: "1",
        width: "1",
        videoId: SECTION_SONGS[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: YTEvent) => {
            playerRef.current = e.target;
            apiReady.current = true;
          },
          onStateChange: (e: YTEvent) => {
            if (e.data === 0 && isPlayingRef.current) {
              const next = (currentSectionRef.current + 1) % SECTION_SONGS.length;
              try {
                playerRef.current?.loadVideoById(SECTION_SONGS[next].youtubeId);
                playerRef.current?.playVideo();
              } catch { /* noop */ }
            }
          },
        },
      });
    };

    if (win.YT && (win.YT as Record<string, unknown>).Player) {
      createPlayer();
    } else {
      const prev = win.onYouTubeIframeAPIReady as (() => void) | undefined;
      win.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      try { playerRef.current?.destroy(); } catch { /* noop */ }
    };
  }, []);

  /* ─── Sync isPlaying ref ─── */
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (!playerRef.current || !apiReady.current) return;
    try {
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    } catch { /* noop */ }
  }, [isPlaying]);

  /* ─── Sync currentSection ref ─── */
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  /* ─── IntersectionObserver: swap song on section enter ─── */
  useEffect(() => {
    const observers = sectionRefs.current.map((section, idx) => {
      if (!section) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentSection(idx);
            if (playerRef.current && apiReady.current && isPlayingRef.current) {
              try {
                playerRef.current.loadVideoById(SECTION_SONGS[idx].youtubeId);
                playerRef.current.playVideo();
              } catch { /* noop */ }
            }
          }
        },
        { threshold: 0.55 }
      );
      obs.observe(section);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  /* ─── Play / Pause ─── */
  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (!p && playerRef.current && apiReady.current) {
        try {
          playerRef.current.loadVideoById(
            SECTION_SONGS[currentSectionRef.current].youtubeId
          );
          playerRef.current.playVideo();
        } catch { /* noop */ }
      }
      return !p;
    });
  }, []);

  /* ─── Helpers ─── */
  const setRef = useCallback((el: HTMLElement | null, idx: number) => {
    sectionRefs.current[idx] = el;
  }, []);

  const scrollTop = () => {
    document.querySelector(".ll-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="ll-app" data-theme={theme}>
      {/* ─── Hidden YouTube audio ─── */}
      <div
        ref={playerDivRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* ─── Floating hearts background ─── */}
      <div className="ll-hearts-bg" aria-hidden="true">
        {HEARTS.map((h, i) => (
          <span
            key={i}
            className="ll-float-heart"
            style={{
              left: h.left,
              animationDelay: h.delay,
              animationDuration: h.duration,
              fontSize: h.size,
              ["--ll-drift" as string]: h.drift,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* ─── Top bar ─── */}
      <header className="ll-topbar">
        <div className="ll-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={20} height={20} />
          <span>Forever Together</span>
        </div>
        <button className="ll-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* ─── Music pill (floating bottom) ─── */}
      <div className="ll-music-pill">
        <button
          className="ll-music-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause size={13} fill="currentColor" />
          ) : (
            <Play size={13} fill="currentColor" />
          )}
        </button>
        <Music
          size={13}
          className={`ll-music-note${isPlaying ? " playing" : ""}`}
        />
      </div>

      {/* ─── Section indicator dots ─── */}
      <nav className="ll-dots-nav" aria-label="Sections">
        {SECTION_SONGS.map((_, i) => (
          <button
            key={i}
            className={`ll-dot${i === currentSection ? " active" : ""}`}
            onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
            aria-label={`Section ${i + 1}`}
          />
        ))}
      </nav>

      {/* ─── Snap-scroll container ─── */}
      <div className="ll-scroll">

        {/* ══ Section 0 · Hero ══ */}
        <section
          ref={(el) => setRef(el, 0)}
          className="ll-section ll-hero"
        >
          <div className="ll-hero-inner">
            <p className="ll-eyebrow">✉️ A letter just for you</p>
            <h1 className="ll-hero-title">
              To My<br />
              <span className="ll-gradient-text">Greatest Love</span>
            </h1>
            <p className="ll-hero-sub">
              Every word here is straight from my heart to yours, with all the love I have.
            </p>
            <button
              className={`ll-hero-heart${heartLit ? " lit" : ""}`}
              onClick={() => setHeartLit((v) => !v)}
              aria-label="Tap to send love"
            >
              {heartLit ? "💖" : "❤️"}
            </button>
            <div className="ll-scroll-hint">
              <ChevronDown size={18} />
              <span>Scroll to read</span>
            </div>
          </div>
        </section>

        {/* ══ Section 1 · Our Story ══ */}
        <section
          ref={(el) => setRef(el, 1)}
          className="ll-section ll-story"
        >
          <div className="ll-card ll-fade-up">
            <p className="ll-eyebrow">📖 Our Story</p>
            <h2 className="ll-section-title">Where it all began</h2>
            <div className="ll-letter-body">
              <p>My love,</p>
              <p>
                From the very first moment I saw you, something shifted inside me —
                like the universe quietly rearranging itself just to make room for you.
                I didn&apos;t know then how completely you would change everything.
              </p>
              <p>
                You walked in and made the whole world make sense.
                And I&apos;ve been falling for you more deeply every single day since.
              </p>
              <p className="ll-sig">— Moe 💕</p>
            </div>
          </div>
        </section>

        {/* ══ Section 2 · Reasons ══ */}
        <section
          ref={(el) => setRef(el, 2)}
          className="ll-section ll-reasons-sec"
        >
          <div className="ll-section-inner">
            <p className="ll-eyebrow">💌 Why I love you</p>
            <h2 className="ll-section-title">Let me count the ways</h2>
            <div className="ll-reasons-grid">
              {REASONS.map((r, i) => (
                <div
                  key={i}
                  className="ll-reason-card"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <span className="ll-reason-emoji">{r.emoji}</span>
                  <p className="ll-reason-text">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Section 4 · Love Letter ══ */}
        <section
          ref={(el) => setRef(el, 4)}
          className="ll-section ll-letter-sec"
        >
          <div className="ll-card ll-letter-card ll-fade-up">
            <div className="ll-envelope-icon" aria-hidden="true">💌</div>
            <p className="ll-eyebrow">My letter to you</p>
            <div className="ll-letter-body">
              <p>My love,</p>
              <p>
                You are the most extraordinary person I have ever known. Not just
                because of how breathtakingly beautiful you are, though you are
                absolutely STUNNING, but because of who you are on the inside.
              </p>
              <p>
                Your kindness, your laugh, the way you care so deeply about the
                people and things you love... it all makes me love you more than
                words could ever capture.
              </p>
              <p>
                I want to be the person who makes you feel as loved as you make me
                feel. Every single day. For the rest of my life.
              </p>
              <p>
                You are my sunshine, my calm, my home. I love you more than you
                will ever fully know.
              </p>
              <p className="ll-sig">
                Forever yours,<br />your (beloved) retard ❤️
              </p>
            </div>
          </div>
        </section>

        {/* ══ Section 5 · Forever ══ */}
        <section
          ref={(el) => setRef(el, 5)}
          className="ll-section ll-forever-sec"
        >
          <div className="ll-forever-inner">
            <div className="ll-forever-ring" aria-hidden="true">💍</div>
            <p className="ll-eyebrow">Always &amp; forever</p>
            <h2 className="ll-forever-title">
              <span className="ll-gradient-text">Forever Together</span>
            </h2>
            <p className="ll-forever-sub">
              No matter what, no matter where; I choose you. Every single day,
              forever and always.
            </p>
            <div className="ll-bounce-hearts" aria-hidden="true">
              {["💕", "💗", "💖", "💝", "💓"].map((h, i) => (
                <span
                  key={i}
                  className="ll-bounce-h"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {h}
                </span>
              ))}
            </div>
            <button className="ll-read-again-btn" onClick={scrollTop}>
              <Heart size={14} fill="currentColor" /> Read again? ❤️
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
