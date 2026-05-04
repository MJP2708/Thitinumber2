import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

const ALLOWED = ["video/mp4", "video/webm", "video/ogg"];
const EXT: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogg" };

export async function POST(request: Request): Promise<Response> {
  try {
    await requireAdmin();

    const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim();

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      if (contentType !== "application/json") {
        return NextResponse.json({ error: "ส่งไฟล์วิดีโอโดยตรงไม่ได้ในโหมดนี้" }, { status: 400 });
      }
      const body = (await request.json()) as HandleUploadBody;
      const json = await handleUpload({
        token: process.env.BLOB_READ_WRITE_TOKEN,
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 500 * 1024 * 1024,
        }),
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(json);
    }

    if (!ALLOWED.includes(contentType)) {
      return NextResponse.json({ error: "รองรับเฉพาะ MP4, WebM, OGG" }, { status: 400 });
    }
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: "ไม่มีไฟล์" }, { status: 400 });
    }
    const filename = `uploads/${randomUUID()}.${EXT[contentType] ?? "mp4"}`;
    await writeFile(join(process.cwd(), "public", filename), Buffer.from(bytes));
    return NextResponse.json({ url: `/${filename}` });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Video upload failed", error);
    return NextResponse.json({ error: "อัปโหลดวิดีโอไม่สำเร็จ" }, { status: 500 });
  }
}
