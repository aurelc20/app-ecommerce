// src/components/admin/UserFilters.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function UserFilters({ search, role }) {
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
      router.push(`/admin/users?${params.toString()}`);
    },
    [router, searchParams],
  );

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
          placeholder="Kërko me emër ose email..."
          defaultValue={search}
          onKeyDown={handleSearchKeyDown}
          className="flex-1 min-w-50 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />

        <select
          defaultValue={role}
          onChange={(e) => updateParam("role", e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Të gjithë rolet</option>
          <option value="customer">Klient</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
        </select>
      </div>
    </div>
  );
}
