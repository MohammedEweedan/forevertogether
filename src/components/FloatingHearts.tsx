"use client";

import { useMemo } from "react";

type FloatingHeartsProps = {
  count?: number;
  className?: string;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function FloatingHearts({ count = 18, className }: FloatingHeartsProps) {
  const hearts = useMemo(() => {
    const rand = mulberry32(1337 + count);
    return Array.from({ length: count }).map((_, i) => {
      const left = `${rand() * 100}%`;
      const size = 14 + Math.round(rand() * 18);
      const delay = Math.round(rand() * 12000);
      const duration = 9000 + Math.round(rand() * 11000);
      const drift = -30 + Math.round(rand() * 60);
      const opacity = 0.35 + rand() * 0.45;
      const blur = rand() < 0.15 ? 1 : 0;

      return {
        id: i,
        left,
        size,
        delay,
        duration,
        drift,
        opacity,
        blur,
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none fixed inset-0 overflow-hidden z-10 " +
        (className ? className : "")
      }
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-40px] animate-float-heart"
          style={
            {
              left: h.left,
              fontSize: `${h.size}px`,
              animationDelay: `${h.delay}ms`,
              animationDuration: `${h.duration}ms`,
              opacity: h.opacity,
              filter: h.blur ? `blur(${h.blur}px)` : undefined,
              "--drift": `${h.drift}px`,
            } as React.CSSProperties
          }
        >
          ❤
        </span>
      ))}
    </div>
  );
}
