export interface TableRow {
  id: number;
  name: string;
  author: string;
  server?: string;
  colors?: number;
  image_url: string;
  flags?: number; // RowFlags
  uses?: number;
  retired_in?: string;
  tags?: string;
  horse_type: string;
  breed_ref?: string;
  /** texture upload date - yyyy-mm-dd */
  uploaded?: string;
  /** row creation date - yyyy-mm-dd */
  archived: string;
}

export interface StatsFile {
  usage: {
    colors: Record<string, number>;
    tags: Record<string, number>;
    servers: Record<string, number>;
  };
  newest_authors: { name: string; first_seen: string; apples: number }[];
  prolific_authors: { name: string; apples: number }[];
  months: { month: number; year: number; apples: number }[];
}
