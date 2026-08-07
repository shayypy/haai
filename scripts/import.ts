import { ColorFlags, RowFlags, TagsFlags } from "~/utils/flags";
import type { TableRow } from "~/utils/types";

type StringBoolean = "TRUE" | "FALSE";

interface RawTableRow {
  name: string;
  author: string;
  server: string | null;
  colors: string | null;
  helios_ray: StringBoolean;
  id: number;
  image_url: string;
  retired: StringBoolean;
  uses: number | "" | null;
  retired_in: string | null;
  tags: string;
  horse_type: string;
  breed_ref: string | null;
  uploaded: string;
  created_time: string;
}

const file = (await Bun.file(Bun.argv[2]).json()) as { Lowadi: RawTableRow[] };
const reconstructed: TableRow[] = [];

const separate = (string: string, splitter = ",") =>
  string.split(splitter).map((sub) => sub.trim());

for (const row of file.Lowadi) {
  let flags = 0;
  if (row.helios_ray === "TRUE") {
    flags = flags | RowFlags.HeliosRay;
  }
  if (row.retired === "TRUE") {
    flags = flags | RowFlags.Retired;
  }
  let tags = 0n;
  if (row.tags) {
    const arr = separate(row.tags);
    for (const tag of arr) {
      const flag = TagsFlags[tag as keyof typeof TagsFlags];
      if (flag !== undefined) {
        tags = tags | flag;
      }
    }
  }
  let colors = 0;
  if (row.colors) {
    const arr = separate(row.colors);
    for (const tag of arr) {
      const flag = ColorFlags[tag as keyof typeof ColorFlags];
      if (flag !== undefined) {
        colors = colors | flag;
      }
    }
  }

  const newRow: TableRow = {
    id: row.id,
    name: row.name,
    author: row.author,
    server: row.server ? row.server : undefined,
    image_url: row.image_url,
    colors: colors === 0 ? undefined : colors,
    tags: tags === 0n ? undefined : tags.toString(),
    flags: flags === 0 ? undefined : flags,
    retired_in: row.retired_in ? row.retired_in : undefined,
    horse_type: row.horse_type,
    breed_ref: row.breed_ref ? row.breed_ref : undefined,
    uploaded: row.uploaded
      ? new Date(row.uploaded).toISOString().split("T")[0]
      : undefined,
    archived: new Date(`${row.created_time} UTC`).toISOString().split("T")[0],
  };
  reconstructed.push(newRow);
}

// preview for dev
// console.log(reconstructed.slice(0, 5));

Bun.file("./public/data.json").write(JSON.stringify(reconstructed));
