// src/app/(admin)/admin/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import Review from "@/models/Review";
import Link from "next/link";
import {
  AlertTriangle,
  DollarSign,
  Hourglass,
  Package,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";

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
  // `isPaid` nuk vendoset kurrë true në asnjë hap të flow-it (as në krijim,
  // as në update-status), ndaj filtrimi me të e la revenue-n gjithmonë 0.
  // Analytics-i (src/actions/admin/analyticsActions.js) e llogarit tashmë
  // pa `isPaid`, vetëm duke përjashtuar porositë e anuluara — e njëjta
  // logjikë përdoret këtu për konsistencë.
  const revenueData = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalRevenue = revenueData[0]?.total || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Dashboard
        </h1>
        <p className="mt-2 text-ink-soft">Përmbledhja e e-commerce</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Produkte"
          value={totalProducts}
          icon={<Package className="h-6 w-6" />}
          color="wood"
          href="/admin/products"
        />
        <StatCard
          title="Total Porosi"
          value={totalOrders}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
          href="/admin/orders"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
          href="/admin/orders"
        />
        <StatCard
          title="Total Përdorues"
          value={totalUsers}
          icon={<Users className="h-6 w-6" />}
          color="pink"
          href="/admin/users"
        />
      </div>

      {/* Alerts */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <AlertCard
          title="Porosi në Pritje"
          value={pendingOrders}
          description="Kërkojnë vëmendje të menjëhershme"
          icon={<Hourglass className="h-7 w-7" />}
          color="yellow"
          href="/admin/orders?status=pending"
        />
        <AlertCard
          title="Stock i Ulët"
          value={lowStockProducts}
          description="Produkte me stock ≤ 5"
          icon={<AlertTriangle className="h-7 w-7" />}
          color="red"
          href="/admin/products?stock=low"
        />
      </div>

      {/* Recent Orders */}
      <div className="mb-8 rounded-xl border border-sand bg-paper shadow-sm">
        <div className="flex items-center justify-between border-b border-sand p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            Porositë e Fundit
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-wood hover:text-wood-dark"
          >
            Shiko të gjitha →
          </Link>
        </div>

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
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-sand/20">
                  <td className="px-6 py-4 text-sm font-medium text-wood">
                    #{order._id.toString().slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium text-ink">
                        {order.user?.name || "N/A"}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {order.user?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-ink">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-soft">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="rounded-xl border border-sand bg-paper shadow-sm">
        <div className="flex items-center justify-between border-b border-sand p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            Reviews e Fundit
          </h2>
          <Link
            href="/admin/reviews"
            className="text-sm font-medium text-wood hover:text-wood-dark"
          >
            Shiko të gjitha →
          </Link>
        </div>

        <div className="divide-y divide-sand">
          {recentReviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-sand/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="flex text-yellow-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="mb-1 font-semibold text-ink">
                    {review.title}
                  </h4>
                  <p className="mb-2 text-sm text-ink-soft">
                    {review.comment}
                  </p>
                  <p className="text-xs text-ink-soft">
                    Produkti:{" "}
                    <span className="text-wood">{review.product?.name}</span>{" "}
                    • Nga:{" "}
                    <span className="text-wood">{review.user?.name}</span>
                  </p>
                </div>
                <Link
                  href={`/admin/reviews?product=${review.product?._id}`}
                  className="text-sm font-medium text-wood hover:text-wood-dark"
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
    wood: "bg-wood/10 text-wood",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    pink: "bg-pink-100 text-pink-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Link
      href={href}
      className="rounded-xl border border-sand bg-paper p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm text-ink-soft">{title}</p>
          <p className="text-3xl font-bold text-ink">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]}`}
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

  const iconColorClasses = {
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <Link
      href={href}
      className={`rounded-xl border-l-4 p-6 transition hover:shadow-md ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-ink">{title}</p>
          <p className="mb-1 text-3xl font-bold text-ink">{value}</p>
          <p className="text-xs text-ink-soft">{description}</p>
        </div>
        <div className={iconColorClasses[color]}>{icon}</div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-wood/15 text-wood-dark",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-sand text-ink-soft",
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
      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
