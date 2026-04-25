"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-blue-600">ReplyLocal</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Respond to every Google review
            <br />
            <span className="text-blue-600">in seconds, not hours</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            ReplyLocal uses AI to generate personalized, brand-aligned responses
            to your Google reviews. Save time, maintain consistency, and build
            your reputation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "AI-Powered Replies",
              description: "Generate personalized responses matching your brand tone",
            },
            {
              title: "Human Validation",
              description: "Review and edit before publishing to your profile",
            },
            {
              title: "Multi-Location",
              description: "Manage all your locations from one dashboard",
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2025 ReplyLocal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
