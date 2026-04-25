"use client";

import { Card, CardHeader, CardBody } from "@/components/common/Card";

const HISTORY = [
  {
    id: "1",
    author: "John Smith",
    review: "Best pizza in town!",
    reply: "Thank you so much for the amazing review!",
    date: "2025-04-20",
  },
];

export default function HistoryPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Response History</h1>

      <div className="space-y-4">
        {HISTORY.map((item) => (
          <Card key={item.id}>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Review from {item.author}</p>
                  <p className="text-gray-700 italic">"{item.review}"</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Your reply</p>
                  <p className="text-gray-700">"{item.reply}"</p>
                </div>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
