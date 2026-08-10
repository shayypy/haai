import { ColorFlags, parseFlags, RowFlags, TagsFlags } from "./flags";
import type { TableRow } from "./types";

export interface ParsedRow {
  id: number;
  name: string;
  author: string;
  server?: string;
  retired: boolean;
  helios_ray: boolean;
  colors: string[];
  image_url: string;
  uses?: number;
  retired_in?: string;
  tags: string[];
  horse_type: string;
  breed_ref?: string;
  /** texture upload date - yyyy-mm-dd */
  uploaded?: Date;
  /** row creation date - yyyy-mm-dd */
  archived: Date;
}

export const processRow = (row: TableRow): ParsedRow => {
  const colors = parseFlags(row.colors ?? 0, ColorFlags);
  const tags = parseFlags(BigInt(row.tags ?? 0), TagsFlags);
  return {
    id: row.id,
    name: row.name,
    author: row.author,
    server: row.server,
    image_url: row.image_url,
    retired: parseFlags(row.flags ?? 0, RowFlags).includes("Retired"),
    helios_ray: parseFlags(row.flags ?? 0, RowFlags).includes("HeliosRay"),
    colors,
    tags,
    uses: row.uses,
    retired_in: row.retired_in,
    horse_type: row.horse_type,
    breed_ref: row.breed_ref,
    uploaded: row.uploaded ? new Date(row.uploaded) : undefined,
    archived: new Date(row.archived),
  };
};
