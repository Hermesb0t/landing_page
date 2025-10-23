import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { pageId } = body;

  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
  }

  console.log("Connecting page:", pageId);

  // TODO: call Facebook Graph API to subscribe the chatbot
  // Example (once you have the Page access token):
  // await fetch(`https://graph.facebook.com/${pageId}/subscribed_apps?access_token=${pageAccessToken}`, { method: "POST" })

  return NextResponse.json({ success: true });
}
