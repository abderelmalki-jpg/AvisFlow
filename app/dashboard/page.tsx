"use client";

import { useBusinesses } from "@/hooks/useBusinesses";
import { Card, CardHeader, CardBody } from "@/components/common/Card";

export default function DashboardPage() {
  const { businesses, loading } = useBusinesses();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (businesses.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <Card>
          <CardBody>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No businesses yet</p>
              <a
                href="/onboarding"
                className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Create Your First Business
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Pending Reviews</h3>
          </CardHeader>
          <CardBody>
            <div className="text-4xl font-bold text-blue-600">0</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Replies Published</h3>
          </CardHeader>
          <CardBody>
            <div className="text-4xl font-bold text-green-600">0</div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Your Businesses</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h4 className="font-semibold text-gray-900">{business.name}</h4>
                <p className="text-sm text-gray-600">
                  {business.members ? Object.keys(business.members).length : 0}{" "}
                  members
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
