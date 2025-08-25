"use client";

import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-100 bg-[#0b0f14] min-h-screen">
      <header className="py-6">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: 2025-08-25</p>
      </header>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          These Terms of Service ("Terms") govern your use of our Facebook Messenger chatbot and related services (the "Service"). By using the Service, you agree to these Terms.
        </p>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Service Description</h2>
        <p>
          Our chatbot enables businesses to communicate automatically with people on Facebook Messenger. It may provide answers, appointment bookings, schedules, or other business information. We use data only to deliver this Service.
        </p>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>You will not misuse the Service or use it for unlawful activities.</li>
          <li>You are responsible for the accuracy of any information you provide through the Service.</li>
          <li>You acknowledge that automated responses may not always be accurate or complete.</li>
        </ul>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Use</h2>
        <p>
          We may collect and process Platform Data (such as messages, Page IDs, and interaction timestamps) only to deliver the Service. Please review our {" "}
          <a href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>{" "}
          for more details.
        </p>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
        <p>
          We provide the Service "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for any damages resulting from your use of the Service.
        </p>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes means you accept the revised Terms.
        </p>
      </section>

      <section className="bg-[#121821] border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
        <p>
          If you have questions about these Terms, contact us at {" "}
          <a href="mailto:info@hermesbot.me" className="text-blue-400 hover:underline">
            info@hermesbot.me
          </a>
          .
        </p>
      </section>

      <footer className="text-sm text-gray-400 mt-6">
        <p>
          For information on how we handle data, please also see our {" "}
          <a href="/data-deletion" className="text-blue-400 hover:underline">
            Data Deletion Policy
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
