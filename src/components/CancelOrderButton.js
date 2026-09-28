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
          className="rounded-full bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Duke anuluar..." : "Po, anulo porosinë"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="rounded-full border border-sand px-4 py-2 font-medium text-ink transition hover:bg-sand/60"
        >
          Jo, mbaje
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded-full bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
    >
      Anulo Porosinë
    </button>
  );
}
