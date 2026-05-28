import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

const CONTENT_FILE = join(process.cwd(), "data", "storefront-content.json");
const HISTORY_DIR = join(process.cwd(), "data", "history");

export async function GET() {
  try {
    const raw = await readFile(CONTENT_FILE, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAuthorizedAdminRequest(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid content body" }, { status: 400 });
    }

    const required = ["config", "products", "offers", "homepage", "testimonials", "categories", "pageLayout"];
    for (const key of required) {
      if (!(key in body)) {
        return NextResponse.json({ error: `Missing required field: ${key}` }, { status: 400 });
      }
    }

    try {
      const previous = await readFile(CONTENT_FILE, "utf-8");
      const timestamp = new Date().toISOString().replaceAll(":", "-");
      await mkdir(HISTORY_DIR, { recursive: true });
      await writeFile(join(HISTORY_DIR, `storefront-content-${timestamp}.json`), previous, "utf-8");
    } catch {
      // Best-effort snapshotting. Save should not fail if backup write fails.
    }

    await writeFile(CONTENT_FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
