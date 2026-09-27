// src/components/ShopSortDropdown.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const OPTIONS = [
  { value: "newest", label: "Më të rejat" },
  { value: "price-low", label: "Çmimi: Ngritës" },
  { value: "price-high", label: "Çmimi: Zbritës" },
  { value: "rating", label: "Rating" },
  { value: "name-asc", label: "Emri: A-Z" },
  { value: "name-desc", label: "Emri: Z-A" },
];

export default function ShopSortDropdown({ defaultValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected =
    OPTIONS.find((option) => option.value === defaultValue) || OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = useCallback(
    (value) => {
      setIsOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortBy", value);
      params.set("page", "1"); // reset page when sorting changes
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id="sortBy"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-sand bg-paper py-2 pl-3 pr-2.5 text-sm text-ink outline-none transition hover:border-wood/50 focus:border-wood focus:ring-2 focus:ring-wood/20"
      >
        {selected.label}
        <ChevronDown
          className={`h-4 w-4 text-wood transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-sand bg-paper py-1.5 shadow-xl shadow-ink/10"
        >
          {OPTIONS.map((option) => {
            const isSelected = option.value === selected.value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-sand/60 ${
                    isSelected ? "font-medium text-wood" : "text-ink"
                  }`}
                >
                  {option.label}
                  {isSelected && (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
