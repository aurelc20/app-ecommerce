// src/app/(shop)/cart/page.js
"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import CartItem from "@/components/CartItem";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPublicSettings } from "@/actions/settingsActions";

export default function CartPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Shporta është bosh
          </h1>
          <p className="mt-2 text-gray-600">
            Shto produkte për të filluar shopping-un
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Shiko produktet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shporta Ime</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm("Je i sigurt që dëshiron ta zbrazësh shportën?")) {
                  clearCart();
                }
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Zbraz shportën
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Përmbledhja e Porosisë</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="rounded object-cover"
                        />
                      )}
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Transporti:</span>
                  <span
                    className={
                      shippingPrice === 0 ? "text-green-600 font-medium" : ""
                    }
                  >
                    {shippingPrice === 0
                      ? "Falas"
                      : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tatimi ({(settings.taxRate * 100).toFixed(0)}%):</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {getTotalPrice() < settings.freeShippingThreshold && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(getTotalPrice() / settings.freeShippingThreshold) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Mbeten $
                    {(settings.freeShippingThreshold - getTotalPrice()).toFixed(
                      2,
                    )}{" "}
                    për transport falas
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-center block"
              >
                Procedo në Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="mt-3 w-full text-purple-600 hover:text-purple-700 font-medium text-sm text-center block"
              >
                Vazhdo me shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
