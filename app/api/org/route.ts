import { NextResponse, NextRequest } from "next/server";
import { findOrg } from "@/lib/org";

/** Confirms the workspace slug (or org name) the client entered is a real organization. */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";

  if (!slug.trim()) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const org = await findOrg(slug);
    if (!org) {
      return NextResponse.json(
        {
          error:
            "We could not match that to an organization. Try the workspace name from your dashboard URL — or skip this step and we will link the Page for you.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ org });
  } catch (err) {
    console.error("Error looking up org:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
