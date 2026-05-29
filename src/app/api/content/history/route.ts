import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAuthorizedAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const authorized = await isAuthorizedAdminRequest(request);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshots = await prisma.contentSnapshot.findMany({
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      snapshots: snapshots.map((s) => ({
        name: s.id,
        label: s.name,
        modifiedAt: s.createdAt.toISOString(),
      })),
    });
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
    const snapshotId = body.snapshot;

    if (!snapshotId || typeof snapshotId !== "string") {
      return NextResponse.json({ error: "Invalid snapshot ID" }, { status: 400 });
    }

    const snapshot = await prisma.contentSnapshot.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
    }

    // Save current content as a pre-restore snapshot
    const current = await prisma.storefrontContent.findUnique({ where: { id: "live" } });
    if (current) {
      await prisma.contentSnapshot.create({
        data: {
          name: `Pre-restore backup`,
          data: current.data as object,
        },
      });
    }

    // Restore the snapshot as live content
    await prisma.storefrontContent.upsert({
      where: { id: "live" },
      update: { data: snapshot.data as object },
      create: { id: "live", data: snapshot.data as object },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to restore snapshot" }, { status: 500 });
  }
}
