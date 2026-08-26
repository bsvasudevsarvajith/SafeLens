import { NextRequest, NextResponse } from "next/server";
import { INITIAL_REGIONS, INITIAL_CAMERAS } from "@/lib/seedData";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      regions: INITIAL_REGIONS,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
