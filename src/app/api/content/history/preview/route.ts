import { basename, join } from "path";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

type DiffEntry = {
  path: string;
  before: string;
  after: string;
};

const CONTENT_FILE = join(process.cwd(), "data", "storefront-content.json");
const HISTORY_DIR = join(process.cwd(), "data", "history");
const MAX_DIFF_ENTRIES = 80;

function formatValue(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return value.length > 80 ? `${value.slice(0, 77)}...` : value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[array:${value.length}]`;
  if (typeof value === "object") return "[object]";
  return typeof value;
}

function diffValues(current: unknown, next: unknown, path: string, out: DiffEntry[]) {
  if (out.length >= MAX_DIFF_ENTRIES) {
    return;
  }

  if (Object.is(current, next)) {
    return;
  }

  const currentIsObject = current !== null && typeof current === "object";
  const nextIsObject = next !== null && typeof next === "object";

  if (!currentIsObject || !nextIsObject) {
    out.push({
      path: path || "root",
      before: formatValue(current),
      after: formatValue(next),
    });
    return;
  }

  if (Array.isArray(current) || Array.isArray(next)) {
    const left = Array.isArray(current) ? current : [];
    const right = Array.isArray(next) ? next : [];

    if (left.length !== right.length) {
      out.push({
        path: path || "root",
        before: `[array:${left.length}]`,
        after: `[array:${right.length}]`,
      });
      if (out.length >= MAX_DIFF_ENTRIES) return;
    }

    const sharedLength = Math.min(left.length, right.length);
    for (let i = 0; i < sharedLength; i += 1) {
      diffValues(left[i], right[i], `${path}[${i}]`, out);
      if (out.length >= MAX_DIFF_ENTRIES) return;
    }
    return;
  }

  const leftObj = current as Record<string, unknown>;
  const rightObj = next as Record<string, unknown>;
  const keys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);

  for (const key of keys) {
    diffValues(leftObj[key], rightObj[key], path ? `${path}.${key}` : key, out);
    if (out.length >= MAX_DIFF_ENTRIES) return;
  }
}

export async function POST(request: Request) {
  const authorized = await isAuthorizedAdminRequest(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { snapshot?: string };
    if (
      !body.snapshot ||
      body.snapshot !== basename(body.snapshot) ||
      !body.snapshot.endsWith(".json")
    ) {
      return NextResponse.json({ error: "Invalid snapshot name" }, { status: 400 });
    }

    const snapshotPath = join(HISTORY_DIR, body.snapshot);
    const [currentRaw, snapshotRaw] = await Promise.all([
      readFile(CONTENT_FILE, "utf-8"),
      readFile(snapshotPath, "utf-8"),
    ]);

    const current = JSON.parse(currentRaw) as Record<string, unknown>;
    const snapshot = JSON.parse(snapshotRaw) as Record<string, unknown>;

    const changes: DiffEntry[] = [];
    diffValues(current, snapshot, "", changes);

    const groupedChanges = changes.reduce<Record<string, number>>((acc, change) => {
      const normalized = change.path.startsWith("[") ? "root" : change.path;
      const section = normalized.split(/[.[\]]/)[0] || "root";
      acc[section] = (acc[section] ?? 0) + 1;
      return acc;
    }, {});

    const stats = {
      changedFields: changes.length,
      hasMore: changes.length >= MAX_DIFF_ENTRIES,
      productsNow: Array.isArray(current.products) ? current.products.length : 0,
      productsAfterRestore: Array.isArray(snapshot.products) ? snapshot.products.length : 0,
      offersNow: Array.isArray(current.offers) ? current.offers.length : 0,
      offersAfterRestore: Array.isArray(snapshot.offers) ? snapshot.offers.length : 0,
      testimonialsNow: Array.isArray(current.testimonials) ? current.testimonials.length : 0,
      testimonialsAfterRestore: Array.isArray(snapshot.testimonials) ? snapshot.testimonials.length : 0,
      categoriesNow: Array.isArray(current.categories) ? current.categories.length : 0,
      categoriesAfterRestore: Array.isArray(snapshot.categories) ? snapshot.categories.length : 0,
    };

    return NextResponse.json({
      snapshot: body.snapshot,
      stats,
      groupedChanges,
      changes,
    });
  } catch {
    return NextResponse.json({ error: "Failed to preview snapshot diff" }, { status: 500 });
  }
}
