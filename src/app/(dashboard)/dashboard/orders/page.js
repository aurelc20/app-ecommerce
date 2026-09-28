// src/app/(dashboard)/dashboard/orders/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/actions/orderActions";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function OrdersPage({ searchParams }) {
  const session = await auth();
  const { page, status } = await searchParams;
  if (!session?.user) {
    redirect("/login");
  }

  const newPage = parseInt(page) || 1;
  const newStatus = status || "";

  const { orders, totalPages } = await getUserOrders({
    page: newPage,
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
        <h1 className="font-display text-3xl font-semibold text-ink">
          Porositë e Mia
        </h1>
        <p className="mt-2 text-ink-soft">
          Historiku i porosive dhe statusi i tyre
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-sand bg-paper p-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Link
              key={filter.value}
              href={`/dashboard/orders${filter.value ? `?status=${filter.value}` : ""}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                status === filter.value
                  ? "bg-wood text-white"
                  : "bg-sand/60 text-ink hover:bg-sand"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="rounded-2xl border border-sand bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Statusi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-ink-soft uppercase">
                    Artikuj
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
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {order.items.length} artikuj
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-ink">
                      ${order.totalPrice.toFixed(2)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-sand px-6 py-4">
              <p className="text-sm text-ink-soft">
                Faqja {page} nga {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/dashboard/orders?page=${page - 1}${status ? `&status=${status}` : ""}`}
                    className="rounded-lg border border-sand px-4 py-2 text-sm text-ink hover:bg-sand/60"
                  >
                    Prapa
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/dashboard/orders?page=${page + 1}${status ? `&status=${status}` : ""}`}
                    className="rounded-lg border border-sand px-4 py-2 text-sm text-ink hover:bg-sand/60"
                  >
                    Para
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-sand bg-paper p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-ink-soft/50" strokeWidth={1.5} />
          <h3 className="mt-2 text-sm font-medium text-ink">Nuk ka porosi</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {status
              ? `Nuk ka porosi me status "${status}"`
              : "Nuk ke bërë ende asnjë porosi"}
          </p>
          {!status && (
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full bg-wood px-5 py-2.5 text-sm font-medium text-white transition hover:bg-wood-dark"
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
