// src/app/(shop)/checkout/page.js (update)
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/orderActions";
import { getPublicSettings } from "@/actions/settingsActions";
import { useSession } from "next-auth/react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethod from "@/components/checkout/PaymentMethod";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Shporta është bosh
          </h1>
          <p className="text-gray-600 mb-6">
            Shto produkte për të vazhduar me checkout
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Shiko produktet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Plotëso të dhënat për të dërguar porositë
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg font-medium">
            ⚠️ {error}
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

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <button
                onClick={handlePlaceOrder}
                disabled={loading || settings.maintenanceMode}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Duke procesuar...
                  </>
                ) : (
                  <>
                    {paymentMethod === "cod"
                      ? "🛍️ Konfirmo Porosinë (COD)"
                      : "🏦 Konfirmo Porosinë"}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Duke klikuar "Konfirmo Porosinë", pranon{" "}
                <a href="/terms" className="text-purple-600 hover:underline">
                  Termat dhe Kushtet
                </a>
              </p>
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
