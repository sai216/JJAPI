// app/api/session/route.ts
import { NextResponse } from 'next/server';
import { generateJwt } from '@coinbase/cdp-sdk/auth';

const CDP_KEY_ID = process.env.CDP_API_KEY_ID!;
const CDP_KEY_SECRET = process.env.CDP_API_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const { addresses, assets } = await req.json();

    // 1) Sign a JWT for the Onramp Session Token API
    const jwt = await generateJwt({
      apiKeyId: CDP_KEY_ID,
      apiKeySecret: CDP_KEY_SECRET,
      requestMethod: 'POST',
      requestHost: 'api.developer.coinbase.com',
      requestPath: '/onramp/v1/token',
      expiresIn: 120,
    });

    // 2) Exchange JWT for a one-time session token
    const res = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addresses, assets }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json(); // { token, channel_id? }
    return NextResponse.json({ token: data.token });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
