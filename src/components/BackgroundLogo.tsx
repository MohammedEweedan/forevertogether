"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BackgroundLogoProps = {
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

export default function BackgroundLogo({ className }: BackgroundLogoProps) {
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState("/logo.png");

  const rand = useMemo(() => mulberry32(20260119), []);

  useEffect(() => {
    let timeout: number | undefined;
    let interval: number | undefined;

    const schedule = () => {
      const wait = 1600 + Math.round(rand() * 4200);
      timeout = window.setTimeout(() => {
        setVisible(true);
        const onFor = 700 + Math.round(rand() * 1600);
        interval = window.setTimeout(() => {
          setVisible(false);
          schedule();
        }, onFor);
      }, wait);
    };

    schedule();

    return () => {
      if (timeout) window.clearTimeout(timeout);
      if (interval) window.clearTimeout(interval);
    };
  }, [rand]);

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none fixed inset-0 z-[5] flex items-center justify-center transition-opacity duration-700 " +
        (visible ? "opacity-100" : "opacity-0") +
        (className ? ` ${className}` : "")
      }
    >
      <Image
        src={src}
        alt=""
        width={900}
        height={900}
        className="select-none opacity-[0.07] dark:opacity-[0.18]"
        onError={() => setSrc("/logo.svg")}
        priority={false}
      />
    </div>
  );
}
