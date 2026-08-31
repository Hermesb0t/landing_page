export const GRAPH_VERSION = process.env.FACEBOOK_GRAPH_VERSION || "v20.0";
export const GRAPH_URL = `https://graph.facebook.com/${GRAPH_VERSION}`;

const PAGE_FIELDS = "id,name,access_token,tasks,picture{url}";

export interface GraphError {
  message: string;
  type?: string;
  code?: number;
  error_subcode?: number;
}

export interface GraphPage {
  id: string;
  name: string;
  access_token?: string;
  tasks?: string[];
  picture?: { data?: { url?: string } };
}

/** A Page as the dashboard sees it: where it came from and whether we can act on it. */
export interface ConnectablePage {
  id: string;
  name: string;
  pictureUrl?: string;
  tasks: string[];
  /** "personal" = returned by /me/accounts, otherwise the Business Manager it belongs to. */
  source: "personal" | "business";
  businessId?: string;
  businessName?: string;
  /** Which portfolio bucket this Page belongs to — a business id, or "personal". */
  portfolioId: string;
  /** Whether the login gave us a Page access token — without one, connecting will fail. */
  hasToken: boolean;
}

/** A Business Portfolio (Business Manager) the person belongs to. */
export interface BusinessPortfolio {
  id: string;
  name: string;
  /** How many connectable Pages we found under it — 0 means nothing to offer here. */
  pageCount: number;
}

/** Stand-in portfolio for Pages held through a personal role rather than a business. */
export const PERSONAL_PORTFOLIO_ID = "personal";
export const PERSONAL_PORTFOLIO_NAME = "Pages you manage personally";

export interface PageDiscoveryResult {
  /** Portfolios to choose from, personal first. */
  businesses: BusinessPortfolio[];
  pages: ConnectablePage[];
  /** Non-fatal problems (e.g. business_management not granted) worth showing the user. */
  warnings: string[];
  /** True when Facebook rejected a call because a permission is missing → re-consent needed. */
  needsReauth: boolean;
}

/** Missing/expired permission, as opposed to a real failure. */
function isPermissionError(error?: GraphError) {
  return error?.code === 10 || error?.code === 200 || error?.type === "OAuthException";
}

/** Follows `paging.next` so businesses with many Pages are not truncated at 25. */
async function graphList<T>(
  path: string,
  accessToken: string,
  params: Record<string, string> = {}
): Promise<{ data: T[]; error?: GraphError }> {
  const out: T[] = [];
  let url =
    `${GRAPH_URL}/${path}?` +
    new URLSearchParams({ ...params, limit: "100", access_token: accessToken });

  while (url) {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) return { data: out, error: json.error as GraphError };
    out.push(...((json.data ?? []) as T[]));
    url = json.paging?.next ?? "";
    // Guard against a pathological paging loop.
    if (out.length > 1000) break;
  }

  return { data: out };
}

function toConnectable(
  page: GraphPage,
  source: ConnectablePage["source"],
  business?: { id: string; name: string }
): ConnectablePage {
  return {
    id: page.id,
    name: page.name,
    pictureUrl: page.picture?.data?.url,
    tasks: page.tasks ?? [],
    source,
    businessId: business?.id,
    businessName: business?.name,
    portfolioId: business?.id ?? PERSONAL_PORTFOLIO_ID,
    hasToken: Boolean(page.access_token),
  };
}

/**
 * `/me/accounts` only returns Pages the person holds a direct role on. Pages owned by a
 * Business Manager show up under the business instead, so we walk `/me/businesses` and
 * collect both owned and client Pages, then merge everything by Page id.
 */
export async function discoverPages(userAccessToken: string): Promise<PageDiscoveryResult> {
  const warnings: string[] = [];
  let needsReauth = false;

  const byId = new Map<string, ConnectablePage>();
  const add = (page: ConnectablePage) => {
    const existing = byId.get(page.id);
    if (!existing) {
      byId.set(page.id, page);
      return;
    }
    // Keep whichever copy actually carries a token, and keep the business label if we have one.
    const businessId = existing.businessId ?? page.businessId;
    byId.set(page.id, {
      ...existing,
      hasToken: existing.hasToken || page.hasToken,
      tasks: existing.tasks.length ? existing.tasks : page.tasks,
      businessId,
      businessName: existing.businessName ?? page.businessName,
      portfolioId: businessId ?? PERSONAL_PORTFOLIO_ID,
      source: existing.source === "business" ? "business" : page.source,
    });
  };

  const accounts = await graphList<GraphPage>("me/accounts", userAccessToken, {
    fields: PAGE_FIELDS,
  });
  if (accounts.error) {
    if (isPermissionError(accounts.error)) needsReauth = true;
    warnings.push(`Could not read your Pages: ${accounts.error.message}`);
  }
  accounts.data.forEach((p) => add(toConnectable(p, "personal")));

  const businesses = await graphList<{ id: string; name: string }>(
    "me/businesses",
    userAccessToken,
    { fields: "id,name" }
  );
  if (businesses.error) {
    if (isPermissionError(businesses.error)) needsReauth = true;
    warnings.push(
      `Could not read your business portfolios (grant "business_management" to see Pages owned by a business): ${businesses.error.message}`
    );
  }

  for (const business of businesses.data) {
    for (const edge of ["owned_pages", "client_pages"] as const) {
      const result = await graphList<GraphPage>(`${business.id}/${edge}`, userAccessToken, {
        fields: PAGE_FIELDS,
      });
      if (result.error) {
        if (isPermissionError(result.error)) needsReauth = true;
        warnings.push(`${business.name} (${edge}): ${result.error.message}`);
        continue;
      }
      result.data.forEach((p) => add(toConnectable(p, "business", business)));
    }
  }

  const pages = [...byId.values()].sort(
    (a, b) =>
      (a.businessName ?? "").localeCompare(b.businessName ?? "") || a.name.localeCompare(b.name)
  );

  const countIn = (portfolioId: string) =>
    pages.filter((p) => p.portfolioId === portfolioId).length;

  // Businesses with no Pages are still listed: seeing an empty portfolio is the
  // clue that the app was not granted access to its Pages.
  const portfolios: BusinessPortfolio[] = businesses.data.map((b) => ({
    id: b.id,
    name: b.name,
    pageCount: countIn(b.id),
  }));

  const personalCount = countIn(PERSONAL_PORTFOLIO_ID);
  if (personalCount > 0) {
    portfolios.unshift({
      id: PERSONAL_PORTFOLIO_ID,
      name: PERSONAL_PORTFOLIO_NAME,
      pageCount: personalCount,
    });
  }

  return { businesses: portfolios, pages, warnings, needsReauth };
}
