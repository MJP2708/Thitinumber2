import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
