import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "";
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "API unavailable" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "";
  try {
    const body = await request.json();
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "API unavailable" }, { status: 502 });
  }
}
