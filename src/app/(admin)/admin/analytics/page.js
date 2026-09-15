// src/app/(admin)/admin/analytics/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/admin/analyticsActions";
import RevenueChart from "@/components/admin/analytics/RevenueChart";
import OrdersByStatusChart from "@/components/admin/analytics/OrdersByStatusChart";
import PaymentMethodsChart from "@/components/admin/analytics/PaymentMethodsChart";
import TopProducts from "@/components/admin/analytics/TopProducts";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-600">
          Ndodhi një gabim gjatë marrjes së statistikave
        </p>
      </div>
    );
  }

  // Llogarit % change
  const ordersChange =
    stats.ordersLast7Days > 0
      ? (
          ((stats.ordersLast30Days - stats.ordersLast7Days) /
            stats.ordersLast7Days) *
          100
        ).toFixed(1)
      : 0;

  const revenueChange =
    stats.revenueLast7Days > 0
      ? (
          ((stats.revenueLast30Days - stats.revenueLast7Days) /
            stats.revenueLast7Days) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Përmbledhja e performancës së dyqanit
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={`+${revenueChange}% (30d)`}
          trend="up"
          icon="💰"
          color="green"
        />
        <KpiCard
          title="Total Porosi"
          value={stats.totalOrders.toLocaleString()}
          change={`+${ordersChange}% (30d)`}
          trend="up"
          icon="🛒"
          color="purple"
        />
        <KpiCard
          title="Klientë"
          value={stats.totalCustomers.toLocaleString()}
          change={`+${stats.customersLast30Days} (30d)`}
          trend="up"
          icon="👥"
          color="blue"
        />
        <KpiCard
          title="Produkte Aktive"
          value={stats.totalProducts.toLocaleString()}
          change="Në stock"
          trend="neutral"
          icon="📦"
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">
            Revenue (30 Ditët e Fundit)
          </h2>
          <RevenueChart data={stats.dailyRevenue} />
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Porositë sipas Statusit</h2>
          <OrdersByStatusChart data={stats.revenueByStatus} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold mb-4">Metodat e Pagesës</h2>
          <PaymentMethodsChart data={stats.ordersByPayment} />
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Top 5 Produktet</h2>
          <TopProducts data={stats.topProducts} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, trend, icon, color }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colors[color]}`}
        >
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
        >
          {change}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
