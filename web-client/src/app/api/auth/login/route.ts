import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://localhost:8000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const backendResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      return NextResponse.json(
        data || { message: "Đăng nhập không thành công." },
        { status: backendResponse.status }
      );
    }

    const token = data?.data?.token;
    const user = data?.data?.user;

    const cookieStore = await cookies();
    if (token) {
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      if (user?.role) {
        cookieStore.set("user_role", user.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { user },
      message: data?.message || "Đăng nhập thành công.",
    });
  } catch (error) {
    console.error("[Auth Login Proxy Error]:", error);
    return NextResponse.json(
      { message: "Không thể kết nối đến máy chủ API." },
      { status: 500 }
    );
  }
}
