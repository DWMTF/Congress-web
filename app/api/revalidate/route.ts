import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    const configuredSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const tag = body?._type;

    if (tag) {
      try {
        revalidateTag(tag, { expire: 0 });
      } catch {
        // Tag revalidation fallback
      }
    }

    // Revalidate primary pages
    revalidatePath("/", "page");
    revalidatePath("/press", "page");
    revalidatePath("/sponsorship", "page");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
