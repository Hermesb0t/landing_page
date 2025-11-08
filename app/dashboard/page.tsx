"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  interface FacebookPage {
      id: string;
      name: string;
      access_token?: string;
    }
  const { data: session } = useSession();
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectingPageId, setConnectingPageId] = useState<string | null>(null);
  const [connectedPageId, setConnectedPageId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch user's Pages
  useEffect(() => {
    const fetchPages = async () => {
      if (!session?.accessToken) return;
      setLoading(true);
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        if (data.pages) setPages(data.pages);
      } catch (err) {
        console.error("Error fetching pages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [session]);

  const handleConnect = async (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page?.access_token) {
        setMessage("Page token not found");
        return;
    }
    setConnectingPageId(pageId);
    try {
      const res = await fetch("/api/connect-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, pageAccessToken: page.access_token, name: page.name }),
      });
      const data = await res.json();
      if (data.success) {
        setConnectedPageId(pageId);
        setMessage("Page connected successfully 🎉");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error connecting page:", err);
    } finally {
      setConnectingPageId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome to Hermesbot Dashboard
      </h1>

      {loading ? (
        <div className="flex flex-col items-center mt-10">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your Pages...</p>
        </div>
      ) : (
        <div className="grid gap-4 w-full max-w-md">
          {pages.length > 0 ? (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex justify-between items-center bg-white shadow p-4 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">{page.name}</p>
                  <p className="text-sm text-gray-500">Page ID: {page.id}</p>
                </div>

                {connectedPageId === page.id ? (
                  <div className="flex items-center text-green-600 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-6 h-6 mr-1 animate-bounce"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    Connected
                  </div>
                ) : connectingPageId === page.id ? (
                  <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <button
                    onClick={() => handleConnect(page.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No Pages found. Make sure you manage at least one Page.
            </p>
          )}
        </div>
      )}

      {/* ✅ Floating success message */}
      {message && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
          {message}
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
