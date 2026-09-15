// src/app/(dashboard)/dashboard/layout.js

// src/app/(dashboard)/dashboard/layout.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/actions/authActions";
import DashboardNav from "@/components/dashboard/DashboardNav";
import {
  Heart,
  LayoutDashboard,
  LocationEditIcon,
  ShoppingBasket,
  User2,
} from "lucide-react";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/dashboard/orders",
    label: "Porositë",
    icon: <ShoppingBasket className="h-5 w-5" />,
  },
  {
    href: "/dashboard/wishlist",
    label: "Wishlist",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    href: "/dashboard/profile",
    label: "Profili",
    icon: <User2 className="h-5 w-5" />,
  },
  {
    href: "/dashboard/profile/addresses",
    label: "Adresat",
    icon: <LocationEditIcon className="h-5 w-5" />,
  },
];

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);

  const displayName = user?.name || session.user.name || "Përdorues";
  const email = user?.email || session.user.email || "";
  const avatar = user?.avatar || user?.image || session.user.avatar || null;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 top-16 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 px-6 py-6">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-200 text-lg font-bold text-white shadow-sm">
              C
            </span>

            <span>
              <span className="block text-xl font-bold tracking-tight text-slate-900">
                Company Name
              </span>
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Dashboard
              </span>
            </span>
          </Link>
        </div>

        <div className="px-4 pt-6">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-200 font-bold text-white">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Menuja
          </p>

          <DashboardNav items={navigation} variant="sidebar" />
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-300 p-4">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-indigo-500 bg-gray-200 transition hover:bg-indigo-600 -50 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 group-hover:bg-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              Dil nga llogaria
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile header and navigation */}
      <div className="border-b border-slate-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-pink-500 font-bold text-white">
              P
            </span>

            <span>
              <span className="block text-lg font-bold leading-none">
                Perlë
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Dashboard
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-9 w-9 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                {initials}
              </div>
            )}
          </div>
        </div>

        <nav className="overflow-x-auto border-t border-slate-100 px-4 py-3 sm:px-6">
          <DashboardNav items={navigation} variant="mobile" />
        </nav>
      </div>

      {/* Main content */}
      <main className="min-h-dvh lg:pl-72">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
