import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";
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

const imagesPath = path.join(".", "public", "images");
await mkdir(imagesPath, { recursive: true });
let hasFFmpeg = false;
try {
  // i built this for mac/nix, will probably fail on windows
  const { exitCode } = await $`which ffmpeg`.quiet().nothrow();
  hasFFmpeg = exitCode === 0;
} catch {}
const extantImages = await readdir(imagesPath);

const separate = (string: string, splitter = ",") =>
  string.split(splitter).map((sub) => sub.trim());

const reconstructed: TableRow[] = [];
for (const row of file.Lowadi) {
  let flags = 0;
  if (row.helios_ray === "TRUE") flags |= RowFlags.HeliosRay;
  if (row.retired === "TRUE") flags |= RowFlags.Retired;

  let tags = 0n;
  if (row.tags) {
    const arr = separate(row.tags);
    for (const tag of arr) {
      const flag = TagsFlags[tag as keyof typeof TagsFlags];
      if (flag !== undefined) tags |= flag;
    }
  }
  let colors = 0;
  if (row.colors) {
    const arr = separate(row.colors);
    for (const tag of arr) {
      const flag = ColorFlags[tag as keyof typeof ColorFlags];
      if (flag !== undefined) colors |= flag;
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
    uses: row.uses || undefined,
    uploaded: row.uploaded
      ? new Date(row.uploaded).toISOString().split("T")[0]
      : undefined,
    archived: new Date(`${row.created_time} UTC`).toISOString().split("T")[0],
  };
  reconstructed.push(newRow);
}

// preview for dev
// console.log(reconstructed.slice(0, 5));

if (hasFFmpeg) {
  let streakFailures = 0;
  let i = 0;
  for (const row of reconstructed) {
    i += 1;
    const filename = `${row.id}.webp`;
    if (extantImages.includes(filename)) {
      row.flags = (row.flags ?? 0) | RowFlags.HasThumbnail;
      continue;
    }
    if (!row.image_url) continue;

    const dest = path.join(imagesPath, filename);
    const result =
      await $`ffmpeg -hide_banner -i "${row.image_url}" -vf scale=150:-1 "${dest}"`
        .quiet()
        .nothrow();
    if (result.exitCode === 0) {
      console.log(`Saved ${filename} [${i}/${reconstructed.length}]`);
      streakFailures = 0;
      row.flags = (row.flags ?? 0) | RowFlags.HasThumbnail;
    } else {
      console.log(`Failed to process ${row.image_url}`);
      streakFailures += 1;
      if (streakFailures >= 10) {
        // console.error(result.stderr);
        console.log(`Failure streak of ${streakFailures}, aborting`);
        break;
      }
      await Bun.sleep(500);
    }
  }
} else {
  console.log("FFmpeg not present; will not save images");
}

const finalData = JSON.stringify(reconstructed);
Bun.file("./public/data.json").write(finalData);
Bun.file("./public/hash.txt").write(
  new Bun.MD5().update(finalData).digest("hex"),
);
console.log(`Saved ${reconstructed.length} rows`);
