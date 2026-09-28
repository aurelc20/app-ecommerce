"use client";

import {
  Armchair,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldUser,
  ShoppingBasket,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const avatar = user?.avatar || user?.image || null;

  // Zustand's persisted cart only knows the real count after hydrating from
  // localStorage on the client, so we wait for mount to avoid a server/client
  // markup mismatch (SSR always sees an empty cart).
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  const cartCount = useCartStore((state) => state.getCartCount());
  const displayCartCount = hasMounted ? cartCount : 0;

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-sand/80 bg-cream/90 text-ink backdrop-blur supports-backdrop-blur:bg-cream/70">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight text-ink"
        >
          <Armchair className="h-6 w-6 text-wood" strokeWidth={1.75} />
          Furniture Shop
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/shop"
            className="text-ink-soft transition duration-200 hover:text-wood"
          >
            Produktet
          </Link>
          <Link
            href="/about"
            className="text-ink-soft transition duration-200 hover:text-wood"
          >
            Rreth Nesh
          </Link>
          <Link
            href="/contact"
            className="text-ink-soft transition duration-200 hover:text-wood"
          >
            Kontakt
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-ink-soft transition duration-200 hover:text-wood"
          >
            <ShoppingBasket className="h-5 w-5" />
            {displayCartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-wood text-[10px] font-medium text-white">
                {displayCartCount > 9 ? "9+" : displayCartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 transition duration-200 cursor-pointer"
              >
                <UserAvatar src={avatar} name={user.name} />
              </button>
              <div
                className="invisible pointer-events-none absolute right-0 top-full w-56 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100
              group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100"
              >
                <div className="overflow-hidden rounded-xl border border-sand bg-paper text-ink shadow-xl shadow-ink/5">
                  <div className="flex flex-col gap-0.5 border-b border-sand px-4 py-3 text-sm">
                    <span className="font-medium">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="text-ink-soft">{user.email}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-ink transition duration-200 hover:bg-sand/60"
                  >
                    <LayoutDashboard className="w-5 h-5 text-wood" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-ink transition duration-200 hover:bg-sand/60"
                  >
                    <User className="w-5 h-5 text-wood" />
                    <span>Profili</span>
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-ink transition duration-200 hover:bg-sand/60"
                  >
                    <Package className="w-5 h-5 text-wood" />
                    <span>Porositë</span>
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-ink transition duration-200 hover:bg-sand/60"
                    >
                      <ShieldUser className="w-5 h-5 text-wood" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="w-full flex items-center gap-2 border-t border-sand px-4 py-3 text-sm text-ink hover:bg-sand/60 transition duration-200 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Dil</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft transition hover:text-wood"
            >
              Hyr
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
