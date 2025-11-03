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
  await fetch(`https://graph.facebook.com/${pageId}/subscribed_apps?access_token=${token.accessToken}`, { method: "POST" })

  return NextResponse.json({ success: true });
}
