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
