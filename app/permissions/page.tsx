"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";

export default function PermissionsPage() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-semibold mb-4">Grant Permissions</h2>

      <p className="text-center text-gray-700 max-w-lg mb-6">
        Hermesbot requires certain permissions to build automations with
        Messenger, Instagram, and WhatsApp. Click the button to grant them.
      </p>

      {/* If not logged in → show "Continue with Facebook" */}
      {!session ? (
        <button
          onClick={() =>
            signIn("facebook", {
              callbackUrl: "/dashboard",
              authorizationParams: { prompt: "consent" }, // always show consent screen
            })
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Continue With Facebook
        </button>
      ) : (
        // If logged in → show name and Logout
        <div className="text-center">
          <p className="mb-4 text-gray-800">
            Signed in as{" "}
            <span className="font-semibold">{session.user?.name}</span>
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}

      <p className="text-sm text-gray-600 mt-6 text-center max-w-sm">
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
