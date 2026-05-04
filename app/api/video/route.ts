import { NextResponse } from "next/server";
import { updateVideoInfo } from "@/lib/db";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const video = await request.json();
    return NextResponse.json(await updateVideoInfo({
      videoUrl: video.videoUrl || "",
      videoTitle: video.videoTitle || "",
      videoDescription: video.videoDescription || "",
    }));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to update video", error);
    return NextResponse.json({ error: "บันทึกวิดีโอไม่สำเร็จ" }, { status: 500 });
  }
}
