import { NextResponse } from "next/server";
import { createPolicy } from "@/lib/db";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const policy = await request.json();
    if (!policy.title?.trim() || !policy.description?.trim()) {
      return NextResponse.json({ error: "กรอกชื่อนโยบายและรายละเอียดก่อนนะ" }, { status: 400 });
    }
    return NextResponse.json(await createPolicy({
      title: policy.title.trim(),
      category: policy.category || "อื่น ๆ",
      description: policy.description.trim(),
      impact: policy.impact || "",
      icon: policy.icon || "Lightbulb",
    }));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to create policy", error);
    return NextResponse.json({ error: "เพิ่มนโยบายไม่สำเร็จ" }, { status: 500 });
  }
}
