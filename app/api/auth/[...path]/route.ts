import { getAuthHandler } from "@/lib/auth";
import type { NextRequest } from "next/server";

type Ctx = { params: Promise<{ path: string[] }> };

export function GET(req: NextRequest, ctx: Ctx) {
  return getAuthHandler().GET(req, ctx);
}

export function POST(req: NextRequest, ctx: Ctx) {
  return getAuthHandler().POST(req, ctx);
}
