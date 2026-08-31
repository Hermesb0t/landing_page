"use client";

import { Suspense } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import type { Session } from "next-auth";

function Permissions() {
  const { data: session } = useSession() as { data: Session | null };
  const searchParams = useSearchParams();

  // Carry the workspace slug across the Facebook redirect so the wizard opens
  // with the client's organization already resolved.
  const org = searchParams.get("org");
  const callbackUrl = `/dashboard${org ? `?org=${encodeURIComponent(org)}` : ""}`;

  return (
    <>
      {/* If not logged in → show "Continue with Facebook" */}
      {!session ? (
        <button
          onClick={() =>
            signIn(
              "facebook",
              { callbackUrl },
              // Re-ask for anything previously declined, e.g. business_management.
              { auth_type: "rerequest" }
            )
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Continue With Facebook
        </button>
      ) : (
        // If logged in → show name, continue, and Logout
        <div className="text-center">
          <p className="mb-4 text-gray-800">
            Signed in as <span className="font-semibold">{session.user?.name}</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={callbackUrl}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Continue
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function PermissionsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-semibold mb-4">Grant Permissions</h2>

      <p className="text-center text-gray-700 max-w-lg mb-6">
        Hermesbot requires certain permissions to build automations with
        Messenger, Instagram, and WhatsApp. Click the button to grant them.
      </p>

      <Suspense fallback={null}>
        <Permissions />
      </Suspense>

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
