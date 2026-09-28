// src/app/(dashboard)/dashboard/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/authActions";
import { getUserOrders, getUserOrderStats } from "@/actions/orderActions";
import Link from "next/link";
import {
  BadgeDollarSign,
  CircleX,
  Clock,
  Heart,
  ShoppingBag,
  ShoppingBasket,
  User2,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [user, { orders }, { totalOrders, totalSpent, pendingOrders }] =
    await Promise.all([
      getUserById(),
      getUserOrders({ limit: 5 }),
      getUserOrderStats(),
    ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Mirësevini, {user?.name}!
        </h1>
        <p className="mt-2 text-ink-soft">
          Këtu është përmbledhja e llogarisë tuaj
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <div className="rounded-2xl border border-sand bg-paper p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-ink-soft">Total Porosi</p>
              <p className="text-3xl font-semibold text-ink">{totalOrders}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/70 text-wood">
              <ShoppingBasket className="h-5 w-5" />
            </div>
          </div>
          <Link
            href="/dashboard/orders"
            className="mt-4 inline-block text-sm text-wood hover:text-wood-dark"
          >
            Shiko të gjitha →
          </Link>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl border border-sand bg-paper p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-ink-soft">Total Shpenzuar</p>
              <p className="text-3xl font-semibold text-ink">
                ${(totalSpent ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-emerald-600">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-soft">Në të gjitha porositë</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-2xl border border-sand bg-paper p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-ink-soft">Në Pritje</p>
              <p className="text-3xl font-semibold text-ink">
                {pendingOrders}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Porosi që pritet të dërgohen
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="rounded-2xl border border-sand bg-paper p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-ink-soft">Wishlist</p>
              <p className="text-3xl font-semibold text-ink">
                {user?.wishlist?.length || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <Link
            href="/dashboard/wishlist"
            className="mt-4 inline-block text-sm text-wood hover:text-wood-dark"
          >
            Shiko wishlist →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-8 rounded-2xl border border-sand bg-paper">
        <div className="flex items-center justify-between border-b border-sand p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            Porositë e Fundit
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-medium text-wood hover:text-wood-dark"
          >
            Shiko të gjitha
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    ID Porosisë
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Statusi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Totali
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Veprime
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-sand/20">
                    <td className="px-6 py-4 text-sm font-medium text-wood">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "shipped" ||
                                  order.status === "out_for_delivery"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === "pending" && "Në pritje"}
                        {order.status === "processing" && "Në përpunim"}
                        {order.status === "shipped" && "Dërguar"}
                        {order.status === "out_for_delivery" && "Në rrugë"}
                        {order.status === "delivered" && "Dorëzuar"}
                        {order.status === "cancelled" && "Anuluar"}
                        {order.status === "refunded" && "Rimbursuar"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-ink">
                      ${(order.totalPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="font-medium text-wood hover:text-wood-dark"
                      >
                        Detajet
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <CircleX className="mx-auto h-12 w-12 text-ink-soft/50" />
            <h3 className="mt-2 text-sm font-medium text-ink">
              Nuk ka porosi
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Fillo shopping-un për të bërë porosi të para.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full bg-wood px-5 py-2.5 text-sm font-medium text-white transition hover:bg-wood-dark"
              >
                Shiko produktet
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          href="/shop"
          className="rounded-2xl bg-wood p-6 text-white transition hover:shadow-lg"
        >
          <ShoppingBag className="mb-3 h-6 w-6" strokeWidth={1.75} />
          <h3 className="mb-2 font-display text-lg font-semibold">
            Bëj Shopping
          </h3>
          <p className="text-sm text-white/80">
            Zbuloni koleksionin tonë të ri
          </p>
        </Link>

        <Link
          href="/dashboard/wishlist"
          className="rounded-2xl bg-red-500 p-6 text-white transition hover:shadow-lg"
        >
          <Heart className="mb-3 h-6 w-6" strokeWidth={1.75} />
          <h3 className="mb-2 font-display text-lg font-semibold">
            Wishlist
          </h3>
          <p className="text-sm text-white/80">
            Shiko produktet e preferuara
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="rounded-2xl bg-ink p-6 text-white transition hover:shadow-lg"
        >
          <User2 className="mb-3 h-6 w-6" strokeWidth={1.75} />
          <h3 className="mb-2 font-display text-lg font-semibold">
            Përditëso Profilin
          </h3>
          <p className="text-sm text-white/70">Menaxho të dhënat e tua</p>
        </Link>
      </div>
    </div>
  );
}
