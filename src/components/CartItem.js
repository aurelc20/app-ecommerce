// src/components/CartItem.js
"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    updateQuantity(item.productId, item.quantity - 1);
  };

  const handleRemove = () => {
    if (confirm("Je i sigurt që dëshiron ta heqësh këtë produkt?")) {
      removeItem(item.productId);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Image */}
      <div className="relative w-20 h-20 shrink-0 bg-gray-100 rounded">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.stock}
            className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="text-xs text-red-600 mt-1">
            Maksimumi i arritur ({item.stock} në stock)
          </p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="text-red-600 hover:text-red-700 p-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
