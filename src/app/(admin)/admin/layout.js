// src/app/(admin)/admin/layout.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Armchair,
  BarChart3,
  LayoutDashboard,
  Package,
  Settings as SettingsIcon,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import DashboardNav from "@/components/dashboard/DashboardNav";

export const metadata = {
  title: "Admin Dashboard - Furniture Shop",
  description: "Admin panel për menaxhimin e e-commerce",
};

const navigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    exact: true,
  },
  {
    href: "/admin/analytics",
    label: "Statistikat",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    href: "/admin/products",
    label: "Produktet",
    icon: <Package className="h-5 w-5" />,
  },
  {
    href: "/admin/orders",
    label: "Porositë",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    href: "/admin/users",
    label: "Përdoruesit",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: <Star className="h-5 w-5" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
];

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-cream text-ink">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 top-16 left-0 z-30 hidden w-72 border-r border-sand bg-paper lg:flex lg:flex-col">
        <div className="border-b border-sand px-6 py-6">
          <Link href="/admin" className="group inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand/70 text-wood">
              <Armchair className="h-5 w-5" strokeWidth={1.75} />
            </span>

            <span>
              <span className="block font-display text-xl font-semibold tracking-tight text-ink">
                Furniture Shop
              </span>
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
                Admin Panel
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
            Menuja
          </p>

          <DashboardNav items={navigation} variant="sidebar" />
        </nav>

        <div className="border-t border-sand p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-wood transition hover:bg-sand/60 hover:text-wood-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Kthehu te Dashboard-i
          </Link>
        </div>
      </aside>

      {/* Mobile header and navigation */}
      <div className="border-b border-sand bg-paper lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand/70 text-wood">
              <Armchair className="h-5 w-5" strokeWidth={1.75} />
            </span>

            <span>
              <span className="block font-display text-lg font-semibold leading-none text-ink">
                Furniture Shop
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Admin Panel
              </span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-wood hover:text-wood-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        <nav className="overflow-x-auto border-t border-sand px-4 py-3 sm:px-6">
          <DashboardNav items={navigation} variant="mobile" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="min-h-dvh lg:pl-72">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
