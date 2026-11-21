// Údaje o salóne (zdroj: paradise-martin.sk). Riadky označené DOPLNIŤ treba pred spustením potvrdiť s Paradise.
export const salon = {
  name: "Paradise Martin",
  fullName: "Paradise Martin",
  address: "Aurela Stodolu 5307, Martin",
  phone: "+421 907 565 190",
  phoneHref: "tel:+421907565190",
  hours: "Pondelok až sobota 9:00 – 19:00",
  web: "https://paradise-martin.sk",
  instagram: "https://www.instagram.com/paradise_raj_mt/",
  facebook: "https://www.facebook.com/paradise.raj.mt",
  // DOPLNIŤ: prevádzkovateľ (obchodné meno, sídlo, IČO, DIČ / IČ DPH, e-mail)
  operator: {
    company: "DOPLNIŤ obchodné meno",
    seat: "DOPLNIŤ sídlo",
    ico: "DOPLNIŤ",
    dic: "DOPLNIŤ",
    email: "paradise.raj.martin@gmail.com",
  },
};

/** Označenie platieb z tejto stránky v metadátach Stripe (na tom istom účte beží aj rezervačný systém). */
export const appId = "paradise-darceky";

export const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
// DOPLNIŤ: platnosť poukážok ešte nie je s Paradise potvrdená.
export const voucherValidUntil = process.env.VOUCHER_VALID_UNTIL || "31. 3. 2027";
export const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/** Black Friday stránka (/black-friday). Termín predaja je v products.ts (blackFridayWindow). */
export const blackFriday = {
  theme: "gold" as "gold" | "blue",
  themeColor: "#0B0A08",
  brand: { main: "Paradise", sub: "Martin" },
  place: "v Paradise",
  packageName: "Paradise Body Shape",
  dateLabel: "23. – 29. 11.",
  startLabel: "23.\u00a011.",
  howToBook: `Termín si dohodnete na čísle ${salon.phone}`,
  // DOPLNIŤ: platnosť Black Friday balíkov potvrdiť s Paradise (10× balík potrebuje dosť času).
  validUntil: process.env.BF_VALID_UNTIL || voucherValidUntil,
};
