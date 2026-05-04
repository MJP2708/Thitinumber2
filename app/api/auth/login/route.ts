import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/db";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth";

// Simple in-memory rate limit: max 5 attempts per IP per 15 minutes.
// Note: resets on cold starts (serverless). Sufficient for a campaign site.
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "ลองเข้าสู่ระบบใหม่อีกครั้งใน 15 นาที" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const username = String(body.username ?? "").trim().slice(0, 64);
    const password = String(body.password ?? "").slice(0, 128);

    if (!username || !password) {
      return NextResponse.json({ error: "กรอกชื่อผู้ใช้และรหัสผ่าน" }, { status: 400 });
    }

    const ok = await authenticateAdmin(username, password);
    if (!ok) {
      return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const token = createSessionToken(username);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "เข้าสู่ระบบไม่สำเร็จ" }, { status: 500 });
  }
}
