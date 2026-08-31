/**
 * Organization lookup against the Hermes backend.
 *
 * The onboarding link a client receives carries their workspace slug
 * (`/channels?org=acme-clinic`), and every Page they connect is stored against
 * that organization. Two different calls are needed because the backend keeps
 * the org id private:
 *   - `getPublicOrg`  — unauthenticated, safe to echo to the browser (name/logo).
 *   - `resolveOrgId`  — admin-only, server-side, turns the slug into the id the
 *                       `/pages` endpoint expects.
 */

export interface OrgSummary {
  slug: string;
  name: string;
  imageUrl?: string;
}

const backendUrl = () => {
  const url = process.env.BACKEND_URL;
  if (!url) throw new Error("BACKEND_URL is not configured");
  return url.replace(/\/$/, "");
};

export const normalizeSlug = (slug: string) => slug.trim().toLowerCase();

/** Public org card for the slug, or null when it does not exist / is inactive. */
export async function getPublicOrg(slug: string): Promise<OrgSummary | null> {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;

  const res = await fetch(
    `${backendUrl()}/orgs/public/slug/${encodeURIComponent(normalized)}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.slug) return null;

  return { slug: data.slug, name: data.name, imageUrl: data.imageUrl };
}

/**
 * Finds an org by workspace slug OR by its display name — clients know their
 * clinic's name, not the slug buried in a dashboard URL.
 *
 * Returns the canonical slug only, never the id, and only ever on an exact
 * match: this runs for unauthenticated visitors, so it must not become a way to
 * browse the customer list.
 */
export async function findOrg(query: string): Promise<OrgSummary | null> {
  const normalized = normalizeSlug(query);
  if (!normalized) return null;

  const bySlug = await getPublicOrg(normalized);
  if (bySlug) return bySlug;

  const res = await fetch(
    `${backendUrl()}/orgs?` +
      new URLSearchParams({ search: normalized, page: "1", limit: "100" }),
    {
      headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error("Org lookup failed:", res.status, await res.text());
    return null;
  }

  const body = await res.json();
  const orgs: Array<{ slug?: string; name?: string; imageUrl?: string; isActive?: boolean }> =
    Array.isArray(body) ? body : body?.data ?? [];

  // `search` is a loose regex, so require the whole name to match, and bail out
  // when it is ambiguous rather than guessing at the client's org.
  const matches = orgs.filter(
    (o) => o.isActive !== false && (o.name ?? "").trim().toLowerCase() === normalized
  );
  if (matches.length !== 1 || !matches[0].slug) return null;

  const org = matches[0];
  return { slug: org.slug!, name: org.name ?? org.slug!, imageUrl: org.imageUrl };
}

/**
 * The org's ObjectId, for writing on the Page record. Uses the admin token, so
 * this must only ever run server-side.
 */
export async function resolveOrgId(slug: string): Promise<string | null> {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;

  const res = await fetch(
    `${backendUrl()}/orgs?` +
      new URLSearchParams({ search: normalized, page: "1", limit: "100" }),
    {
      headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error("Org lookup failed:", res.status, await res.text());
    return null;
  }

  const body = await res.json();
  // The list endpoint returns a bare array when unpaginated, `{ data }` otherwise.
  const orgs: Array<{ _id?: string; slug?: string }> = Array.isArray(body)
    ? body
    : body?.data ?? [];

  // `search` is a regex match, so pin down the exact slug ourselves.
  const match = orgs.find((o) => (o.slug ?? "").toLowerCase() === normalized);
  return match?._id ?? null;
}
