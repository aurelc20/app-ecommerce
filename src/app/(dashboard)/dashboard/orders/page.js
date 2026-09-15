// src/app/(dashboard)/dashboard/orders/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/actions/orderActions";
import Link from "next/link";

export default async function OrdersPage({ searchParams }) {
  const session = await auth();
  const { page, status } = await searchParams;
  if (!session?.user) {
    redirect("/login");
  }

  const newPage = parseInt(page) || 1;
  const newStatus = status || "";

  const { orders, totalPages } = await getUserOrders(session.user.id, {
    newPage,
    limit: 10,
    status: newStatus || undefined,
  });

  const statusFilters = [
    { value: "", label: "Të gjitha" },
    { value: "pending", label: "Në pritje" },
    { value: "processing", label: "Në përpunim" },
    { value: "shipped", label: "Dërguar" },
    { value: "delivered", label: "Dorëzuar" },
    { value: "cancelled", label: "Anuluar" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Porositë e Mia</h1>
        <p className="text-gray-600 mt-2">
          Historiku i porosive dhe statusi i tyre
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Link
              key={filter.value}
              href={`/dashboard/orders${filter.value ? `?status=${filter.value}` : ""}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                status === filter.value
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statusi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artikuj
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
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === "pending" && "Në pritje"}
                        {order.status === "processing" && "Në përpunim"}
                        {order.status === "shipped" && "Dërguar"}
                        {order.status === "delivered" && "Dorëzuar"}
                        {order.status === "cancelled" && "Anuluar"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.length} artikuj
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Faqja {page} nga {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/dashboard/orders?page=${page - 1}${status ? `&status=${status}` : ""}`}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Prapa
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/dashboard/orders?page=${page + 1}${status ? `&status=${status}` : ""}`}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Para
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nuk ka porosi
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {status
              ? `Nuk ka porosi me status "${status}"`
              : "Nuk ke bërë ende asnjë porosi"}
          </p>
          {!status && (
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Fillo shopping-un
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
