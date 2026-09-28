// src/app/(dashboard)/dashboard/layout.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/actions/authActions";
import DashboardNav from "@/components/dashboard/DashboardNav";
import {
  Armchair,
  Heart,
  LayoutDashboard,
  ListCheck,
  LocationEditIcon,
  User2,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    exact: true,
  },
  {
    href: "/dashboard/orders",
    label: "Porositë",
    icon: <ListCheck className="h-5 w-5" />,
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
    exact: true,
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
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = await getUserById();

  const displayName = user?.name || session.user.name || "Përdorues";
  const email = user?.email || session.user.email || "";
  const avatar = user?.avatar || user?.image || session.user.avatar || null;

  return (
    <div className="min-h-dvh bg-cream text-ink">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 top-16 left-0 z-30 hidden w-72 border-r border-sand bg-paper lg:flex lg:flex-col">
        <div className="border-b border-sand px-6 py-6">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand/70 text-wood">
              <Armchair className="h-5 w-5" strokeWidth={1.75} />
            </span>

            <span>
              <span className="block font-display text-xl font-semibold tracking-tight text-ink">
                Furniture Shop
              </span>
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
                Dashboard
              </span>
            </span>
          </Link>
        </div>

        <div className="px-4 pt-6">
          <div className="flex items-center gap-3 rounded-2xl border border-sand bg-cream p-3">
            <UserAvatar
              src={avatar}
              name={displayName}
              size={44}
              className="text-lg"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {displayName}
              </p>
              <p className="truncate text-xs text-ink-soft">{email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
            Menuja
          </p>

          <DashboardNav items={navigation} variant="sidebar" />
        </nav>
      </aside>

      {/* Mobile header and navigation */}
      <div className="border-b border-sand bg-paper lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand/70 text-wood">
              <Armchair className="h-5 w-5" strokeWidth={1.75} />
            </span>

            <span>
              <span className="block font-display text-lg font-semibold leading-none text-ink">
                Furniture Shop
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Dashboard
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <UserAvatar src={avatar} name={displayName} size={36} />
          </div>
        </div>

        <nav className="overflow-x-auto border-t border-sand px-4 py-3 sm:px-6">
          <DashboardNav items={navigation} variant="mobile" />
        </nav>
      </div>

      {/* Main content */}
      <div className="min-h-dvh lg:pl-72">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
