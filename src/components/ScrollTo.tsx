"use client";

import { ReactNode } from "react";

type ScrollToProps = {
  targetId: string;
  children: ReactNode;
  className?: string;
};

export default function ScrollTo({ targetId, children, className }: ScrollToProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const container = document.querySelector(".snap-y-container") as HTMLElement | null;
        const target = document.getElementById(targetId);
        if (!container || !target) return;

        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const top = container.scrollTop + (targetRect.top - containerRect.top) - 96;

        container.scrollTo({ top, behavior: "smooth" });
      }}
    >
      {children}
    </button>
  );
}
