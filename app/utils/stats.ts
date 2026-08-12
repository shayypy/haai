import type { StatsFile } from "./types";

export interface PieSlice {
  key: string;
  label: string;
  value: number;
  fill?: string;
}

export interface MonthBucket {
  label: string;
  apples: number;
}

export function sortedNewestAuthors(
  authors: StatsFile["newest_authors"],
): StatsFile["newest_authors"] {
  return [...authors].sort((a, b) => b.first_seen.localeCompare(a.first_seen));
}

export function sortedProlificAuthors(
  authors: StatsFile["prolific_authors"],
): StatsFile["prolific_authors"] {
  return [...authors].sort((a, b) => b.apples - a.apples);
}

export function sortedServers(
  servers: StatsFile["usage"]["servers"],
): StatsFile["usage"]["servers"] {
  return Object.fromEntries(
    Object.entries(servers).sort((a, b) => b[1] - a[1]),
  );
}
