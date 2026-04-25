"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Card, CardHeader, CardBody } from "@/components/common/Card";

// Placeholder data
const REVIEW = {
  id: "1",
  author: "John Smith",
  rating: 5,
  text: "Best pizza in town! Service was incredibly fast and the staff was so friendly. Will definitely be back.",
  date: "2025-04-20",
  generatedReply:
    "Thank you so much for the amazing review, John! We're thrilled you loved your experience. Your kind words about our staff mean the world to us. We can't wait to serve you again soon! 🍕",
};

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState(REVIEW.generatedReply);

  const handlePublish = async () => {
    // TODO: Call API to publish reply
    console.log("Publishing reply:", replyText);
  };

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/reviews" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
        ← Back to Reviews
      </Link>

      <div className="space-y-6">
        {/* Review Card */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">
              Review from {REVIEW.author}
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-5xl">
                {"⭐".repeat(REVIEW.rating)}
              </div>
              <span className="text-gray-500">{REVIEW.date}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{REVIEW.text}</p>
            </div>
          </CardBody>
        </Card>

        {/* Reply Card */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Your Reply</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {isEditing ? (
              <>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                />
                <div className="flex gap-4">
                  <Button onClick={() => setIsEditing(false)} variant="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handlePublish}>Publish Reply</Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{replyText}</p>
                </div>
                <Button onClick={() => setIsEditing(true)} variant="secondary">
                  Edit Reply
                </Button>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
