import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

const CONTENT_FILE = join(process.cwd(), "data", "storefront-content.json");

export async function GET() {
  try {
    // Try database first (persisted edits)
    const row = await prisma.storefrontContent.findUnique({ where: { id: "live" } });
    if (row) {
      return NextResponse.json(row.data);
    }

    // Fallback to filesystem (initial deployment default)
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

    // Save a snapshot of previous content before overwriting
    const previous = await prisma.storefrontContent.findUnique({ where: { id: "live" } });
    if (previous) {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      await prisma.contentSnapshot.create({
        data: {
          name: `Auto-save ${timestamp}`,
          data: previous.data as object,
        },
      });
    }

    // Upsert content into database (persistent across deploys)
    await prisma.storefrontContent.upsert({
      where: { id: "live" },
      update: { data: body },
      create: { id: "live", data: body },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
