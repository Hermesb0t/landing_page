"use client";

import { signIn } from "next-auth/react";

export default function PermissionsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-semibold mb-4">Grant Permissions</h2>
      <p className="text-center text-gray-700 max-w-lg mb-6">
        Hermesbot requires certain permissions to build automations with
        Messenger, Instagram, and WhatsApp. Click the button to grant them.
      </p>

      <button
        onClick={() => signIn("facebook", {
            callbackUrl: "/",
            // 👇 forces FB to always show permissions screen
            authorizationParams: { prompt: "consent" },
          })}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
      >
        Continue With Facebook
      </button>

      <p className="text-sm text-gray-600 mt-4 text-center max-w-sm">
        By signing up, you agree to Hermesbot’s{" "}
        <a href="/service-term" className="underline text-blue-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline text-blue-600">
          Privacy Policy
        </a>
        .
      </p>
    </main>
  );
}
