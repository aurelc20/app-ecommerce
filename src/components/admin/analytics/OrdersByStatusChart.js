// src/components/admin/analytics/OrdersByStatusChart.js
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function OrdersByStatusChart({ data }) {
  const statusLabels = {
    pending: "Në pritje",
    processing: "Në përpunim",
    shipped: "Dërguar",
    out_for_delivery: "Në rrugë",
    delivered: "Dorëzuar",
    cancelled: "Anuluar",
    refunded: "Rimbursuar",
  };

  const statusColors = {
    pending: "#fbbf24",
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    out_for_delivery: "#6366f1",
    delivered: "#10b981",
    cancelled: "#ef4444",
    refunded: "#6b7280",
  };

  const chartData = data.map((item) => ({
    status: statusLabels[item._id] || item._id,
    count: item.count,
    revenue: item.total,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="status"
            stroke="#6b7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value, name) => [
              name === "revenue" ? `$${value.toFixed(2)}` : value,
              name === "revenue" ? "Revenue" : "Orders",
            ]}
          />
          <Bar dataKey="count" name="Porosi">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  statusColors[Object.keys(statusLabels)[index]] || "#9333ea"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
