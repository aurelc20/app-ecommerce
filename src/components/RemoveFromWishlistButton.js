// src/components/RemoveFromWishlistButton.js
"use client";

import { useState } from "react";
import { removeFromWishlist } from "@/actions/wishlistActions";
import { useRouter } from "next/navigation";

export default function RemoveFromWishlistButton({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);

    const result = await removeFromWishlist(productId);

    if (result.success) {
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition disabled:opacity-50"
      title="Hiq nga wishlist"
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
  );
}
