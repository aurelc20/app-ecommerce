// src/components/ShopFilters.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShopFilters({
  categories,
  brands,
  stats,
  currentFilters,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || "",
    max: currentFilters.maxPrice || "",
  });

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "" || value === false || value === null) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }

    // Reset page when filters change
    params.delete("page");

    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    handleFilterChange("minPrice", priceRange.min);
    handleFilterChange("maxPrice", priceRange.max);
  };

  const handleClearFilters = () => {
    router.push("/shop");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Filtera</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kërko
        </label>
        <input
          type="text"
          placeholder="Kërko produkte..."
          defaultValue={currentFilters.search}
          onBlur={(e) => handleFilterChange("search", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFilterChange("search", e.target.value);
            }
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Kategoritë</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.category === ""}
              onChange={() => handleFilterChange("category", "")}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Të gjitha</span>
          </label>
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={currentFilters.category === category}
                onChange={() => handleFilterChange("category", category)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Brand</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.brand === ""}
                onChange={() => handleFilterChange("brand", "")}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Të gjitha</span>
            </label>
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={currentFilters.brand === brand}
                  onChange={() => handleFilterChange("brand", brand)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Çmimi</h3>
        <form onSubmit={handlePriceSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition"
          >
            Apliko
          </button>
        </form>
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.isFeatured}
            onChange={(e) => handleFilterChange("featured", e.target.checked)}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">Të preferuarat ⭐</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.isOnSale}
            onChange={(e) => handleFilterChange("sale", e.target.checked)}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700">Në zbritje 🔥</span>
        </label>
      </div>
    </div>
  );
}
