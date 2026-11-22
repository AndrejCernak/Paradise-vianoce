# Paradise Martin – vianočné darčeky (kontext pre Claude Code)

## O projekte
Stránka na predaj darčekových poukážok pre salón **Paradise Martin** (masáže, lymfodrenáž, kolagén, solárium).
Robí ju agentúra **WebPoint** (Andrej) ako súčasť vianočnej Meta kampane 2026.
Cieľ: v Ads Manageri vidieť **reálne tržby a ROAS** (Purchase s hodnotou), nie leady.

Je to kópia systému pre **Relax Žilina** (`~/Desktop/relax-darceky 2`, repozitár AndrejCernak/relax-vianoce).
Projekty sú samostatné: iný katalóg, iné údaje salónu, iný Stripe účet, iný pixel. Opravy v spoločnej logike
(platba, webhook, CAPI, PDF) sa oplatí preniesť do oboch.

Paradise má aj samostatný **rezervačný systém** (`~/Desktop/paradise booking system`, paradise.webpointsk.com),
ktorý tiež používa Stripe. Preto má každá platba z tejto stránky v metadátach `app=paradise-darceky`
a webhook cudzie platby preskakuje.

## Komunikácia
- Používateľ: Andrej, píše po slovensky, chce **vykanie**, stručne, bez omáčok.
- Texty na stránke: slovenčina, vykanie, jednoduché vety.

## Stack
- Next.js 16 (App Router, TypeScript), bez Tailwindu, ručné CSS v `src/app/globals.css`
- Stripe Checkout (hostovaný), webhook `/api/stripe-webhook`
- Meta Pixel (až po súhlase s cookies) + Conversions API zo servera
- PDF poukážky cez `pdf-lib` + DejaVu fonty v `assets/fonts` (kvôli diakritike)
- E-maily cez n8n webhook (`N8N_MAIL_WEBHOOK_URL`, workflow `n8n/poukazky-email.json`, Send Email z webpointsk@gmail.com s menom salónu, webhook chráni len náhodná cesta), náhradne Brevo API; voliteľne n8n webhook → NocoDB
- Hosting: Vercel
- Fonty stránky cez `@fontsource` (self-hosted, bez Google Fonts kvôli GDPR)

## Dôležité rozhodnutia (nemeniť bez dôvodu)
- **Deduplikácia:** InitiateCheckout má rovnaké `eventId` v Pixeli (BuyButton) aj v CAPI (`/api/checkout`).
  Purchase má `event_id = purchase_<stripe session id>` v CAPI (webhook) aj v Pixeli (ďakovacia stránka).
- **Consent:** Pixel sa načíta až po „Povoliť všetky“. `CAPI_REQUIRE_CONSENT=true` → bez súhlasu sa do Mety neposiela nič.
- `fbp`, `fbc`, `fbclid`, IP a user agent sa ukladajú do metadát Stripe session (len so súhlasom) a použijú sa pri Purchase.
- **Kódy poukážok** `PAR-XXXX-XXXX` sú deterministické (HMAC zo session id + poradie) → opakovaný webhook nevytvorí nové kódy.
  Po spracovaní sa na PaymentIntent zapíše `fulfilled=1` a `voucher_codes`.
- **Metadáta `app=paradise-darceky`** (konštanta `appId` v `config.ts`): fulfillment spracuje len platby z tejto stránky.
- Ceny v `src/lib/products.ts` = súčet hlavných služieb z cenníka na paradise-martin.sk zaokrúhlený na celé eurá,
  **bonus je navyše**, bez komunikovanej zľavy. Zdroj: návrh ponuky `Paradise_Martin_vianocne_baliky.pdf`.
- Na webe sa predáva len: Vianočný Paradise Mini / Klasik / Premium, Zimná žiara, Uvoľnenie chrbta, hodnotové 30 / 50 / 100 €.
  Ostatné balíky z návrhu (Parafínový dotyk, Kolagénový reštart, Kancelárska úľava, malé darčeky, Nový rok) na webe nie sú.
- Na stránke nie sú recenzie ani hodnotenie: nemáme overené údaje Paradise. Nevymýšľať ich.
- Sľuby, ktoré Paradise nepotvrdilo (výmena za inú službu, tlačená poukážka v obálke), na stránke nie sú.

## Black Friday 2026
- Podstránka `/black-friday`: `src/app/black-friday/page.tsx`, `black-friday.css`, klient `src/components/BlackFridayShop.tsx`.
  Tieto tri súbory sú **rovnaké v Relaxe aj v Paradise**, rozdiely sú len v `config.ts` (`blackFriday`) a `products.ts`.
- Produkty majú `group: "black-friday"`, `availableFrom/Until` (23. – 29. 11.), `compareAtCents`, `tier`, `sessions`, `landingPath`.
  `isAvailable` kontroluje začiatok aj koniec; `SALE_PREVIEW=1` ho obíde (len lokálne).
- Fulfillment podľa `isDeal(product)` mení nadpis PDF, predmet e-mailu, platnosť (`blackFriday.validUntil`) a oslovenie.
- Nákupná lišta je `position: fixed` dole; cookie lišta zapisuje svoju výšku do `--consent-h`, aby sa neprekrývali.

## Stav
Hotové: katalóg a texty Paradise, typecheck, build, selftest (CAPI payload, kódy, PDF), vizuálna kontrola na desktope a mobile.

**Neoverené** (chýbajú kľúče): reálna Stripe platba, webhook, Conversions API zo servera, e-maily cez n8n.

## TODO
1. Potvrdiť s Paradise: platnosť poukážok (`VOUCHER_VALID_UNTIL`, zatiaľ 31. 3. 2027), prevádzkovateľa (IČO, sídlo),
   spôsob uplatnenia (telefón vs. online rezervácia), e-mail na upozornenia o predaji.
2. Stripe: zistiť, či Paradise už má aktivovaný účet z rezervačného systému. Testovací nákup podľa README.
3. Meta: Pixel ID Paradise, CAPI token, `META_TEST_EVENT_CODE`, skontrolovať „Deduplikované“ a hodnotu Purchase.
4. Nasadiť na Vercel z vlastného repozitára, pripojiť doménu, ostrý webhook.
5. Obchodné podmienky a GDPR stránka sú **návrhy** → skontrolovať právnikom/účtovníčkou. Faktúry a DPH pri poukážkach s účtovníčkou.
6. Voliteľne: fotky do kartičiek, recenzie, balíky Nový rok od 27. 12. (`availableFrom` je pripravené).

## Príkazy
- `npm run dev` – vývoj na http://localhost:3000
- `npm run build` – produkčný build
- `npm run typecheck`
- `npm run selftest` – kontrola CAPI payloadu, kódov a PDF (vytvorí `test-poukazka.pdf`)

## Dizajn
Rovnaký ako Relax: vianočný motív „darček v zimný večer“. Tmavé sekcie: noc `#2A0D1B` (úvod, pätička, ďakujeme),
čečina `#1C3529` (Každá poukážka). Svetlé: papier `#FBF6EE` / `#FFFDF8`, text `#2B1E2F`, vínová `#8C2F4B`, zlatá fólia (`--foil`).
Nadpisy Bodoni Moda, text Figtree, ozdobné písmo Pinyon Script (len krátke nápisy).
Ozdoby sú čisté SVG v `src/components/Decor.tsx`, sneženie je canvas `Snowfall.tsx`.
Rozdiel oproti Relaxu: tri úrovne Vianočného Paradise sú vedľa seba ako rovnako široké kartičky,
stredná (Klasik) je vínová s pečaťou „Náš tip na darček“. Sekcia recenzií chýba.
Všetko rešpektuje `prefers-reduced-motion`.
