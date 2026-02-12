"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  User,
  Moon,
  Sun,
  Send,
  Music,
  ListMusic,
  ChevronLeft,
  Mail,
  Check,
  Loader2,
  Plus,
  LinkIcon,
  Sparkles,
} from "lucide-react";

/* ─── Song Data ─── */
interface Song {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  message: string;
  cover: string;
}

const KISS_EMOJIS = ["💋", "😘", "💕", "💗", "💖", "😽", "💏"];
const KISS_PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  left: `${(7 + i * 1.63) % 100}%`,
  top: `${(13 + i * 1.47) % 100}%`,
  animationDelay: `${(i * 0.037) % 2}s`,
  animationDuration: `${1.5 + (i * 0.043) % 2}s`,
  fontSize: `${18 + (i * 0.49) % 28}px`,
  emoji: KISS_EMOJIS[i % KISS_EMOJIS.length],
}));

const LOVE_MESSAGES: string[] = [
  "You are the most gorgeous person I have ever laid eyes on. Every time I see you, my heart stops. 💕",
  "I feel so privileged to be the one who gets to love you. You are my everything. 🥰",
  "You're not just beautiful on the outside — your soul shines brighter than any star. ✨",
  "I am the luckiest person alive because I get to call you mine. 💍",
  "Every moment with you feels like a dream I never want to wake up from. 💫",
  "Your smile could light up the entire universe. You are absolutely perfect. 🌹",
  "I don't know what I did to deserve you, but I thank God every single day. 💖",
  "You make me want to be the best version of myself. You inspire me just by existing. ❤️",
  "If I had to choose between breathing and loving you, I'd use my last breath to say I love you. 💋",
  "You are my sunrise and my sunset. My first thought and my last. Always. 🌅",
  "The way you laugh, the way you move, the way you exist — it's all magic to me. ✨",
  "I could write a million love letters and still not capture how much you mean to me. 💕",
  "Being with you is my favorite place in the world. You are home. ❤️",
  "You are the definition of perfection. I am so blessed to show you my love every day. ❤️",
  "Every love song ever written was about you — they just didn't know it yet. 💖",
  "Your beauty takes my breath away, but your heart is what made me stay forever. 💝",
  "I look at you and I see my whole future. You are everything I ever wanted and more. ❤️",
  "You deserve the world and I will spend my life trying to give it to you. 💕",
  "I am so proud to be yours. You make everything in life worth it. ❤️",
  "No distance, no time, nothing could ever change how deeply I love you. Forever and always. ❤️",
];

function getMessageForIndex(index: number): string {
  return LOVE_MESSAGES[index % LOVE_MESSAGES.length];
}

const PLAYLIST: Song[] = [
  {
    id: "1",
    youtubeId: "WxYgXmZ9xh8",
    title: "After Hours",
    artist: "The Weeknd",
    message: "",
    cover: "https://img.youtube.com/vi/WxYgXmZ9xh8/hqdefault.jpg",
  },
  {
    id: "2",
    youtubeId: "Iy-dJwHVX84",
    title: "Money Trees",
    artist: "Kendrick Lamar",
    message: "",
    cover: "https://img.youtube.com/vi/Iy-dJwHVX84/hqdefault.jpg",
  },
  {
    id: "3",
    youtubeId: "DPIOEheFoHs",
    title: "Energy (Stay Far Away)",
    artist: "Skepta & WizKid",
    message: "",
    cover: "https://img.youtube.com/vi/DPIOEheFoHs/hqdefault.jpg",
  },
  {
    id: "4",
    youtubeId: "JdqBmeg4XmY",
    title: "Turn The Lights Off",
    artist: "Kato feat. Jon",
    message: "",
    cover: "https://img.youtube.com/vi/JdqBmeg4XmY/hqdefault.jpg",
  },
  {
    id: "5",
    youtubeId: "_r-nPqWGG6c",
    title: "No Idea",
    artist: "Don Toliver",
    message: "",
    cover: "https://img.youtube.com/vi/_r-nPqWGG6c/hqdefault.jpg",
  },
  {
    id: "6",
    youtubeId: "s6IQIc98wIg",
    title: "Melting",
    artist: "Kali Uchis",
    message: "",
    cover: "https://img.youtube.com/vi/s6IQIc98wIg/hqdefault.jpg",
  },
  {
    id: "7",
    youtubeId: "S-cbOl96RFM",
    title: "At Last",
    artist: "Etta James",
    message: "",
    cover: "https://img.youtube.com/vi/S-cbOl96RFM/hqdefault.jpg",
  },
  {
    id: "8",
    youtubeId: "K3JGxj2rvAs",
    title: "I Follow Rivers",
    artist: "Lykke Li",
    message: "",
    cover: "https://img.youtube.com/vi/K3JGxj2rvAs/hqdefault.jpg",
  },
  {
    id: "9",
    youtubeId: "BS46C2z5lVE",
    title: "My Love",
    artist: "Route 94 ft. Jess Glynne",
    message: "",
    cover: "https://img.youtube.com/vi/BS46C2z5lVE/hqdefault.jpg",
  },
  {
    id: "10",
    youtubeId: "U8F5G5wR1mk",
    title: "tv off",
    artist: "Kendrick Lamar",
    message: "",
    cover: "https://img.youtube.com/vi/U8F5G5wR1mk/hqdefault.jpg",
  },
  {
    id: "11",
    youtubeId: "COz9lDCFHjw",
    title: "Passionfruit",
    artist: "Drake",
    message: "",
    cover: "https://img.youtube.com/vi/COz9lDCFHjw/hqdefault.jpg",
  },
  {
    id: "12",
    youtubeId: "kK0Vd3daL_o",
    title: "Mist",
    artist: "Protest the Hero",
    message: "",
    cover: "https://img.youtube.com/vi/kK0Vd3daL_o/hqdefault.jpg",
  },
  {
    id: "13",
    youtubeId: "f1r0XZLNlGQ",
    title: "One Of The Girls",
    artist: "The Weeknd, JENNIE & Lily Rose Depp",
    message: "",
    cover: "https://img.youtube.com/vi/f1r0XZLNlGQ/hqdefault.jpg",
  },
  {
    id: "14",
    youtubeId: "Gt2wnz7oTwo",
    title: "Innerbloom",
    artist: "RÜFÜS DU SOL",
    message: "",
    cover: "https://img.youtube.com/vi/Gt2wnz7oTwo/hqdefault.jpg",
  },
  {
    id: "15",
    youtubeId: "dGghkjpNCQ8",
    title: "Feel So Close",
    artist: "Calvin Harris",
    message: "",
    cover: "https://img.youtube.com/vi/dGghkjpNCQ8/hqdefault.jpg",
  },
].map((s, i) => ({ ...s, message: getMessageForIndex(i) }));

/* ─── Types ─── */
type View = "player" | "playlist" | "account";
type Theme = "light" | "dark";

/* ─── Theme helpers ─── */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("music-theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/* ─── Main Component ─── */
export default function MusicApp() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [view, setView] = useState<View>("player");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [kissStatus, setKissStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showMessage, setShowMessage] = useState(false);
  const [suggestUrl, setSuggestUrl] = useState("");
  const [suggestStatus, setSuggestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showLove, setShowLove] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const song = PLAYLIST[currentIndex];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      window.localStorage.setItem("music-theme", next);
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % PLAYLIST.length);
    setIsPlaying(true);
    setShowMessage(false);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
    setShowMessage(false);
  }, []);

  const togglePlay = () => setIsPlaying((p) => !p);

  const sendKiss = async () => {
    setKissStatus("sending");
    try {
      const res = await fetch("/api/send-kiss", { method: "POST" });
      if (res.ok) {
        setKissStatus("sent");
        setTimeout(() => setKissStatus("idle"), 4000);
      } else {
        setKissStatus("error");
        setTimeout(() => setKissStatus("idle"), 3000);
      }
    } catch {
      setKissStatus("error");
      setTimeout(() => setKissStatus("idle"), 3000);
    }
  };

  const suggestSong = async () => {
    if (!suggestUrl.trim()) return;
    setSuggestStatus("sending");
    try {
      const res = await fetch("/api/suggest-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: suggestUrl.trim() }),
      });
      if (res.ok) {
        setSuggestStatus("sent");
        setSuggestUrl("");
        setTimeout(() => setSuggestStatus("idle"), 4000);
      } else {
        setSuggestStatus("error");
        setTimeout(() => setSuggestStatus("idle"), 3000);
      }
    } catch {
      setSuggestStatus("error");
      setTimeout(() => setSuggestStatus("idle"), 3000);
    }
  };

  const youtubeUrl = `https://www.youtube-nocookie.com/embed/${song.youtubeId}?rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${song.youtubeId}`;

  return (
    <div className="music-app" data-theme={theme}>
      {/* ─── Top Bar ─── */}
      <header className="music-topbar">
        <div className="music-topbar-left">
          {view !== "player" && (
            <button className="music-icon-btn" onClick={() => setView("player")}>
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="music-logo">
            <Music size={20} />
            <span>Forever Music</span>
          </div>
        </div>
        <div className="music-topbar-right">
          <button className="music-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className={`music-icon-btn ${view === "playlist" ? "active" : ""}`}
            onClick={() => setView(view === "playlist" ? "player" : "playlist")}
            aria-label="Playlist"
          >
            <ListMusic size={18} />
          </button>
          <button
            className={`music-icon-btn ${view === "account" ? "active" : ""}`}
            onClick={() => setView(view === "account" ? "player" : "account")}
            aria-label="Account"
          >
            <User size={18} />
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="music-main">
        {/* ─── PLAYER VIEW ─── */}
        {view === "player" && (
          <div className="music-player-view">
            <div className="music-artwork-container">
              <div className="music-artwork">
                <iframe
                  ref={iframeRef}
                  key={song.youtubeId}
                  src={youtubeUrl}
                  title={song.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="music-video-iframe"
                />
              </div>
            </div>

            <div className="music-song-info">
              <div className="music-song-text">
                <h2 className="music-song-title">{song.title}</h2>
                <p className="music-song-artist">{song.artist}</p>
              </div>
              <button
                className={`music-like-btn ${liked.has(song.id) ? "liked" : ""}`}
                onClick={() => toggleLike(song.id)}
              >
                <Heart size={22} fill={liked.has(song.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="music-controls">
              <button className="music-ctrl-btn" onClick={prev} aria-label="Previous">
                <SkipBack size={22} fill="currentColor" />
              </button>
              <button className="music-ctrl-btn" onClick={next} aria-label="Next">
                <SkipForward size={22} fill="currentColor" />
              </button>
            </div>

            <button
              className="music-message-toggle"
              onClick={() => setShowMessage((s) => !s)}
            >
              <Mail size={14} />
              {showMessage ? "Hide message" : "Message from Moe 💌"}
            </button>
            {showMessage && (
              <div className="music-message-card">
                <p className="music-message-text">{song.message}</p>
                <span className="music-message-sig">— Moe ❤️</span>
              </div>
            )}

            <p className="music-track-counter">
              {currentIndex + 1} / {PLAYLIST.length}
            </p>
          </div>
        )}

        {/* ─── PLAYLIST VIEW ─── */}
        {view === "playlist" && (
          <div className="music-playlist-view">
            <h2 className="music-section-title">Our Playlist 💕</h2>
            <p className="music-section-sub">{PLAYLIST.length} songs that tell our story</p>
            <div className="music-playlist-list">
              {PLAYLIST.map((s, i) => (
                <button
                  key={s.id}
                  className={`music-playlist-item ${i === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsPlaying(true);
                    setView("player");
                    setShowMessage(false);
                  }}
                >
                  <div className="music-playlist-num">
                    {i === currentIndex && isPlaying ? (
                      <div className="music-eq-bars">
                        <span /><span /><span /><span />
                      </div>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <div className="music-playlist-info">
                    <p className="music-playlist-title">{s.title}</p>
                    <p className="music-playlist-artist">{s.artist}</p>
                  </div>
                  <button
                    className={`music-like-btn-sm ${liked.has(s.id) ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(s.id);
                    }}
                  >
                    <Heart size={16} fill={liked.has(s.id) ? "currentColor" : "none"} />
                  </button>
                </button>
              ))}
            </div>

            {/* Suggest a Song */}
            <div className="music-suggest-section">
              <h3 className="music-section-title">Suggest a Song ✨</h3>
              <p className="music-section-sub">Paste a YouTube link and Moe will add it!</p>
              <div className="music-suggest-input-row">
                <div className="music-suggest-input-wrap">
                  <LinkIcon size={16} className="music-suggest-icon" />
                  <input
                    type="url"
                    className="music-suggest-input"
                    placeholder="Paste YouTube URL here..."
                    value={suggestUrl}
                    onChange={(e) => setSuggestUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && suggestSong()}
                  />
                </div>
                <button
                  className={`music-suggest-btn ${suggestStatus}`}
                  onClick={suggestSong}
                  disabled={suggestStatus === "sending" || suggestStatus === "sent" || !suggestUrl.trim()}
                >
                  {suggestStatus === "idle" && <><Plus size={16} /> Send</>}
                  {suggestStatus === "sending" && <><Loader2 size={16} className="music-spin" /> Sending</>}
                  {suggestStatus === "sent" && <><Check size={16} /> Sent!</>}
                  {suggestStatus === "error" && <><Plus size={16} /> Retry</>}
                </button>
              </div>
            </div>

            {/* Messages Section */}
            <h3 className="music-section-title mt-8">Messages from Moe 💌</h3>
            <div className="music-messages-list">
              {PLAYLIST.map((s) => (
                <div key={s.id} className="music-msg-item">
                  <div className="music-msg-content">
                    <p className="music-msg-song">{s.title} — {s.artist}</p>
                    <p className="music-msg-text">{s.message}</p>
                    <span className="music-msg-sig">— Moe ❤️</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ACCOUNT VIEW ─── */}
        {view === "account" && (
          <div className="music-account-view">
            <div className="music-account-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/7.jpg" alt="Rayan" className="music-avatar-img" />
            </div>
            <h2 className="music-account-name">Rayan 💖</h2>
            <p className="music-account-email">rayan.gahwagi16@gmail.com</p>

            <div className="music-account-stats">
              <div className="music-stat">
                <span className="music-stat-num">{PLAYLIST.length}</span>
                <span className="music-stat-label">Songs</span>
              </div>
              <div className="music-stat">
                <span className="music-stat-num">{liked.size}</span>
                <span className="music-stat-label">Liked</span>
              </div>
              <div className="music-stat">
                <span className="music-stat-num">∞</span>
                <span className="music-stat-label">Love</span>
              </div>
            </div>

            <div className="music-account-section">
              <h3 className="music-account-section-title">Send Kisses to Moe 💋</h3>
              <p className="music-account-section-desc">
                Tap to send a kiss email straight to Moe&apos;s inbox!
              </p>
              <button
                className={`music-kiss-btn ${kissStatus}`}
                onClick={sendKiss}
                disabled={kissStatus === "sending" || kissStatus === "sent"}
              >
                {kissStatus === "idle" && (
                  <>
                    <Send size={18} />
                    Send Kisses 💋
                  </>
                )}
                {kissStatus === "sending" && (
                  <>
                    <Loader2 size={18} className="music-spin" />
                    Sending...
                  </>
                )}
                {kissStatus === "sent" && (
                  <>
                    <Check size={18} />
                    Kiss Sent! 💕
                  </>
                )}
                {kissStatus === "error" && (
                  <>
                    <Send size={18} />
                    Failed — Try Again
                  </>
                )}
              </button>
              <p className="music-kiss-info">
                Sends to: moeawidan99@gmail.com 💌
              </p>
            </div>

            <div className="music-account-section">
              <h3 className="music-account-section-title">Show Me Love 💖</h3>
              <p className="music-account-section-desc">
                Feeling down? Tap for a surprise from your bobo
              </p>
              <button
                className="music-love-btn"
                onClick={() => {
                  setShowLove(true);
                  setTimeout(() => setShowLove(false), 5000);
                }}
              >
                <Sparkles size={18} />
                Show Me Love
              </button>
            </div>

            <div className="music-account-section">
              <h3 className="music-account-section-title">Appearance</h3>
              <button className="music-theme-toggle-btn" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ─── Kiss Fireworks Overlay ─── */}
      {showLove && (
        <div className="kiss-fireworks-overlay">
          <div className="kiss-fireworks-message">
            <p>imagine they&apos;re from your bobo 💋</p>
          </div>
          {KISS_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="kiss-particle"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.animationDelay,
                animationDuration: p.animationDuration,
                fontSize: p.fontSize,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {/* ─── Bottom Mini Player (when not on player view) ─── */}
      {view !== "player" && (
        <div className="music-mini-player" onClick={() => setView("player")}>
          <div className="music-mini-info">
            <p className="music-mini-title">{song.title}</p>
            <p className="music-mini-artist">{song.artist}</p>
          </div>
          <button
            className="music-mini-play"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            className="music-mini-next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}
