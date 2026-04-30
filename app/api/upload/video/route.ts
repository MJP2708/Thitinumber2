import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const ALLOWED = ["video/mp4", "video/webm", "video/ogg"];
const EXT: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogg" };

export async function POST(request: Request): Promise<Response> {
  try {
    const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim();

    // Production: Vercel Blob client-side token flow (JSON body only)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      if (contentType !== "application/json") {
        return NextResponse.json(
          { error: "ส่งไฟล์วิดีโอโดยตรงไม่ได้ในโหมดนี้" },
          { status: 400 }
        );
      }
      const body = (await request.json()) as HandleUploadBody;
      const json = await handleUpload({
        token: process.env.BLOB_READ_WRITE_TOKEN,
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
        }),
        onUploadCompleted: async ({ blob: _blob }) => {
          // no-op: client reads blob.url directly from upload() return value
        },
      });
      return NextResponse.json(json);
    }

    // Local dev fallback: accept raw binary and write to public/uploads/
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
    console.error("Video upload failed", error);
    const message = error instanceof Error ? error.message : "อัปโหลดวิดีโอไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
