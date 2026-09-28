// src/app/(shop)/checkout/page.js (update)
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder } from "@/actions/orderActions";
import { getPublicSettings } from "@/actions/settingsActions";
import { useSession } from "next-auth/react";
import { AlertTriangle, Loader2, LogIn, ShoppingBag } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethod from "@/components/checkout/PaymentMethod";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingData, setShippingData] = useState(null);
  const [formValid, setFormValid] = useState(false);

  // ✅ Settings dinamike nga DB
  const [settings, setSettings] = useState({
    freeShippingThreshold: 100,
    standardShippingFee: 5,
    taxRate: 0.15,
    paymentMethods: {},
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    getPublicSettings().then((data) => {
      setSettings(data);
      setSettingsLoading(false);

      // Nëse dyqani është në maintenance, redirect
      if (data.maintenanceMode) {
        setError(
          data.maintenanceMessage || "Dyqani është aktualisht në mirëmbajtje",
        );
      }
    });
  }, []);

  const shippingPrice =
    getTotalPrice() >= settings.freeShippingThreshold
      ? 0
      : settings.standardShippingFee;
  const taxPrice = getTotalPrice() * settings.taxRate;
  const totalPrice = getTotalPrice() + shippingPrice + taxPrice;

  const handleFormChange = (formData, isValid) => {
    setShippingData(formData);
    setFormValid(isValid);
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (settings.maintenanceMode) {
      setError(
        settings.maintenanceMessage || "Dyqani është aktualisht në mirëmbajtje",
      );
      return;
    }

    if (items.length === 0) {
      setError("Shporta është bosh");
      return;
    }

    if (!session?.user) {
      setError("Duhet të jesh i kyçur për të bërë porosi");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (!shippingData || !formValid) {
      setError("Ju lutem plotëso të gjitha të dhënat e dërgesës (fushat me *)");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const { validateStock } = useCartStore.getState();
      const stockValidation = validateStock();

      if (!stockValidation.isValid) {
        setError(
          "Disa produkte nuk kanë stock të mjaftueshëm. Ju lutem përditësoni shportën.",
        );
        setLoading(false);
        return;
      }

      const orderData = {
        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingData.fullName,
          street: shippingData.address,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country || "AL",
          phone: shippingData.phone,
        },
        paymentMethod,
        notes: shippingData.notes,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        clearCart();
        router.push(`/checkout/success?orderId=${result.order._id}`);
      } else {
        setError(result.error || "Ndodhi një gabim gjatë krijimit të porosisë");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Ndodhi një gabim. Provo sërish.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
      </div>
    );
  }

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
            <ShoppingBag className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
            Shporta është bosh
          </h1>
          <p className="mt-2 text-ink-soft">
            Shto produkte për të vazhduar me checkout
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="mt-6 rounded-full bg-wood px-6 py-3 font-medium text-white transition hover:bg-wood-dark"
          >
            Shiko produktet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Checkout
          </h1>
          <p className="mt-2 text-ink-soft">
            Plotëso të dhënat për të dërguar porositë
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 font-medium text-red-600">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CheckoutForm
              onFormChange={handleFormChange}
              user={session?.user}
            />

            {/* ✅ Payment Method tani me settings dinamike */}
            <PaymentMethod
              selectedMethod={paymentMethod}
              onChange={setPaymentMethod}
              paymentMethodsConfig={settings.paymentMethods}
            />

            <div className="rounded-2xl border border-sand bg-paper p-6">
              {sessionStatus === "authenticated" ? (
                <>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || settings.maintenanceMode}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-wood py-4 text-lg font-semibold text-white transition hover:bg-wood-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Duke procesuar...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "cod"
                          ? "Konfirmo Porosinë (COD)"
                          : "Konfirmo Porosinë"}
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs text-ink-soft">
                    Duke klikuar &quot;Konfirmo Porosinë&quot;, pranon{" "}
                    <a href="/terms" className="text-wood hover:underline">
                      Termat dhe Kushtet
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href="/login?callbackUrl=/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-wood py-4 text-lg font-semibold text-white transition hover:bg-wood-dark"
                  >
                    <LogIn className="h-5 w-5" />
                    Hyr ose Regjistrohu
                  </Link>

                  <p className="mt-3 text-center text-xs text-ink-soft">
                    Duhet të kyçesh për të përfunduar porosinë
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={getTotalPrice()}
              shipping={shippingPrice}
              tax={taxPrice}
              total={totalPrice}
              freeShippingThreshold={settings.freeShippingThreshold}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
