import { NextResponse } from "next/server";
import { deletePolicyRecord, updatePolicyRecord } from "@/lib/db";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const policy = await request.json();
    if (!policy.title?.trim() || !policy.description?.trim()) {
      return NextResponse.json({ error: "กรอกชื่อนโยบายและรายละเอียดก่อนนะ" }, { status: 400 });
    }

    const updated = await updatePolicyRecord(id, {
      title: policy.title.trim(),
      category: policy.category || "อื่น ๆ",
      description: policy.description.trim(),
      impact: policy.impact || "",
      icon: policy.icon || "Lightbulb",
    });

    if (!updated) return NextResponse.json({ error: "ไม่พบนโยบายนี้" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update policy", error);
    return NextResponse.json({ error: "แก้ไขนโยบายไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await deletePolicyRecord(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete policy", error);
    return NextResponse.json({ error: "ลบนโยบายไม่สำเร็จ" }, { status: 500 });
  }
}
