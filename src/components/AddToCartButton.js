// src/components/AddToCartButton.js
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({
  product,
  disabled = false,
  className = "",
}) {
  const [message, setMessage] = useState("");
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      setMessage("❌ Nuk ka në stock");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    addItem(product, 1);
    setMessage("✅ U shtua në shportë!");
    setTimeout(() => setMessage(""), 2000);
    setTimeout(() => toggleCart(), 300);
  };

  return (
    <div className={className}>
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        Shto në Shportë
      </button>

      {message && (
        <p
          className={`mt-2 text-sm text-center ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
