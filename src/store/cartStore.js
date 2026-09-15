// src/store/cartStore.js
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { syncCartToDatabase } from "@/actions/cartActions";

// Custom storage për localStorage (client-side vetëm)
const localStorageStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Add item to cart
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product._id,
          );

          if (existingItem) {
            // Update quantity
            return {
              items: state.items.map((item) =>
                item.productId === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          } else {
            // Add new item
            return {
              items: [
                ...state.items,
                {
                  productId: product._id,
                  name: product.name,
                  price: product.salePrice || product.price,
                  image: product.images?.[0]?.url,
                  quantity,
                  stock: product.stock,
                },
              ],
            };
          }
        });
      },

      // Remove item from cart
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Toggle cart sidebar
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Get cart total
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      // Get cart count
      getCartCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      // Validate stock
      validateStock: () => {
        const state = get();
        const invalidItems = [];

        state.items.forEach((item) => {
          if (item.quantity > item.stock) {
            invalidItems.push({
              ...item,
              availableStock: item.stock,
            });
          }
        });

        return {
          isValid: invalidItems.length === 0,
          invalidItems,
        };
      },

      // Sync to database
      syncToDatabase: async () => {
        const state = get();
        const result = await syncCartToDatabase(state.items);
        return result;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorageStorage),
      partialize: (state) => ({ items: state.items }), // Persist vetëm items
    },
  ),
);
