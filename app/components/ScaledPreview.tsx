"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Avoid the SSR warning for useLayoutEffect.
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const BASE_WIDTH = 800; // every template renders at 800px wide

// Renders a full-size template scaled to perfectly fit its container width.
// The box height hugs the (scaled) content, so there's no empty space and no
// horizontal clipping. Pass maxHeight to crop very tall CVs with a soft fade.
export function ScaledPreview({
  children,
  maxHeight,
}: {
  children: ReactNode;
  maxHeight?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [fullHeight, setFullHeight] = useState(0);

  useIso(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const w = outer.clientWidth;
      const s = w / BASE_WIDTH;
      setScale(s);
      setFullHeight(inner.offsetHeight * s);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  const height = maxHeight
    ? Math.min(fullHeight || maxHeight, maxHeight)
    : fullHeight || undefined;
  const cropped = maxHeight ? fullHeight > maxHeight : false;

  return (
    <div
      ref={outerRef}
      className="relative w-full overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-zinc-200"
      style={{ height }}
    >
      <div
        ref={innerRef}
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: BASE_WIDTH, transform: `scale(${scale})` }}
      >
        {children}
      </div>
      {cropped && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      )}
    </div>
  );
}
