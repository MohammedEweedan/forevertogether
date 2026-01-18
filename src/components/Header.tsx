"use client";

import LogoMark from "@/components/LogoMark";
import ScrollTo from "@/components/ScrollTo";
import ThemeToggle from "@/components/ThemeToggle";

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <div className={"premium-header" + (className ? ` ${className}` : "")}
    >
      <div className="premium-header-inner">
        <ScrollTo targetId="top" className="logo-pill glass shadow-soft">
          <LogoMark className="rounded-2xl" size={86} />
        </ScrollTo>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
