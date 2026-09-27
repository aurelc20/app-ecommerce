// src/app/(shop)/checkout/success/page.js
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";

const NEXT_STEPS = [
  "Do të marrësh një email konfirmimi",
  "Do të të kontaktojmë për të konfirmuar dërgesën",
  "Paguaj kur të marrësh produktin (COD)",
];

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        {/* Title */}
        <h1 className="mb-4 font-display text-3xl font-semibold text-ink">
          Faleminderit për porositë!
        </h1>

        {/* Order Number */}
        {orderId && (
          <p className="mb-6 text-ink-soft">
            Numri i porosisë:{" "}
            <span className="font-mono font-bold text-wood">
              #{orderId.slice(-8).toUpperCase()}
            </span>
          </p>
        )}

        {/* Message */}
        <div className="mb-6 rounded-2xl border border-sand bg-paper p-6 text-left">
          <h2 className="mb-3 font-display font-semibold text-ink">
            Hapat e ardhshëm:
          </h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            {NEXT_STEPS.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-wood" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-wood px-6 py-3 font-medium text-white transition hover:bg-wood-dark"
          >
            Shiko Porositë e Mia
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="font-medium text-wood hover:text-wood-dark"
          >
            Vazhdo me shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
