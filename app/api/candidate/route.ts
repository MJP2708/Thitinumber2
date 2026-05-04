import { NextResponse } from "next/server";
import { updateCandidateInfo } from "@/lib/db";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const candidate = await request.json();
    if (!candidate.name?.trim() || !candidate.number || !candidate.electionDate) {
      return NextResponse.json({ error: "ข้อมูลผู้สมัครไม่ครบ" }, { status: 400 });
    }
    return NextResponse.json(await updateCandidateInfo(candidate));
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to update candidate", error);
    return NextResponse.json({ error: "บันทึกข้อมูลผู้สมัครไม่สำเร็จ" }, { status: 500 });
  }
}
