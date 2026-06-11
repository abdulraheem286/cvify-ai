export function Stepper({ current }: { current: 1 | 2 }) {
  return (
    <div className="mx-auto mb-8 flex max-w-md items-center">
      <StepDot n={1} label="Your details" active={current === 1} done={current > 1} />
      <div className={`mx-3 h-0.5 flex-1 rounded ${current > 1 ? "bg-blue-600" : "bg-zinc-200"}`} />
      <StepDot n={2} label="Template" active={current === 2} done={false} />
    </div>
  );
}

function StepDot({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          active || done ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-500"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span className={`text-sm font-medium ${active ? "text-zinc-900" : "text-zinc-500"}`}>
        {label}
      </span>
    </div>
  );
}
