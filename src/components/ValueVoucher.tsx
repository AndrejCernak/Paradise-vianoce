"use client";

import { useState } from "react";
import BuyButton from "./BuyButton";
import TrackView from "./TrackView";
import { GiftIcon, Snowflake } from "./Decor";
import type { Product } from "@/lib/products";
import { formatEur } from "@/lib/products";

/** Hodnotová poukážka s výberom sumy 30 / 50 / 100 €. Bonus sa mení podľa vybranej sumy. */
export default function ValueVoucher({ options }: { options: Product[] }) {
  const [selected, setSelected] = useState(options[1] ?? options[0]);
  return (
    <TrackView
      productId={selected.id}
      productName={selected.name}
      priceCents={selected.priceCents}
      className="voucher"
      data-reveal="up"
    >
      <span className="voucher__sheen" aria-hidden="true" />
      <Snowflake className="voucher__flake" />
      <div className="voucher__body">
        <p className="voucher__flag">Keď neviete, čo vybrať</p>
        <h4 className="voucher__name">Hodnotová poukážka</h4>
        <span className="voucher__rule" aria-hidden="true" />
        <p className="voucher__includes-single">Platí na všetky služby v Paradise.</p>
        <fieldset className="amounts">
          <legend className="sr-only">Hodnota poukážky</legend>
          {options.map((o) => (
            <label key={o.id} className={`amount ${o.id === selected.id ? "is-on" : ""}`}>
              <input type="radio" name="value-voucher" value={o.id} checked={o.id === selected.id} onChange={() => setSelected(o)} />
              {formatEur(o.priceCents)}
            </label>
          ))}
        </fieldset>
        {selected.bonus && (
          <p key={selected.id} className="voucher__bonus pop">
            <GiftIcon />
            <span>Bonus zadarmo: {selected.bonus}</span>
          </p>
        )}
      </div>
      <div className="voucher__stub">
        <p className="voucher__pricebox">
          <span className="voucher__price-label">Hodnota</span>
          <span key={selected.id} className="voucher__price pop">
            {formatEur(selected.priceCents)}
          </span>
        </p>
        <BuyButton
          productId={selected.id}
          productName={selected.name}
          priceCents={selected.priceCents}
          label={`Kúpiť za ${formatEur(selected.priceCents)}`}
        />
      </div>
    </TrackView>
  );
}
