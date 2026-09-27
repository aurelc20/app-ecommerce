// src/components/CartItem.js
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    updateQuantity(item.productId, item.quantity - 1);
  };

  return (
    <div className="flex gap-4 rounded-xl border border-sand bg-paper p-4">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sand/60">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-ink">{item.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">${item.price.toFixed(2)}</p>

        {/* Quantity Controls */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand text-ink transition hover:bg-sand/60"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium text-ink">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={item.quantity >= item.stock}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand text-ink transition hover:bg-sand/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.stock && (
          <p className="mt-1 text-xs text-red-600">
            Maksimumi i arritur ({item.stock} në stock)
          </p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => setIsRemoveModalOpen(true)}
        className="h-fit rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
        title="Hiq nga shporta"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <ConfirmModal
        isOpen={isRemoveModalOpen}
        title="Hiq produktin?"
        description={`Je i sigurt që dëshiron ta heqësh "${item.name}" nga shporta?`}
        confirmLabel="Hiqe"
        cancelLabel="Anulo"
        onConfirm={() => {
          removeItem(item.productId);
          setIsRemoveModalOpen(false);
        }}
        onCancel={() => setIsRemoveModalOpen(false)}
      />
    </div>
  );
}
