import type { SortDir, SortField, ViewState } from "../hooks/use-view-state";
import type { ParsedRow } from "./rows";

export function filterRows(
  rows: ParsedRow[],
  view: Pick<
    ViewState,
    | "q"
    | "author"
    | "server"
    | "retired"
    | "horse_type"
    | "breed_ref"
    | "uses"
    | "helios"
    | "colors"
    | "tags"
  >,
): ParsedRow[] {
  const q = view.q.trim().toLowerCase();

  return rows.filter((row) => {
    if (
      q &&
      !row.name.toLowerCase().includes(q) &&
      !row.author.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (view.author && row.author !== view.author) return false;
    if (view.server && row.server !== view.server) return false;
    if (view.retired !== "any" && row.retired !== (view.retired === "yes")) {
      return false;
    }
    if (view.helios !== "any" && row.helios_ray !== (view.helios === "yes")) {
      return false;
    }
    if (view.horse_type !== null && row.horse_type !== view.horse_type) {
      return false;
    }
    if (view.breed_ref !== null && row.breed_ref !== view.breed_ref) {
      return false;
    }
    if (view.uses !== null && row.uses !== view.uses) {
      return false;
    }
    if (
      view.colors.length &&
      !view.colors.every((c) => row.colors.includes(c))
    ) {
      return false;
    }
    if (view.tags.length && !view.tags.every((t) => row.tags.includes(t))) {
      return false;
    }
    return true;
  });
}

// Rows missing `uploaded` always sort last
const compareBy =
  (sort: SortField, dir: SortDir) => (a: ParsedRow, b: ParsedRow) => {
    const mul = dir === "desc" ? -1 : 1;
    switch (sort) {
      case "name":
        return mul * a.name.localeCompare(b.name);
      case "author":
        return mul * a.author.localeCompare(b.author);
      case "id":
        return mul * (a.id - b.id);
      case "archived":
        return mul * (a.archived.getTime() - b.archived.getTime());
      case "uploaded": {
        if (!a.uploaded && !b.uploaded) return 0;
        if (!a.uploaded) return 1;
        if (!b.uploaded) return -1;
        return mul * (a.uploaded.getTime() - b.uploaded.getTime());
      }
    }
  };

export function sortRows(
  rows: ParsedRow[],
  sort: SortField | null,
  dir: SortDir,
): ParsedRow[] {
  if (!sort) return rows;
  return [...rows].sort(compareBy(sort, dir));
}
