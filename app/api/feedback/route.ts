import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const feedback = await request.json();
    if (!feedback.message?.trim()) {
      return NextResponse.json({ error: "เขียนข้อเสนอแนะก่อนนะ" }, { status: 400 });
    }

    return NextResponse.json(await createFeedback({
      name: feedback.name?.trim() || "",
      grade: feedback.grade?.trim() || undefined,
      category: feedback.category || "อื่น ๆ",
      message: feedback.message.trim(),
    }));
  } catch (error) {
    console.error("Failed to create feedback", error);
    return NextResponse.json({ error: "ส่งความคิดเห็นไม่สำเร็จ" }, { status: 500 });
  }
}
