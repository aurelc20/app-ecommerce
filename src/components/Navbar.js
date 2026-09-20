"use client";

import {
  LayoutDashboard,
  LogOut,
  Package,
  ShieldUser,
  ShoppingBasket,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const avatar = user?.avatar || user?.image || null;

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white text-black shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Ecommerce Store
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/shop"
            className="hover:text-indigo-600 transition duration-200"
          >
            Produktet
          </Link>
          <Link
            href="/about"
            className="hover:text-indigo-600 transition duration-200"
          >
            Rreth Nesh
          </Link>
          <Link
            href="/contact"
            className="hover:text-indigo-600 transition duration-200"
          >
            Kontakt
          </Link>
        </div>

        <div className="flex items-center gap-4 ">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 hover:text-indigo-600 transition duration-200"
          >
            <ShoppingBasket />
          </Link>

          {user ? (
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 hover:text-indigo-600 transition duration-200 cursor-pointer"
              >
                <UserAvatar src={avatar} name={user.name} />
                {/* <span>{user.name || user.email}</span> */}
              </button>
              <div
                className="invisible pointer-events-none absolute right-0 top-full w-52 pt-2 opacity-0 transition duration-100 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100
              group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100"
              >
                <div className="bg-white text-black shadow-lg right-1 ring-black/5 rounded-sm">
                  <div className="flex flex-col px-4 py-3 text-sm">
                    <span>{user.name.split(" ")[0]}</span>
                    <span>{user.email}</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-900 transition duration-200 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-900" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-900 transition duration-200 hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 text-gray-900" />
                    <span>Profili</span>
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-900 transition duration-200 hover:bg-gray-100"
                  >
                    <Package className="w-5 h-5 text-gray-900" />
                    <span>Porositë</span>
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-900 transition duration-200 hover:bg-gray-100"
                    >
                      <ShieldUser className="w-5 h-5 text-gray-900" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="w-full flex items-center gap-2 border-t border-gray-200 px-4 py-3 text-sm text-gray-900  hover:bg-gray-100 transition duration-200 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 " />
                    <span>Dil</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hover:text-indigo-600">
              Hyr
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
