// src/components/checkout/OrderSummary.js
"use client";

import Image from "next/image";

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
}) {
  return (
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
                  className="object-cover rounded"
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
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Transporti:</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? "Falas" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tatimi (15%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-purple-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(subtotal / 100) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Mbeten ${(100 - subtotal).toFixed(2)} për transport falas
          </p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Garanci kthimi 30 ditë</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Dërgesë në 2-5 ditë punë</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Produkte origjinale</span>
        </div>
      </div>
    </div>
  );
}
