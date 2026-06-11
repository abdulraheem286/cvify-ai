"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** distance (px) to slide up from */
  y?: number;
  /** delay before animating (s) */
  delay?: number;
  /** animate direct children one-by-one instead of the whole block */
  stagger?: boolean;
};

// Fades + slides content up when it scrolls into view.
// Wrap any block: <Reveal>...</Reveal> or <Reveal stagger className="grid ...">cards</Reveal>
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  stagger = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Respect users who prefer reduced motion — leave everything visible.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        ease: "power2.out",
        delay,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
