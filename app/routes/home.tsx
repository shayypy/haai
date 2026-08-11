import { useEffect, useMemo, useReducer } from "react";
import { FaBed, FaSun } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import {
  breedNames,
  colorNames,
  horseTypeNames,
  tagNames,
} from "~/utils/flags";
import { processRow } from "~/utils/rows";
import { getServerName, regionToEmojiCode, twemojiUrl } from "~/utils/text";
import { FilterBar } from "../components/filter-bar";
import { RowModal } from "../components/row-modal";
import { useDataset } from "../hooks/use-dataset";
import { useViewState } from "../hooks/use-view-state";
import { filterRows, sortRows } from "../utils/filter-rows";

const defaultWidth = 128;

function Cell({
  title,
  children,
  width,
  className,
}: {
  title?: boolean;
  width?: number;
  className?: string;
} & React.PropsWithChildren) {
  const base = twMerge(
    "hover:border-slate-100/10 transition-colors",
    "px-2 py-0.5 border-2 border-transparent",
    title ? "font-medium bg-slate-700" : "bg-slate-800",
    className,
  );

  return (
    <div
      className="relative shrink-0 group"
      style={{ width: `${width ?? defaultWidth}px` }}
    >
      <div className={twMerge(base, "truncate max-h-8 overflow-hidden")}>
        {children}
      </div>
      <div
        className={twMerge(
          base,
          "invisible group-hover:visible absolute left-0 top-0 z-10 w-full whitespace-normal wrap-break-word shadow-lg",
        )}
      >
        {children}
      </div>
    </div>
  );
}

type Widths = Record<string, number>;

function DatasetStatus({
  dataset,
}: {
  dataset: ReturnType<typeof useDataset>;
}) {
  switch (dataset.status) {
    case "idle":
      return (
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={dataset.load}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-1.5 font-medium border border-slate-100/10 shrink-0"
          >
            Load Table
          </button>
          <p className="text-gray-200">
            This will load the dataset (a few MBs) into your browser. Then, you
            can save this site as a progressive web app (PWA) to view it
            offline.
          </p>
        </div>
      );
    case "loading":
      return <p className="text-gray-400">Loading dataset…</p>;
    case "error":
      return (
        <p className="text-red-400">
          {dataset.message}{" "}
          <button
            type="button"
            onClick={dataset.load}
            className="underline hover:no-underline"
          >
            Retry
          </button>
        </p>
      );
    default:
      return null;
  }
}

const columns = [
  "name",
  "server",
  "colors",
  "author",
  "uses",
  "horse_type",
  "breed_ref",
  "retired",
  "retired_in",
  "helios_ray",
  "tags",
  "uploaded",
  "archived",
];

const columnLabels = {
  name: "Name",
  server: "Server",
  colors: "Colors",
  author: "Author",
  uses: "Max. Uses",
  horse_type: "Horse Type",
  breed_ref: "Breed Ref",
  retired: "Retired Apple",
  retired_in: "Retired in",
  helios_ray: "Helios Ray",
  id: "ID",
  tags: "Tags",
  uploaded: "Uploaded",
  archived: "Archived",
};

export function Home() {
  const dataset = useDataset();
  const { view, update, hasAnyParam } = useViewState();
  const [widths, updateWidths] = useReducer(
    (
      state: Widths,
      update: {
        id: string;
        width: number | null;
      },
    ) => {
      return {
        ...state,
        [update.id]: update.width === null ? undefined : update.width,
      } as Widths;
    },
    {} as Widths,
  );

  // A permalink should load data immediately
  useEffect(() => {
    if (dataset.status === "idle" && hasAnyParam) {
      dataset.load();
    }
  }, [dataset.status, dataset.load, hasAnyParam]);

  const rawRows = dataset.status === "ready" ? dataset.rows : null;
  const parsedRows = useMemo(
    () => (rawRows ? rawRows.map(processRow) : []),
    [rawRows],
  );

  const filteredRows = useMemo(
    () => filterRows(parsedRows, view),
    [parsedRows, view],
  );
  const sortedRows = useMemo(
    () => sortRows(filteredRows, view.sort, view.dir),
    [filteredRows, view.sort, view.dir],
  );
  const total = sortedRows.length;
  const pageRows = useMemo(() => {
    const start = (view.page - 1) * view.limit;
    return sortedRows.slice(start, start + view.limit);
  }, [sortedRows, view.page, view.limit]);

  const openRow =
    view.row != null ? parsedRows.find((r) => r.id === view.row) : undefined;

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-6">
        <p className="font-semibold text-xl">
          LAAI{" "}
          <span className="text-gray-400 ms-2">
            Lowadi Alternate Apple Index
          </span>
        </p>
        <p className="text-gray-200 mt-1">blah blah blurb</p>
      </div>
      {dataset.status === "ready" ? (
        <div className="mt-4 max-w-fit mx-auto px-6">
          <FilterBar view={view} update={update} total={total} />
          {view.layout === "gallery" ? (
            <div className="mt-2 gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {pageRows.map((row) => (
                <button
                  key={`row-${row.id}`}
                  type="button"
                  className="rounded-lg bg-slate-800 border-2 border-slate-100/10 group hover:-translate-y-1.5 transition-transform"
                  onClick={() => update({ row: row.id }, { resetPage: false })}
                >
                  <div className="relative">
                    <img
                      src={row.thumbnail_url ?? row.image_url}
                      className="h-40 aspect-square object-contain p-1 m-auto"
                      alt=""
                    />
                    <div className="absolute bottom-0.5 inset-s-1.5 flex flex-col gap-y-1">
                      {row.helios_ray ? (
                        <div
                          className="h-4.5 w-6 bg-slate-700 rounded-xs flex"
                          title="Helios Ray"
                        >
                          <FaSun className="m-auto text-sm" />
                        </div>
                      ) : null}
                      {row.retired ? (
                        <div
                          className="h-4.5 w-6 bg-slate-700 rounded-xs flex border border-transparent"
                          title="Retired"
                        >
                          {row.uses ? (
                            <p className="text-xs font-medium">{row.uses}</p>
                          ) : (
                            <FaBed className="mx-auto -mt-px text-lg" />
                          )}
                        </div>
                      ) : null}
                      {row.server ? (
                        <img
                          className="h-6 -mt-1"
                          src={twemojiUrl(regionToEmojiCode(row.server))}
                          alt=""
                          title={getServerName(row.server)}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="pt-1 pb-2 bg-slate-900 rounded-b-lg w-full">
                    <div className="px-2">
                      <p className="font-medium text-center truncate group-hover:underline">
                        {row.name}
                        <span className="text-gray-300 text-sm font-normal">
                          {" "}
                          by {row.author}
                        </span>
                      </p>
                      <p className="text-sm truncate">
                        <span className="text-gray-400">
                          {horseTypeNames[row.horse_type]}
                        </span>
                        {row.breed_ref ? (
                          <span className="text-gray-300">
                            {" "}
                            / {breedNames[row.breed_ref]}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-2 rounded-lg bg-slate-900 border-2 border-slate-100/10 overflow-y-hidden overflow-x-auto flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {columns.map((col) => (
                  <Cell key={col} title width={widths[col]}>
                    {/* @ts-expect-error */}
                    {columnLabels[col] ?? col}
                  </Cell>
                ))}
              </div>
              {pageRows.map((row) => (
                <div key={`row-${row.id}`} className="flex gap-0.5">
                  {columns.map((col) => {
                    // @ts-expect-error
                    const value = row[col];
                    return (
                      <Cell
                        key={`${row.id}-${col}`}
                        width={widths[col]}
                        className={
                          Array.isArray(value) && value.length !== 0
                            ? "px-0.5"
                            : ""
                        }
                      >
                        {value instanceof Date ? (
                          value.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        ) : Array.isArray(value) ? (
                          value.length === 0 ? (
                            <span className="italic text-gray-400">-</span>
                          ) : (
                            <div className="flex gap-0.5 flex-wrap">
                              {value.map((sub) => (
                                <span
                                  key={sub}
                                  className="bg-slate-700 px-1 rounded"
                                >
                                  {col === "colors"
                                    ? // @ts-expect-error
                                      (colorNames[sub] ?? sub)
                                    : col === "tags"
                                      ? // @ts-expect-error
                                        (tagNames[sub] ?? sub)
                                      : sub}
                                </span>
                              ))}
                            </div>
                          )
                        ) : value === undefined ? (
                          <span className="italic text-gray-400">-</span>
                        ) : typeof value === "boolean" ? (
                          value ? (
                            <span className="text-green-200">Yes</span>
                          ) : (
                            <span className="text-gray-300">No</span>
                          )
                        ) : col === "horse_type" ? (
                          (horseTypeNames[String(value)] ?? String(value))
                        ) : col === "breed_ref" ? (
                          (breedNames[String(value)] ?? String(value))
                        ) : col === "server" ? (
                          <img
                            src={twemojiUrl(regionToEmojiCode(value))}
                            alt={String(value)}
                            className={twMerge("h-6")}
                          />
                        ) : col === "author" ? (
                          <button
                            type="button"
                            onClick={() =>
                              update({ q: row.author }, { replace: false })
                            }
                            className="text-left w-full truncate hover:underline underline-offset-2"
                          >
                            {value}
                          </button>
                        ) : col === "name" ? (
                          <button
                            type="button"
                            onClick={() =>
                              update({ row: row.id }, { replace: false })
                            }
                            className="text-left w-full truncate hover:underline underline-offset-2"
                          >
                            {value}
                          </button>
                        ) : (
                          String(value)
                        )}
                      </Cell>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 mt-4 border-t border-t-slate-100/20 pt-4">
          <DatasetStatus dataset={dataset} />
        </div>
      )}
      {view.row != null && dataset.status === "ready" ? (
        <RowModal
          row={openRow}
          onClose={() => update({ row: null }, { replace: false })}
          update={update}
        />
      ) : null}
    </div>
  );
}
