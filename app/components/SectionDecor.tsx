// A light background illustration layer for full-width sections: soft colour
// washes plus a faint dot grid. Variants shift the composition so consecutive
// sections never look identical. Drop inside a `relative overflow-hidden` section.
export function SectionDecor({ variant = "left" }: { variant?: "left" | "right" | "center" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {variant === "left" && (
        <>
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
        </>
      )}
      {variant === "right" && (
        <>
          <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -left-36 bottom-8 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl" />
        </>
      )}
      {variant === "center" && (
        <>
          <div className="absolute left-1/2 top-0 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-sky-100/40 blur-3xl" />
        </>
      )}

      {/* faint dot grid, fading out toward the bottom */}
      <svg className="absolute inset-0 h-full w-full text-blue-300/25 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden>
        <defs>
          <pattern id={`secDots-${variant}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#secDots-${variant})`} />
      </svg>
    </div>
  );
}
