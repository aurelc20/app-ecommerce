// src/app/(shop)/cart/page.js
"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import CartItem from "@/components/CartItem";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getPublicSettings } from "@/actions/settingsActions";
import { ArrowRight, Loader2, LogIn, ShoppingCart, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

export default function CartPage() {
  const { items, getTotalPrice, clearCart, getCartCount } = useCartStore();
  const { status: sessionStatus } = useSession();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // ✅ Settings dinamike nga DB
  const [settings, setSettings] = useState({
    freeShippingThreshold: 100,
    standardShippingFee: 5,
    taxRate: 0.15,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    getPublicSettings().then((data) => {
      setSettings(data);
      setSettingsLoading(false);
    });
  }, []);

  const shippingPrice =
    getTotalPrice() >= settings.freeShippingThreshold
      ? 0
      : settings.standardShippingFee;
  const taxPrice = getTotalPrice() * settings.taxRate;
  const totalPrice = getTotalPrice() + shippingPrice + taxPrice;

  if (settingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand/70 text-wood">
            <ShoppingCart className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Shporta është bosh
          </h1>
          <p className="mt-2 text-ink-soft">
            Shto produkte për të filluar shopping-un
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-wood px-6 py-3 font-medium text-white transition hover:bg-wood-dark"
          >
            Shiko produktet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 font-display text-3xl font-semibold text-ink">
          Shporta Ime ({getCartCount()} artikuj)
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-wood-dark"
            >
              <Trash2 className="h-4 w-4" />
              Zbraz shportën
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
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
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-ink-soft">
                  <span>Transporti:</span>
                  <span
                    className={
                      shippingPrice === 0 ? "font-medium text-green-700" : ""
                    }
                  >
                    {shippingPrice === 0
                      ? "Falas"
                      : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-ink-soft">
                  <span>Tatimi ({(settings.taxRate * 100).toFixed(0)}%):</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t border-sand pt-3 text-lg font-semibold">
                  <span className="text-ink">Total:</span>
                  <span className="text-wood">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {getTotalPrice() < settings.freeShippingThreshold && (
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-sand">
                    <div
                      className="h-2 rounded-full bg-wood transition-all"
                      style={{
                        width: `${(getTotalPrice() / settings.freeShippingThreshold) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-ink-soft">
                    Mbeten $
                    {(settings.freeShippingThreshold - getTotalPrice()).toFixed(
                      2,
                    )}{" "}
                    për transport falas
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              {sessionStatus === "authenticated" ? (
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-medium text-white transition hover:bg-wood-dark"
                >
                  Procedo në Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/login?callbackUrl=/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-medium text-white transition hover:bg-wood-dark"
                >
                  <LogIn className="h-4 w-4" />
                  Hyr ose Regjistrohu
                </Link>
              )}

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="mt-3 block w-full text-center text-sm font-medium text-wood hover:text-wood-dark"
              >
                Vazhdo me shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Zbraz shportën?"
        description="Je i sigurt që dëshiron ta zbrazësh shportën? Ky veprim nuk mund të kthehet mbrapsht."
        confirmLabel="Zbraze"
        cancelLabel="Anulo"
        onConfirm={() => {
          clearCart();
          setIsClearModalOpen(false);
        }}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
