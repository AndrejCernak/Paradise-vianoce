// Katalóg darčekov Paradise Martin. Ceny sú v centoch a vychádzajú z cenníka na paradise-martin.sk (november 2026).
// Cena balíka = súčet hlavných služieb zaokrúhlený na celé eurá, bonus je navyše.

export type Group = "pre-nu" | "solarium-kolagen" | "pre-neho" | "hodnotova" | "black-friday";

export type Product = {
  id: string;
  group: Group;
  name: string;
  priceCents: number;
  includes: string[];
  duration?: string;
  bonus?: string;
  note?: string;
  featured?: boolean;
  /** ISO dátum, od ktorého sa produkt zobrazí a dá kúpiť (čas Europe/Bratislava) */
  availableFrom?: string;
  /** ISO dátum, do ktorého (vrátane) sa produkt dá kúpiť */
  availableUntil?: string;
  /** Pôvodná cena pred zľavou (prečiarknutá) */
  compareAtCents?: number;
  /** Úroveň balíka pri akciách (BASIC, PREMIUM, VIP) */
  tier?: string;
  /** Počet procedúr v balíku (kvôli cene za procedúru) */
  sessions?: number;
  /** Stránka, kam sa zákazník vráti, keď platbu zruší */
  landingPath?: string;
  /** Počet kusov na predaj (bez hodnoty = neobmedzene); predané sa rátajú zo Stripe, pozri lib/stock.ts */
  stock?: number;
};

export const groups: { id: Group; title: string; intro: string }[] = [
  { id: "pre-nu", title: "Pre ňu", intro: "Vianočný Paradise v troch veľkostiach. Vyberte podľa toho, koľko chcete darovať." },
  { id: "solarium-kolagen", title: "Solárium a kolagén", intro: "Zimná žiara na celú zimu." },
  { id: "pre-neho", title: "Pre neho", intro: "Darček pre muža, ktorý celé dni sedí alebo dvíha." },
  { id: "hodnotova", title: "Hodnotová poukážka", intro: "Keď neviete, čo vybrať. Platí na všetky služby v Paradise." },
];

export const products: Product[] = [
  {
    id: "vianocny-paradise-mini",
    group: "pre-nu",
    name: "Vianočný Paradise Mini",
    priceCents: 3600,
    includes: ["Indická masáž hlavy 40 min", "Lymfodrenáž 30 min"],
    bonus: "Vibračná plošina 10 min",
  },
  {
    id: "vianocny-paradise-klasik",
    group: "pre-nu",
    name: "Vianočný Paradise Klasik",
    priceCents: 5600,
    includes: ["Celotelová masáž 60 min", "Lymfodrenáž 50 min"],
    bonus: "Kolagén 20 min",
    featured: true,
  },
  {
    id: "vianocny-paradise-premium",
    group: "pre-nu",
    name: "Vianočný Paradise Premium",
    priceCents: 9600,
    includes: ["Celotelová masáž 90 min", "Indická masáž hlavy 40 min", "Lymfodrenáž 50 min"],
    bonus: "Kolagén 20 min a vibračná plošina 10 min",
  },
  {
    id: "zimna-ziara",
    group: "solarium-kolagen",
    name: "Zimná žiara",
    priceCents: 8700,
    includes: ["Permanentka do solária 50 min", "Permanentka na kolagén 100 min"],
    bonus: "Vibračná plošina 5 vstupov",
    note: "Permanentky sú bez časového obmedzenia.",
  },
  {
    id: "uvolnenie-chrbta",
    group: "pre-neho",
    name: "Uvoľnenie chrbta",
    priceCents: 5800,
    includes: ["Masáž chrbta a šije 45 min", "Masáž krčnej chrbtice 30 min"],
    bonus: "Vibračná plošina 10 min",
  },
  {
    id: "hodnotova-30",
    group: "hodnotova",
    name: "Hodnotová poukážka 30 €",
    priceCents: 3000,
    includes: ["Na ľubovoľnú službu v Paradise"],
    bonus: "Vibračná plošina 10 min",
  },
  {
    id: "hodnotova-50",
    group: "hodnotova",
    name: "Hodnotová poukážka 50 €",
    priceCents: 5000,
    includes: ["Na ľubovoľnú službu v Paradise"],
    bonus: "Kolagén 10 min",
  },
  {
    id: "hodnotova-100",
    group: "hodnotova",
    name: "Hodnotová poukážka 100 €",
    priceCents: 10000,
    includes: ["Na ľubovoľnú službu v Paradise"],
    bonus: "Kolagén 20 min a vibračná plošina 10 min",
  },
];

/** Black Friday 2026: predaj od pondelka 23. 11. do nedele 29. 11. (vrátane). */
export const blackFridayWindow = { from: "2026-11-23", until: "2026-11-29" };

const bf = {
  group: "black-friday",
  availableFrom: blackFridayWindow.from,
  availableUntil: blackFridayWindow.until,
  landingPath: "/black-friday",
} as const;

products.push(
  {
    ...bf,
    id: "bf-body-shape-basic",
    tier: "BASIC",
    name: "Paradise Body Shape BASIC",
    priceCents: 5500,
    compareAtCents: 7500,
    sessions: 3,
    includes: ["1× EMShape 40 min", "1× INFRAShape 30 min", "1× lymfodrenáž 30 min"],
  },
  {
    ...bf,
    id: "bf-body-shape-premium",
    tier: "PREMIUM",
    name: "Paradise Body Shape PREMIUM",
    stock: 10,
    priceCents: 17900,
    compareAtCents: 30000,
    sessions: 15,
    includes: ["5× EMShape 40 min", "5× INFRAShape 30 min", "5× lymfodrenáž 30 min"],
  },
  {
    ...bf,
    id: "bf-body-shape-vip",
    tier: "VIP",
    name: "Paradise Body Shape VIP",
    stock: 10,
    priceCents: 29000,
    compareAtCents: 58000,
    sessions: 30,
    includes: ["10× EMShape 40 min", "10× INFRAShape 30 min", "10× lymfodrenáž 30 min"],
  },
);

export const valueVoucherIds = ["hodnotova-30", "hodnotova-50", "hodnotova-100"];

/** Začiatok (0:00) a koniec (23:59:59) obdobia predaja v ms, čas Europe/Bratislava (v zime +01:00). */
export function saleWindowMs(from: string, until: string) {
  return { start: Date.parse(`${from}T00:00:00+01:00`), end: Date.parse(`${until}T23:59:59+01:00`) };
}

export function isAvailable(p: Product, now = new Date()): boolean {
  // SALE_PREVIEW=1 sprístupní akcie mimo termínu. Len na lokálne testovanie, nikdy nie vo Verceli.
  if (process.env.SALE_PREVIEW === "1") return true;
  const { start, end } = saleWindowMs(p.availableFrom ?? "2000-01-01", p.availableUntil ?? "2100-01-01");
  return now.getTime() >= start && now.getTime() <= end;
}

export const isDeal = (p?: Product) => p?.group === "black-friday";

/** Názov položky v Stripe Checkoute (zobrazí sa aj na potvrdení o platbe). */
export function checkoutName(p: Product) {
  return isDeal(p) ? `Black Friday: ${p.name}` : `Darčeková poukážka: ${p.name}`;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatEur(cents: number): string {
  const eur = cents / 100;
  return `${Number.isInteger(eur) ? eur : eur.toFixed(2).replace(".", ",")} €`;
}
