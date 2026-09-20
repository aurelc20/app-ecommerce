// src/app/(dashboard)/dashboard/orders/[id]/page.js
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/actions/orderActions";
import Link from "next/link";
import Image from "next/image";
import CancelOrderButton from "@/components/CancelOrderButton";

export default async function UserOrderDetailsPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

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
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  const canCancel = order.status === "pending" || order.status === "processing";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/orders"
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              ← Kthehu te porositë
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Porosia #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-gray-600 mt-2">
            {new Date(order.createdAt).toLocaleDateString("sq-AL", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Progress Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Statusi i Porosisë</h2>
            <OrderTimeline currentStatus={order.status} order={order} />
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Artikujt e Porositur</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">📍 Adresa e Dërgesës</h2>
            <div className="space-y-1 text-gray-700">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-2">📞 {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Shënime</h2>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-900 mb-2">
                Dëshiron ta anulosh porosinë?
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Mund ta anulosh porosinë vetëm nëse ende nuk është dërguar.
              </p>
              <CancelOrderButton orderId={order._id} />
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Përmbledhja</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transporti:</span>
                <span
                  className={
                    order.shippingPrice === 0
                      ? "text-green-600 font-medium"
                      : ""
                  }
                >
                  {order.shippingPrice === 0
                    ? "Falas"
                    : `$${order.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tatimi:</span>
                <span>${order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-purple-600">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Metoda e Pagesës</p>
                <p className="font-medium">
                  {order.paymentMethod === "cod"
                    ? "💵 Cash on Delivery"
                    : "🏦 Transfer Bankar"}
                </p>
              </div>
            </div>

            {/* Help */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Ke pyetje për porositë?
              </p>
              <a
                href="mailto:info@perle.com"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Na kontakto →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Component - tregon progresin e porosisë
function OrderTimeline({ currentStatus, order }) {
  const steps = [
    { key: "pending", label: "Porosia u pranua", icon: "🛒" },
    { key: "processing", label: "Në përpunim", icon: "⚙️" },
    { key: "shipped", label: "U dërgua", icon: "📦" },
    { key: "out_for_delivery", label: "Në rrugë", icon: "🚚" },
    { key: "delivered", label: "U dorëzua", icon: "✅" },
  ];

  const statusOrder = [
    "pending",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];
  const currentIndex = statusOrder.indexOf(currentStatus);

  // Nëse është anuluar, shfaq mesazh të veçantë
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-semibold text-red-900">Porosia u anulua</p>
          <p className="text-sm text-red-700">Kjo porosi nuk është më aktive</p>
        </div>
      </div>
    );
  }

  if (currentStatus === "refunded") {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span className="text-2xl">💰</span>
        <div>
          <p className="font-semibold text-gray-900">Porosia u rimbursua</p>
          <p className="text-sm text-gray-700">
            Shuma u kthye te llogaria juaj
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step.key}
            className="flex items-start gap-4 relative pb-8 last:pb-0"
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-5 top-10 w-0.5 h-full ${
                  index < currentIndex ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                isCompleted
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-400"
              } ${isCurrent ? "ring-4 ring-purple-200" : ""}`}
            >
              {isCompleted ? step.icon : "○"}
            </div>

            {/* Label */}
            <div className="flex-1 pt-2">
              <p
                className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-purple-600 mt-1">Statusi aktual</p>
              )}
              {step.key === "pending" && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {step.key === "delivered" && order.deliveredAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.deliveredAt).toLocaleDateString("sq-AL", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
