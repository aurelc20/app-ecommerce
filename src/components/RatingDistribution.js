import StarRating from "./StarRating";

// src/components/RatingDistribution.js
export default function RatingDistribution({ stats }) {
  const total = stats.total || 1;

  return (
    <div className="space-y-2">
      {/* Average */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {stats.average.toFixed(1)}
        </div>
        <StarRating rating={stats.average} />
        <p className="text-sm text-gray-600 mt-2">{stats.total} reviews</p>
      </div>

      {/* Distribution Bars */}
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = stats.distribution[stars] || 0;
        const percentage = (count / total) * 100;

        return (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 w-8">{stars} ⭐</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
