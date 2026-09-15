// src/app/(shop)/checkout/page.js
"use client";

import { useState, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/orderActions";
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

  // Ref për të marrë të dhënat e formës nga jashtë
  const [shippingData, setShippingData] = useState(null);
  const [formValid, setFormValid] = useState(false);

  const shippingPrice = getTotalPrice() >= 100 ? 0 : 5;
  const taxPrice = getTotalPrice() * 0.15;
  const totalPrice = getTotalPrice() + shippingPrice + taxPrice;

  // Kjo thirret nga CheckoutForm çdo herë që ndryshon një fushë
  const handleFormChange = (formData, isValid) => {
    setShippingData(formData);
    setFormValid(isValid);
  };

  // Kjo është funksioni final që bën submit të GJITHË porosisë
  const handlePlaceOrder = async () => {
    setError("");

    // 1. Kontrollo shportën
    if (items.length === 0) {
      setError("Shporta është bosh");
      return;
    }

    // 2. Kontrollo user-in
    if (!session?.user) {
      setError("Duhet të jesh i kyçur për të bërë porosi");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    // 3. Kontrollo formën e shipping
    if (!shippingData || !formValid) {
      setError("Ju lutem plotëso të gjitha të dhënat e dërgesës (fushat me *)");
      // Scroll lart te forma
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      // 4. Kontrollo stock
      const { validateStock } = useCartStore.getState();
      const stockValidation = validateStock();

      if (!stockValidation.isValid) {
        setError(
          "Disa produkte nuk kanë stock të mjaftueshëm. Ju lutem përditësoni shportën.",
        );
        setLoading(false);
        return;
      }

      // 5. Krijo porosinë
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
        {/* Header */}
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
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Form (pa <form> tag e vet, vetëm inputs) */}
            <CheckoutForm
              onFormChange={handleFormChange}
              user={session?.user}
            />

            {/* Payment Method */}
            <PaymentMethod
              selectedMethod={paymentMethod}
              onChange={setPaymentMethod}
            />

            {/* ✅ SUBMIT BUTTON KËTU */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={getTotalPrice()}
              shipping={shippingPrice}
              tax={taxPrice}
              total={totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
