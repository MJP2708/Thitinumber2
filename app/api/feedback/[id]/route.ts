import { NextResponse } from "next/server";
import { deleteFeedbackRecord } from "@/lib/db";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await deleteFeedbackRecord(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete feedback", error);
    return NextResponse.json({ error: "ลบความคิดเห็นไม่สำเร็จ" }, { status: 500 });
  }
}
