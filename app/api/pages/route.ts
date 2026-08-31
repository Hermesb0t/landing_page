import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import { discoverPages } from "@/lib/facebook";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const result = await discoverPages(token.accessToken as string);

    // Only a hard failure when nothing at all came back.
    if (!result.pages.length && result.warnings.length) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching pages:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
