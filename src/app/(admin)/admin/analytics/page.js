// src/app/(admin)/admin/analytics/page.js
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/admin/analyticsActions";
import RevenueChart from "@/components/admin/analytics/RevenueChart";
import OrdersByStatusChart from "@/components/admin/analytics/OrdersByStatusChart";
import PaymentMethodsChart from "@/components/admin/analytics/PaymentMethodsChart";
import TopProducts from "@/components/admin/analytics/TopProducts";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="rounded-xl border border-sand bg-paper p-8">
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
        <h1 className="font-display text-3xl font-semibold text-ink">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-ink-soft">
          Përmbledhja e performancës së dyqanit
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={`+${revenueChange}% (30d)`}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <KpiCard
          title="Total Porosi"
          value={stats.totalOrders.toLocaleString()}
          change={`+${ordersChange}% (30d)`}
          trend="up"
          icon={<ShoppingCart className="h-6 w-6" />}
          color="wood"
        />
        <KpiCard
          title="Klientë"
          value={stats.totalCustomers.toLocaleString()}
          change={`+${stats.customersLast30Days} (30d)`}
          trend="up"
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <KpiCard
          title="Produkte Aktive"
          value={stats.totalProducts.toLocaleString()}
          change="Në stock"
          trend="neutral"
          icon={<Package className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Revenue (30 Ditët e Fundit)
          </h2>
          <RevenueChart data={stats.dailyRevenue} />
        </div>

        {/* Orders by Status */}
        <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Porositë sipas Statusit
          </h2>
          <OrdersByStatusChart data={stats.revenueByStatus} />
        </div>
      </div>

      {/* Second Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Methods */}
        <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Metodat e Pagesës
          </h2>
          <PaymentMethodsChart data={stats.ordersByPayment} />
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Top 5 Produktet
          </h2>
          <TopProducts data={stats.topProducts} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, trend, icon, color }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    wood: "bg-wood/10 text-wood",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colors[color]}`}
        >
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-ink-soft"}`}
        >
          {change}
        </span>
      </div>
      <p className="mb-1 text-sm text-ink-soft">{title}</p>
      <p className="text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
