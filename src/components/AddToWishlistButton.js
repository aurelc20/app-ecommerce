// src/components/AddToWishlistButton.js
"use client";

import { useState } from "react";
import { addToWishlist } from "@/actions/wishlistActions";

export default function AddToWishlistButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setLoading(true);

    const result = await addToWishlist(productId);

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading || added}
      className={`p-2 rounded-full transition ${
        added
          ? "bg-red-100 text-red-600"
          : "bg-white text-gray-600 hover:text-red-600 hover:bg-red-50"
      }`}
      title={added ? "Në wishlist" : "Shto në wishlist"}
    >
      <svg
        className="w-5 h-5"
        fill={added ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
