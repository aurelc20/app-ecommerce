// src/components/admin/OrderFilters.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function OrderFilters({ search, status, paymentMethod }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearchBlur = (e) => {
    updateParam("search", e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      updateParam("search", e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Kërko me emër, email, telefon..."
          defaultValue={search}
          onBlur={handleSearchBlur}
          onKeyDown={handleSearchKeyDown}
          className="flex-1 min-w-50 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />

        <select
          defaultValue={status}
          onChange={(e) => updateParam("status", e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Të gjitha statuset</option>
          <option value="pending">Në pritje</option>
          <option value="processing">Në përpunim</option>
          <option value="shipped">Dërguar</option>
          <option value="out_for_delivery">Në rrugë</option>
          <option value="delivered">Dorëzuar</option>
          <option value="cancelled">Anuluar</option>
        </select>

        <select
          defaultValue={paymentMethod}
          onChange={(e) => updateParam("paymentMethod", e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Të gjitha pagesat</option>
          <option value="cod">Cash on Delivery</option>
          <option value="bank">Transfer Bankar</option>
        </select>
      </div>
    </div>
  );
}
