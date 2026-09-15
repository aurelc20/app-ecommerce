// src/components/admin/DeleteProductButton.js
"use client";

import { useState } from "react";
import { deleteProduct } from "@/actions/admin/productActions";

export default function DeleteProductButton({ productId, productName }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteProduct(productId);
    window.location.reload();
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          {loading ? "Duke fshirë..." : "Konfirmo"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-600 hover:text-gray-700 text-sm"
        >
          Anulo
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 font-medium text-sm"
    >
      Fshi
    </button>
  );
}
