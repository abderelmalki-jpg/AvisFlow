"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/common/Card";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Brand Voice</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              Configure how your business responds to reviews
            </p>
            <Link
              href="/dashboard/settings/voice"
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Configure Brand Voice
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              Manage your business locations
            </p>
            <Link
              href="/dashboard/settings/locations"
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Manage Locations
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              View your subscription and usage
            </p>
            <Link
              href="/dashboard/settings/billing"
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              View Billing
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Team</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">
              Invite team members to your account
            </p>
            <Link
              href="/dashboard/settings/team"
              className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Manage Team
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
