// src/app/(shop)/cart/page.js
"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import CartItem from "@/components/CartItem";

export default function CartPage() {
  const { items, getTotalPrice, getCartCount, clearCart } = useCartStore();

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shporta Ime ({getCartCount()} artikuj)
        </h1>

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

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Transporti:</span>
                  <span
                    className={getTotalPrice() >= 100 ? "text-green-600" : ""}
                  >
                    {getTotalPrice() >= 100 ? "Falas" : "$5.00"}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tatimi (15%):</span>
                  <span>${(getTotalPrice() * 0.15).toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    $
                    {(
                      getTotalPrice() +
                      (getTotalPrice() >= 100 ? 0 : 5) +
                      getTotalPrice() * 0.15
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {getTotalPrice() < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(getTotalPrice() / 100) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Mbeten ${(100 - getTotalPrice()).toFixed(2)} për transport
                    falas
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
