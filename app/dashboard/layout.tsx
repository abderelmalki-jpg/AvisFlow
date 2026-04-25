"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">ReplyLocal</h1>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/reviews"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            Reviews
          </Link>
          <Link
            href="/dashboard/history"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            Response History
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-600 truncate">
            {firebaseUser?.email}
          </div>
          <button className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
