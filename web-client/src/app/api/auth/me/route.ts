import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://localhost:8000/api/v1";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthenticated.", success: false },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        cookieStore.delete("auth_token");
      }
      return NextResponse.json(
        data || { message: "Không thể xác thực thông tin." },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Auth Me Proxy Error]:", error);
    return NextResponse.json(
      { message: "Lỗi kết nối máy chủ xác thực." },
      { status: 500 }
    );
  }
}
