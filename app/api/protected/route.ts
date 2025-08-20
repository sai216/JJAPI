// app/api/protected/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // If the request reached here, x.402 is satisfied (or not required)
  return NextResponse.json({
    ok: true,
    secret: 'unlocked 🤫 (x402 paid/allowed)',
    ts: Date.now(),
  });
}
