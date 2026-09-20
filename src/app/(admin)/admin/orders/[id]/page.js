// src/app/(admin)/admin/orders/[id]/page.js
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/actions/admin/orderActions";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import Link from "next/link";
import Image from "next/image";

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="text-purple-600 hover:text-purple-700"
            >
              ← Porositë
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Porosia #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>
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
        <OrderStatusSelect
          orderId={order._id.toString()}
          currentStatus={order.status}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Artikujt</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b last:border-0"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
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
            <h2 className="text-xl font-bold mb-4">Adresa e Dërgesës</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Emri:</span>{" "}
                {order.shippingAddress?.fullName}
              </p>
              <p>
                <span className="font-medium">Adresa:</span>{" "}
                {order.shippingAddress?.street}
              </p>
              <p>
                <span className="font-medium">Qyteti:</span>{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>
                <span className="font-medium">Shteti:</span>{" "}
                {order.shippingAddress?.country}
              </p>
              <p>
                <span className="font-medium">Telefoni:</span>{" "}
                {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Timeline</h2>
            <div className="space-y-3">
              <TimelineItem
                icon="🛒"
                label="Porosia u krijua"
                date={order.createdAt}
                active
              />
              {order.paidAt && (
                <TimelineItem
                  icon="💳"
                  label="Pagesa u konfirmua"
                  date={order.paidAt}
                />
              )}
              {order.deliveredAt && (
                <TimelineItem
                  icon="✅"
                  label="Porosia u dorëzua"
                  date={order.deliveredAt}
                />
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Përmbledhja</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>
                  ${order.itemsPrice?.toFixed(2) || order.totalPrice * 0.77}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transporti:</span>
                <span>${order.shippingPrice?.toFixed(2) || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tatimi:</span>
                <span>
                  ${order.taxPrice?.toFixed(2) || order.totalPrice * 0.13}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-purple-600">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Statusi</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pagesa</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shënime</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ icon, label, date, active }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
          active ? "bg-purple-100" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("sq-AL", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
