"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import UserAvatar from "./UserAvatar";
import { ShoppingBasket } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const avatar = user?.avatar || user?.image || null;

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white text-black shadow-md">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Ecommerce
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/shop" className="transition hover:text-indigo-600">
            Shop
          </Link>
          <Link href="/about" className="transition hover:text-indigo-600">
            Rreth Nesh
          </Link>
          <Link href="/contact" className="transition hover:text-indigo-600">
            Kontakt
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label="Shporta"
            className="relative transition hover:text-indigo-600"
          >
            <ShoppingBasket />
          </Link>

          {user ? (
            <div className="group relative">
              <button
                type="button"
                aria-label="Hap menunë e përdoruesit"
                className="flex items-center gap-2 transition hover:text-purple-600"
              >
                <UserAvatar src={avatar} name={user.name} />
                <span className="hidden md:block">
                  {user.name || user.email}
                </span>
              </button>

              <div
                className="
                  invisible pointer-events-none absolute right-0 top-full w-48
                  pt-2 opacity-0 transition
                  group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100
                  group-focus-within:visible group-focus-within:pointer-events-auto
                  group-focus-within:opacity-100
                "
              >
                <div className="rounded-md bg-white py-1 text-black shadow-lg ring-1 ring-black/5">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profili
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Porositë
                  </Link>

                  {(user.role === "admin" || user.role === "seller") && (
                    <Link
                      href="/admin"
                      className="block border-t px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="w-full border-t px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Dil
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="transition hover:text-indigo-600">
              Hyr
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
