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
    <div className="mb-6 rounded-xl border border-sand bg-paper p-4 shadow-sm">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Kërko me emër ose email..."
          defaultValue={search}
          onKeyDown={handleSearchKeyDown}
          className="min-w-50 flex-1 rounded-lg border border-sand px-4 py-2 text-ink transition focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
        />

        <select
          defaultValue={role}
          onChange={(e) => updateParam("role", e.target.value)}
          className="rounded-lg border border-sand px-4 py-2 text-ink transition focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
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
