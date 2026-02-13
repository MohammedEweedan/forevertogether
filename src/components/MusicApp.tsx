"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Moon,
  Sun,
  Send,
  Music,
  ListMusic,
  Mail,
  Check,
  Loader2,
  Plus,
  LinkIcon,
  Sparkles,
  MessageCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Undo2,
} from "lucide-react";

/* ─── Types ─── */
interface Song {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  message: string;
  cover: string;
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  destroy(): void;
  getPlayerState(): number;
}

interface YTEvent {
  target: YTPlayer;
  data: number;
}

type Tab = "player" | "playlist" | "message" | "account";
type Theme = "light" | "dark";

/* ─── Constants ─── */
const KISS_EMOJIS = ["💋", "😘", "💕", "💗", "💖", "😽", "💏"];
const KISS_PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  left: `${(7 + i * 1.63) % 100}%`,
  top: `${(13 + i * 1.47) % 100}%`,
  animationDelay: `${(i * 0.037) % 2}s`,
  animationDuration: `${1.5 + (i * 0.043) % 2}s`,
  fontSize: `${18 + (i * 0.49) % 28}px`,
  emoji: KISS_EMOJIS[i % KISS_EMOJIS.length],
}));

const PHOTOS = [
  "/1.jpg", "/2.jpg", "/3.jpg", "/5.jpg", "/6.jpg", "/7.jpg",
  "/8.JPG", "/9.PNG", "/10.PNG", "/11.PNG", "/12.PNG", "/13.jpg",
  "/14.PNG", "/15.PNG", "/16.PNG", "/17.PNG", "/18.PNG", "/19.jpg",
  "/20.PNG", "/21.PNG", "/22.PNG", "/23.PNG", "/24.PNG", "/25.PNG",
  "/26.PNG", "/27.PNG", "/28.PNG", "/29.PNG", "/30.PNG",
];

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

const DEFAULT_SONGS: Song[] = [
  { id: "1", youtubeId: "WxYgXmZ9xh8", title: "After Hours", artist: "The Weeknd", message: "", cover: "https://img.youtube.com/vi/WxYgXmZ9xh8/hqdefault.jpg" },
  { id: "2", youtubeId: "Iy-dJwHVX84", title: "Money Trees", artist: "Kendrick Lamar", message: "", cover: "https://img.youtube.com/vi/Iy-dJwHVX84/hqdefault.jpg" },
  { id: "3", youtubeId: "DPIOEheFoHs", title: "Energy (Stay Far Away)", artist: "Skepta & WizKid", message: "", cover: "https://img.youtube.com/vi/DPIOEheFoHs/hqdefault.jpg" },
  { id: "4", youtubeId: "JdqBmeg4XmY", title: "Turn The Lights Off", artist: "Kato feat. Jon", message: "", cover: "https://img.youtube.com/vi/JdqBmeg4XmY/hqdefault.jpg" },
  { id: "5", youtubeId: "_r-nPqWGG6c", title: "No Idea", artist: "Don Toliver", message: "", cover: "https://img.youtube.com/vi/_r-nPqWGG6c/hqdefault.jpg" },
  { id: "6", youtubeId: "s6IQIc98wIg", title: "Melting", artist: "Kali Uchis", message: "", cover: "https://img.youtube.com/vi/s6IQIc98wIg/hqdefault.jpg" },
  { id: "7", youtubeId: "S-cbOl96RFM", title: "At Last", artist: "Etta James", message: "", cover: "https://img.youtube.com/vi/S-cbOl96RFM/hqdefault.jpg" },
  { id: "8", youtubeId: "K3JGxj2rvAs", title: "I Follow Rivers", artist: "Lykke Li", message: "", cover: "https://img.youtube.com/vi/K3JGxj2rvAs/hqdefault.jpg" },
  { id: "9", youtubeId: "BS46C2z5lVE", title: "My Love", artist: "Route 94 ft. Jess Glynne", message: "", cover: "https://img.youtube.com/vi/BS46C2z5lVE/hqdefault.jpg" },
  { id: "10", youtubeId: "U8F5G5wR1mk", title: "tv off", artist: "Kendrick Lamar", message: "", cover: "https://img.youtube.com/vi/U8F5G5wR1mk/hqdefault.jpg" },
  { id: "11", youtubeId: "COz9lDCFHjw", title: "Passionfruit", artist: "Drake", message: "", cover: "https://img.youtube.com/vi/COz9lDCFHjw/hqdefault.jpg" },
  { id: "12", youtubeId: "kK0Vd3daL_o", title: "Mist", artist: "Protest the Hero", message: "", cover: "https://img.youtube.com/vi/kK0Vd3daL_o/hqdefault.jpg" },
  { id: "13", youtubeId: "f1r0XZLNlGQ", title: "One Of The Girls", artist: "The Weeknd, JENNIE & Lily Rose Depp", message: "", cover: "https://img.youtube.com/vi/f1r0XZLNlGQ/hqdefault.jpg" },
  { id: "14", youtubeId: "Gt2wnz7oTwo", title: "Innerbloom", artist: "RÜFÜS DU SOL", message: "", cover: "https://img.youtube.com/vi/Gt2wnz7oTwo/hqdefault.jpg" },
  { id: "15", youtubeId: "dGghkjpNCQ8", title: "Feel So Close", artist: "Calvin Harris", message: "", cover: "https://img.youtube.com/vi/dGghkjpNCQ8/hqdefault.jpg" },
].map((s, i) => ({ ...s, message: LOVE_MESSAGES[i % LOVE_MESSAGES.length] }));

/* ─── localStorage keys ─── */
const LS_USER_SONGS = "fm-user-songs";
const LS_HIDDEN_IDS = "fm-hidden-ids";

function loadUserSongs(): Song[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_USER_SONGS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUserSongs(songs: Song[]) {
  localStorage.setItem(LS_USER_SONGS, JSON.stringify(songs));
}

function loadHiddenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LS_HIDDEN_IDS);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveHiddenIds(ids: Set<string>) {
  localStorage.setItem(LS_HIDDEN_IDS, JSON.stringify([...ids]));
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function buildPlaylist(userSongs: Song[], hiddenIds: Set<string>): Song[] {
  const all = [...DEFAULT_SONGS, ...userSongs];
  return all.filter((s) => !hiddenIds.has(s.id));
}

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
  const [tab, setTab] = useState<Tab>("player");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [showMessage, setShowMessage] = useState(false);
  const [showLove, setShowLove] = useState(false);

  const [kissStatus, setKissStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [suggestUrl, setSuggestUrl] = useState("");
  const [suggestStatus, setSuggestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msgText, setMsgText] = useState("");
  const [msgSongUrl, setMsgSongUrl] = useState("");
  const [msgStatus, setMsgStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [photoIdx, setPhotoIdx] = useState(0);

  const [userSongs, setUserSongs] = useState<Song[]>(loadUserSongs);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(loadHiddenIds);
  const [addUrl, setAddUrl] = useState("");
  const [addStatus, setAddStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [addError, setAddError] = useState("");

  const playlist = buildPlaylist(userSongs, hiddenIds);

  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const apiReady = useRef(false);
  const pendingVideoId = useRef<string | null>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const safeIndex = playlist.length > 0 ? currentIndex % playlist.length : 0;
  const song = playlist.length > 0 ? playlist[safeIndex] : DEFAULT_SONGS[0];

  /* ─── Theme ─── */
  useEffect(() => { applyTheme(theme); }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      window.localStorage.setItem("music-theme", next);
      return next;
    });
  };

  /* ─── YouTube IFrame API (background audio) ─── */
  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;

    const createPlayer = () => {
      if (!playerContainerRef.current) return;
      const YT = win.YT as { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer };
      if (!YT?.Player) return;

      // NOTE: constructor return is a placeholder — real player comes from onReady target
      new YT.Player(playerContainerRef.current, {
        height: "1",
        width: "1",
        videoId: DEFAULT_SONGS[0].youtubeId,
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
            if (pendingVideoId.current) {
              playerRef.current.loadVideoById(pendingVideoId.current);
              playerRef.current.playVideo();
              pendingVideoId.current = null;
            }
          },
          onStateChange: (e: YTEvent) => {
            if (e.data === 0) {
              setCurrentIndex((prev) => {
                const pl = buildPlaylist(loadUserSongs(), loadHiddenIds());
                if (pl.length === 0) return 0;
                const next = (prev + 1) % pl.length;
                if (playerRef.current && apiReady.current) {
                  playerRef.current.loadVideoById(pl[next].youtubeId);
                  playerRef.current.playVideo();
                }
                return next;
              });
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
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    };
  }, []);

  /* ─── Sync play/pause with YT player ─── */
  useEffect(() => {
    if (!playerRef.current || !apiReady.current) return;
    try {
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    } catch { /* player not ready yet */ }
  }, [isPlaying]);

  /* ─── Load new song when index changes ─── */
  useEffect(() => {
    if (playlist.length === 0) return;
    const vid = playlist[safeIndex].youtubeId;
    if (playerRef.current && apiReady.current) {
      try {
        playerRef.current.loadVideoById(vid);
        if (isPlaying) playerRef.current.playVideo();
      } catch { /* player not ready */ }
    } else {
      pendingVideoId.current = vid;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex]);

  /* ─── Media Session API (lock screen controls) ─── */
  useEffect(() => {
    if (!("mediaSession" in navigator) || playlist.length === 0) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: "Forever Music",
      artwork: [{ src: song.cover, sizes: "480x360", type: "image/jpeg" }],
    });
    navigator.mediaSession.setActionHandler("play", () => { setIsPlaying(true); });
    navigator.mediaSession.setActionHandler("pause", () => { setIsPlaying(false); });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      setCurrentIndex((i) => { const len = playlist.length || 1; return (i - 1 + len) % len; });
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      setCurrentIndex((i) => { const len = playlist.length || 1; return (i + 1) % len; });
      setIsPlaying(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, playlist.length]);

  /* ─── Actions ─── */
  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const goNext = useCallback(() => {
    setCurrentIndex((i) => {
      const pl = buildPlaylist(loadUserSongs(), loadHiddenIds());
      return pl.length > 0 ? (i + 1) % pl.length : 0;
    });
    setIsPlaying(true);
    setShowMessage(false);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => {
      const pl = buildPlaylist(loadUserSongs(), loadHiddenIds());
      return pl.length > 0 ? (i - 1 + pl.length) % pl.length : 0;
    });
    setIsPlaying(true);
    setShowMessage(false);
  }, []);

  const togglePlay = () => setIsPlaying((p) => !p);

  const sendKiss = async () => {
    setKissStatus("sending");
    try {
      const res = await fetch("/api/send-kiss", { method: "POST" });
      setKissStatus(res.ok ? "sent" : "error");
    } catch { setKissStatus("error"); }
    setTimeout(() => setKissStatus("idle"), 4000);
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
      if (res.ok) { setSuggestStatus("sent"); setSuggestUrl(""); }
      else setSuggestStatus("error");
    } catch { setSuggestStatus("error"); }
    setTimeout(() => setSuggestStatus("idle"), 4000);
  };

  const addSongByUrl = async () => {
    const url = addUrl.trim();
    if (!url) return;
    const ytId = extractYouTubeId(url);
    if (!ytId) { setAddError("Invalid YouTube URL"); setAddStatus("error"); setTimeout(() => setAddStatus("idle"), 3000); return; }
    const allSongs = [...DEFAULT_SONGS, ...userSongs];
    if (allSongs.some((s) => s.youtubeId === ytId && !hiddenIds.has(s.id))) {
      setAddError("Song already in playlist"); setAddStatus("error"); setTimeout(() => setAddStatus("idle"), 3000); return;
    }
    setAddStatus("adding"); setAddError("");
    try {
      const res = await fetch(`/api/yt-info?id=${encodeURIComponent(ytId)}`);
      const data = await res.json();
      const newSong: Song = {
        id: `user-${Date.now()}`,
        youtubeId: ytId,
        title: data.title || "Unknown Song",
        artist: data.artist || "Unknown Artist",
        message: LOVE_MESSAGES[Math.floor(Date.now() / 1000) % LOVE_MESSAGES.length],
        cover: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      };
      const updated = [...userSongs, newSong];
      setUserSongs(updated);
      saveUserSongs(updated);
      setAddUrl("");
      setAddStatus("added");
      setTimeout(() => setAddStatus("idle"), 3000);
    } catch {
      setAddError("Failed to fetch song info");
      setAddStatus("error");
      setTimeout(() => setAddStatus("idle"), 3000);
    }
  };

  const hideSong = (songId: string) => {
    const updated = new Set(hiddenIds);
    updated.add(songId);
    setHiddenIds(updated);
    saveHiddenIds(updated);
    if (safeIndex >= buildPlaylist(userSongs, updated).length) {
      setCurrentIndex(0);
    }
  };

  const unhideSong = (songId: string) => {
    const updated = new Set(hiddenIds);
    updated.delete(songId);
    setHiddenIds(updated);
    saveHiddenIds(updated);
  };

  const removeSong = (songId: string) => {
    const updated = userSongs.filter((s) => s.id !== songId);
    setUserSongs(updated);
    saveUserSongs(updated);
    if (safeIndex >= buildPlaylist(updated, hiddenIds).length) {
      setCurrentIndex(0);
    }
  };

  const sendMessage = async () => {
    if (!msgText.trim() && !msgSongUrl.trim()) return;
    setMsgStatus("sending");
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText.trim(), songUrl: msgSongUrl.trim() }),
      });
      if (res.ok) { setMsgStatus("sent"); setMsgText(""); setMsgSongUrl(""); }
      else setMsgStatus("error");
    } catch { setMsgStatus("error"); }
    setTimeout(() => setMsgStatus("idle"), 4000);
  };

  return (
    <div className="music-app" data-theme={theme}>
      {/* Hidden YT audio player — persists across all views */}
      <div ref={playerContainerRef} className="yt-audio-hidden" />

      {/* ─── Top Bar ─── */}
      <header className="music-topbar">
        <div className="music-topbar-left">
          <div className="music-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className="music-logo-icon" />
            <span>Forever Music</span>
          </div>
        </div>
        <div className="music-topbar-right">
          <button className="music-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="music-main">

        {/* ═══ PLAYER TAB ═══ */}
        {tab === "player" && (
          <div className="music-player-view">
            {/* Cover art */}
            <div className="music-artwork-container">
              <div className={`music-artwork ${isPlaying ? "playing" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={song.cover} alt={song.title} className="music-cover-img" />
              </div>
            </div>

            {/* Song info */}
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

            {/* Progress-like track indicator */}
            <div className="music-progress-bar">
              <div className="music-progress-fill" style={{ width: `${playlist.length > 0 ? ((safeIndex + 1) / playlist.length) * 100 : 0}%` }} />
            </div>
            <div className="music-progress-labels">
              <span>{safeIndex + 1} of {playlist.length}</span>
              <span>Forever Together</span>
            </div>

            {/* Controls */}
            <div className="music-controls">
              <button className="music-ctrl-btn" onClick={goPrev} aria-label="Previous">
                <SkipBack size={28} fill="currentColor" />
              </button>
              <button className="music-play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              <button className="music-ctrl-btn" onClick={goNext} aria-label="Next">
                <SkipForward size={28} fill="currentColor" />
              </button>
            </div>

            {/* Love message */}
            <button className="music-message-toggle" onClick={() => setShowMessage((s) => !s)}>
              <Mail size={14} />
              {showMessage ? "Hide message" : "Message from Moe 💌"}
            </button>
            {showMessage && (
              <div className="music-message-card">
                <p className="music-message-text">{song.message}</p>
                <span className="music-message-sig">— Moe ❤️</span>
              </div>
            )}

            {/* Photo carousel — swipable, full image */}
            <div className="music-photo-section">
              <h3 className="music-photo-title">Our Memories 📸</h3>
              <div
                className="music-photo-carousel"
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchDeltaX.current = 0; }}
                onTouchMove={(e) => { touchDeltaX.current = e.touches[0].clientX - touchStartX.current; }}
                onTouchEnd={() => {
                  if (touchDeltaX.current > 50) setPhotoIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
                  else if (touchDeltaX.current < -50) setPhotoIdx((i) => (i + 1) % PHOTOS.length);
                  touchDeltaX.current = 0;
                }}
              >
                <button className="music-photo-arrow left" onClick={() => setPhotoIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)}>
                  <ChevronLeft size={18} />
                </button>
                <div className="music-photo-track">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={photoIdx}
                    src={PHOTOS[photoIdx]}
                    alt={`Memory ${photoIdx + 1}`}
                    className="music-photo-img"
                  />
                </div>
                <button className="music-photo-arrow right" onClick={() => setPhotoIdx((i) => (i + 1) % PHOTOS.length)}>
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="music-photo-counter">{photoIdx + 1} / {PHOTOS.length}</div>
              <div className="music-photo-dots">
                {PHOTOS.map((_, i) => (
                  <button
                    key={i}
                    className={`music-photo-dot ${i === photoIdx ? "active" : ""}`}
                    onClick={() => setPhotoIdx(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PLAYLIST TAB ═══ */}
        {tab === "playlist" && (
          <div className="music-playlist-view">
            <h2 className="music-section-title">Our Playlist 💕</h2>
            <p className="music-section-sub">{playlist.length} songs that tell our story</p>

            {/* Add a Song */}
            <div className="music-add-song-section">
              <div className="music-suggest-input-row">
                <div className="music-suggest-input-wrap">
                  <LinkIcon size={16} className="music-suggest-icon" />
                  <input
                    type="url"
                    className="music-suggest-input"
                    placeholder="Add a song — paste YouTube URL..."
                    value={addUrl}
                    onChange={(e) => setAddUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSongByUrl()}
                  />
                </div>
                <button
                  className={`music-suggest-btn ${addStatus === "added" ? "sent" : addStatus === "error" ? "error" : ""}`}
                  onClick={addSongByUrl}
                  disabled={addStatus === "adding" || addStatus === "added" || !addUrl.trim()}
                >
                  {addStatus === "idle" && <><Plus size={16} /> Add</>}
                  {addStatus === "adding" && <><Loader2 size={16} className="music-spin" /> ...</>}
                  {addStatus === "added" && <><Check size={16} /> Added!</>}
                  {addStatus === "error" && <><Plus size={16} /> Retry</>}
                </button>
              </div>
              {addError && <p className="music-add-error">{addError}</p>}
            </div>

            <div className="music-playlist-list">
              {playlist.map((s, i) => (
                <div
                  key={s.id}
                  className={`music-playlist-item ${i === safeIndex ? "active" : ""}`}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsPlaying(true);
                    setTab("player");
                    setShowMessage(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") { setCurrentIndex(i); setIsPlaying(true); setTab("player"); } }}
                >
                  <div className="music-playlist-cover-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.cover} alt={s.title} className="music-playlist-cover" />
                    {i === safeIndex && isPlaying && (
                      <div className="music-eq-bars overlay"><span /><span /><span /><span /></div>
                    )}
                  </div>
                  <div className="music-playlist-info">
                    <p className="music-playlist-title">{s.title}</p>
                    <p className="music-playlist-artist">
                      {s.artist}
                      {s.id.startsWith("user-") && <span className="music-user-badge">Added by you</span>}
                    </p>
                  </div>
                  <div className="music-playlist-actions">
                    <button
                      className={`music-like-btn-sm ${liked.has(s.id) ? "liked" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleLike(s.id); }}
                    >
                      <Heart size={16} fill={liked.has(s.id) ? "currentColor" : "none"} />
                    </button>
                    <button
                      className="music-hide-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (s.id.startsWith("user-")) removeSong(s.id);
                        else hideSong(s.id);
                      }}
                      title={s.id.startsWith("user-") ? "Remove song" : "Hide song"}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden songs (restore) */}
            {hiddenIds.size > 0 && (
              <div className="music-hidden-section">
                <h3 className="music-section-title">Hidden Songs</h3>
                <p className="music-section-sub">Tap to restore</p>
                <div className="music-hidden-list">
                  {DEFAULT_SONGS.filter((s) => hiddenIds.has(s.id)).map((s) => (
                    <button key={s.id} className="music-hidden-item" onClick={() => unhideSong(s.id)}>
                      <Undo2 size={14} />
                      <span>{s.title} — {s.artist}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggest a Song (email to Moe) */}
            <div className="music-suggest-section">
              <h3 className="music-section-title">Suggest to Moe ✨</h3>
              <p className="music-section-sub">Email Moe a YouTube link to add!</p>
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
                  {suggestStatus === "sending" && <><Loader2 size={16} className="music-spin" /> ...</>}
                  {suggestStatus === "sent" && <><Check size={16} /> Sent!</>}
                  {suggestStatus === "error" && <><Plus size={16} /> Retry</>}
                </button>
              </div>
            </div>

            {/* Messages from Moe */}
            <h3 className="music-section-title mt-8">Messages from Moe 💌</h3>
            <div className="music-messages-list">
              {playlist.map((s) => (
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

        {/* ═══ MESSAGE TAB ═══ */}
        {tab === "message" && (
          <div className="music-message-view">
            <h2 className="music-section-title">Write to Moe 💌</h2>
            <p className="music-section-sub">Send anything — a love note, a song request, or just say hi</p>

            <div className="music-msg-form">
              <label className="music-msg-label">Your message</label>
              <textarea
                className="music-msg-textarea"
                placeholder="Type anything you want to tell Moe..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                rows={5}
              />

              <label className="music-msg-label">Song request (optional)</label>
              <div className="music-suggest-input-wrap">
                <LinkIcon size={16} className="music-suggest-icon" />
                <input
                  type="url"
                  className="music-suggest-input"
                  placeholder="Paste a YouTube URL..."
                  value={msgSongUrl}
                  onChange={(e) => setMsgSongUrl(e.target.value)}
                />
              </div>

              <button
                className={`music-send-msg-btn ${msgStatus}`}
                onClick={sendMessage}
                disabled={msgStatus === "sending" || msgStatus === "sent" || (!msgText.trim() && !msgSongUrl.trim())}
              >
                {msgStatus === "idle" && <><Send size={18} /> Send to Moe</>}
                {msgStatus === "sending" && <><Loader2 size={18} className="music-spin" /> Sending...</>}
                {msgStatus === "sent" && <><Check size={18} /> Sent! 💕</>}
                {msgStatus === "error" && <><Send size={18} /> Failed — Retry</>}
              </button>
              <p className="music-kiss-info">Delivers to: moeawidan99@gmail.com</p>
            </div>
          </div>
        )}

        {/* ═══ ACCOUNT TAB ═══ */}
        {tab === "account" && (
          <div className="music-account-view">
            <div className="music-account-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/7.jpg" alt="Rayan" className="music-avatar-img" />
            </div>
            <h2 className="music-account-name">Rayan 💖</h2>
            <p className="music-account-email">rayan.gahwagi16@gmail.com</p>

            <div className="music-account-stats">
              <div className="music-stat">
                <span className="music-stat-num">{playlist.length}</span>
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
              <p className="music-account-section-desc">Tap to send a kiss email straight to Moe&apos;s inbox!</p>
              <button
                className={`music-kiss-btn ${kissStatus}`}
                onClick={sendKiss}
                disabled={kissStatus === "sending" || kissStatus === "sent"}
              >
                {kissStatus === "idle" && <><Send size={18} /> Send Kisses 💋</>}
                {kissStatus === "sending" && <><Loader2 size={18} className="music-spin" /> Sending...</>}
                {kissStatus === "sent" && <><Check size={18} /> Kiss Sent! 💕</>}
                {kissStatus === "error" && <><Send size={18} /> Failed — Try Again</>}
              </button>
            </div>

            <div className="music-account-section">
              <h3 className="music-account-section-title">Show Me Love 💖</h3>
              <p className="music-account-section-desc">Feeling down? Tap for a surprise from your bobo</p>
              <button
                className="music-love-btn"
                onClick={() => { setShowLove(true); setTimeout(() => setShowLove(false), 5000); }}
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
        <div className="kiss-fireworks-overlay" onClick={() => setShowLove(false)}>
          <div className="kiss-fireworks-message">
            <p>imagine they&apos;re from your bobo 💋</p>
          </div>
          {KISS_PARTICLES.map((p, i) => (
            <span key={i} className="kiss-particle" style={{ left: p.left, top: p.top, animationDelay: p.animationDelay, animationDuration: p.animationDuration, fontSize: p.fontSize }}>
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {/* ─── Now Playing Bar (always visible when playing) ─── */}
      {tab !== "player" && (
        <div className="music-now-playing" onClick={() => setTab("player")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={song.cover} alt="" className="music-np-cover" />
          <div className="music-np-info">
            <p className="music-np-title">{song.title}</p>
            <p className="music-np-artist">{song.artist}</p>
          </div>
          <button className="music-np-btn" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="music-np-btn" onClick={(e) => { e.stopPropagation(); goNext(); }}>
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
      )}

      {/* ─── Bottom Tab Bar (Apple Music style) ─── */}
      <nav className="music-tab-bar">
        <button className={`music-tab ${tab === "player" ? "active" : ""}`} onClick={() => setTab("player")}>
          <Music size={22} />
          <span>Now Playing</span>
        </button>
        <button className={`music-tab ${tab === "playlist" ? "active" : ""}`} onClick={() => setTab("playlist")}>
          <ListMusic size={22} />
          <span>Playlist</span>
        </button>
        <button className={`music-tab ${tab === "message" ? "active" : ""}`} onClick={() => setTab("message")}>
          <MessageCircle size={22} />
          <span>Message</span>
        </button>
        <button className={`music-tab ${tab === "account" ? "active" : ""}`} onClick={() => setTab("account")}>
          <ImageIcon size={22} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
