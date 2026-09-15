// src/components/admin/analytics/PaymentMethodsChart.js
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function PaymentMethodsChart({ data }) {
  const paymentLabels = {
    cod: "Cash on Delivery",
    bank: "Transfer Bankar",
  };

  const paymentColors = {
    cod: "#10b981",
    bank: "#3b82f6",
  };

  const chartData = data.map((item) => ({
    name: paymentLabels[item._id] || item._id,
    value: item.count,
    revenue: item.total,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  paymentColors[entry.name.split(" ")[0].toLowerCase()] ||
                  "#9333ea"
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} porosi ($${props.payload.revenue.toFixed(2)})`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
