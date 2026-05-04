import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const mimeType = (request.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG, WEBP, GIF" }, { status: 400 });
    }

    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: "ไม่มีไฟล์" }, { status: 400 });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const ext = EXT_MAP[mimeType] ?? "jpg";
      const filename = `uploads/${randomUUID()}.${ext}`;
      const blob = await put(filename, bytes, { access: "public", contentType: mimeType });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.NODE_ENV === "development") {
      const ext = EXT_MAP[mimeType] ?? "jpg";
      const filename = `uploads/${randomUUID()}.${ext}`;
      await writeFile(join(process.cwd(), "public", filename), Buffer.from(bytes));
      return NextResponse.json({ url: `/${filename}` });
    }

    const base64 = Buffer.from(bytes).toString("base64");
    return NextResponse.json({ url: `data:${mimeType};base64,${base64}` });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload failed", error);
    return NextResponse.json({ error: "อัปโหลดไม่สำเร็จ" }, { status: 500 });
  }
}
