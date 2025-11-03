import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const body = await req.json();
  const { pageId } = body;

  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
  }

  console.log("Connecting page:", pageId);

  // TODO: call Facebook Graph API to subscribe the chatbot
  // Example (once you have the Page access token):
  const subscribed_apps = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/subscribed_apps`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscribed_fields: [
            "messages",
            "messaging_postbacks",
            "messaging_optins",
            "messaging_handovers",
          ],
          access_token: token.accessToken,
        }),
      }
    );

  return NextResponse.json({ success: true });
}
