import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = await getToken({ req: req as any });

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/me/accounts?access_token=${token.accessToken}`
    );
    const data = await res.json();

    if (data.error) {
      console.error("Facebook API error:", data.error);
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ pages: data.data });
  } catch (err) {
    console.error("Error fetching pages:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
