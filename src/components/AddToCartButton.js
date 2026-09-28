// src/components/AddToCartButton.js
"use client";

import { useState } from "react";
import { Check, TriangleAlert, X } from "lucide-react";
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
      setMessage("out-of-stock");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    const existingItem = useCartStore
      .getState()
      .items.find((item) => item.productId === product._id);
    const currentQuantity = existingItem?.quantity || 0;

    if (currentQuantity >= product.stock) {
      setMessage("max-stock");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    addItem(product, 1);
    setMessage("success");
    setTimeout(() => setMessage(""), 2000);
    setTimeout(() => toggleCart(), 300);
  };

  return (
    <div className={className}>
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`w-full rounded-full py-3 font-semibold transition ${
          disabled
            ? "cursor-not-allowed bg-sand text-ink-soft"
            : "bg-wood text-white hover:bg-wood-dark"
        }`}
      >
        Shto në Shportë
      </button>

      {message && (
        <p
          className={`mt-2 flex items-center justify-center gap-1.5 text-sm ${
            message === "success"
              ? "text-green-700"
              : message === "max-stock"
                ? "text-wood-dark"
                : "text-ink-soft"
          }`}
        >
          {message === "success" && (
            <>
              <Check className="h-4 w-4" />
              U shtua në shportë!
            </>
          )}
          {message === "out-of-stock" && (
            <>
              <X className="h-4 w-4" />
              Nuk ka në stock
            </>
          )}
          {message === "max-stock" && (
            <>
              <TriangleAlert className="h-4 w-4" />
              Ke arritur sasinë maksimale në stock ({product.stock})
            </>
          )}
        </p>
      )}
    </div>
  );
}
