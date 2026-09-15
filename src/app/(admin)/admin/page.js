// src/app/(admin)/admin/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import Review from "@/models/Review";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  await dbConnect();

  // Fetch stats
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalReviews,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    recentReviews,
  ] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Review.countDocuments(),
    Order.countDocuments({ status: { $in: ["pending", "processing"] } }),
    Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email"),
    Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("product", "name"),
  ]);

  // Calculate revenue
  const revenueData = await Order.aggregate([
    { $match: { isPaid: true, status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Përmbledhja e e-commerce</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Produkte"
          value={totalProducts}
          icon="📦"
          color="purple"
          href="/admin/products"
        />
        <StatCard
          title="Total Porosi"
          value={totalOrders}
          icon="🛒"
          color="blue"
          href="/admin/orders"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="💰"
          color="green"
          href="/admin/orders"
        />
        <StatCard
          title="Total Përdorues"
          value={totalUsers}
          icon="👥"
          color="pink"
          href="/admin/users"
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AlertCard
          title="Porosi në Pritje"
          value={pendingOrders}
          description="Kërkojnë vëmendje të menjëhershme"
          icon="⏳"
          color="yellow"
          href="/admin/orders?status=pending"
        />
        <AlertCard
          title="Stock i Ulët"
          value={lowStockProducts}
          description="Produkte me stock ≤ 5"
          icon="⚠️"
          color="red"
          href="/admin/products?stock=low"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Porositë e Fundit</h2>
          <Link
            href="/admin/orders"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Shiko të gjitha →
          </Link>
        </div>

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
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-purple-600">
                    #{order._id.toString().slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium">{order.user?.name || "N/A"}</p>
                      <p className="text-xs text-gray-500">
                        {order.user?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Reviews e Fundit</h2>
          <Link
            href="/admin/reviews"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Shiko të gjitha →
          </Link>
        </div>

        <div className="divide-y divide-gray-200">
          {recentReviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {review.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">
                    Produkti:{" "}
                    <span className="text-purple-600">
                      {review.product?.name}
                    </span>{" "}
                    • Nga:{" "}
                    <span className="text-purple-600">{review.user?.name}</span>
                  </p>
                </div>
                <Link
                  href={`/admin/reviews?product=${review.product?._id}`}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Shiko →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color, href }) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    pink: "bg-pink-100 text-pink-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </Link>
  );
}

function AlertCard({ title, value, description, icon, color, href }) {
  const colorClasses = {
    yellow: "border-yellow-500 bg-yellow-50",
    red: "border-red-500 bg-red-50",
  };

  return (
    <Link
      href={href}
      className={`p-6 rounded-xl border-l-4 ${colorClasses[color]} hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    pending: "Në pritje",
    processing: "Në përpunim",
    shipped: "Dërguar",
    out_for_delivery: "Në rrugë",
    delivered: "Dorëzuar",
    cancelled: "Anuluar",
    refunded: "Rimbursuar",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
