// src/components/CartSidebar.js
"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import CartItem from "@/components/CartItem";

export default function CartSidebar() {
  const { items, isOpen, toggleCart, getTotalPrice, getCartCount } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Shporta ({getCartCount()} artikuj)
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
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
              <p className="mt-4 text-gray-600">Shporta është bosh</p>
              <Link
                href="/shop"
                onClick={toggleCart}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Fillo shopping-un →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>

            {/* Free Shipping Info */}
            <div className="text-sm text-gray-600">
              {getTotalPrice() >= 100 ? (
                <p className="text-green-600">✓ Transporti falas!</p>
              ) : (
                <p>
                  Transporti falas për poros mbi $100. Mbeten{" "}
                  <span className="font-medium">
                    ${(100 - getTotalPrice()).toFixed(2)}
                  </span>
                </p>
              )}
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-center block"
            >
              Procedo në Checkout
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={toggleCart}
              className="w-full text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Vazhdo me shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
