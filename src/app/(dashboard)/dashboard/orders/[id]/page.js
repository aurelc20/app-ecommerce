// src/app/(dashboard)/dashboard/orders/[id]/page.js
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/actions/orderActions";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Package,
  Phone,
  Settings,
  ShoppingCart,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
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
    shipped: "bg-sky-100 text-sky-800",
    out_for_delivery: "bg-cyan-100 text-cyan-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  const canCancel = order.status === "pending" || order.status === "processing";

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1.5 text-sm text-wood hover:text-wood-dark"
            >
              <ArrowLeft className="h-4 w-4" />
              Kthehu te porositë
            </Link>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Porosia #{order._id.slice(-8).toUpperCase()}
          </h1>
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

        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${statusColors[order.status]}`}
        >
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Progress Timeline */}
          <div className="rounded-2xl border border-sand bg-paper p-6">
            <h2 className="mb-6 font-display text-xl font-semibold text-ink">
              Statusi i Porosisë
            </h2>
            <OrderTimeline currentStatus={order.status} order={order} />
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-sand bg-paper p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              Artikujt e Porositur
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
                    className="flex items-center gap-4 border-b border-sand pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sand/60">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
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
          <div className="rounded-2xl border border-sand bg-paper p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-ink">
              <MapPin className="h-5 w-5 text-wood" />
              Adresa e Dërgesës
            </h2>
            <div className="space-y-1 text-ink-soft">
              <p className="font-medium text-ink">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="mt-2 flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-2xl border border-sand bg-paper p-6">
              <h2 className="mb-4 font-display text-xl font-semibold text-ink">
                Shënime
              </h2>
              <p className="text-ink-soft">{order.notes}</p>
            </div>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="mb-2 font-semibold text-red-900">
                Dëshiron ta anulosh porosinë?
              </h3>
              <p className="mb-4 text-sm text-red-700">
                Mund ta anulosh porosinë vetëm nëse ende nuk është dërguar.
              </p>
              <CancelOrderButton orderId={order._id} />
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-sand bg-paper p-6">
            <h2 className="mb-6 font-display text-xl font-semibold text-ink">
              Përmbledhja
            </h2>

            <div className="mb-6 space-y-3">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal:</span>
                <span>${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Transporti:</span>
                <span
                  className={
                    order.shippingPrice === 0
                      ? "font-medium text-green-700"
                      : ""
                  }
                >
                  {order.shippingPrice === 0
                    ? "Falas"
                    : `$${order.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Tatimi:</span>
                <span>${order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-sand pt-3 text-lg font-semibold">
                <span className="text-ink">Total:</span>
                <span className="text-wood">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-sand pt-6">
              <div>
                <p className="mb-1 text-sm text-ink-soft">Metoda e Pagesës</p>
                <p className="flex items-center gap-1.5 font-medium text-ink">
                  {order.paymentMethod === "cod" ? (
                    <>
                      <Wallet className="h-4 w-4 text-wood" />
                      Cash on Delivery
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4 text-wood" />
                      Transfer Bankar
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Help */}
            <div className="mt-6 border-t border-sand pt-6">
              <p className="mb-2 text-sm text-ink-soft">
                Ke pyetje për porositë?
              </p>
              <a
                href="mailto:info@furnitureshop.com"
                className="text-sm font-medium text-wood hover:text-wood-dark"
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
    { key: "pending", label: "Porosia u pranua", icon: ShoppingCart },
    { key: "processing", label: "Në përpunim", icon: Settings },
    { key: "shipped", label: "U dërgua", icon: Package },
    { key: "out_for_delivery", label: "Në rrugë", icon: Truck },
    { key: "delivered", label: "U dorëzua", icon: CheckCircle2 },
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
      <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
        <XCircle className="h-8 w-8 text-red-600" />
        <div>
          <p className="font-semibold text-red-900">Porosia u anulua</p>
          <p className="text-sm text-red-700">Kjo porosi nuk është më aktive</p>
        </div>
      </div>
    );
  }

  if (currentStatus === "refunded") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-sand/50 p-4">
        <CircleDollarSign className="h-8 w-8 text-ink-soft" />
        <div>
          <p className="font-semibold text-ink">Porosia u rimbursua</p>
          <p className="text-sm text-ink-soft">
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
        const StepIcon = step.icon;

        return (
          <div
            key={step.key}
            className="relative flex items-start gap-4 pb-8 last:pb-0"
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-10 left-5 h-full w-0.5 ${
                  index < currentIndex ? "bg-wood" : "bg-sand"
                }`}
              />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isCompleted ? "bg-wood text-white" : "bg-sand text-ink-soft"
              } ${isCurrent ? "ring-4 ring-wood/20" : ""}`}
            >
              {isCompleted ? (
                <StepIcon className="h-5 w-5" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-current" />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 pt-2">
              <p
                className={`font-medium ${isCompleted ? "text-ink" : "text-ink-soft/60"}`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="mt-1 text-sm text-wood">Statusi aktual</p>
              )}
              {step.key === "pending" && (
                <p className="mt-1 text-xs text-ink-soft">
                  {new Date(order.createdAt).toLocaleDateString("sq-AL", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {step.key === "delivered" && order.deliveredAt && (
                <p className="mt-1 text-xs text-ink-soft">
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
