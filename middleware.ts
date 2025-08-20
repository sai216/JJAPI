// middleware.ts
import type { NextRequest } from 'next/server';
import { paymentMiddleware } from 'x402-next';

// Protect the API routes you want paywalled
export const config = {
  matcher: ['/api/protected'],
};

export function middleware(req: NextRequest) {
  // Address that receives payments (from .env)
  const payTo = process.env.X402_PAYTO_ADDRESS ?? '0x0000000000000000000000000000000000000000';

  // Price & network per route (test on Base Sepolia first)
  const routes = {
    '/api/protected': {
      price: '$0.01',
      network: 'base-sepolia', // switch to 'base' for mainnet later
      config: { description: 'Access to premium API' },
    },
  } as const;

  // Delegate to x402 middleware
  return paymentMiddleware(payTo, routes)(req);
}
