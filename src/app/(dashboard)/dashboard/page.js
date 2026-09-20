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
  ShoppingBasket,
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
        <h1 className="text-3xl font-bold text-gray-900">
          Mirësevini, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Këtu është përmbledhja e llogarisë tuaj
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Porosi</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <ShoppingBasket className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block"
          >
            Shiko të gjitha →
          </Link>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Shpenzuar</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(totalSpent ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BadgeDollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Në të gjitha porositë</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Në Pritje</p>
              <p className="text-3xl font-bold text-gray-900">
                {pendingOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Porosi që pritet të dërgohen
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wishlist</p>
              <p className="text-3xl font-bold text-gray-900">
                {user?.wishlist?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <Link
            href="/dashboard/wishlist"
            className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block"
          >
            Shiko wishlist →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Porositë e Fundit</h2>
          <Link
            href="/dashboard/orders"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Shiko të gjitha
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Porosisë
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statusi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Totali
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veprime
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-purple-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${(order.totalPrice ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
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
          <div className="p-12 text-center ">
            <CircleX className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nuk ka porosi
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fillo shopping-un për të bërë porosi të para.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Shiko produktet
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/shop"
          className="bg-linear-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold mb-2">Bëj Shopping 🛍️</h3>
          <p className="text-purple-100 text-sm">
            Zbuloni koleksionin tonë të ri
          </p>
        </Link>

        <Link
          href="/dashboard/wishlist"
          className="bg-linear-to-r from-red-500 to-pink-500 p-6 rounded-xl text-white hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold mb-2">Wishlist ❤️</h3>
          <p className="text-red-100 text-sm">Shiko produktet e preferuara</p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="bg-linear-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold mb-2">Përditëso Profilin 👤</h3>
          <p className="text-blue-100 text-sm">Menaxho të dhënat e tua</p>
        </Link>
      </div>
    </div>
  );
}
