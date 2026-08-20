import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  formatYearMonth,
  getMonthLabel,
  isYearMonthInRange,
  MIN_YEAR,
  parseYearMonth,
  stripDay,
  toYearMonth,
} from "~/utils/month";

function YearGrid({
  maxYear,
  onSelect,
}: {
  maxYear: number;
  onSelect: (year: number) => void;
}) {
  const years = Array.from(
    { length: maxYear - MIN_YEAR + 1 },
    (_, i) => MIN_YEAR + i,
  );

  return (
    <div className="grid grid-cols-4 gap-1 w-40">
      {years.map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => onSelect(year)}
          className="rounded px-1 py-1 text-xs hover:bg-slate-700"
        >
          {year}
        </button>
      ))}
    </div>
  );
}

function MonthGrid({
  year,
  selectedMonth,
  maxYear,
  maxMonth,
  onSelectMonth,
  onBack,
  onPrevYear,
  onNextYear,
}: {
  year: number;
  selectedMonth: number | undefined;
  maxYear: number;
  maxMonth: number;
  onSelectMonth: (month: number) => void;
  onBack: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
}) {
  return (
    <div className="w-40">
      <div className="flex items-center justify-between mb-1.5">
        <button
          type="button"
          disabled={year <= MIN_YEAR}
          onClick={onPrevYear}
          className="rounded px-1.5 py-0.5 text-gray-400 hover:bg-slate-700 hover:text-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium hover:underline underline-offset-2"
        >
          {year}
        </button>
        <button
          type="button"
          disabled={year >= maxYear}
          onClick={onNextYear}
          className="rounded px-1.5 py-0.5 text-gray-400 hover:bg-slate-700 hover:text-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {new Array(12).fill(undefined).map((_, i) => {
          const month = i + 1;
          const label = getMonthLabel(month);
          const disabled = !isYearMonthInRange(year, month, maxYear, maxMonth);
          const isSelected = selectedMonth === month;
          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMonth(month)}
              className={twMerge(
                "rounded px-1 py-1 text-xs hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent",
                isSelected && "bg-slate-100/20 font-medium",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MonthColumn({
  label,
  value,
  maxYear,
  maxMonth,
  onChange,
}: {
  label: string;
  value: string | null;
  maxYear: number;
  maxMonth: number;
  onChange: (value: string) => void;
}) {
  const parsed = parseYearMonth(value);
  const [drillYear, setDrillYear] = useState<number | null>(
    parsed?.year ?? null,
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-1.5">
        {label}
      </p>
      {drillYear === null ? (
        <YearGrid maxYear={maxYear} onSelect={setDrillYear} />
      ) : (
        <MonthGrid
          year={drillYear}
          selectedMonth={parsed?.year === drillYear ? parsed.month : undefined}
          maxYear={maxYear}
          maxMonth={maxMonth}
          onSelectMonth={(month) => onChange(toYearMonth(drillYear, month))}
          onBack={() => setDrillYear(null)}
          onPrevYear={() => setDrillYear(drillYear - 1)}
          onNextYear={() => setDrillYear(drillYear + 1)}
        />
      )}
    </div>
  );
}

export function MonthRangePicker({
  from,
  to,
  onChange,
}: {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelLeft, setPanelLeft] = useState<number | null>(null);

  const now = new Date();
  const maxYear = now.getFullYear();
  const maxMonth = now.getMonth() + 1;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Clamp the popup's horizontal position so it never overflows the
  // viewport, e.g. when the trigger sits near the left edge on mobile.
  useLayoutEffect(() => {
    if (!open) {
      setPanelLeft(null);
      return;
    }
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const margin = 8;
    const recalc = () => {
      const rootRect = root.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const maxLeft = Math.max(margin, window.innerWidth - panelWidth - margin);
      const viewportLeft = Math.min(
        Math.max(rootRect.right - panelWidth, margin),
        maxLeft,
      );
      setPanelLeft(viewportLeft - rootRect.left);
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [open]);

  const hasValue = from !== null || to !== null;
  const fromFormatted = formatYearMonth(from);
  const toFormatted = formatYearMonth(to);
  const label = hasValue
    ? fromFormatted === toFormatted
      ? fromFormatted
      : `${fromFormatted ?? "Start"} – ${toFormatted ?? "Now"}`
    : "Uploaded: Any";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={twMerge(
          "rounded-lg border border-slate-100/10 bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors",
          hasValue && "border-slate-100/30",
        )}
      >
        {label}
      </button>
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 z-20 mt-1 max-w-[calc(100vw-1rem)] rounded-lg border border-slate-100/10 bg-slate-800 shadow-lg p-3"
          style={
            panelLeft !== null ? { left: panelLeft, right: "auto" } : undefined
          }
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <MonthColumn
              label="From"
              value={stripDay(from)}
              maxYear={maxYear}
              maxMonth={maxMonth}
              onChange={(value) =>
                onChange(`${value}-01`, to === null ? `${value}-31` : to)
              }
            />
            <MonthColumn
              label="To"
              value={stripDay(to)}
              maxYear={maxYear}
              maxMonth={maxMonth}
              onChange={(value) =>
                onChange(from === null ? `${value}-01` : from, `${value}-31`)
              }
            />
          </div>
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange(null, null)}
              className="mt-2 text-sm text-gray-400 hover:text-gray-200 underline-offset-2 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
