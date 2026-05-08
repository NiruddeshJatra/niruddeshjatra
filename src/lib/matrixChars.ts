export const KATAKANA = Array.from({ length: 59 }, (_, i) =>
  String.fromCodePoint(0xff65 + i)
);
export const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const CHARS: string[] = [...KATAKANA, ...DIGITS];
