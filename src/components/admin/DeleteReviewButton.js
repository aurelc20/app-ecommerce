// src/components/admin/DeleteReviewButton.js
"use client";

import { useState } from "react";
import { deleteReviewAdmin } from "@/actions/admin/reviewActions";
import { useRouter } from "next/navigation";

export default function DeleteReviewButton({ reviewId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteReviewAdmin(reviewId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Ndodhi një gabim");
    }

    setLoading(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-700 text-xs font-medium"
        >
          {loading ? "..." : "Konfirmo"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-600 text-xs"
        >
          Anulo
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 p-1"
      title="Fshi review"
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
