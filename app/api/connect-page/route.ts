import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { GRAPH_URL } from "@/lib/facebook";
import { resolveOrgId } from "@/lib/org";

interface RequestedPage {
  id: string;
  name?: string;
}

interface ConnectResult {
  pageId: string;
  name: string;
  success: boolean;
  error?: string;
}

/** Reads the selection in either the multi-page or the older single-page shape. */
function readRequestedPages(body: {
  pages?: RequestedPage[];
  pageId?: string;
  name?: string;
}): RequestedPage[] {
  if (Array.isArray(body.pages)) {
    return body.pages
      .filter((p) => typeof p?.id === "string" && p.id.trim())
      .map((p) => ({ id: p.id.trim(), name: p.name }));
  }
  if (typeof body.pageId === "string" && body.pageId.trim()) {
    return [{ id: body.pageId.trim(), name: body.name }];
  }
  return [];
}

/**
 * Ask Facebook for the Page token directly instead of trusting the client — for
 * business-owned Pages the listing call does not always include one.
 */
async function fetchPageToken(pageId: string, userToken: string) {
  const res = await fetch(
    `${GRAPH_URL}/${pageId}?` +
      new URLSearchParams({ fields: "access_token,name", access_token: userToken })
  );
  return res.json();
}

async function subscribeApp(pageId: string, pageToken: string) {
  const res = await fetch(`${GRAPH_URL}/${pageId}/subscribed_apps?access_token=${pageToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subscribed_fields: [
        "messages",
        "messaging_postbacks",
        "messaging_optins",
        "messaging_handovers",
      ],
    }),
  });
  return res.json();
}

/** Stores the Page on the backend, attached to the client's organization. */
async function savePage(payload: {
  pageId: string;
  name: string;
  accessToken: string;
  userToken: string;
  orgId?: string;
}) {
  const res = await fetch(`${process.env.BACKEND_URL}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, body: await res.json().catch(() => ({})) };
}

async function connectPage(
  page: RequestedPage,
  longLivedUserToken: string,
  orgId?: string
): Promise<ConnectResult> {
  const fallbackName = page.name ?? page.id;

  const pageTokenData = await fetchPageToken(page.id, longLivedUserToken);
  if (pageTokenData.error || !pageTokenData.access_token) {
    console.error("Page token fetch error:", pageTokenData.error);
    return {
      pageId: page.id,
      name: fallbackName,
      success: false,
      error:
        "No Page access token. Ask a business admin to assign you to this Page in Business settings → Pages, with the Manage and Messages tasks.",
    };
  }

  // Prefer the name Facebook reports over whatever the browser sent.
  const name: string = pageTokenData.name ?? fallbackName;
  const nonExpiringPageToken: string = pageTokenData.access_token;

  const subData = await subscribeApp(page.id, nonExpiringPageToken);
  if (subData.error) {
    console.error("Facebook subscription error:", subData.error);
    return {
      pageId: page.id,
      name,
      success: false,
      error: subData.error.message ?? "Failed to subscribe the app to this Page.",
    };
  }

  const saved = await savePage({
    pageId: page.id,
    name,
    accessToken: nonExpiringPageToken,
    userToken: longLivedUserToken,
    orgId,
  });
  if (!saved.ok) {
    console.error("Backend error:", saved.body);
    return { pageId: page.id, name, success: false, error: "Failed to save this Page." };
  }

  return { pageId: page.id, name, success: true };
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const body = await req.json();

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const requestedPages = readRequestedPages(body);
  if (!requestedPages.length) {
    return NextResponse.json({ error: "Select at least one Page" }, { status: 400 });
  }

  try {
    // Which organization these Pages belong to. Resolved server-side so the
    // browser never has to know (or be trusted with) the org id.
    let orgId: string | undefined;
    if (typeof body.orgSlug === "string" && body.orgSlug.trim()) {
      const resolved = await resolveOrgId(body.orgSlug);
      if (!resolved) {
        return NextResponse.json(
          { error: "No organization found with that workspace name." },
          { status: 400 }
        );
      }
      orgId = resolved;
    }

    const shortLivedUserToken = token.accessToken as string;

    const exchangeRes = await fetch(
      `${GRAPH_URL}/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: process.env.FACEBOOK_CLIENT_ID!,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
          fb_exchange_token: shortLivedUserToken,
        }),
      { method: "GET" }
    );

    const exchangeData = await exchangeRes.json();

    if (exchangeData.error) {
      console.error("Token exchange error:", exchangeData.error);
      return NextResponse.json(
        { error: "Failed to exchange user token", detail: exchangeData.error },
        { status: 400 }
      );
    }

    const longLivedUserToken: string = exchangeData.access_token;

    // Sequential on purpose: a portfolio-sized batch is small, and Facebook is
    // happier without a burst of parallel writes against the same user token.
    const results: ConnectResult[] = [];
    for (const page of requestedPages) {
      results.push(await connectPage(page, longLivedUserToken, orgId));
    }

    const connected = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json(
      {
        // Partial success still counts as success; the per-Page results say what failed.
        success: connected.length > 0,
        results,
        connectedCount: connected.length,
        ...(failed.length && connected.length === 0 ? { error: failed[0].error } : {}),
      },
      { status: connected.length ? 200 : 400 }
    );
  } catch (err) {
    console.error("Error connecting pages:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
