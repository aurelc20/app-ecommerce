// src/components/RemoveFromWishlistButton.js
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
      className="text-ink-soft hover:text-wood-dark p-2 rounded-full hover:bg-sand/60 transition disabled:opacity-50"
      title="Hiq nga wishlist"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
