// src/components/ShopSortDropdown.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ShopSortDropdown({ defaultValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortBy", value);
      params.set("page", "1"); // reset page when sorting changes
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <select
      id="sortBy"
      defaultValue={defaultValue}
      onChange={handleChange}
      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
    >
      <option value="newest">Më të rejat</option>
      <option value="price-low">Çmimi: Ngritës</option>
      <option value="price-high">Çmimi: Zbritës</option>
      <option value="rating">Rating</option>
      <option value="name-asc">Emri: A-Z</option>
      <option value="name-desc">Emri: Z-A</option>
    </select>
  );
}
