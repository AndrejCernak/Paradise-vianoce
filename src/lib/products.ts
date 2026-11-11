// Katalóg darčekov Paradise Martin. Ceny sú v centoch a vychádzajú z cenníka na paradise-martin.sk (november 2026).
// Cena balíka = súčet hlavných služieb zaokrúhlený na celé eurá, bonus je navyše.

export type Group = "pre-nu" | "solarium-kolagen" | "pre-neho" | "hodnotova";

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

export const valueVoucherIds = ["hodnotova-30", "hodnotova-50", "hodnotova-100"];

export function isAvailable(p: Product, now = new Date()): boolean {
  if (!p.availableFrom) return true;
  return now.getTime() >= Date.parse(`${p.availableFrom}T00:00:00+01:00`);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatEur(cents: number): string {
  const eur = cents / 100;
  return `${Number.isInteger(eur) ? eur : eur.toFixed(2).replace(".", ",")} €`;
}
