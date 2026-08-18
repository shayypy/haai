const alphabetLower = "abcdefghijklmnopqrstuvwxyz";
const alphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// I wonder if there is a better way to do this
const fancyFontsLower = [
  "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
  "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
  "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
  "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏",
  "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫",
  "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ",
  "ꪖ᥇ᥴᦔꫀᠻᧁꫝ꠸꠹ᛕꪶꪑꪀꪮρꪇ᥅ᦓꪻꪊꪜ᭙᥊ꪗƺ",
  "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ",
  "zʎxʍʌnʇsɹbdouɯlʞɾıɥɓɟǝpɔqɐ",
  "​🇦​​🇧​​🇨​​🇩​​🇪​​🇫​​🇬​​🇭​​🇮​​🇯​​🇰​​🇱​​🇲​​🇳​​🇴​​🇵​​🇶​​🇷​​🇸​​🇹​​🇺​​🇻​​🇼​​🇽​​🇾​​🇿​",
];
const fancyFontsUpper = [
  "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
  "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅",
  "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
  "𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
  "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
  "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ",
  "Z⅄XMΛ∩⊥SᴚΌԀONW˥⋊ſIH⅁ℲƎᗡƆᙠ∀",
  "​🇦​​🇧​​🇨​​🇩​​🇪​​🇫​​🇬​​🇭​​🇮​​🇯​​🇰​​🇱​​🇲​​🇳​​🇴​​🇵​​🇶​​🇷​​🇸​​🇹​​🇺​​🇻​​🇼​​🇽​​🇾​​🇿​",
  "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘᴏ̨ʀsᴛᴜᴠᴡxʏᴢ",
];

// this would be slow to do every time fancyToPlain is run so we precalculate it
const fancyToPlainMap = (() => {
  const map: Record<string, string> = {};
  for (const charset of fancyFontsLower) {
    let i = -1;
    for (const char of charset.split("")) {
      i += 1;
      const match = alphabetLower.at(i);
      if (match) map[char] = match;
    }
  }
  for (const charset of fancyFontsUpper) {
    let i = -1;
    for (const char of charset.split("")) {
      i += 1;
      const match = alphabetUpper.at(i);
      if (match) map[char] = match;
    }
  }

  return map;
})();

export const fancyToPlain = (text: string) => {
  let reconstructed = "";
  for (const char of text.split("")) {
    reconstructed += fancyToPlainMap[char] ?? char;
  }
  return reconstructed;
};
