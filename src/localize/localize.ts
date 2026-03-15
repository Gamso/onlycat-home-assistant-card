import en from "./en.json";
import fr from "./fr.json";

type Section = keyof typeof en & string;
type SectionKeys<S extends Section> = keyof (typeof en)[S] & string;
export type TranslationKey = {
  [S in Section]: `${S}.${SectionKeys<S>}`;
}[Section];

// Widen literal string types so fr is assignable to the same shape as en
type Widen<T> = {
  [K in keyof T]: T[K] extends string ? string : { [J in keyof T[K]]: string };
};
const translations: Record<string, Widen<typeof en>> = { en, fr };

function resolveLang(hass: any): "en" | "fr" {
  const lang: string = hass?.locale?.language ?? hass?.language ?? "en";
  return lang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function get(dict: Widen<typeof en>, key: TranslationKey): string | undefined {
  const dot = key.indexOf(".");
  const sec = key.slice(0, dot) as Section;
  const k = key.slice(dot + 1);
  const section = dict[sec];
  return typeof section === "object"
    ? (section as Record<string, string>)[k]
    : undefined;
}

export function localize(
  hass: any,
  key: TranslationKey,
): string {
  return (
    get(translations[resolveLang(hass)], key) ??
    get(translations.en, key) ??
    key
  );
}

export function localizeFormat(
  hass: any,
  key: TranslationKey,
  vars: Record<string, string | number>,
): string {
  let str = localize(hass, key);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v));
  }
  return str;
}
