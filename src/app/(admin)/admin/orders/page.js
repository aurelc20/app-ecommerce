// src/app/(admin)/admin/orders/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderFilters from "@/components/admin/OrderFilters";

export default async function OrdersPage({ searchParams }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const {
    page = "1",
    status = "",
    search = "",
    paymentMethod = "",
  } = await searchParams;

  await dbConnect();

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  if (search) {
    query.$or = [
      { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      { "shippingAddress.email": { $regex: search, $options: "i" } },
      { "shippingAddress.phone": { $regex: search, $options: "i" } },
    ];
  }

  const limit = 20;
  const skip = (parseInt(page) - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .lean(),
    Order.countDocuments(query),
  ]);
  // Problemi është se order._id është ObjectId i Mongoose, jo string, prandaj .slice() nuk funksionon.
  //serializo të gjithë array-n në plain objects. Konverto të gjitha ObjectId në string
  const plainOrders = JSON.parse(JSON.stringify(orders));

  const statusCounts = await Promise.all([
    Order.countDocuments({ status: "pending" }),
    Order.countDocuments({ status: "processing" }),
    Order.countDocuments({ status: "shipped" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Porositë
          </h1>
          <p className="mt-2 text-ink-soft">Menaxho porositë e klientëve</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard
          label="Të gjitha"
          value={total}
          href="/admin/orders"
          active={!status}
        />
        <StatCard
          label="Në pritje"
          value={statusCounts[0]}
          href="/admin/orders?status=pending"
          active={status === "pending"}
          color="yellow"
        />
        <StatCard
          label="Në përpunim"
          value={statusCounts[1]}
          href="/admin/orders?status=processing"
          active={status === "processing"}
          color="blue"
        />
        <StatCard
          label="Dërguar"
          value={statusCounts[2]}
          href="/admin/orders?status=shipped"
          active={status === "shipped"}
          color="wood"
        />
        <StatCard
          label="Dorëzuar"
          value={statusCounts[3]}
          href="/admin/orders?status=delivered"
          active={status === "delivered"}
          color="green"
        />
      </div>

      {/* Filters */}
      <OrderFilters
        search={search}
        status={status}
        paymentMethod={paymentMethod}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-sand bg-paper shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Klienti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Totali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Pagesa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink-soft uppercase">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {plainOrders.map((order) => (
                <tr key={order._id} className="hover:bg-sand/20">
                  <td className="px-6 py-4 text-sm font-medium text-wood">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium text-ink">
                        {order.shippingAddress?.fullName || "N/A"}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {order.shippingAddress?.phone || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-ink">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <OrderStatusSelect
                      orderId={order._id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        order.paymentMethod === "cod"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.paymentMethod === "cod" ? "COD" : "Bank"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-soft">
                    {new Date(order.createdAt).toLocaleDateString("sq-AL")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/orders/${order._id}`}
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
        {total > limit && (
          <div className="flex items-center justify-between border-t border-sand px-6 py-4">
            <p className="text-sm text-ink-soft">
              Shfaqur {skip + 1}-{Math.min(skip + limit, total)} nga {total}
            </p>
            <div className="flex gap-2">
              {parseInt(page) > 1 && (
                <Link
                  href={`/admin/orders?page=${parseInt(page) - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-lg border border-sand px-4 py-2 text-sm hover:bg-sand/40"
                >
                  ← Prapa
                </Link>
              )}
              {skip + limit < total && (
                <Link
                  href={`/admin/orders?page=${parseInt(page) + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className="rounded-lg border border-sand px-4 py-2 text-sm hover:bg-sand/40"
                >
                  Para →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, href, active, color = "gray" }) {
  const colors = {
    gray: active
      ? "bg-sand border-sand"
      : "bg-paper border-sand hover:bg-sand/30",
    yellow: active
      ? "bg-yellow-100 border-yellow-300"
      : "bg-paper border-sand hover:bg-yellow-50",
    blue: active
      ? "bg-blue-100 border-blue-300"
      : "bg-paper border-sand hover:bg-blue-50",
    wood: active
      ? "bg-wood/15 border-wood/40"
      : "bg-paper border-sand hover:bg-wood/10",
    green: active
      ? "bg-green-100 border-green-300"
      : "bg-paper border-sand hover:bg-green-50",
  };

  return (
    <Link
      href={href}
      className={`p-4 rounded-lg border transition ${colors[color]}`}
    >
      <p className="mb-1 text-sm text-ink-soft">{label}</p>
      <p className="text-2xl font-bold text-ink">{value}</p>
    </Link>
  );
}
