import { NextResponse } from "next/server";
import { likeFeedbackRecord } from "@/lib/db";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const updated = await likeFeedbackRecord(id);
    if (!updated) return NextResponse.json({ error: "ไม่พบความคิดเห็นนี้" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to like feedback", error);
    return NextResponse.json({ error: "กดเห็นด้วยไม่สำเร็จ" }, { status: 500 });
  }
}
