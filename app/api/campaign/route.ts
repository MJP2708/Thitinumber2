import { NextResponse } from "next/server";
import { getCampaignData } from "@/lib/db";

export async function GET() {
  try {
    return NextResponse.json(await getCampaignData());
  } catch (error) {
    console.error("Failed to fetch campaign data", error);
    return NextResponse.json({ error: "โหลดข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
