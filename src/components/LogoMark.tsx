"use client";

import Image from "next/image";
import { useState } from "react";

type LogoMarkProps = {
  className?: string;
  size?: number;
};

export default function LogoMark({ className, size = 52 }: LogoMarkProps) {
  const [src, setSrc] = useState("/logo.png");

  return (
    <Image
      src={src}
      alt="Forever Together"
      width={size}
      height={size}
      className={className}
      priority
      onError={() => setSrc("/logo.svg")}
    />
  );
}
