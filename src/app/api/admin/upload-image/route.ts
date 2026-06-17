import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

function extFromMime(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/svg+xml") return "svg";
  return "bin";
}

export async function POST(request: Request) {
  try {
    const authorized = await isAuthorizedAdminRequest(request);
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }

    const ext = extFromMime(file.type);
    const safeName = `${Date.now()}-${randomUUID()}.${ext}`;
    const relativeUrl = `/images/uploads/${safeName}`;
    const absoluteDir = join(process.cwd(), "public", "images", "uploads");
    const absolutePath = join(absoluteDir, safeName);

    await mkdir(absoluteDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(absolutePath, buffer);

    return NextResponse.json({ success: true, url: relativeUrl });
  } catch (error) {
    console.error("UPLOAD ERROR", error);

    // Serverless platforms often have a read-only filesystem.
    // Fall back to returning a data URL so the image can still be persisted
    // inside storefront content stored in the database.
    try {
      const formData = await request.formData();
      const file = formData.get("file");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
        return NextResponse.json({ success: true, url: dataUrl, storage: "inline" });
      }
    } catch {}

    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to upload image" }, { status: 500 });
  }
}
