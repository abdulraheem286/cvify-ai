"use client";

// A themed month/year period picker that reads and writes the same free-text
// string the rest of the app already stores (e.g. "Jan 2020 – Present"). This
// keeps CVResult, all 18 templates and careerYears() untouched — it only changes
// how the user enters the value.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const NOW_YEAR = new Date().getFullYear();
// Most-recent first; a little into the future for "expected" graduation dates.
const YEARS = Array.from({ length: NOW_YEAR + 5 - 1965 + 1 }, (_, i) => String(NOW_YEAR + 5 - i));

type Side = { m: string; y: string; present?: boolean };

function parseSide(str: string): Side {
  if (!str) return { m: "", y: "" };
  if (/present|current|now|ongoing/i.test(str)) return { m: "", y: "", present: true };
  const yMatch = str.match(/(?:19|20)\d{2}/);
  const lower = str.toLowerCase();
  // includes() also catches full month names ("January" contains "jan").
  const mMatch = MONTHS.find((mm) => lower.includes(mm.toLowerCase()));
  return { m: mMatch || "", y: yMatch ? yMatch[0] : "" };
}

function parsePeriod(value: string): { s: Side; e: Side } {
  const parts = (value || "").split(/\s*(?:–|—|-|\bto\b)\s*/i);
  const s = parseSide(parts[0] || "");
  const e = parts.length > 1 ? parseSide(parts.slice(1).join(" ")) : { m: "", y: "" };
  return { s, e };
}

function fmtSide(side: Side): string {
  if (side.present) return "Present";
  if (!side.y) return side.m ? side.m : "";
  return side.m ? `${side.m} ${side.y}` : side.y;
}

function compose(s: Side, e: Side, single: boolean): string {
  const start = fmtSide(s);
  if (single) return start;
  const end = fmtSide(e);
  if (!start && !end) return "";
  if (!end) return start;
  if (!start) return end;
  return `${start} – ${end}`;
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function PeriodField({
  label,
  value,
  onChange,
  single = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  single?: boolean;
}) {
  const { s, e } = parsePeriod(value);

  const setStart = (patch: Partial<Side>) => onChange(compose({ ...s, ...patch }, e, single));
  const setEnd = (patch: Partial<Side>) => onChange(compose(s, { ...e, present: false, ...patch }, single));
  const togglePresent = (on: boolean) => onChange(compose(s, on ? { m: "", y: "", present: true } : { m: "", y: "" }, single));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {/* Start */}
        <div className="flex min-w-[12rem] flex-1 items-center gap-2">
          <Select value={s.m} onChange={(m) => setStart({ m })} options={MONTHS} placeholder="Month" className="flex-1" />
          <Select value={s.y} onChange={(y) => setStart({ y })} options={YEARS} placeholder="Year" className="flex-1" />
        </div>

        {!single && (
          <>
            <span className="shrink-0 text-sm text-zinc-400">–</span>
            {/* End */}
            <div className="flex min-w-[12rem] flex-1 items-center gap-2">
              <Select value={e.m} onChange={(m) => setEnd({ m })} options={MONTHS} placeholder="Month" disabled={!!e.present} className="flex-1" />
              <Select value={e.y} onChange={(y) => setEnd({ y })} options={YEARS} placeholder="Year" disabled={!!e.present} className="flex-1" />
            </div>
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={!!e.present}
                onChange={(ev) => togglePresent(ev.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              Present
            </label>
          </>
        )}
      </div>
    </div>
  );
}
