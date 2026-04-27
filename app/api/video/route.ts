import { NextResponse } from "next/server";
import { updateVideoInfo } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const video = await request.json();
    return NextResponse.json(await updateVideoInfo({
      videoUrl: video.videoUrl || "",
      videoTitle: video.videoTitle || "",
      videoDescription: video.videoDescription || "",
    }));
  } catch (error) {
    console.error("Failed to update video", error);
    return NextResponse.json({ error: "บันทึกวิดีโอไม่สำเร็จ" }, { status: 500 });
  }
}
