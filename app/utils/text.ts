import twemoji from "@twemoji/api";

// https://web.dev/articles/clipboard/copy-text#progressive_enhancement
export const copyText = async (text: string) => {
  // pretty sure this is secure-only so we don't rely on it to always
  // succeed just because the browser has it
  try {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch (e) {
    console.error(e);
    document.body.removeChild(textArea);
    return false;
  }
};

export const serverDomains = {
  INT: "www.howrse.com",
  US: "us.howrse.com",
  GB: "www.howrse.co.uk",
  AU: "au.howrse.com",
  CA: "ca.howrse.com",
  DE: "www.howrse.de",
  FR: "www.equideow.com",
  ES: "www.caballow.com",
  PT: "www.howrse.com.pt",
  BR: "br.howrse.com",
  RU: "www.lowadi.com",
  IT: "www.howrse.it",
  NL: "nl.howrse.com",
  SE: "www.howrse.se",
  PL: "www.howrse.pl",
  CZ: "www.howrse.cz",
  DK: "www.howrse.dk",
  FI: "www.howrse.fi",
  NO: "www.howrse.no",
  HU: "www.howrse.hu",
  RO: "www.howrse.ro",
  BG: "www.howrse.bg",
  SI: "www.howrse.si",
  SK: "www.howrse.sk",
};

export const serverNames = {
  INT: "International",
  US: "United States",
  GB: "United Kingdom",
  AU: "Australia",
  CA: "Canada",
  DE: "Germany",
  FR: "Equideow",
  ES: "Caballow",
  PT: "Portugal",
  BR: "Brazil",
  RU: "Lowadi",
  IT: "Italy",
  NL: "Netherlands",
  SE: "Sweden",
  PL: "Poland",
  CZ: "Czechia",
  DK: "Denmark",
  FI: "Finland",
  NO: "Norway",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  SI: "Slovenia",
  SK: "Slovakia",
};

const namesToRegions = Object.fromEntries(
  Object.entries(serverNames).map(([key, val]) => [val, key]),
);

export const getServerName = (region: string): string =>
  // @ts-expect-error
  serverNames[region] ?? "Howrse";

export const getServerRegions = (name: string): string[] =>
  // Assume plural val because sometimes the retired_in region is "International, X"
  name
    .split(",")
    .map((s) => s.trim())
    .map((part) => namesToRegions[part])
    .filter((v) => !!v);

export const regionToEmojiCode = (region: string) =>
  region === "INT"
    ? "1f30f"
    : String(region)
        .toUpperCase()
        .split("")
        .map((char) => (127397 + char.charCodeAt(0)).toString(16))
        .join("-");

// from jdecked/twemoji readme
export const twemojiUrl = (
  icon: string,
  options: Pick<typeof twemoji, "base" | "size" | "ext"> = {
    base: twemoji.base,
    size: "svg",
    ext: ".svg",
  },
) => {
  return "".concat(options.base, options.size, "/", icon, options.ext);
};
