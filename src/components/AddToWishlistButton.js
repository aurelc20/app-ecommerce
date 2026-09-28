// src/components/AddToWishlistButton.js
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { addToWishlist } from "@/actions/wishlistActions";

export default function AddToWishlistButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      className={`rounded-full p-2 shadow-sm transition disabled:cursor-not-allowed ${
        added
          ? "bg-wood/10 text-wood"
          : "bg-paper text-ink-soft hover:bg-wood/10 hover:text-wood"
      }`}
      title={added ? "Në wishlist" : "Shto në wishlist"}
    >
      <Heart className="h-5 w-5" fill={added ? "currentColor" : "none"} />
    </button>
  );
}
