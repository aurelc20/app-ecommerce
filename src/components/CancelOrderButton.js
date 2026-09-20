// src/components/CancelOrderButton.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/actions/orderActions";

export default function CancelOrderButton({ orderId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setLoading(true);

    const result = await cancelOrder(orderId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Ndodhi një gabim");
    }

    setLoading(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Duke anuluar..." : "Po, anulo porosinë"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Jo, mbaje
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
    >
      Anulo Porosinë
    </button>
  );
}
