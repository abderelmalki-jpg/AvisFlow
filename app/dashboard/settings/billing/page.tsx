"use client";

import { useBusinesses } from "@/hooks/useBusinesses";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function BillingSettingsPage() {
  const { businesses } = useBusinesses();

  if (!businesses || businesses.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing</h1>
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
  const usagePercent = Math.round(
    (business.currentMonthUsage / business.monthlyQuota) * 100
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Current Plan</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {business.subscriptionStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Monthly Quota:{" "}
                <span className="font-semibold">{business.monthlyQuota}</span>{" "}
                replies
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Monthly Usage</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {business.currentMonthUsage}/{business.monthlyQuota}
                  </span>
                  <span className="font-semibold">{usagePercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Upgrade Plan</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 mb-4">
            Upgrade to a higher plan to get more monthly replies.
          </p>
          <Button variant="primary" disabled>
            Upgrade (Coming Soon)
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
