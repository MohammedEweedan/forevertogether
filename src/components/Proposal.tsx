"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Heart, Music, Pause, Play } from "lucide-react";
import "./Proposal.css";

/* ─── Types ─── */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
}
interface YTEvent {
  target: YTPlayer;
  data: number;
}
type Phase = "shown" | "leaving" | "gone";

/* ─── Content ─── */
const HER = "bobo";
const ME = "modi";
const SONG = { youtubeId: "0wPhbmeNSOs", title: "Lovesong", artist: "Adele" };
const BIG_DAY = "October 3rd, 2026";
/** 7:00 PM local time on the big day; the countdown after "yes" runs to it. */
const FOREVER_AT = new Date(2026, 9, 3, 19, 0, 0).getTime();

const REASONS = [
  "The way you make me laugh like nobody else ever could",
  "Your beauty that takes my breath away every single time",
  "How you turn ordinary moments into something magical",
  "The way you always know exactly what I need",
  "Your incredible mind and the way you see the world",
  "How being with you feels like coming home",
  "The quiet strength you show me every day",
  "The way your eyes light up when you truly smile",
];

const LETTER = [
  "My love,",
  "You are the most extraordinary person I have ever known. Not just because of how breathtakingly beautiful you are, though you are absolutely STUNNING, but because of who you are on the inside.",
  "Your kindness, your laugh, the way you care so deeply about the people and things you love... it all makes me love you more than words could ever capture.",
  "I want to be the person who makes you feel as loved as you make me feel. Every single day. For the rest of my life.",
  "You are my sunshine, my calm, my home. I love you more than you will ever fully know.",
];

const PROMISES = [
  "to choose you, every single day. On the easy days, and most of all on the hard ones.",
  "to be your safe place, the home you can always run back to.",
  "to hold your hand through every storm, and to dance with you in the sunshine after.",
  "to keep making you laugh until we are old and grey.",
  "to love you gently, loudly, and for the rest of my life.",
];

const PAUSE_LINES = [
  "I've imagined this moment a thousand times.",
  "In every version of my future, there is you.",
  "So, with my whole heart, I have one question left to ask…",
];

/* Each tap on "No" swaps its label, shrinks it, and grows "Yes". */
const NO_LINES = ["No", "Are you sure?", "Think again…", "Look at the flowers", "Pretty please?", "Last chance"];

/* ─── Flower cutouts (backgrounds removed) ─── */
const FLOWERS = {
  cornerTop: { src: "/flowers/corner-top.png", w: 543, h: 526 },
  cornerBottom: { src: "/flowers/corner-bottom.png", w: 691, h: 582 },
  lily: { src: "/flowers/gilded-lily.png", w: 839, h: 1368 },
  vine: { src: "/flowers/magnolia-vine.png", w: 500, h: 1400 },
  calla: { src: "/flowers/calla-lily.png", w: 484, h: 1168 },
  trio: { src: "/flowers/anthurium-trio.png", w: 564, h: 943 },
  rosebuds: { src: "/flowers/rosebuds.png", w: 513, h: 968 },
  arch: { src: "/flowers/arch-frame.png", w: 981, h: 1400 },
  bluebell: { src: "/flowers/bluebell.png", w: 390, h: 1008 },
  anthurium: { src: "/flowers/anthurium.png", w: 320, h: 1082 },
  /* Corner sprays: stems meet in the corner and are cut by the edge. */
  sprayTl: { src: "/flowers/spray-top-left.png", w: 511, h: 643 },
  sprayBr: { src: "/flowers/spray-bottom-right.png", w: 497, h: 817 },
} as const;

const PETAL_COLORS = ["var(--pp-blush-300)", "var(--pp-blush-200)", "var(--pp-olive-300)", "var(--pp-burgundy)"];

const makePetals = (count: number, seed: number) =>
  Array.from({ length: count }, (_, i) => ({
    left: `${(i * 37 + seed) % 100}%`,
    delay: `${((i * 1.7 + seed) % 9).toFixed(2)}s`,
    duration: `${(9 + ((i * 2.3) % 7)).toFixed(2)}s`,
    size: `${10 + ((i * 5) % 12)}px`,
    drift: `${(i % 2 ? 1 : -1) * (30 + ((i * 17) % 90))}px`,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
  }));

const HERO_PETALS = makePetals(12, 7);
const SHOWER_PETALS = makePetals(40, 3).map((p, i) => ({
  ...p,
  delay: `${((i * 0.23) % 5).toFixed(2)}s`,
  duration: `${(6 + ((i * 1.3) % 5)).toFixed(2)}s`,
}));

type Petal = (typeof HERO_PETALS)[number];

/* Every "you" on the page is set in bold burgundy. */
const YOU = /(\byou(?:['’](?:re|ll|ve|d))?\b)/gi;
function y(text: string): React.ReactNode {
  return text.split(YOU).map((part, i) =>
    i % 2 ? <span key={i} className="pp-you">{part}</span> : part
  );
}

/* A one-second clock for the countdown (null while server rendering). */
const subscribeClock = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

/* Shown once she says yes: a flip-clock countdown to the big day. */
function ForeverCountdown({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const now = useSyncExternalStore(subscribeClock, getSecond, getServerSecond);
  const left = now === null ? null : Math.max(0, Math.floor(FOREVER_AT / 1000) - now);

  const units = [
    { label: "Days", value: left === null ? null : Math.floor(left / 86400) },
    { label: "Hours", value: left === null ? null : Math.floor((left % 86400) / 3600) },
    { label: "Minutes", value: left === null ? null : Math.floor((left % 3600) / 60) },
    { label: "Seconds", value: left === null ? null : left % 60 },
  ];

  return (
    <div className={`pp-countdown${className ? ` ${className}` : ""}`} style={style}>
      <p className="pp-eyebrow pp-countdown-title">Counting every second until forever</p>
      {left === 0 ? (
        <p className="pp-countdown-done">Forever starts today.</p>
      ) : (
        <div className="pp-clock" role="timer" aria-label="Time until forever">
          {units.map((u, i) => (
            <div key={u.label} className="pp-clock-group">
              {i > 0 && <span className="pp-clock-colon" aria-hidden="true">:</span>}
              <div className="pp-clock-unit">
                <div className="pp-clock-box">
                  <span key={u.value ?? "-"} className="pp-clock-num">
                    {u.value === null ? "--" : String(u.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="pp-clock-label">{u.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="pp-countdown-yearn">{y("…because every second without you is a second too long.")}</p>
    </div>
  );
}

function Petals({ petals, className }: { petals: Petal[]; className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="pp-petal"
          style={
            {
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              "--pp-size": p.size,
              "--pp-drift": p.drift,
              "--pp-color": p.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Flower({
  name,
  className,
  sizes,
  priority,
  delay,
}: {
  name: keyof typeof FLOWERS;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Stagger for the bloom-in transition, in seconds. */
  delay?: number;
}) {
  const f = FLOWERS[name];
  return (
    <Image
      src={f.src}
      width={f.w}
      height={f.h}
      alt=""
      aria-hidden="true"
      className={className}
      sizes={sizes}
      priority={priority}
      style={delay ? ({ "--pp-delay": `${delay}s` } as React.CSSProperties) : undefined}
    />
  );
}

/* ─── Component ─── */
export default function Proposal() {
  const [intro, setIntro] = useState<Phase>("shown");
  const [finale, setFinale] = useState<Phase>("gone");
  const [answered, setAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noCount, setNoCount] = useState(0);

  const playerRef = useRef<YTPlayer | null>(null);
  const wantPlayRef = useRef(false);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  /* ─── YouTube IFrame API (hidden audio) ─── */
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
        videoId: SONG.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          playsinline: 1,
          loop: 1,
          playlist: SONG.youtubeId,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: YTEvent) => {
            playerRef.current = e.target;
            // She may have opened the letter before the player finished loading.
            if (wantPlayRef.current) e.target.playVideo();
          },
          onStateChange: (e: YTEvent) => {
            if (e.data === 1) setIsPlaying(true);
            else if (e.data === 2) setIsPlaying(false);
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

  const setPlaying = useCallback((play: boolean) => {
    wantPlayRef.current = play;
    setIsPlaying(play);
    try {
      if (play) playerRef.current?.playVideo();
      else playerRef.current?.pauseVideo();
    } catch { /* noop */ }
  }, []);

  /* ─── Reveal on scroll ─── */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".pp-reveal, .pp-bloom");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ─── Lock page scroll behind the intro and the finale ─── */
  const locked = intro !== "gone" || finale !== "gone";
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = locked ? "hidden" : "";
    return () => {
      root.style.overflow = "";
    };
  }, [locked]);

  /* ─── Opening the letter ─── */
  const openLetter = () => {
    if (intro !== "shown") return;
    setPlaying(true);
    setIntro("leaving");
    window.setTimeout(() => setIntro("gone"), 1200);
  };

  /* ─── The answer ─── */
  const sayYes = () => {
    setAnswered(true);
    setFinale("shown");
    setPlaying(true);
    fetch("/api/said-yes", { method: "POST" }).catch(() => { /* best effort */ });
  };

  const closeFinale = useCallback((toTop: boolean) => {
    setFinale("leaving");
    window.setTimeout(() => {
      setFinale("gone");
      if (toTop) window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  }, []);

  useEffect(() => {
    if (finale !== "shown") return;
    finaleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFinale(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finale, closeFinale]);

  const noGone = noCount >= NO_LINES.length;

  return (
    <div className={`pp-app${intro !== "shown" ? " is-open" : ""}`}>
      {/* Hidden YouTube audio */}
      <div ref={playerDivRef} className="pp-yt" aria-hidden="true" />

      {/* ══ Sealed letter intro ══ */}
      {intro !== "gone" && (
        <div className={`pp-intro${intro === "leaving" ? " is-leaving" : ""}`}>
          <Flower name="sprayTl" className="pp-intro-flower pp-spray pp-spray--tl" sizes="(max-width: 640px) 45vw, 340px" priority />
          <Flower name="sprayBr" className="pp-intro-flower pp-spray pp-spray--br" sizes="(max-width: 640px) 40vw, 300px" priority />

          <div className="pp-intro-inner">
            <p className="pp-intro-title">
              For <em>the love of my life</em>
            </p>
            <p className="pp-intro-sub">
              Find somewhere quiet, turn your sound on,
              <br />
              {y("and open it whenever you're ready.")}
            </p>
            <button type="button" className="pp-seal" onClick={openLetter} aria-label="Open the letter">
              <span className="pp-seal-mono">
                M<i>&amp;</i>R
              </span>
            </button>
            <p className="pp-intro-hint">Tap the seal</p>
          </div>
        </div>
      )}

      {/* ══ Hero ══ */}
      <section className="pp-hero">
        <Flower name="cornerTop" className="pp-hero-flower pp-hero-flower--tr" sizes="(max-width: 640px) 45vw, 380px" priority />
        <Flower name="cornerBottom" className="pp-hero-flower pp-hero-flower--bl" sizes="(max-width: 640px) 50vw, 440px" priority />
        <Flower name="sprayTl" className="pp-hero-flower pp-spray pp-spray--tl" sizes="(max-width: 640px) 45vw, 340px" priority />
        <Flower name="sprayBr" className="pp-hero-flower pp-spray pp-spray--br" sizes="(max-width: 640px) 40vw, 300px" priority />
        <Petals petals={HERO_PETALS} className="pp-petals" />

        <div className="pp-hero-glow" aria-hidden="true" />

        <div className="pp-hero-inner">
          <p className="pp-monogram">
            M<span>&amp; </span> R
          </p>
          <p className="pp-eyebrow">To my wonderful bobo,</p>
          <h1 className="pp-hero-name">
            <span>Rayan Zahi</span>
            <span>Gahwagi</span>
          </h1>
          <p className="pp-hero-line">{y("I have something to ask you.")}</p>
          <div className="pp-heartline" aria-hidden="true">
            <Heart size={13} fill="currentColor" strokeWidth={0} />
          </div>
          <a href="#story" className="pp-scroll-cue">
            <span>Read slowly</span>
            <ChevronDown size={18} strokeWidth={1.5} />
          </a>
        </div>
      </section>

      {/* ══ Our story ══ */}
      <section id="story" className="pp-section pp-story">
        <Flower name="rosebuds" className="pp-bloom pp-story-buds" sizes="(max-width: 760px) 90px, 130px" delay={0.3} />
        <div className="pp-story-grid">
          <div className="pp-story-art">
            <Flower name="lily" className="pp-bloom pp-story-lily" sizes="(max-width: 760px) 60vw, 380px" />
          </div>
          <div className="pp-story-text pp-reveal">
            <p className="pp-eyebrow">Our story</p>
            <h2 className="pp-title">
              Where it all <em>began</em>
            </h2>
            <div className="pp-rule" aria-hidden="true" />
            <p>Hello habibti,</p>
            <p>
              {y("From the very first moment I saw you, something shifted inside me, like the universe quietly rearranging itself just to make room for ")}
              <em className="pp-you">you.</em>{" "}
              {y("I didn't know then how completely you would change everything.")}
            </p>
            <p>
              {y("You walked in and made the whole world make sense. And I've been falling for you more deeply every single day since.")}
            </p>
            <p className="pp-story-sig">— Your loving husband, best friend and partner 💕</p>
          </div>
        </div>
      </section>

      {/* ══ Reasons ══ */}
      <section className="pp-section pp-reasons">
        <Flower name="vine" className="pp-bloom pp-reasons-vine" sizes="(max-width: 760px) 130px, 260px" delay={0.2} />
        <Flower name="calla" className="pp-bloom pp-reasons-calla" sizes="(max-width: 760px) 80px, 200px" />
        <div className="pp-reasons-inner">
          <header className="pp-section-head pp-reveal">
            <p className="pp-eyebrow">{y("Why I chose you")}</p>
            <h2 className="pp-title">
              Let me count <em>the ways</em>
            </h2>
          </header>
          <ol className="pp-reasons-list">
            {REASONS.map((r, i) => (
              <li
                key={i}
                className="pp-reason pp-reveal"
                style={{ "--pp-delay": `${(i % 2) * 0.12}s` } as React.CSSProperties}
              >
                <span className="pp-reason-num">{String(i + 1).padStart(2, "0")}</span>
                <p>{y(r)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ Letter ══ */}
      <section className="pp-section pp-letter">
        <div className="pp-letter-wrap">
          <Flower name="trio" className="pp-bloom pp-letter-trio" sizes="(max-width: 640px) 110px, 190px" delay={0.4} />
          <Flower name="rosebuds" className="pp-bloom pp-letter-buds" sizes="(max-width: 640px) 100px, 170px" delay={0.4} />
          <article className="pp-letter-card pp-reveal">
          <p className="pp-eyebrow">{y("My letter to you")}</p>
          <div className="pp-letter-body">
            {LETTER.map((para, i) => (
              <p key={i} className="pp-reveal">{y(para)}</p>
            ))}
          </div>
          <p className="pp-sig pp-reveal">
            <span>Forever yours,</span>
            your (beloved) retard
          </p>
          </article>
        </div>
      </section>

      {/* ══ Promises ══ */}
      <section className="pp-section pp-promises">
        <Flower name="calla" className="pp-bloom pp-promises-calla" sizes="(max-width: 760px) 80px, 170px" />
        <Flower name="bluebell" className="pp-bloom pp-promises-bell" sizes="(max-width: 760px) 80px, 150px" delay={0.25} />
        <header className="pp-section-head pp-reveal">
          <p className="pp-eyebrow">Before I ask</p>
          <h2 className="pp-title">
            My promises <em>to <span className="pp-you">you</span></em>
          </h2>
        </header>
        <ol className="pp-promise-list">
          {PROMISES.map((p, i) => (
            <li key={i} className="pp-promise pp-reveal">
              <span className="pp-promise-mark">I promise</span>
              <p>{y(p)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ The pause before the question ══ */}
      <section className="pp-section pp-pause">
        {PAUSE_LINES.map((line, i) => (
          <p key={i} className="pp-pause-line pp-reveal">
            {y(line)}
          </p>
        ))}
      </section>

      {/* ══ The question ══ */}
      <section className="pp-section pp-question" id="question">
        <header className="pp-section-head pp-reveal">
          <p className="pp-eyebrow">{answered ? y("You said yes") : "And so, the question"}</p>
        </header>

        <div className="pp-question-stage pp-reveal pp-reveal--scale">
          <Flower name="bluebell" className="pp-bloom pp-side pp-side--left" sizes="(max-width: 760px) 80px, 180px" delay={0.5} />
          <Flower name="anthurium" className="pp-bloom pp-side pp-side--right" sizes="(max-width: 760px) 60px, 150px" delay={0.7} />

          <div className="pp-arch">
            <Flower name="arch" className="pp-arch-img" sizes="(max-width: 520px) 92vw, 460px" />

            <div className="pp-arch-content">
              {answered ? (
                <div className="pp-yes" role="status">
                  <span className="pp-yes-heart" aria-hidden="true">❤️</span>
                  <p className="pp-yes-title">Forever together</p>
                  <p className="pp-yes-line">starts today</p>
                  <div className="pp-rule" aria-hidden="true" />
                  <p className="pp-yes-date">{BIG_DAY}</p>
                  <p className="pp-yes-note">{y("Hope to see you there!")}</p>
                  <p className="pp-yes-sig">— {ME}</p>
                </div>
              ) : (
                <>
                  <p className="pp-ask-name">
                    <span>Rayan Zahi</span>
                    <span>Gahwagi,</span>
                  </p>
                  <h2 className="pp-ask">
                    will <span className="pp-you">you</span> <em>marry&nbsp;me?</em>
                  </h2>
                  <div className="pp-answers">
                    <button
                      type="button"
                      className="pp-btn pp-btn--yes"
                      onClick={sayYes}
                      style={{ transform: `scale(${1 + noCount * 0.05})` }}
                    >
                      Yes, forever
                    </button>
                    {!noGone && (
                      <button
                        type="button"
                        className="pp-btn pp-btn--no"
                        onClick={() => setNoCount((n) => n + 1)}
                        style={{ transform: `scale(${1 - noCount * 0.09})` }}
                      >
                        {y(NO_LINES[noCount])}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {answered && <ForeverCountdown className="pp-countdown--page" />}
      </section>

      {/* ══ Finale: the ring becomes a heart ══ */}
      {finale !== "gone" && (
        <div
          ref={finaleRef}
          className={`pp-finale${finale === "leaving" ? " is-leaving" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Forever together starts today"
          tabIndex={-1}
        >
          <Petals petals={SHOWER_PETALS} className="pp-shower" />
          <Flower name="cornerTop" className="pp-finale-flower pp-finale-flower--tr" sizes="(max-width: 640px) 45vw, 360px" />
          <Flower name="cornerBottom" className="pp-finale-flower pp-finale-flower--bl" sizes="(max-width: 640px) 50vw, 420px" />
          <Flower name="sprayTl" className="pp-finale-flower pp-spray pp-spray--tl" sizes="(max-width: 640px) 40vw, 300px" />
          <Flower name="sprayBr" className="pp-finale-flower pp-spray pp-spray--br" sizes="(max-width: 640px) 36vw, 260px" />

          <div className="pp-finale-inner">
            <div className="pp-emblem" aria-hidden="true">
              <span className="pp-emblem-glow" />
              <span className="pp-emblem-ring">💍</span>
              <span className="pp-emblem-heart">❤️</span>
            </div>
            <p className="pp-finale-said pp-seq" style={{ "--pp-seq": "5.2s" } as React.CSSProperties}>
              {y("You said yes!")} 🥰
            </p>
            <h2 className="pp-finale-title pp-seq" style={{ "--pp-seq": "6s" } as React.CSSProperties}>
              Forever together
              <em>starts today</em>
            </h2>
            <div className="pp-rule pp-finale-rule" aria-hidden="true" />
            <p className="pp-finale-date pp-seq" style={{ "--pp-seq": "7.4s" } as React.CSSProperties}>
              {BIG_DAY}
            </p>
            <p className="pp-finale-invite pp-seq" style={{ "--pp-seq": "8s" } as React.CSSProperties}>
              {y("Hope to see you there!")}
            </p>
            <ForeverCountdown className="pp-seq" style={{ "--pp-seq": "8.8s" } as React.CSSProperties} />
            <p className="pp-finale-sig pp-seq" style={{ "--pp-seq": "9.8s" } as React.CSSProperties}>
              All my love, forever — {ME}
            </p>
            <button
              type="button"
              className="pp-btn pp-btn--ghost pp-seq"
              style={{ "--pp-seq": "10.6s" } as React.CSSProperties}
              onClick={() => closeFinale(true)}
            >
              Read it all again
            </button>
          </div>
        </div>
      )}

      {/* ─── Music pill ─── */}
      <button
        type="button"
        className={`pp-music${isPlaying ? " is-playing" : ""}`}
        onClick={() => setPlaying(!isPlaying)}
        aria-label={isPlaying ? "Pause our song" : "Play our song"}
      >
        <span className="pp-music-icon">
          {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
        </span>
        <span className="pp-music-label">
          <Music size={12} /> {SONG.title}
        </span>
      </button>
    </div>
  );
}
