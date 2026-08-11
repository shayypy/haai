import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { type MaxUses, maxUses } from "~/utils/flags";

export type TriState = "any" | "yes" | "no";
export type SortField = "name" | "author" | "id" | "uploaded" | "archived";
export type SortDir = "asc" | "desc";
export type ViewLayout = "table" | "gallery";

export const PAGE_SIZES = [10, 30, 50, 100, 200] as const;
export type limit = (typeof PAGE_SIZES)[number];

export interface ViewState {
  q: string;
  server: string | null;
  retired: TriState;
  helios: TriState;
  horse_type: string | null;
  breed_ref: string | null;
  colors: string[];
  uses: MaxUses | null;
  tags: string[];
  sort: SortField | null;
  dir: SortDir;
  page: number;
  limit: limit;
  row: number | null;
  layout: ViewLayout;
}

const defaultViewState: ViewState = {
  q: "",
  server: null,
  retired: "any",
  helios: "any",
  horse_type: null,
  breed_ref: null,
  colors: [],
  uses: null,
  tags: [],
  sort: null,
  dir: "asc",
  page: 1,
  limit: 50,
  row: null,
  layout: "table",
};

const TRI_STATES: TriState[] = ["any", "yes", "no"];
const SORT_FIELDS: SortField[] = [
  "name",
  "author",
  "id",
  "uploaded",
  "archived",
];

const parseTriState = (value: string | null): TriState =>
  TRI_STATES.includes(value as TriState) ? (value as TriState) : "any";

const parseSort = (value: string | null): SortField | null =>
  SORT_FIELDS.includes(value as SortField) ? (value as SortField) : null;

const parselimit = (value: string | null): limit => {
  const n = Number(value);
  return (PAGE_SIZES as readonly number[]).includes(n) ? (n as limit) : 50;
};

const parseList = (value: string | null): string[] =>
  value ? value.split(",").filter(Boolean) : [];

export function useViewState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const view = useMemo<ViewState>(() => {
    const page = Number(searchParams.get("page"));
    const row = Number(searchParams.get("row"));
    const uses = Number(searchParams.get("uses"));
    return {
      q: searchParams.get("q") ?? "",
      server: searchParams.get("server"),
      retired: parseTriState(searchParams.get("retired")),
      helios: parseTriState(searchParams.get("helios")),
      horse_type: searchParams.get("horse_type"),
      breed_ref: searchParams.get("breed_ref"),
      uses: maxUses.includes(uses as MaxUses) ? (uses as MaxUses) : null,
      colors: parseList(searchParams.get("colors")),
      tags: parseList(searchParams.get("tags")),
      sort: parseSort(searchParams.get("sort")),
      dir: searchParams.get("dir") === "desc" ? "desc" : "asc",
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: parselimit(searchParams.get("limit")),
      row: searchParams.has("row") && Number.isFinite(row) ? row : null,
      layout: searchParams.get("layout") === "gallery" ? "gallery" : "table",
    };
  }, [searchParams]);

  const paramsWithoutLayout = new URLSearchParams(searchParams);
  paramsWithoutLayout.delete("layout");
  const hasAnyParam = paramsWithoutLayout.size > 0;

  const update = useCallback(
    (
      partial: Partial<ViewState>,
      opts: { resetPage?: boolean; replace?: boolean; retain?: boolean } = {},
    ) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const merged =
            opts.retain === false
              ? { ...defaultViewState, ...partial }
              : { ...view, ...partial };
          if (opts.resetPage) merged.page = 1;

          const write = (key: string, value: string | null) => {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          };

          write("q", merged.q || null);
          write("server", merged.server);
          write("retired", merged.retired === "any" ? null : merged.retired);
          write("helios", merged.helios === "any" ? null : merged.helios);
          write(
            "horse_type",
            merged.horse_type === null ? null : String(merged.horse_type),
          );
          write(
            "breed_ref",
            merged.breed_ref === null ? null : String(merged.breed_ref),
          );
          write("uses", merged.uses === null ? null : String(merged.uses));
          write(
            "colors",
            merged.colors.length ? merged.colors.join(",") : null,
          );
          write("tags", merged.tags.length ? merged.tags.join(",") : null);
          write("sort", merged.sort);
          write("dir", merged.dir === "asc" ? null : merged.dir);
          write("page", merged.page > 1 ? String(merged.page) : null);
          write("limit", merged.limit !== 50 ? String(merged.limit) : null);
          write("row", merged.row !== null ? String(merged.row) : null);
          write("layout", merged.layout === "table" ? null : merged.layout);

          return next;
        },
        { replace: opts.replace ?? true },
      );
    },
    [setSearchParams, view],
  );

  return { view, update, hasAnyParam };
}
