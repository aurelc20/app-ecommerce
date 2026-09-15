// src/components/AddToCartButton.js
"use client";

import { useState } from "react";
import { addToCart } from "@/actions/cartActions";

export default function AddToCartButton({
  productId,
  disabled = false,
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setMessage("");

    const result = await addToCart(productId, 1);

    if (result.success) {
      setMessage("Produkti u shtua në shportë! ✓");
    } else {
      setMessage(result.error || "Gabim");
    }

    setLoading(false);
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Duke shtuar..." : "Shto në shportë"}
      </button>
      {message && (
        <p className="text-sm text-center mt-2 text-green-600">{message}</p>
      )}
    </div>
  );
}
