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
