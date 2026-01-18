"use client";

import Image from "next/image";
import { useState } from "react";

type UsPhotoProps = {
  className?: string;
  alt?: string;
};

export default function UsPhoto({ className, alt = "Us" }: UsPhotoProps) {
  const [src, setSrc] = useState("/us.jpg");

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={1600}
      height={1000}
      priority={false}
      onError={() => setSrc("/us.svg")}
    />
  );
}
