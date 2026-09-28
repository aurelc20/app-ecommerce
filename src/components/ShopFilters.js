// src/components/ShopFilters.js
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { categoryLabel } from "@/lib/categories";

function FilterCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-4 w-4 shrink-0 appearance-none rounded border border-ink bg-cream transition checked:border-wood checked:bg-wood focus:outline-none focus:ring-2 focus:ring-wood/30 focus:ring-offset-1"
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
        />
      </span>
      <span className="text-sm text-ink-soft">{label}</span>
    </label>
  );
}

export default function ShopFilters({
  categories,
  brands,
  stats,
  currentFilters,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || "",
    max: currentFilters.maxPrice || "",
  });

  const handleFilterChange = (key, value) => {
    setIsMobileOpen(false);

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
    setIsMobileOpen(false);
    handleFilterChange("minPrice", priceRange.min);
    handleFilterChange("maxPrice", priceRange.max);
  };

  const handleClearFilters = () => {
    setIsMobileOpen(false);
    router.push("/shop");
  };

  const activeFilterCount = [
    currentFilters.category,
    currentFilters.brand,
    currentFilters.search,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    currentFilters.isFeatured,
    currentFilters.isOnSale,
  ].filter(Boolean).length;

  const filterFields = (
    <>
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-2">Kërko</label>
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
          className="w-full rounded-lg border border-wood bg-cream px-3 py-2 text-ink outline-none transition focus:border-wood focus:ring-2 focus:ring-wood/20"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-ink mb-3">Kategoritë</h3>
        <div className="space-y-2">
          <FilterCheckbox
            checked={currentFilters.category === ""}
            onChange={() => handleFilterChange("category", "")}
            label="Të gjitha"
          />
          {categories.map((category) => (
            <FilterCheckbox
              key={category}
              checked={currentFilters.category === category}
              onChange={() => handleFilterChange("category", category)}
              label={categoryLabel(category)}
            />
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-ink mb-3">Brand</h3>
          <div className="space-y-2">
            <FilterCheckbox
              checked={currentFilters.brand === ""}
              onChange={() => handleFilterChange("brand", "")}
              label="Të gjitha"
            />
            {brands.map((brand) => (
              <FilterCheckbox
                key={brand}
                checked={currentFilters.brand === brand}
                onChange={() => handleFilterChange("brand", brand)}
                label={brand}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-ink mb-3">Çmimi</h3>
        <form onSubmit={handlePriceSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              className="w-full rounded-lg border border-wood bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-wood focus:ring-2 focus:ring-wood/20"
            />
            <span className="text-ink-soft">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              className="w-full rounded-lg border border-wood bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-wood focus:ring-2 focus:ring-wood/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-wood py-2 text-sm text-white transition hover:bg-wood-dark cursor-pointer"
          >
            Apliko
          </button>
        </form>
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        <FilterCheckbox
          checked={currentFilters.isFeatured}
          onChange={(e) => handleFilterChange("featured", e.target.checked)}
          label="Të preferuarat ⭐"
        />
        <FilterCheckbox
          checked={currentFilters.isOnSale}
          onChange={(e) => handleFilterChange("sale", e.target.checked)}
          label="Në zbritje 🔥"
        />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="mb-6 flex w-full items-center justify-between rounded-full border border-sand bg-cream px-5 py-3 text-sm font-medium text-ink lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-wood" />
          Filtera
        </span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wood text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-24 rounded-2xl border border-sand bg-cream p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-medium text-ink">Filtera</h2>
          <button
            onClick={handleClearFilters}
            className="text-sm text-wood hover:text-wood-dark"
          >
            Clear all
          </button>
        </div>
        {filterFields}
      </div>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-paper shadow-2xl lg:hidden">
            <div className="flex items-center justify-between border-b border-sand p-4">
              <h2 className="font-display text-lg font-medium text-ink">
                Filtera
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-wood hover:text-wood-dark"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-full p-1.5 text-ink-soft transition hover:bg-sand/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterFields}</div>
          </div>
        </>
      )}
    </>
  );
}
