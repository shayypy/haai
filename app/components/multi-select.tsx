import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

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

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={twMerge(
          "rounded-lg border border-slate-100/10 bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700 transition-colors",
          selected.length > 0 && "border-slate-100/30",
        )}
      >
        {label}
        {selected.length > 0 ? ` (${selected.length})` : ""}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-slate-100/10 bg-slate-800 shadow-lg p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full rounded bg-slate-900 border border-slate-100/10 px-2 py-1 text-sm mb-2 outline-none focus:border-slate-100/30"
          />
          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 px-1 py-1">No matches</p>
            )}
            {filtered.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-700 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
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
