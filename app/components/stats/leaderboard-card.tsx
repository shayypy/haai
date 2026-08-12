import { useState } from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { serializeViewState, type ViewState } from "~/hooks/use-view-state";

const CUTOFF = 10;

export function LeaderboardCard<
  T extends {
    name: string;
    apples: number;
    group?: string;
    rank?: React.ReactNode;
    query?: Partial<ViewState>;
  },
>({
  title,
  rows,
  renderExtra,
}: {
  title: string;
  rows: T[];
  renderExtra?: (row: T) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rows : rows.slice(0, CUTOFF);

  return (
    <div className="rounded-lg border border-slate-100/10 bg-slate-900 p-4">
      <p className="font-medium mb-2">{title}</p>
      <ol className="flex flex-col gap-0.5">
        {visible.map((row, i) => (
          <div key={row.name}>
            {row.group && visible[i - 1]?.group !== row.group ? (
              <p className="uppercase text-gray-400 text-sm font-medium ms-1.5">
                {row.group}
              </p>
            ) : null}
            <li className="flex items-center justify-between gap-2 rounded px-1 py-0.5 hover:bg-slate-800">
              <span className="flex min-w-0 items-center gap-2">
                {row.rank !== undefined ? (
                  visible[i - 1]?.rank !== row.rank ? (
                    <span className="w-6 shrink-0 text-center text-gray-400">
                      {row.rank}
                    </span>
                  ) : (
                    <div className="w-6" />
                  )
                ) : (
                  <span
                    className={twMerge(
                      "w-6 shrink-0 text-center",
                      i === 0
                        ? "text-yellow-300"
                        : i === 1
                          ? "text-gray-300"
                          : i === 2
                            ? "text-orange-200"
                            : "text-gray-400",
                    )}
                  >
                    {i + 1}
                  </span>
                )}
                <Link
                  to={`/?${serializeViewState(row.query ?? { author: row.name }).toString()}`}
                  className="truncate hover:underline"
                >
                  {row.name}
                </Link>
              </span>
              <span className="shrink-0 text-sm text-gray-400">
                {renderExtra
                  ? renderExtra(row)
                  : `${row.apples.toLocaleString()} apple${row.apples === 1 ? "" : "s"}`}
              </span>
            </li>
          </div>
        ))}
      </ol>
      {rows.length > CUTOFF && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm text-gray-400 hover:text-gray-200 underline-offset-2 hover:underline"
        >
          {expanded ? "Show less" : `Show all (${rows.length})`}
        </button>
      )}
    </div>
  );
}
