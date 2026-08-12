import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";
import { ColorFlags, RowFlags, TagsFlags } from "~/utils/flags";
import type { StatsFile, TableRow } from "~/utils/types";

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
const stats: StatsFile = {
  usage: {
    colors: {},
    tags: {},
    servers: {},
  },
  newest_authors: [],
  prolific_authors: [],
  months: [],
};

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

  if (row.colors) {
    for (const color of separate(row.colors)) {
      stats.usage.colors[color] = (stats.usage.colors[color] ?? 0) + 1;
    }
  }
  if (row.tags) {
    for (const tag of separate(row.tags)) {
      stats.usage.tags[tag] = (stats.usage.tags[tag] ?? 0) + 1;
    }
  }
  if (row.server) {
    stats.usage.servers[row.server] =
      (stats.usage.servers[row.server] ?? 0) + 1;
  }
  if (row.uploaded) {
    const date = new Date(row.uploaded);
    const extant = stats.months.find(
      (m) => m.year === date.getUTCFullYear() && m.month === date.getUTCMonth(),
    );
    if (extant) {
      extant.apples += 1;
    } else {
      stats.months.push({
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        apples: 1,
      });
    }
  }
  if (row.author) {
    const extant = stats.prolific_authors.find((m) => m.name === row.author);
    if (extant) {
      extant.apples += 1;
    } else {
      stats.prolific_authors.push({ name: row.author, apples: 1 });
    }

    if (row.uploaded) {
      const date = new Date(row.uploaded);
      const extantRecent = stats.newest_authors.find(
        (m) => m.name === row.author,
      );
      if (extantRecent) {
        extantRecent.apples += 1;
        const parsed = new Date(extantRecent.first_seen);
        if (date.getTime() < parsed.getTime()) {
          extantRecent.first_seen = date.toISOString();
        }
      } else {
        stats.newest_authors.push({
          name: row.author,
          first_seen: date.toISOString(),
          apples: 1,
        });
      }
    }
  }
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

const now = Date.now();
stats.newest_authors.sort(
  (a, b) => new Date(b.first_seen).getTime() - new Date(a.first_seen).getTime(),
);
stats.newest_authors = stats.newest_authors
  .filter(
    // only authors newer than 1 month
    (a) => now - new Date(a.first_seen).getTime() < 86_400_000 * 30,
  )
  .map((a) => ({ ...a, first_seen: a.first_seen.split("T")[0] }));
stats.prolific_authors = stats.prolific_authors
  .filter((a) => a.apples > 1)
  .sort((a, b) => b.apples - a.apples)
  .slice(0, 100);

Bun.file("./public/stats.json").write(JSON.stringify(stats));
console.log("Saved stats file");
