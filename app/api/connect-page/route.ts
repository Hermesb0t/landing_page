import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const body = await req.json();
  const { pageId, pageAccessToken, name } = body;

  if (!pageId || !pageAccessToken) {
    return NextResponse.json({ error: "Missing pageId or pageAccessToken" }, { status: 400 });
  }


  try {
    const shortLivedUserToken = token?.accessToken as string;

    const exchangeRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?` +
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

    const pageTokenRes = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}?` +
        new URLSearchParams({
          fields: "access_token",
          access_token: longLivedUserToken,
        })
    );
    const pageTokenData = await pageTokenRes.json();

    if (pageTokenData.error) {
      console.error("Page token fetch error:", pageTokenData.error);
      return NextResponse.json(
        { error: "Failed to get page access token", detail: pageTokenData.error },
        { status: 400 }
      );
    }

    const nonExpiringPageToken: string = pageTokenData.access_token;

    const subRes = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/subscribed_apps?access_token=${nonExpiringPageToken}`,
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
        }),
      }
    );
    const subData = await subRes.json();

    if (subData.error) {
      console.error("Facebook subscription error:", subData.error);
      return NextResponse.json({ error: subData.error }, { status: 400 });
    }

    const backendRes = await fetch(`${process.env.BACKEND_URL}/pages`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
          pageId: pageId,
          name: name,
          accessToken: nonExpiringPageToken,
          userToken: longLivedUserToken,
      }),
    });

    if (!backendRes.ok) {
      const errData = await backendRes.json();
      console.error("Backend error:", errData);
      return NextResponse.json(
        { error: "Failed to save page", detail: errData },
        { status: backendRes.status }
      );
    }

    const backendData = await backendRes.json();
    console.log(backendData)
    return NextResponse.json({ success: true, res: backendData, subscribed: subData.success });
  } catch (err) {
    console.error("Error subscribing page:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
