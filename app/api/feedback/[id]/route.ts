import { NextResponse } from "next/server";
import { deleteFeedbackRecord } from "@/lib/db";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await deleteFeedbackRecord(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to delete feedback", error);
    return NextResponse.json({ error: "ลบความคิดเห็นไม่สำเร็จ" }, { status: 500 });
  }
}
