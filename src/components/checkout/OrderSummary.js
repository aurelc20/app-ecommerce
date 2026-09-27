// src/components/checkout/OrderSummary.js
"use client";

import Image from "next/image";
import { Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Garanci kthimi 30 ditë" },
  { icon: Truck, label: "Dërgesë në 2-5 ditë punë" },
  { icon: Package, label: "Produkte origjinale" },
];

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
}) {
  return (
    <div className="sticky top-24 rounded-2xl border border-sand bg-paper p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink">
        Përmbledhja e Porosisë
      </h2>

      {/* Items */}
      <div className="mb-6 max-h-96 space-y-4 overflow-y-auto pt-2">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 rounded-lg bg-sand/60">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
              <span className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-wood text-xs text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium text-ink">
                {item.name}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="space-y-3 border-t border-sand pt-4">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-ink-soft">
          <span>Transporti:</span>
          <span className={shipping === 0 ? "font-medium text-green-700" : ""}>
            {shipping === 0 ? "Falas" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-ink-soft">
          <span>Tatimi (15%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t border-sand pt-3 text-lg font-semibold">
          <span className="text-ink">Total:</span>
          <span className="text-wood">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < 100 && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-sand">
            <div
              className="h-2 rounded-full bg-wood transition-all"
              style={{ width: `${(subtotal / 100) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-ink-soft">
            Mbeten ${(100 - subtotal).toFixed(2)} për transport falas
          </p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 space-y-3 border-t border-sand pt-6">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm text-ink-soft">
            <Icon className="h-5 w-5 text-wood" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
