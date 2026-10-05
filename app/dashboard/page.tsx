"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import type { BusinessPortfolio, ConnectablePage } from "@/lib/facebook";
import type { OrgSummary } from "@/lib/org";

interface ConnectResult {
  pageId: string;
  name: string;
  success: boolean;
  error?: string;
}

const STEPS = ["Organization", "Business Portfolio", "Pages"] as const;

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 mb-8 text-sm">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = current > step;
        const active = current === step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                done
                  ? "bg-green-600 text-white"
                  : active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : step}
            </span>
            <span className={active ? "font-medium text-gray-900" : "text-gray-500"}>{label}</span>
            {step < STEPS.length && <span className="w-6 h-px bg-gray-300" />}
          </li>
        );
      })}
    </ol>
  );
}

function OnboardingWizard() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  // Step 1 — the organization these Pages will belong to.
  const [slugInput, setSlugInput] = useState("");
  const [org, setOrg] = useState<OrgSummary | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [verifyingOrg, setVerifyingOrg] = useState(false);

  // Step 2/3 — what Facebook gave us.
  const [pages, setPages] = useState<ConnectablePage[]>([]);
  const [businesses, setBusinesses] = useState<BusinessPortfolio[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);

  const [step, setStep] = useState(1);
  const [connecting, setConnecting] = useState(false);
  const [results, setResults] = useState<ConnectResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const verifyOrg = useCallback(async (slug: string) => {
    const trimmed = slug.trim();
    if (!trimmed) return false;

    setVerifyingOrg(true);
    setOrgError(null);
    try {
      const res = await fetch(`/api/org?slug=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok || !data.org) {
        setOrg(null);
        setOrgError(data.error ?? "We could not find that organization.");
        return false;
      }
      setOrg(data.org as OrgSummary);
      return true;
    } catch (err) {
      console.error("Error verifying org:", err);
      setOrg(null);
      setOrgError("Could not reach the server. Please try again.");
      return false;
    } finally {
      setVerifyingOrg(false);
    }
  }, []);

  // The onboarding link carries the workspace slug — pre-fill and confirm it.
  useEffect(() => {
    const fromLink = searchParams.get("org");
    if (!fromLink) return;
    setSlugInput(fromLink);
    verifyOrg(fromLink);
  }, [searchParams, verifyOrg]);

  // Fetch the user's Pages: personal ones plus anything owned by their businesses.
  useEffect(() => {
    const fetchPages = async () => {
      if (!session?.accessToken) return;
      setLoading(true);
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        if (!res.ok && !Array.isArray(data.pages)) {
          throw new Error(data.error ?? "Could not load your Pages.");
        }
        setPages(data.pages ?? []);
        setBusinesses(data.businesses ?? []);
        setWarnings(data.warnings ?? []);
        setNeedsReauth(Boolean(data.needsReauth));
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Could not load your Pages. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [session]);

  const portfolioPages = useMemo(
    () => pages.filter((p) => p.portfolioId === portfolioId),
    [pages, portfolioId]
  );
  const connectablePages = useMemo(
    () => portfolioPages.filter((p) => p.hasToken),
    [portfolioPages]
  );

  // Ask Facebook again, including permissions the user previously declined.
  const regrant = () =>
    signIn(
      "facebook",
      { callbackUrl: `/dashboard${org ? `?org=${encodeURIComponent(org.slug)}` : ""}` },
      { auth_type: "rerequest" }
    );

  const choosePortfolio = (id: string) => {
    setPortfolioId(id);
    setSelectedPageIds([]);
    setResults([]);
    setStep(3);
  };

  const togglePage = (pageId: string) =>
    setSelectedPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );

  const allSelected =
    connectablePages.length > 0 && selectedPageIds.length === connectablePages.length;

  const toggleAll = () =>
    setSelectedPageIds(allSelected ? [] : connectablePages.map((p) => p.id));

  const handleConnect = async () => {
    if (!selectedPageIds.length) return;

    setConnecting(true);
    setError(null);
    try {
      const selected = pages.filter((p) => selectedPageIds.includes(p.id));
      const res = await fetch("/api/connect-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: selected.map((p) => ({ id: p.id, name: p.name })),
          // Omitted when skipped — the Page is stored unattached for an admin to link.
          ...(org ? { orgSlug: org.slug } : {}),
        }),
      });
      const data = await res.json();

      if (Array.isArray(data.results)) {
        setResults(data.results as ConnectResult[]);
        setStep(4);
      } else {
        setError(typeof data.error === "string" ? data.error : "Failed to connect the Pages.");
      }
    } catch (err) {
      console.error("Error connecting pages:", err);
      setError("Failed to connect the Pages.");
    } finally {
      setConnecting(false);
    }
  };

  const connectedIds = results.filter((r) => r.success).map((r) => r.pageId);

  if (status === "loading") {
    return <Spinner label="Loading…" />;
  }

  // Facebook Login is the first step of the flow; without it there is nothing to show.
  if (!session) {
    return (
      <div className="text-center max-w-md">
        <p className="text-gray-700 mb-6">
          Sign in with Facebook to connect the Pages you manage.
        </p>
        <button
          onClick={() =>
            signIn(
              "facebook",
              {
                callbackUrl: `/dashboard${
                  searchParams.get("org")
                    ? `?org=${encodeURIComponent(searchParams.get("org")!)}`
                    : ""
                }`,
              },
              { auth_type: "rerequest" }
            )
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Continue With Facebook
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <Stepper current={Math.min(step, 3)} />

      {(needsReauth || warnings.length > 0) && step !== 4 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm mb-6">
          <p className="font-medium mb-1">Some Pages may be missing</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
          {needsReauth && (
            <button
              onClick={regrant}
              className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
            >
              Reconnect Facebook
            </button>
          )}
        </div>
      )}

      {/* ---- Step 1: organization ---- */}
      {step === 1 && (
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900">Which organization is this for?</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Enter your organization&apos;s name, or the workspace name from your Hermes dashboard
            URL. Pages you connect are linked to it. Optional — skip it and we will link them for
            you.
          </p>

          <div className="flex gap-2">
            <input
              value={slugInput}
              onChange={(e) => {
                setSlugInput(e.target.value);
                setOrg(null);
                setOrgError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && verifyOrg(slugInput)}
              placeholder="e.g. acme-clinic"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => verifyOrg(slugInput)}
              disabled={!slugInput.trim() || verifyingOrg}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300"
            >
              {verifyingOrg ? "Checking…" : "Check"}
            </button>
          </div>

          {orgError && <p className="text-sm text-red-600 mt-3">{orgError}</p>}

          {org && (
            <div className="flex items-center gap-3 mt-5 p-4 bg-green-50 border border-green-200 rounded-xl">
              {org.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={org.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-medium text-gray-900">{org.name}</p>
                <p className="text-sm text-gray-500">{org.slug}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!org}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Continue
            </button>
            <button
              onClick={() => {
                setOrg(null);
                setOrgError(null);
                setStep(2);
              }}
              className="px-4 py-2 text-sm text-gray-500 underline"
            >
              Skip for now
            </button>
          </div>
        </section>
      )}

      {/* ---- Step 2: business portfolio ---- */}
      {step === 2 && (
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900">Choose your Business Portfolio</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            {org ? (
              <>
                Pick the portfolio that owns the Pages you want to connect to{" "}
                <span className="font-medium text-gray-700">{org.name}</span>.
              </>
            ) : (
              "Pick the portfolio that owns the Pages you want to connect."
            )}
          </p>

          {loading ? (
            <Spinner label="Loading your portfolios…" />
          ) : businesses.length ? (
            <div className="space-y-3">
              {businesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => choosePortfolio(business.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{business.name}</p>
                    <p className="text-sm text-gray-500">
                      {business.pageCount === 0
                        ? "No Pages available — check this portfolio's access"
                        : `${business.pageCount} Page${business.pageCount === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <span className="text-blue-600 text-sm shrink-0">Select →</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No portfolios or Pages found. Make sure you manage at least one Page, or that your
              business portfolio has granted this app access.
            </p>
          )}

          <button onClick={() => setStep(1)} className="mt-6 text-sm text-gray-500 underline">
            ← Back
          </button>
        </section>
      )}

      {/* ---- Step 3: pages ---- */}
      {step === 3 && (
        <section className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Select the Pages to connect</h2>
            {connectablePages.length > 1 && (
              <button onClick={toggleAll} className="text-sm text-blue-600 underline shrink-0">
                {allSelected ? "Clear all" : "Select all"}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            {businesses.find((b) => b.id === portfolioId)?.name}
          </p>

          {portfolioPages.length ? (
            <div className="space-y-3">
              {portfolioPages.map((page) => (
                <label
                  key={page.id}
                  className={`flex items-center gap-3 p-4 border rounded-xl ${
                    page.hasToken
                      ? "border-gray-200 cursor-pointer hover:border-blue-400"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!page.hasToken}
                    checked={selectedPageIds.includes(page.id)}
                    onChange={() => togglePage(page.id)}
                    className="w-4 h-4 shrink-0"
                  />
                  {page.pictureUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={page.pictureUrl} alt="" className="w-10 h-10 rounded-full shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{page.name}</p>
                    <p className="text-sm text-gray-500">Page ID: {page.id}</p>
                    {!page.hasToken && (
                      <p className="text-xs text-amber-600 mt-1">
                        No Page token — ask a business admin to assign you to this Page.
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              This portfolio has no Pages this app can access yet.
            </p>
          )}

          <button
            onClick={handleConnect}
            disabled={!selectedPageIds.length || connecting}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {connecting
              ? "Connecting…"
              : `Connect ${selectedPageIds.length || ""} Page${
                  selectedPageIds.length === 1 ? "" : "s"
                }`}
          </button>

          <button onClick={() => setStep(2)} className="mt-4 text-sm text-gray-500 underline">
            ← Choose a different portfolio
          </button>
        </section>
      )}

      {/* ---- Done ---- */}
      {step === 4 && (
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {connectedIds.length
              ? `${connectedIds.length} Page${connectedIds.length === 1 ? "" : "s"} connected${
                  org ? ` to ${org.name}` : ""
                } 🎉`
              : "Nothing was connected"}
          </h2>
          {!org && connectedIds.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              We will link {connectedIds.length === 1 ? "it" : "them"} to your organization for
              you — no further action needed.
            </p>
          )}

          <ul className="mt-5 space-y-2">
            {results.map((result) => (
              <li
                key={result.pageId}
                className={`p-4 rounded-xl border text-sm ${
                  result.success
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">
                  {result.success ? "✓" : "✕"} {result.name}
                </p>
                {result.error && <p className="mt-1">{result.error}</p>}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              setResults([]);
              setSelectedPageIds([]);
              setStep(2);
            }}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Connect more Pages
          </button>
        </section>
      )}

      {error && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-3 underline">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-600">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Connect your Facebook Pages</h1>
      <Suspense fallback={<Spinner label="Loading…" />}>
        <OnboardingWizard />
      </Suspense>
    </main>
  );
}
