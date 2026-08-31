import { NextResponse, NextRequest } from "next/server";
import { getPublicOrg } from "@/lib/org";

/** Confirms the workspace slug in the onboarding link belongs to a real organization. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";

  if (!slug.trim()) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const org = await getPublicOrg(slug);
    if (!org) {
      return NextResponse.json(
        { error: "No organization found with that workspace name." },
        { status: 404 }
      );
    }
    return NextResponse.json({ org });
  } catch (err) {
    console.error("Error looking up org:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
