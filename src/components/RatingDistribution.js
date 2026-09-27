import StarRating from "./StarRating";

// src/components/RatingDistribution.js
export default function RatingDistribution({ stats }) {
  const total = stats.total || 1;

  return (
    <div className="space-y-2">
      {/* Average */}
      <div className="mb-6 text-center">
        <div className="mb-2 font-display text-5xl font-semibold text-ink">
          {stats.average.toFixed(1)}
        </div>
        <div className="flex justify-center">
          <StarRating rating={stats.average} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">{stats.total} reviews</p>
      </div>

      {/* Distribution Bars */}
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = stats.distribution[stars] || 0;
        const percentage = (count / total) * 100;

        return (
          <div key={stars} className="flex items-center gap-2">
            <span className="w-8 text-sm text-ink-soft">{stars} ⭐</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-right text-sm text-ink-soft">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
