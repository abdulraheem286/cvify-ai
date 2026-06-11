import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** delay before animating (s) — applies to non-stagger blocks */
  delay?: number;
  /** animate direct children one-by-one instead of the whole block */
  stagger?: boolean;
  /** kept for API compatibility; CSS uses a fixed slide distance */
  y?: number;
};

// Pure-CSS entrance reveal (fade + slide up). No JavaScript, so it can never
// get stuck hidden — the animation always finishes at the visible state.
export function Reveal({ children, className, delay = 0, stagger = false }: RevealProps) {
  const cls = `${stagger ? "cvify-reveal" : "cvify-reveal-self"}${className ? ` ${className}` : ""}`;
  const style: CSSProperties | undefined =
    !stagger && delay ? { animationDelay: `${delay}s` } : undefined;

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
