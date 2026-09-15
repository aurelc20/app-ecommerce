// src/components/admin/UserRoleSelect.js
"use client";

import { useState } from "react";
import { updateUserRole } from "@/actions/admin/userActions";

export default function UserRoleSelect({ userId, currentRole, disabled }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(currentRole);

  const handleChange = async (e) => {
    const newRole = e.target.value;

    if (
      !confirm(`Je i sigurt që dëshiron ta ndryshosh rolin në "${newRole}"?`)
    ) {
      return;
    }

    setLoading(true);

    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      setRole(newRole);
    } else {
      alert(result.error || "Ndodhi një gabim");
    }

    setLoading(false);
  };

  const roleColors = {
    customer: "bg-blue-100 text-blue-800",
    admin: "bg-purple-100 text-purple-800",
    seller: "bg-green-100 text-green-800",
  };

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={disabled || loading}
      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer ${
        roleColors[role]
      } ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <option value="customer">Klient</option>
      <option value="seller">Seller</option>
      <option value="admin">Admin</option>
    </select>
  );
}
