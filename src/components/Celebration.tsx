"use client";

import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  type: "fall" | "explode";
  layer: 0 | 1 | 2;
  tx?: number;
  ty?: number;
}

const LOVE_EMOJIS = ["❤️", "💕", "💖", "💗", "💘", "💝", "💞", "💓", "🥰", "😍", "💋", "🌹", "💐", "✨", "🫶🏼"];

export default function Celebration() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; layer: 0 | 1 | 2 }[]>([]);

  const spawnFirework = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 50;
    const layer = (Math.floor(Math.random() * 3)) as 0 | 1 | 2;
    setFireworks((prev) => [...prev, { id, x, y, layer }]);

    const explosionParticles: Particle[] = [];
    const count = 20 + Math.floor(Math.random() * 15);
    for (let i = 0; i < count; i++) {
      const angleRad = (((360 / count) * i + Math.random() * 20) * Math.PI) / 180;
      const dist = 80 + Math.random() * 180;
      explosionParticles.push({
        id: id + i + 0.001,
        x,
        y,
        emoji: LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)],
        size: 16 + Math.random() * 24,
        duration: 1.2 + Math.random() * 1.5,
        delay: Math.random() * 0.3,
        drift: 0,
        type: "explode",
        layer,
        tx: Math.cos(angleRad) * dist,
        ty: Math.sin(angleRad) * dist,
      });
    }
    setParticles((prev) => [...prev, ...explosionParticles]);

    setTimeout(() => {
      setFireworks((prev) => prev.filter((f) => f.id !== id));
      setParticles((prev) => prev.filter((p) => !explosionParticles.find((ep) => ep.id === p.id)));
    }, 3000);
  }, []);

  useEffect(() => {
    const spawnFalling = () => {
      const layer = (Math.floor(Math.random() * 3)) as 0 | 1 | 2;
      const sizeMultiplier = layer === 0 ? 0.6 : layer === 1 ? 1 : 1.4;
      const speedMultiplier = layer === 0 ? 1.5 : layer === 1 ? 1 : 0.7;
      const p: Particle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: -5,
        emoji: LOVE_EMOJIS[Math.floor(Math.random() * LOVE_EMOJIS.length)],
        size: (18 + Math.random() * 28) * sizeMultiplier,
        duration: (3 + Math.random() * 4) * speedMultiplier,
        delay: 0,
        drift: -30 + Math.random() * 60,
        type: "fall",
        layer,
      };
      setParticles((prev) => {
        const cleaned = prev.length > 150 ? prev.slice(-100) : prev;
        return [...cleaned, p];
      });
    };

    const interval = setInterval(spawnFalling, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnFirework(), i * 400);
    }
    const interval = setInterval(spawnFirework, 1800);
    return () => clearInterval(interval);
  }, [spawnFirework]);

  const LAYER_CLASS = ["celebration-layer-slow", "celebration-layer-mid", "celebration-layer-fast"] as const;

  const layerParticles = [
    particles.filter((p) => p.layer === 0),
    particles.filter((p) => p.layer === 1),
    particles.filter((p) => p.layer === 2),
  ];

  const layerFireworks = [
    fireworks.filter((f) => f.layer === 0),
    fireworks.filter((f) => f.layer === 1),
    fireworks.filter((f) => f.layer === 2),
  ];

  return (
    <>
      {[0, 1, 2].map((layerIdx) => (
        <div key={layerIdx} className={LAYER_CLASS[layerIdx]}>
          {layerParticles[layerIdx].map((p) =>
            p.type === "fall" ? (
              <span
                key={p.id}
                className="falling-particle"
                style={{
                  left: `${p.x}%`,
                  fontSize: `${p.size}px`,
                  animationDuration: `${p.duration}s`,
                  opacity: layerIdx === 0 ? 0.4 : layerIdx === 1 ? 0.7 : 1,
                  "--drift": `${p.drift}px`,
                } as React.CSSProperties}
              >
                {p.emoji}
              </span>
            ) : (
              <span
                key={p.id}
                className="explode-particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  fontSize: `${p.size}px`,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  "--tx": `${p.tx}px`,
                  "--ty": `${p.ty}px`,
                } as React.CSSProperties}
              >
                {p.emoji}
              </span>
            )
          )}

          {layerFireworks[layerIdx].map((fw) => (
            <div
              key={fw.id}
              className="firework-flash"
              style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
            />
          ))}
        </div>
      ))}
    </>
  );
}
