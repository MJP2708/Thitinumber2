import { NextResponse } from "next/server";
import { updateCandidateInfo } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const candidate = await request.json();
    if (!candidate.name?.trim() || !candidate.number || !candidate.electionDate) {
      return NextResponse.json({ error: "ข้อมูลผู้สมัครไม่ครบ" }, { status: 400 });
    }

    return NextResponse.json(await updateCandidateInfo(candidate));
  } catch (error) {
    console.error("Failed to update candidate", error);
    return NextResponse.json({ error: "บันทึกข้อมูลผู้สมัครไม่สำเร็จ" }, { status: 500 });
  }
}
