// src/app/(shop)/checkout/success/page.js
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Faleminderit për porositë!
        </h1>

        {/* Order Number */}
        {orderId && (
          <p className="text-gray-600 mb-6">
            Numri i porosisë:{" "}
            <span className="font-mono font-bold text-purple-600">
              #{orderId.slice(-8).toUpperCase()}
            </span>
          </p>
        )}

        {/* Message */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            Hapat e ardhshëm:
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Do të marrësh një email konfirmimi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Do të të kontaktojmë për të konfirmuar dërgesën</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Paguaj kur të marrësh produktin (COD)</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/orders"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Shiko Porositë e Mia
          </Link>
          <Link
            href="/shop"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Vazhdo me shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
