"use client";

import { scrollToTarget } from "@/lib/scroll";

/** In-page link that scrolls smoothly through Lenis. */
export default function ScrollLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget(to);
      }}
    >
      {children}
    </a>
  );
}
