import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Module from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";

// Use the project's existing TypeScript compiler; no test runtime dependency.
const filename = fileURLToPath(new URL("../lib/facebook.ts", import.meta.url));
const compiled = new Module(filename);
compiled._compile(ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { discoverPages } = compiled.exports;

const pagePermissions = [
  "pages_show_list", "pages_read_engagement", "pages_manage_metadata", "pages_messaging",
];
const permissions = (businessStatus = "granted") => ({ data: [
  ...pagePermissions.map((permission) => ({ permission, status: "granted" })),
  ...(businessStatus ? [{ permission: "business_management", status: businessStatus }] : []),
] });
const page = (id, extra = {}) => ({ id, name: `Page ${id}`, ...extra });

function mockGraph(t, routes) {
  const calls = [];
  t.mock.method(global, "fetch", async (input, options) => {
    const url = new URL(input);
    const endpoint = url.pathname.replace(/^\/v[^/]+\//, "");
    const key = url.searchParams.has("after")
      ? `${endpoint}?after=${url.searchParams.get("after")}` : endpoint;
    calls.push(key);
    assert.equal(options?.cache, "no-store");
    assert.ok(Object.hasOwn(routes, key), `Unexpected Graph request: ${key}`);
    return { ok: true, json: async () => routes[key] };
  });
  return calls;
}

for (const status of [undefined, "declined", "expired"]) {
  test(`business permission ${status ?? "absent"}: preserve available Pages and offer consent`, async (t) => {
    const calls = mockGraph(t, {
      "me/permissions": permissions(status ?? ""),
      "me/accounts": { data: [page("1", { access_token: "secret-page-token" })] },
    });
    const result = await discoverPages("user-token");
    assert.equal(result.needsReauth, true);
    assert.equal(result.pages[0].id, "1");
    assert.match(result.warnings[0], /has not granted access to your business/);
    assert.ok(!calls.includes("me/businesses"));
    assert.ok(!JSON.stringify(result).includes("secret-page-token"));
  });
}

test("screenshot error with granted permission points to business/app access, not repeated consent", async (t) => {
  mockGraph(t, {
    "me/permissions": permissions(),
    "me/accounts": { data: [] },
    "me/businesses": { error: { code: 100, type: "OAuthException", message: "(#100) Missing Permission" } },
  });
  const result = await discoverPages("user-token");
  assert.equal(result.needsReauth, false);
  assert.match(result.warnings[0], /business admin/);
  assert.match(result.warnings[0], /app's business access approval/);
});

test("code 100 missing permission still offers recovery when permission check is unavailable", async (t) => {
  mockGraph(t, {
    "me/permissions": { error: { code: 2, message: "Temporarily unavailable" } },
    "me/accounts": { data: [] },
    "me/businesses": { error: { code: 100, message: "Missing Permission" } },
  });
  assert.equal((await discoverPages("user-token")).needsReauth, true);
});

test("expired Facebook session requests a new login without querying assets", async (t) => {
  const calls = mockGraph(t, {
    "me/permissions": { error: { code: 190, message: "Expired token" } },
  });
  const result = await discoverPages("expired-token");
  assert.equal(result.needsReauth, true);
  assert.match(result.warnings[0], /expired or was revoked/);
  assert.deepEqual(calls, ["me/permissions"]);
});

test("owned and client Pages resolve missing tokens and merge duplicates without exposing tokens", async (t) => {
  const calls = mockGraph(t, {
    "me/permissions": permissions(),
    "me/accounts": { data: [page("1", { access_token: "personal-secret", tasks: ["MANAGE"] })] },
    "me/businesses": { data: [{ id: "b1", name: "Business" }] },
    "b1/owned_pages": { data: [page("1"), page("2")] },
    "b1/client_pages": { data: [page("2"), page("3")] },
    "2": { access_token: "business-secret" },
    "3": { error: { code: 200, message: "Page access denied" } },
  });
  const result = await discoverPages("user-token");
  assert.deepEqual(result.pages.map((p) => [p.id, p.portfolioId, p.hasToken]), [
    ["1", "b1", true], ["2", "b1", true], ["3", "b1", false],
  ]);
  assert.equal(result.businesses[0].pageCount, 3);
  assert.deepEqual(result.pages[0].tasks, ["MANAGE"]);
  assert.equal(calls.filter((call) => call === "2").length, 1);
  assert.ok(!calls.includes("1"));
  assert.ok(!JSON.stringify(result).includes("secret"));
});

test("business Pages from earlier pagination responses survive a later error", async (t) => {
  mockGraph(t, {
    "me/permissions": permissions(),
    "me/accounts": { data: [] },
    "me/businesses": { data: [{ id: "b1", name: "Business" }] },
    "b1/owned_pages": {
      data: [page("1", { access_token: "page-secret" })],
      paging: { next: "https://graph.facebook.com/v20.0/b1/owned_pages?after=next" },
    },
    "b1/owned_pages?after=next": { error: { code: 2, type: "OAuthException", message: "Temporary failure" } },
    "b1/client_pages": { data: [] },
  });
  const result = await discoverPages("user-token");
  assert.equal(result.pages.length, 1);
  assert.equal(result.needsReauth, false);
  assert.match(result.warnings[0], /Temporary failure/);
});

test("empty asset selection offers reconnection even when scopes are granted", async (t) => {
  mockGraph(t, {
    "me/permissions": permissions(),
    "me/accounts": { data: [] },
    "me/businesses": { data: [] },
  });
  const result = await discoverPages("user-token");
  assert.equal(result.needsReauth, true);
  assert.match(result.warnings[0], /select the business and Pages/);
});

test("missing Messenger permission offers reconnection even with business access", async (t) => {
  const granted = permissions();
  granted.data = granted.data.filter((p) => p.permission !== "pages_messaging");
  mockGraph(t, {
    "me/permissions": granted,
    "me/accounts": { data: [page("1", { access_token: "page-secret" })] },
    "me/businesses": { data: [] },
  });
  const result = await discoverPages("user-token");
  assert.equal(result.needsReauth, true);
  assert.match(result.warnings[0], /permissions needed to connect Messenger/);
});
