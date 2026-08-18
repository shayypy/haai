export const RowFlags = {
  Retired: 1 << 0,
  HeliosRay: 1 << 1,
  HasThumbnail: 1 << 2,
};

export const ColorFlags = {
  b: 1 << 0,
  l: 1 << 1,
  n: 1 << 2,
  e: 1 << 3,
  g: 1 << 4,
  y: 1 << 5,
  p: 1 << 6,
  u: 1 << 7,
  w: 1 << 8,
  r: 1 << 9,
};

export const TagsFlags = {
  ab: 1n << 0n,
  bt: 1n << 1n,
  bw: 1n << 2n,
  bp: 1n << 3n,
  braids: 1n << 4n,
  ch: 1n << 5n,
  cl: 1n << 6n,
  dr: 1n << 7n,
  left: 1n << 8n,
  right: 1n << 9n,
  fy: 1n << 10n,
  hair: 1n << 11n,
  jy: 1n << 12n,
  mh: 1n << 13n,
  ml: 1n << 14n,
  tack: 1n << 15n,
  bay: 1n << 16n,
  black: 1n << 17n,
  red: 1n << 18n,
  cream: 1n << 19n,
  dun: 1n << 20n,
  cfan: 1n << 21n,
  gray: 1n << 22n,
  leo: 1n << 23n,
  spot: 1n << 24n,
  pinto: 1n << 25n,
  roan: 1n << 26n,
  seal: 1n << 27n,
  afk: 1n << 28n,
  ame: 1n << 29n,
  emb: 1n << 30n,
  jpn: 1n << 31n,
  myt: 1n << 32n,
  pir: 1n << 33n,
  pri: 1n << 34n,
  afr: 1n << 35n,
  stars: 1n << 36n,
  fla: 1n << 37n,
  fs: 1n << 38n,
  gs: 1n << 39n,
  gil: 1n << 40n,
  jcg: 1n << 41n,
  mus: 1n << 42n,
  obb: 1n << 43n,
  obi: 1n << 44n,
  pg: 1n << 45n,
  spo: 1n << 46n,
  rb: 1n << 47n,
  swirl: 1n << 48n,
  ann: 1n << 49n,
  nyd: 1n << 50n,
  esp: 1n << 51n,
  spk: 1n << 52n,
  val: 1n << 53n,
  buck: 1n << 54n,
  run: 1n << 55n,
  drs: 1n << 56n,
  aer: 1n << 57n,
  ghd: 1n << 58n,
  jump: 1n << 59n,
  lysi: 1n << 60n,
  pos: 1n << 61n,
  st: 1n << 62n,
  trot: 1n << 63n,
  walk: 1n << 64n,
  abs: 1n << 65n,
  anb: 1n << 66n,
  ant: 1n << 67n,
  anf: 1n << 68n,
  ani: 1n << 69n,
  anm: 1n << 70n,
  anr: 1n << 71n,
  cute: 1n << 72n,
  lig: 1n << 73n,
  pt: 1n << 74n,
  rea: 1n << 75n,
  retro: 1n << 76n,
  sp: 1n << 77n,
  tsp: 1n << 78n,
  sno: 1n << 79n,
  wat: 1n << 80n,
  win: 1n << 81n,
  mag: 1n << 82n,
  mwi: 1n << 83n,
  aus: 1n << 84n,
  ton: 1n << 85n,
  bow: 1n << 86n,
};

export const parseFlags = <Key extends string = string>(
  value: number | bigint,
  set: Record<Key, number | bigint>,
) => {
  const keys: Key[] = [];
  for (const [key, flag] of Object.entries(set)) {
    if (typeof value === "bigint") {
      if (((flag as bigint) & value) === flag) {
        keys.push(key as Key);
      }
    } else {
      if (((flag as number) & value) === flag) {
        keys.push(key as Key);
      }
    }
  }
  return keys;
};

export const colorNames: Record<keyof typeof ColorFlags, string> = {
  b: "black",
  l: "blue",
  n: "brown",
  e: "green",
  g: "gray",
  y: "yellow",
  p: "pink",
  u: "purple",
  w: "white",
  r: "red",
};

// pie chart slice colors
export const colorColors: Record<keyof typeof ColorFlags, string> = {
  b: "#6b7280",
  l: "#0ea5e9",
  n: "#854d0e",
  e: "#84cc16",
  g: "#a1a1aa",
  y: "#fcd34d",
  p: "#f472b6",
  u: "#a855f7",
  w: "#fff",
  r: "#f43f5e",
};

// this was gonna be for us to color the tags in the table view but i couldn't get it to look right
// export const colorColorsBg: Record<keyof typeof ColorFlags, string> = {
//   b: "#0f172a",
//   l: "#0ea5e9",
//   n: "#854d0e",
//   e: "#84cc16",
//   g: "#374151",
//   y: "#ca8a04",
//   p: "#f472b6",
//   u: "#581c87",
//   w: "#e5e7eb",
//   r: "#991b1b",
// };

export const horseTypeNames: Record<string, string> = {
  dok: "Donkey",
  dkp: "Donkey pegasus",
  dku: "Donkey unicorn",
  dkw: "Donkey winged unicorn",
  dh: "Draft horse",
  dhp: "Draft pegasus",
  dhu: "Draft unicorn",
  dhw: "Draft winged unicorn",
  p: "Pony",
  pp: "Pony pegasus",
  pu: "Pony unicorn",
  pwu: "Pony winged unicorn",
  rh: "Riding horse",
  rp: "Riding pegasus",
  riu: "Riding unicorn",
  rwu: "Riding winged unicorn",
};

export const breedNames: Record<string, string> = {
  at: "Akhal-Teke",
  ac: "American Curly",
  am: "Americas",
  ah: "Arabian Horse",
  dp: "Draft Pony",
  fri: "Friesian",
  haf: "Haflinger",
  hd: "Heavy Draft",
  ic: "Irish Cob",
  ld: "Light Draft",
  mw: "Marwari",
  nor: "Nordics",
  spy: "Sport Pony",
  tb: "Thoroughbred",
  tr: "Trotter",
  wb: "Warmblood",
  knb: "Knabstrupper",
};

export const tagNames: Record<keyof typeof TagsFlags, string> = {
  ab: "angel/demon",
  bt: "big tail",
  bw: "big wings",
  bp: "body paint",
  braids: "braids",
  ch: "chains",
  cl: "clothing",
  dr: "draconic",
  left: "facing left",
  right: "facing right",
  fy: "foal",
  hair: "hairy",
  jy: "jewelry",
  mh: "multiple heads",
  ml: "multiple legs",
  mwi: "multiple wings",
  tack: "tack",
  bay: "bay",
  black: "black",
  red: "red",
  cream: "cream",
  dun: "dun",
  cfan: "fantasy",
  gray: "gray",
  leo: "leopard",
  spot: "pangare",
  pinto: "pinto",
  roan: "roan",
  seal: "seal bay",
  afk: "africa-arabia",
  ame: "america",
  emb: "emblems",
  jpn: "japan",
  myt: "mythos",
  pir: "pirates",
  pri: "primeval",
  afr: "animal friends",
  stars: "stars",
  fla: "flames",
  fs: "food",
  gs: "space",
  gil: "gilded",
  jcg: "gems",
  mus: "music",
  mag: "magic",
  obb: "beside object",
  obi: "inside object",
  pg: "plants",
  spo: "sport",
  rb: "rainbows",
  swirl: "swirls",
  ann: "anniversary",
  nyd: "new years",
  esp: "spring",
  spk: "spooky",
  val: "valentines",
  buck: "bucking",
  run: "running",
  drs: "dressage",
  aer: "aerial",
  ghd: "grazing",
  jump: "jumping",
  lysi: "sitting",
  pos: "posing",
  st: "standing",
  trot: "trotting",
  walk: "walking",
  abs: "abstract",
  anb: "an-bird",
  ant: "an-fantasy",
  anf: "an-fish",
  ani: "an-insect",
  anm: "an-mammal",
  anr: "an-reptile",
  cute: "cute",
  lig: "light",
  pt: "painting",
  rea: "realistic",
  retro: "retro",
  sp: "steampunk",
  tsp: "transluscent",
  sno: "snow",
  wat: "water",
  win: "wind",
  aus: "australia",
  ton: "tongue",
  bow: "bowing",
};

export const tagDescriptions = [
  {
    tag: "ab",
    description: "Resembling angels or demons.",
    group: "Appearance",
  },
  {
    tag: "bt",
    description: "The tail is overly long or otherwise prominent.",
    group: "Appearance",
  },
  {
    tag: "bw",
    description:
      "The wings are the main focus of the coat, or they’re oversized.",
    group: "Appearance",
  },
  {
    tag: "bp",
    description: "There are paint, tattoos, or other markings on the horse.",
    group: "Appearance",
  },
  {
    tag: "braids",
    description:
      "The horse has braids, flowers, or other additions to its mane and tail.",
    group: "Appearance",
  },
  {
    tag: "ch",
    description: "There are chains on the horse.",
    group: "Appearance",
  },
  {
    tag: "cl",
    description:
      "The horse is wearing clothes, a cape/robe, or any human accessories, such as headphones.",
    group: "Appearance",
  },
  {
    tag: "dr",
    description: "Resembling an Asian or European dragon.",
    group: "Appearance",
  },
  {
    tag: "left",
    description:
      "The horse is facing left, or if its head is turned, the body is pointing towards the left.",
    group: "Appearance",
  },
  {
    tag: "right",
    description:
      "The horse is facing right, or if its head is turned, the body is pointing towards the right.",
    group: "Appearance",
  },
  {
    tag: "fy",
    description: "The horse is a foal or appears young.",
    group: "Appearance",
  },
  {
    tag: "hair",
    description: "The horse has an excess of mane, tail, or fluff.",
    group: "Appearance",
  },
  {
    tag: "jy",
    description: "There is jewelry of any sort on the horse.",
    group: "Appearance",
  },
  {
    tag: "ton",
    description: "The horse is sticking its tongue out.",
    group: "Appearance",
  },
  { tag: "mh", description: "Too many heads!", group: "Appearance" },
  { tag: "ml", description: "Too many legs!", group: "Appearance" },
  { tag: "mwi", description: "Too many wings!", group: "Appearance" },
  {
    tag: "tack",
    description:
      "The horse is wearing tack or has human equipment, such as swords, other weapons, or armor.",
    group: "Appearance",
  },

  { tag: "bay", description: "Bay or a vague brown.", group: "Color" },
  {
    tag: "black",
    description: "Black or other dark coats.",
    group: "Color",
  },
  {
    tag: "red",
    description: "Red/chestnut or a liver chestnut.",
    group: "Color",
  },
  {
    tag: "cream",
    description: "Light-colored with pink skin, champagne-colored, etc.",
    group: "Color",
  },
  {
    tag: "dun",
    description: "Dun or buckskin-colored, or black dun (grulla).",
    group: "Color",
  },
  {
    tag: "cfan",
    description: "Any unrealistic colors.",
    group: "Color",
  },
  {
    tag: "gray",
    description: "Dapple gray, light gray, etc.",
    group: "Color",
  },
  {
    tag: "leopard",
    description: "Leopard appaloosa, spotted blanket, etc.",
    group: "Color",
  },
  {
    tag: "pangare",
    description: "Any pangare-like colors, minimal sabino, or countershading.",
    group: "Color",
  },
  {
    tag: "pinto",
    description: "Tobiano, overo, tovero, loud sabino.",
    group: "Color",
  },
  { tag: "roan", description: "Roan colored.", group: "Color" },
  {
    tag: "seal",
    description: "Seal bay or any dark bay.",
    group: "Color",
  },

  {
    tag: "afk",
    description:
      "Anything from or inspired by the continent of Africa or the Middle East.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "ame",
    description:
      "Representing Native American cultures; feathers, war paint, etc.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "emb",
    description: "Features country flags or national identifiers.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "jpn",
    description: "Geishas, sakura trees, samurais, etc.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "myt",
    description: "Inspired by any mythology or folklore.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "pir",
    description:
      "Anything relating to pirates. Eye patches, cutlasses, or parrots, perhaps.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "pri",
    description:
      "Dinosaurs, shamans, extinct creatures, or other prehistoric art.",
    group: "Countries, Cultures, or Time Periods",
  },
  {
    tag: "aus",
    description:
      "Resembling or featuring animals from Australia or Australian culture.",
    group: "Countries, Cultures, or Time Periods",
  },

  {
    tag: "afr",
    description: "There are animals with the horse.",
    group: "Features",
  },
  {
    tag: "stars",
    description:
      "There are stars, dust, vague spots of light, lightning and visible forms of electricity, or other artifacts around the horse.",
    group: "Features",
  },
  {
    tag: "fla",
    description: "There are flames of any color around the horse.",
    group: "Features",
  },
  {
    tag: "fs",
    description: "Featuring food, candy, or drinks.",
    group: "Features",
  },
  {
    tag: "gs",
    description: "The horse is in space or is modeled after a celestial body.",
    group: "Features",
  },
  {
    tag: "gil",
    description: "Featuring melted or solid gold.",
    group: "Features",
  },
  {
    tag: "jcg",
    description:
      "There are gems on or around the horse, or the horse itself is modeled after a gemstone; will not be applied if the gems are embedded within a piece of jewelry.",
    group: "Features",
  },
  {
    tag: "mus",
    description:
      "The horse is playing a musical instrument or standing near one, or the coat represents a genre of music.",
    group: "Features",
  },
  {
    tag: "mag",
    description:
      "Classic magical elements, like cards, top hats, rabbits, or wands.",
    group: "Features",
  },
  {
    tag: "obb",
    description:
      "There is an object beside the horse or in its mouth or hooves.",
    group: "Features",
  },
  {
    tag: "obi",
    description: "The horse is inside an object.",
    group: "Features",
  },
  {
    tag: "pg",
    description:
      "There are leaves, vines, trees, or anything green around or on the horse.",
    group: "Features",
  },
  {
    tag: "spo",
    description:
      "The horse is playing with or around items representing a certain sport.",
    group: "Features",
  },
  {
    tag: "rb",
    description:
      "For rainbow or multicolored horses, or rainbows around the horse.",
    group: "Features",
  },
  {
    tag: "swirl",
    description:
      "There is an abundance of swirls or spirals on or around the horse.",
    group: "Features",
  },

  {
    tag: "ann",
    description: "Howrse anniversary creations.",
    group: "Holidays",
  },
  {
    tag: "nyd",
    description: "Presents, garland, reindeer, Santa Claus, etc.",
    group: "Holidays",
  },
  {
    tag: "esp",
    description:
      "Eggs, rabbits, pastel colors, or anything with lambs or chicks.",
    group: "Holidays",
  },
  {
    tag: "spk",
    description: "Anything involving Halloween, pumpkins, skeletons, etc.",
    group: "Holidays",
  },
  {
    tag: "val",
    description:
      "Hearts, chocolates, and anything that relates to Valentine’s Day.",
    group: "Holidays",
  },

  {
    tag: "buck",
    description: "The horse is on its front or hind legs only.",
    group: "Movement",
  },
  {
    tag: "run",
    description: "Galloping, cantering, or fast movement of any sort.",
    group: "Movement",
  },
  {
    tag: "drs",
    description:
      "Dressage movements or maneuvers. Will often be combined with the regular movement it is closest to, such as `trotting` or `walking`.",
    group: "Movement",
  },
  {
    tag: "aer",
    description:
      "The horse is flying, floating, swimming, or in the middle of a jump.",
    group: "Movement",
  },
  {
    tag: "ghd",
    description: "Grazing, scratching, or anything where the head is lowered.",
    group: "Movement",
  },
  {
    tag: "jump",
    description:
      "The horse is beginning to, in the middle of, or landing a jump.",
    group: "Movement",
  },
  {
    tag: "lysi",
    description: "Sitting, lying, rolling, etc.",
    group: "Movement",
  },
  {
    tag: "pos",
    description:
      "The horse is standing, but with a certain pose, such as a leg being raised, or bowing down. Will always be combined with the `standing` tag.",
    group: "Movement",
  },
  {
    tag: "st",
    description: "The horse is standing still.",
    group: "Movement",
  },
  { tag: "trot", description: "The horse is trotting.", group: "Movement" },
  { tag: "walk", description: "The horse is walking.", group: "Movement" },
  { tag: "bow", description: "The horse is in a bow.", group: "Movement" },

  {
    tag: "abs",
    description:
      "The horse does not resemble a horse or any other animals. This tag will be applied if the horse is supposed to be made out of an organic or inorganic material.",
    group: "Styles",
  },
  {
    tag: "anb",
    description: "The horse resembles a bird.",
    group: "Styles/Animal type",
  },
  {
    tag: "ant",
    description: "The horse resembles a fictional species of animal.",
    group: "Styles/Animal type",
  },
  {
    tag: "anf",
    description:
      "The horse resembles a fish or aquatic creature (includes aquatic mammals).",
    group: "Styles/Animal type",
  },
  {
    tag: "ani",
    description:
      "The horse resembles an insect, arachnid, or mollusc (land snails and slugs).",
    group: "Styles/Animal type",
  },
  {
    tag: "anm",
    description: "The horse resembles a different mammal.",
    group: "Styles/Animal type",
  },
  {
    tag: "anr",
    description: "The horse resembles a reptile or amphibian.",
    group: "Styles/Animal type",
  },
  {
    tag: "cute",
    description: "The horse is drawn in a cartoonish or cute style.",
    group: "Styles",
  },
  {
    tag: "lig",
    description:
      "Used when light plays a significant role in the coat, such as one part of the horse being illuminated and the other being in shadow.",
    group: "Styles",
  },
  {
    tag: "pt",
    description:
      "The lines are not as distinct, the horse is slightly abstract without being inanimate, the colors are blended in a way resembling a painting, or the coat is in the style of a traditional drawing.",
    group: "Styles",
  },
  {
    tag: "rea",
    description:
      "Realistic coats, or anything not fitting into cartoonish or painting-type styles. ",
    group: "Styles",
  },
  {
    tag: "retro",
    description: "Robots, neon lights, or other tech.",
    group: "Styles",
  },
  {
    tag: "sp",
    description: "Clocks, steam engines, 19th century and sci-fi styling.",
    group: "Styles",
  },
  {
    tag: "tsp",
    description: "Completely or partially see-through horses.",
    group: "Styles",
  },

  {
    tag: "sno",
    description: "There is snow on or around the horse, or involving ice.",
    group: "Weather",
  },
  {
    tag: "wat",
    description:
      "The theme relates to water, e.g. a horse that resembles a fish, or there is water around the horse. This tag also applies if the liquid isn’t necessarily water.",
    group: "Weather",
  },
  {
    tag: "win",
    description:
      "Wind is blowing something around the horse, or its mane and tail.",
    group: "Weather",
  },
];

export const maxUses = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type MaxUses = (typeof maxUses)[number];
