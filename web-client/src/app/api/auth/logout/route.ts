import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://localhost:8000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);
    }

    cookieStore.delete("auth_token");

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công.",
    });
  } catch (error) {
    console.error("[Auth Logout Proxy Error]:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi đăng xuất." },
      { status: 500 }
    );
  }
}
