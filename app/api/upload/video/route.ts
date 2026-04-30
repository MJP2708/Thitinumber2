import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const EXT_MAP: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogg",
};

export async function POST(request: Request) {
  try {
    const mimeType = (request.headers.get("content-type") ?? "").split(";")[0].trim();

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "รองรับเฉพาะ MP4, WebM, OGG" }, { status: 400 });
    }

    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: "ไม่มีไฟล์" }, { status: 400 });
    }

    const ext = EXT_MAP[mimeType] ?? "mp4";
    const filename = `uploads/${randomUUID()}.${ext}`;

    // Vercel Blob (production with token)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(filename, bytes, { access: "public", contentType: mimeType });
      return NextResponse.json({ url: blob.url });
    }

    // Local dev: write to public/uploads
    if (process.env.NODE_ENV === "development") {
      await writeFile(join(process.cwd(), "public", filename), Buffer.from(bytes));
      return NextResponse.json({ url: `/${filename}` });
    }

    return NextResponse.json(
      { error: "ไม่รองรับการอัปโหลดวิดีโอในโหมดนี้ กรุณาตั้งค่า BLOB_READ_WRITE_TOKEN" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Video upload failed", error);
    return NextResponse.json({ error: "อัปโหลดวิดีโอไม่สำเร็จ" }, { status: 500 });
  }
}
