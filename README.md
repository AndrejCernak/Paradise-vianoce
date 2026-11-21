# Paradise Martin – stránka s vianočnými darčekmi

Predaj darčekových poukážok online: zákazník vyberie darček, zaplatí cez Stripe a PDF poukážka mu hneď príde e-mailom.
Každý nákup ide do Mety ako **Purchase so skutočnou sumou** (Pixel v prehliadači + Conversions API zo servera, deduplikované),
takže v Ads Manageri vidíte reálne tržby a návratnosť reklamy.

Je to ten istý systém ako pre Relax Žilina, len s katalógom a údajmi Paradise.

## Čo je v predaji

| Darček | Cena | Bonus zadarmo |
| --- | --- | --- |
| Vianočný Paradise Mini | 36 € | Vibračná plošina 10 min |
| Vianočný Paradise Klasik | 56 € | Kolagén 20 min |
| Vianočný Paradise Premium | 96 € | Kolagén 20 min a vibračná plošina 10 min |
| Zimná žiara | 87 € | Vibračná plošina 5 vstupov |
| Uvoľnenie chrbta (pre neho) | 58 € | Vibračná plošina 10 min |
| Hodnotová poukážka 30 / 50 / 100 € | 30 / 50 / 100 € | podľa sumy |

Katalóg je v `src/lib/products.ts`, údaje salónu v `src/lib/config.ts`.

## Ako to funguje

1. Reklama → stránka. Po súhlase s cookies sa načíta Pixel (PageView, ViewContent pri zobrazení darčeka).
2. Klik na **Kúpiť** → Pixel `InitiateCheckout` + server pošle to isté cez Conversions API s rovnakým `event_id`.
3. Stripe Checkout (karta, Apple Pay, Google Pay). Pri vytvorení platby uložíme `_fbp`, `_fbc` / `fbclid`, IP a prehliadač (len so súhlasom).
4. Po zaplatení Stripe zavolá webhook → server:
   - pošle `Purchase` cez Conversions API (event_id `purchase_<id platby>`, suma, zahashovaný e-mail, telefón, meno, `fbp`, `fbc`),
   - vygeneruje PDF poukážku s jedinečným kódom (`PAR-XXXX-XXXX`, jeden kód na kus),
   - pošle e-mail zákazníkovi a upozornenie salónu (Brevo),
   - voliteľne pošle predaj do n8n (→ NocoDB).
5. Ďakovacia stránka pošle `Purchase` z Pixelu s rovnakým event_id → Meta obe udalosti spojí do jednej.

Webhook je odolný voči opakovaniu: kódy sú odvodené od ID platby a po spracovaní sa na platbu zapíše príznak `fulfilled`.
Každá platba z tejto stránky má v metadátach `app=paradise-darceky`. Platby z iných systémov na tom istom Stripe účte
(rezervačný systém) webhook preskočí a poukážku pre ne nevytvorí.

## Spustenie platobnej brány (Stripe)

Peniaze idú priamo na účet salónu, preto musí byť Stripe účet **vedený na Paradise** (ich IČO a ich bankový účet).

1. **Účet.** Ak Paradise už má aktivovaný Stripe účet pre rezervačný systém, použite ten istý. Inak:
   dashboard.stripe.com/register → krajina Slovensko → typ podnikania (živnosť alebo s. r. o.) → IČO, sídlo,
   údaje a doklad totožnosti zodpovednej osoby → web a popis predaja („darčekové poukážky na služby salónu“) →
   IBAN na výplaty → dvojfaktorové prihlásenie. Overenie trvá zvyčajne minúty až pár dní.
2. **Prístup pre WebPoint.** Settings → Team → pozvať Andreja (rola Developer), aby vedel vytvoriť kľúče a webhook.
3. **Vzhľad a e-maily.** Settings → Branding (logo, farba, verejný názov „Paradise Martin“).
   Settings → Customer emails → zapnúť **Successful payments** (zákazník dostane potvrdenie o platbe od Stripe).
4. **Platobné metódy.** Settings → Payment methods → Karty, Apple Pay a Google Pay nechať zapnuté.
   Pri hostovanom Stripe Checkoute sa Apple Pay a Google Pay ukážu samy, doménu netreba overovať.
5. **Test.** Prepnúť Stripe do testovacieho režimu, do `.env` dať `sk_test_...`, vytvoriť testovací webhook (bod 6)
   a spraviť nákup kartou `4242 4242 4242 4242` (ľubovoľný budúci dátum, CVC `123`).
6. **Webhook.** Developers → Webhooks → Add endpoint (destination):
   - URL `https://<doména>/api/stripe-webhook`
   - udalosti `checkout.session.completed` a `checkout.session.async_payment_succeeded`
   - Signing secret `whsec_...` vložiť do `STRIPE_WEBHOOK_SECRET`
   - Testovací a ostrý režim majú **každý vlastný** webhook aj secret.
7. **Ostrý režim.** Developers → API keys → Secret key `sk_live_...` do `STRIPE_SECRET_KEY` vo Verceli,
   ostrý `whsec_...` do `STRIPE_WEBHOOK_SECRET`, **Redeploy**. Potom jeden skutočný nákup najlacnejšej poukážky
   a v Stripe ho vrátiť (Refund).

Kontrola po teste: ďakovacia stránka ukazuje sumu, príde e-mail s PDF, v Stripe → Payments má platba
metadáta `fulfilled=1` a `voucher_codes`, v Events Manageri je Purchase z prehliadača aj servera ako Deduplikované.

## Faktúry a doklady

**Zákazník** dostane dve veci: e-mail od nás s PDF poukážkou a (ak je zapnuté v Stripe) potvrdenie o platbe od Stripe.
Potvrdenie o platbe **nie je faktúra**. Faktúru Stripe sám od seba pri jednorazovej platbe nevystaví.

Ak má každý zákazník dostať faktúru, sú dve cesty:
- **Stripe ju vystaví sám:** v `src/app/api/checkout/route.ts` sa do `sessions.create` pridá
  `invoice_creation: { enabled: true }`. Stripe potom ku každej platbe vytvorí zaplatenú faktúru v PDF a pošle ju zákazníkovi.
  V Stripe treba nastaviť údaje predajcu (Settings → Invoices: IČO, DIČ, číslovanie). Stripe si za to účtuje malý poplatok z faktúry.
- **Vystaví ju salón:** z e-mailu „Nový predaj“ alebo z exportu platieb v Stripe, vo svojom fakturačnom programe. Na firemné nákupy na požiadanie.

Ktorá cesta je správna, **musí povedať účtovníčka Paradise**. Rozhoduje, či je salón platiteľ DPH, ako účtuje poukážky
(jednoúčelový alebo viacúčelový poukaz, teda či sa DPH rieši pri predaji alebo až pri čerpaní) a aký doklad vyžaduje.

**Salón** dostáva od Stripe:
- **Výplaty** na bankový účet (Balances → Payouts). Prvá výplata býva o 7 až 14 dní, potom priebežne po pár pracovných dňoch.
  Na účet príde suma **po odpočítaní poplatkov** Stripe.
- **Prehľady pre účtovníctvo** (Reports → Balance / Payout reconciliation, export do CSV): každá platba, poplatok a výplata.
- **Mesačnú faktúru za poplatky** Stripe (Settings → Documents → Tax invoices). Vystavuje ju Stripe z Írska,
  ako s ňou naložiť z pohľadu DPH (registrácia podľa § 7a) nech posúdi účtovníčka.

Poplatok Stripe je pri kartách z EÚ okolo 1,5 % + 0,25 € za platbu, presný cenník je na stripe.com/sk/pricing.

**WebPoint** si odmenu z tržieb fakturuje salónu sám. Stripe peniaze nedelí, všetko ide salónu.
Podklad je Stripe → Payments (filter podľa metadát `app=paradise-darceky`) alebo NocoDB.

## Čo treba pripraviť

| Čo | Kde | Do premennej |
| --- | --- | --- |
| Stripe účet na Paradise | dashboard.stripe.com | `STRIPE_SECRET_KEY` |
| Webhook endpoint | Stripe → Developers → Webhooks | `STRIPE_WEBHOOK_SECRET` |
| Pixel ID (pixel Paradise) | Events Manager | `NEXT_PUBLIC_META_PIXEL_ID` |
| Conversions API token | Events Manager → pixel → Nastavenia → Conversions API | `META_CAPI_ACCESS_TOKEN` |
| Brevo API kľúč + overený odosielateľ | Brevo → SMTP & API | `BREVO_API_KEY`, `EMAIL_FROM` |
| E-mail salónu na upozornenia | Paradise | `SALON_NOTIFY_EMAIL` |
| Náhodný tajný kľúč pre kódy | `openssl rand -hex 32` | `VOUCHER_SECRET` |
| Platnosť poukážok | Paradise | `VOUCHER_VALID_UNTIL` |
| Subdoména | DNS | — |

Všetky premenné sú popísané v `.env.example`.

## Nasadenie na Vercel

1. Nahrajte projekt do **vlastného** súkromného GitHub repozitára (nie do repozitára Relaxu).
2. Vercel → **Add New Project** → importujte repozitár. Framework sa rozpozná sám (Next.js).
3. **Settings → Environment Variables:** vložte všetky premenné z `.env.example`. `SITE_URL` = finálna adresa bez lomky.
4. **Deploy**, potom **Settings → Domains** a pripojiť doménu alebo subdoménu.
5. Stripe webhook podľa kapitoly vyššie a **Redeploy**.

> `NEXT_PUBLIC_META_PIXEL_ID` sa vkladá pri builde. Po jeho zmene treba vždy spraviť Redeploy.

## Black Friday (23. – 29. 11. 2026)

Samostatná podstránka **`/black-friday`** (reklamu smerujte priamo sem). Používa tú istú platbu, webhook, PDF poukážky a meranie ako vianočné darčeky.

| Balík | Obsah | Pôvodne | Cena |
| --- | --- | --- | --- |
| Paradise Body Shape BASIC | 1× EMShape 40 min, 1× INFRAShape 30 min, 1× lymfodrenáž 30 min | 75 € | 55 € |
| Paradise Body Shape PREMIUM | 5× každé | 300 € | 179 € |
| Paradise Body Shape VIP | 10× každé | 580 € | 290 € |

- Termín je v `src/lib/products.ts` (`blackFridayWindow`), texty a farby v `src/lib/config.ts` (`blackFriday`), téma zlato-čierna (`.bf--gold`).
- Pred začiatkom stránka ukazuje odpočet a „Predaj od 23. 11.“, po skončení „Akcia skončila“ s odkazom na vianočné poukážky.
  Server mimo termínu platbu nevytvorí, aj keby niekto mal starú stránku otvorenú.
- Platnosť Black Friday poukážok: `BF_VALID_UNTIL` (inak platí `VOUCHER_VALID_UNTIL`). Treba potvrdiť s Paradise.
- V e-maile, PDF a na ďakovacej stránke je text pre kupujúceho („Black Friday poukážka“, „termín si dohodnete“), nie pre obdarovaného.
- Lokálne sa dá akcia otvoriť aj mimo termínu cez `SALE_PREVIEW=1` v `.env.local`. **Nikdy to nedávajte do Vercelu.**
- Prečiarknuté ceny: pri oznámení zľavy musí byť ako pôvodná uvedená najnižšia cena za posledných 30 dní (pravidlá Omnibus).
  Overte, že 75 / 300 / 580 € tomu zodpovedá.

## Lokálny vývoj

```bash
npm install
cp .env.example .env.local      # doplňte testovacie kľúče
npm run dev                     # http://localhost:3000
stripe listen --forward-to localhost:3000/api/stripe-webhook   # webhooky lokálne (Stripe CLI)
npm run selftest                # kontrola Conversions API payloadu, kódov a PDF (vytvorí test-poukazka.pdf)
```

## Čo potvrdiť s Paradise pred spustením

- **Platnosť poukážok** (zatiaľ predvolene 31. 3. 2027) a či „Zimná žiara“ naozaj nemá časové obmedzenie.
- Prevádzkovateľ: obchodné meno, sídlo, IČO, DIČ (`src/lib/config.ts`, všetko s **DOPLNIŤ**).
- Ako sa poukážka uplatňuje: zatiaľ „termín na čísle +421 907 565 190 a kód poukážky“. Ak má ísť cez online rezervácie, doplniť odkaz.
- Obchodné podmienky a ochrana osobných údajov sú **návrhy**, musí ich skontrolovať účtovníčka alebo právnik.
- Recenzie a hodnotenie na stránke nie sú (nemáme overené údaje). Ak ich Paradise dodá, sekcia sa dá doplniť.

## Štruktúra

```
src/app/page.tsx                    stránka s darčekmi
src/app/dakujeme/page.tsx           ďakovacia stránka + Purchase z Pixelu
src/app/api/checkout/route.ts       vytvorenie Stripe platby + InitiateCheckout cez CAPI
src/app/api/stripe-webhook/route.ts webhook → fulfillment
src/lib/fulfillment.ts              Purchase cez CAPI, PDF, e-maily, n8n
src/lib/meta-capi.ts                Conversions API (hashovanie, payload, odoslanie)
src/lib/voucher.ts                  kódy a PDF poukážky
src/lib/products.ts                 katalóg darčekov
src/lib/config.ts                   údaje salónu
src/components/Decor.tsx            vianočné ozdoby (SVG)
src/components/MetaPixel.tsx        Pixel po súhlase
src/components/ConsentBanner.tsx    cookie lišta
```
