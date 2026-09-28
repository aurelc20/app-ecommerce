// src/app/(admin)/admin/orders/[id]/page.js
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/actions/admin/orderActions";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, CreditCard, ShoppingCart } from "lucide-react";

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="text-wood hover:text-wood-dark"
            >
              ← Porositë
            </Link>
            <h1 className="font-display text-3xl font-semibold text-ink">
              Porosia #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <p className="mt-2 text-ink-soft">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              Artikujt
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => {
                // Prefero foton aktuale te produktit (ne rast se u ndryshua
                // pas porosise); bie mbrapa te foto e ruajtur ne porosi nese
                // produkti eshte fshire ose nuk ka imazhe.
                const currentImage =
                  item.product?.images?.find((img) => img.isPrimary) ||
                  item.product?.images?.[0];
                const imageUrl = currentImage?.url || item.image;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b border-sand pb-4 last:border-0"
                  >
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-ink">{item.name}</h3>
                      <p className="text-sm text-ink-soft">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-ink">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              Adresa e Dërgesës
            </h2>
            <div className="space-y-2 text-ink-soft">
              <p>
                <span className="font-medium text-ink">Emri:</span>{" "}
                {order.shippingAddress?.fullName}
              </p>
              <p>
                <span className="font-medium text-ink">Adresa:</span>{" "}
                {order.shippingAddress?.street}
              </p>
              <p>
                <span className="font-medium text-ink">Qyteti:</span>{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>
                <span className="font-medium text-ink">Shteti:</span>{" "}
                {order.shippingAddress?.country}
              </p>
              <p>
                <span className="font-medium text-ink">Telefoni:</span>{" "}
                {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-sand bg-paper p-6 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              Timeline
            </h2>
            <div className="space-y-3">
              <TimelineItem
                icon={<ShoppingCart className="h-5 w-5" />}
                label="Porosia u krijua"
                date={order.createdAt}
                active
              />
              {order.paidAt && (
                <TimelineItem
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Pagesa u konfirmua"
                  date={order.paidAt}
                />
              )}
              {order.deliveredAt && (
                <TimelineItem
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  label="Porosia u dorëzua"
                  date={order.deliveredAt}
                />
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-sand bg-paper p-6 shadow-sm">
            <h2 className="mb-6 font-display text-xl font-semibold text-ink">
              Përmbledhja
            </h2>

            <div className="mb-6 space-y-3">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal:</span>
                <span>
                  ${order.itemsPrice?.toFixed(2) || order.totalPrice * 0.77}
                </span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Transporti:</span>
                <span>${order.shippingPrice?.toFixed(2) || 0}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Tatimi:</span>
                <span>
                  ${order.taxPrice?.toFixed(2) || order.totalPrice * 0.13}
                </span>
              </div>
              <div className="flex justify-between border-t border-sand pt-3 text-lg font-bold">
                <span className="text-ink">Total:</span>
                <span className="text-wood">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm text-ink-soft">Statusi</p>
                <p className="font-medium text-ink capitalize">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm text-ink-soft">Pagesa</p>
                <p className="font-medium text-ink capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              {order.notes && (
                <div>
                  <p className="mb-1 text-sm text-ink-soft">Shënime</p>
                  <p className="text-sm text-ink-soft">{order.notes}</p>
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
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          active ? "bg-wood/15 text-wood-dark" : "bg-sand text-ink-soft"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-ink">{label}</p>
        <p className="text-sm text-ink-soft">
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
