import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth";

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

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    const body = await request.json();
    const username = String(body.username ?? "").trim().slice(0, 64);
    const password = String(body.password ?? "").slice(0, 128);

    if (!username || !password) {
      return NextResponse.json({ error: "กรอกชื่อผู้ใช้และรหัสผ่าน" }, { status: 400 });
    }

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const adminUser = process.env.ADMIN_USERNAME ?? "";
    const adminPass = process.env.ADMIN_PASSWORD ?? "";

    const ok = safeCompare(username, adminUser) && safeCompare(password, adminPass);
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
