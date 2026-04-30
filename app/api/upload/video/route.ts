import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const ALLOWED = ["video/mp4", "video/webm", "video/ogg"];
const EXT: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogg" };

export async function POST(request: Request): Promise<Response> {
  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim();

  // Local dev (no blob token): accept raw binary body and write to public/
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    if (!ALLOWED.includes(contentType)) {
      return NextResponse.json({ error: "รองรับเฉพาะ MP4, WebM, OGG" }, { status: 400 });
    }
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: "ไม่มีไฟล์" }, { status: 400 });
    }
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "กรุณาตั้งค่า BLOB_READ_WRITE_TOKEN สำหรับการใช้งานจริง" },
        { status: 501 }
      );
    }
    const filename = `uploads/${randomUUID()}.${EXT[contentType] ?? "mp4"}`;
    await writeFile(join(process.cwd(), "public", filename), Buffer.from(bytes));
    return NextResponse.json({ url: `/${filename}` });
  }

  // Production: client-side upload token + completion callback
  const body = (await request.json()) as HandleUploadBody;
  const json = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ALLOWED,
      maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
    }),
    onUploadCompleted: async () => {
      // no-op: client reads blob.url directly
    },
  });
  return NextResponse.json(json);
}
