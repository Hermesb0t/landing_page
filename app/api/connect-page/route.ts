import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pageId, pageAccessToken } = body;

  if (!pageId || !pageAccessToken) {
    return NextResponse.json({ error: "Missing pageId or pageAccessToken" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/subscribed_apps`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscribed_fields: ["messages", "messaging_postbacks", "messaging_optins", "messaging_handovers"],
          access_token: pageAccessToken,
        }),
      }
    );

    const data = await res.json();
    if (data.error) {
      console.error("Facebook API error:", data.error);
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error subscribing page:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
