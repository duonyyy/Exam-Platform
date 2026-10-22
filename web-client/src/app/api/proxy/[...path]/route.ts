import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://localhost:8000/api/v1";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handleProxy(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    const subPath = path.join("/");
    const search = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${subPath}${search}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    const contentType = request.headers.get("Content-Type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    let body: BodyInit | null = null;
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      body = await request.text();
    }

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    });

    const data = await backendResponse.text();

    return new NextResponse(data, {
      status: backendResponse.status,
      headers: {
        "Content-Type": backendResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("[API Proxy Error]:", error);
    return NextResponse.json(
      { message: "Không thể kết nối đến hệ thống máy chủ Backend." },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}
