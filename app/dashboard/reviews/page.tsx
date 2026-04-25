"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/common/Card";

// Placeholder data
const SAMPLE_REVIEWS = [
  {
    id: "1",
    author: "John Smith",
    rating: 5,
    text: "Best pizza in town! Service was incredibly fast and the staff was so friendly. Will definitely be back.",
    date: "2025-04-20",
  },
  {
    id: "2",
    author: "Sarah Johnson",
    rating: 2,
    text: "Waited 45 minutes for our order. Food was cold when it arrived. Very disappointed.",
    date: "2025-04-18",
  },
  {
    id: "3",
    author: "Mike Davis",
    rating: 4,
    text: "Good food overall, but the place was pretty loud. Could be quieter.",
    date: "2025-04-15",
  },
];

function RatingBadge({ rating }: { rating: number }) {
  const colors = {
    5: "bg-green-100 text-green-800",
    4: "bg-blue-100 text-blue-800",
    3: "bg-yellow-100 text-yellow-800",
    2: "bg-orange-100 text-orange-800",
    1: "bg-red-100 text-red-800",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors[rating as keyof typeof colors]}`}>
      {rating} ⭐
    </span>
  );
}

export default function ReviewsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reviews</h1>

      <div className="space-y-4">
        {SAMPLE_REVIEWS.map((review) => (
          <Link key={review.id} href={`/dashboard/reviews/${review.id}`}>
            <Card className="hover:border-blue-300 cursor-pointer transition-colors">
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.author}
                      </h3>
                      <RatingBadge rating={review.rating} />
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {review.date}
                    </p>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Reply
                  </button>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
