import { NextRequest, NextResponse } from "next/server";

// Stripe webhooks have been disabled - payment system removed
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: "Stripe webhooks disabled - payment system removed" },
    { status: 200 }
  );
}
