// src/components/admin/OrderStatusSelect.js
"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/admin/orderActions";

export default function OrderStatusSelect({ orderId, currentStatus }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);

    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      setStatus(newStatus);
    } else {
      alert(result.error || "Ndodhi një gabim");
      setStatus(currentStatus); // Revert
    }

    setLoading(false);
  };

  const statusLabels = {
    pending: "Në pritje",
    processing: "Në përpunim",
    shipped: "Dërguar",
    out_for_delivery: "Në rrugë",
    delivered: "Dorëzuar",
    cancelled: "Anuluar",
    refunded: "Rimbursuar",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer ${
        statusColors[status] || statusColors.pending
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
