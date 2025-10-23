"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState, useEffect } from "react";

export default function PermissionsPage() {
  const { data: session } = useSession() as { data: Session | null };
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectedPage, setConnectedPage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's managed Pages after login
  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchPages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Call Facebook Graph API to get Pages
        const res = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?access_token=${session.accessToken}`
        );
        const data = await res.json();

        if (data.error) {
          setError(data.error.message);
        } else {
          setPages(data.data || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Pages");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [session]);

const handleConnectPage = async (pageId: string, pageName: string) => {
  setConnectedPage(pageName);

  try {
    // Step 1: subscribe webhook via your backend (use your app access token)
    await fetch("/api/subscribe-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    });

    // Step 2: store connected page in your DB (optional)
    await fetch("/api/connect-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    });

    // Step 3: Redirect to dashboard
    window.location.href = `/dashboard?page=${pageId}`;
  } catch (err) {
    console.error(err);
    setConnectedPage(null);
    setError("Failed to connect Page");
  }
};

  // UI rendering
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Grant Permissions</h2>

      {!session ? (
        <>
          <p className="text-center text-gray-700 max-w-lg mb-6">
            Hermesbot requires Facebook permissions to connect your Page.
          </p>
          <button
            onClick={() =>
              signIn("facebook", {
                callbackUrl: "/permissions",
                authorizationParams: { prompt: "consent" },
              })
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Continue With Facebook
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-gray-800">
            Signed in as <span className="font-semibold">{session.user?.name}</span>
          </p>

          {loading && (
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
              <p>Loading your Facebook Pages...</p>
            </div>
          )}

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && pages.length > 0 && !connectedPage && (
            <div className="bg-gray-50 p-4 rounded-xl shadow-md w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">Select a Page to connect:</h3>
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li
                    key={page.id}
                    className="border p-3 rounded-lg flex justify-between items-center hover:bg-blue-50"
                  >
                    <span>{page.name}</span>
                    <button
                      onClick={() => handleConnectPage(page.id, page.name)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Connect
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {connectedPage && (
            <div className="mt-6 text-green-700 font-medium text-lg">
              ✅ {connectedPage} connected successfully!
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-8 px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
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
