import { NextResponse } from "next/server";
import { INITIAL_ADMIN_USER } from "@/lib/seedData";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      admin: {
        email: INITIAL_ADMIN_USER.email,
        role: INITIAL_ADMIN_USER.role,
        status: INITIAL_ADMIN_USER.status,
      },
      message: "Initial Administrator registered successfully for Karur WSRS."
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
