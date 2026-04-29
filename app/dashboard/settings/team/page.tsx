"use client";

import { useBusinesses } from "@/hooks/useBusinesses";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function TeamSettingsPage() {
  const { businesses } = useBusinesses();

  if (!businesses || businesses.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Team</h1>
        <Card>
          <CardBody>
            <p className="text-gray-600">
              No businesses found. Please set up your business first.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const business = businesses[0];
  const members = business.members || {};

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Team</h1>

      <div className="mb-6">
        <Button variant="primary" disabled>
          Invite Team Member (Coming Soon)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Team Members</h3>
        </CardHeader>
        <CardBody>
          {Object.keys(members).length === 0 ? (
            <p className="text-gray-600 text-center py-8">No team members yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(members).map(([userId, role]) => (
                <div
                  key={userId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{userId}</p>
                    <p className="text-sm text-gray-600 capitalize">{role}</p>
                  </div>
                  {role !== "owner" && (
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
