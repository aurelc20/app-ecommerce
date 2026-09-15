// src/components/admin/analytics/TopProducts.js
import Image from "next/image";

export default function TopProducts({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-8">Nuk ka të dhëna</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((product, index) => (
        <div
          key={product.productId}
          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
        >
          <div className="shrink-0 w-12 h-12 bg-white rounded-lg overflow-hidden">
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
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{product.name}</p>
            <p className="text-sm text-gray-600">
              {product.totalSold} të shitura
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">
              ${product.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
        </div>
      ))}
    </div>
  );
}
