"use client";

import React from "react";

export default function DataDeletionPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-100 bg-[#0b0f14] min-h-screen">
      <header className="py-6">
        <h1 className="text-3xl font-bold mb-2">Data Deletion Instructions</h1>
        <p className="text-sm text-gray-400">Last updated: 2025-08-25</p>
      </header>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <p>
          If you want to delete information collected through our Facebook Messenger chatbot ("Platform Data"), you can submit a request and we will permanently delete your data.
        </p>

        <div className="grid gap-4 mt-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">How to request deletion</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-300">
              <li>
                Email us at {" info@hermesbot.me "}
                <a
                  href="mailto:info@hermesbot.me?subject=Data%20Deletion%20Request"
                  className="text-blue-400 hover:underline"
                >
                  info@hermesbot.me
                </a>{" "}
                with the subject <em>Data Deletion Request</em>.
              </li>
              <li>Include your Facebook profile link or the full name used on Facebook, and the Page you messaged.</li>
              <li>Optionally, include the approximate date of your conversation to help us locate records.</li>
            </ol>
          </div>

          <div className="bg-[#0b0f14] border border-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2">What we delete</h3>
            <ul className="list-disc list-inside text-gray-300">
              <li>Messages sent to the Page via our chatbot</li>
              <li>Conversation metadata used to operate the service (e.g., Page ID, timestamps)</li>
            </ul>
            <p className="text-sm text-gray-400 mt-2">
              We only store Platform Data to operate the chatbot service and do not use it for unrelated purposes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Timing &amp; verification</h3>
        <p>
          We verify requests to confirm ownership of the Facebook account and complete deletions within <strong>30 days</strong> (often sooner), unless a longer period is required by law.
        </p>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Questions</h3>
        <p>
          Contact us at {" "}
          <a href="mailto:info@hermesbot.me" className="text-blue-400 hover:underline">
            info@hermesbot.me
          </a>
          .
        </p>
      </section>

      <footer className="text-sm text-gray-400 mt-6">
        <p>
          This page covers data processed via Facebook Platform. For broader privacy information, see our {" "}
          <a href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
