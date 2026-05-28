import { basename, join } from "path";
import { mkdir, readFile, readdir, stat, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

const CONTENT_FILE = join(process.cwd(), "data", "storefront-content.json");
const HISTORY_DIR = join(process.cwd(), "data", "history");

export async function GET(request: Request) {
  const authorized = await isAuthorizedAdminRequest(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await mkdir(HISTORY_DIR, { recursive: true });
    const files = await readdir(HISTORY_DIR);

    const snapshots = await Promise.all(
      files
        .filter((name) => name.endsWith(".json"))
        .map(async (name) => {
          const fullPath = join(HISTORY_DIR, name);
          const info = await stat(fullPath);
          return {
            name,
            size: info.size,
            modifiedAt: info.mtime.toISOString(),
          };
        }),
    );

    snapshots.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
    return NextResponse.json({ snapshots: snapshots.slice(0, 50) });
  } catch {
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authorized = await isAuthorizedAdminRequest(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { snapshot?: string };
    const snapshotName = body.snapshot;

    if (!snapshotName || snapshotName !== basename(snapshotName) || !snapshotName.endsWith(".json")) {
      return NextResponse.json({ error: "Invalid snapshot name" }, { status: 400 });
    }

    const snapshotPath = join(HISTORY_DIR, snapshotName);
    const snapshotContent = await readFile(snapshotPath, "utf-8");

    try {
      const current = await readFile(CONTENT_FILE, "utf-8");
      const timestamp = new Date().toISOString().replaceAll(":", "-");
      await mkdir(HISTORY_DIR, { recursive: true });
      await writeFile(join(HISTORY_DIR, `pre-restore-${timestamp}.json`), current, "utf-8");
    } catch {
      // Best-effort pre-restore backup.
    }

    await writeFile(CONTENT_FILE, snapshotContent, "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to restore snapshot" }, { status: 500 });
  }
}
