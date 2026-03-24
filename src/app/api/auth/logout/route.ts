import { NextResponse } from "next/server";
import { clearTokenOnResponse } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearTokenOnResponse(response);
  return response;
}
