// src/components/admin/ToggleUserStatusButton.js
"use client";

import { useState } from "react";
import { deleteUser } from "@/actions/admin/userActions";
import { useRouter } from "next/navigation";

export default function ToggleUserStatusButton({ userId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteUser(userId);

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
