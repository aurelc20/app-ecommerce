// src/app/(admin)/admin/orders/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Porositë</h1>
          <p className="text-gray-600 mt-2">Menaxho porositë e klientëve</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
          color="purple"
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
      {/* <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Kërko me emër, email, telefon..."
            defaultValue={search}
            onBlur={(e) => {
              const url = new URL(window.location);
              if (e.target.value) {
                url.searchParams.set("search", e.target.value);
              } else {
                url.searchParams.delete("search");
              }
              url.searchParams.delete("page");
              window.location.href = url.toString();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const url = new URL(window.location);
                url.searchParams.set("search", e.target.value);
                url.searchParams.delete("page");
                window.location.href = url.toString();
              }
            }}
            className="flex-1 min-w-50 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />

          <select
            defaultValue={status}
            onChange={(e) => {
              const url = new URL(window.location);
              if (e.target.value) {
                url.searchParams.set("status", e.target.value);
              } else {
                url.searchParams.delete("status");
              }
              url.searchParams.delete("page");
              window.location.href = url.toString();
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Të gjitha statuset</option>
            <option value="pending">Në pritje</option>
            <option value="processing">Në përpunim</option>
            <option value="shipped">Dërguar</option>
            <option value="out_for_delivery">Në rrugë</option>
            <option value="delivered">Dorëzuar</option>
            <option value="cancelled">Anuluar</option>
          </select>

          <select
            defaultValue={paymentMethod}
            onChange={(e) => {
              const url = new URL(window.location);
              if (e.target.value) {
                url.searchParams.set("paymentMethod", e.target.value);
              } else {
                url.searchParams.delete("paymentMethod");
              }
              url.searchParams.delete("page");
              window.location.href = url.toString();
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Të gjitha pagesat</option>
            <option value="cod">Cash on Delivery</option>
            <option value="bank">Transfer Bankar</option>
          </select>
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Klienti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Totali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pagesa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plainOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-purple-600">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress?.fullName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.shippingAddress?.phone || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
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
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.paymentMethod === "cod"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.paymentMethod === "cod" ? "COD" : "Bank"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("sq-AL")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/orders/${order._id}`}
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
        {total > limit && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Shfaqur {skip + 1}-{Math.min(skip + limit, total)} nga {total}
            </p>
            <div className="flex gap-2">
              {parseInt(page) > 1 && (
                <Link
                  href={`/admin/orders?page=${parseInt(page) - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  ← Prapa
                </Link>
              )}
              {skip + limit < total && (
                <Link
                  href={`/admin/orders?page=${parseInt(page) + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
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
      ? "bg-gray-100 border-gray-300"
      : "bg-white border-gray-200 hover:bg-gray-50",
    yellow: active
      ? "bg-yellow-100 border-yellow-300"
      : "bg-white border-gray-200 hover:bg-yellow-50",
    blue: active
      ? "bg-blue-100 border-blue-300"
      : "bg-white border-gray-200 hover:bg-blue-50",
    purple: active
      ? "bg-purple-100 border-purple-300"
      : "bg-white border-gray-200 hover:bg-purple-50",
    green: active
      ? "bg-green-100 border-green-300"
      : "bg-white border-gray-200 hover:bg-green-50",
  };

  return (
    <Link
      href={href}
      className={`p-4 rounded-lg border transition ${colors[color]}`}
    >
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </Link>
  );
}
