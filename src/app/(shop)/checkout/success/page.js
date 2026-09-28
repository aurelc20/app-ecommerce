// src/app/(shop)/checkout/success/page.js
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/actions/orderActions";

const NEXT_STEPS = [
  "Do të marrësh një email konfirmimi",
  "Do të të kontaktojmë për të konfirmuar dërgesën",
  "Paguaj kur të marrësh produktin (COD)",
];

export default async function CheckoutSuccessPage({ searchParams }) {
  const { orderId } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    const callbackUrl = orderId
      ? `/checkout/success?orderId=${orderId}`
      : "/checkout/success";
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const order = orderId ? await getOrderById(orderId) : null;

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
        {order && (
          <p className="mb-6 text-ink-soft">
            Numri i porosisë:{" "}
            <span className="font-mono font-bold text-wood">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </p>
        )}

        {/* Order Summary */}
        {order && (
          <div className="mb-6 rounded-2xl border border-sand bg-paper p-6 text-left">
            <h2 className="mb-4 font-display font-semibold text-ink">
              Përmbledhja e porosisë
            </h2>
            <ul className="space-y-3">
              {order.items.map((item) => {
                // Prefero foton aktuale te produktit (ne rast se u ndryshua
                // pas porosise); bie mbrapa te foto e ruajtur ne porosi nese
                // produkti eshte fshire ose nuk ka imazhe.
                const currentImage =
                  item.product?.images?.find((img) => img.isPrimary) ||
                  item.product?.images?.[0];
                const imageUrl = currentImage?.url || item.image;

                return (
                <li
                  key={item.product?._id || item.name}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand/60">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-between border-t border-sand pt-4 text-lg font-semibold">
              <span className="text-ink">Total:</span>
              <span className="text-wood">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
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
