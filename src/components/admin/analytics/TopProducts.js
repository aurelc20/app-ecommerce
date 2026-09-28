// src/components/admin/analytics/TopProducts.js
import Image from "next/image";

export default function TopProducts({ data }) {
  if (!data || data.length === 0) {
    return <p className="py-8 text-center text-ink-soft">Nuk ka të dhëna</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((product, index) => (
        <div
          key={product.productId}
          className="flex items-center gap-4 rounded-lg bg-sand/40 p-4"
        >
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-paper">
            {product.image?.[0] && (
              <Image
                src={product.image[0].url}
                alt={product.name}
                width={48}
                height={48}
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-ink">{product.name}</p>
            <p className="text-sm text-ink-soft">
              {product.totalSold} të shitura
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-ink">
              ${product.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-ink-soft">Revenue</p>
          </div>
        </div>
      ))}
    </div>
  );
}
