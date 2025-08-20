import express, { Request, Response } from "express";
import cors from "cors";
import { config as loadEnv } from "dotenv";
import * as x402Pkg from "x402-express";

loadEnv();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Diagnose what's actually exported ----
const exportKeys = Object.keys(x402Pkg as any);
console.log("[x402-express] exports:", exportKeys);

// Try common names first, then any function export
const nameCandidates = [
  "x402",
  "x402Middleware",
  "withPaymentRequired",
  "middleware",
  "createMiddleware",
  "paywall",
  "default",
];

let x402: any = null;
for (const k of nameCandidates) {
  const v = (x402Pkg as any)[k];
  if (typeof v === "function") {
    x402 = v;
    console.log(`[x402-express] using export "${k}" as middleware`);
    break;
  }
}
if (!x402) {
  // Fallback: first function among all exports
  const anyFunc = exportKeys
    .map((k) => [k, (x402Pkg as any)[k]] as const)
    .find(([, v]) => typeof v === "function");
  if (anyFunc) {
    x402 = anyFunc[1];
    console.log(`[x402-express] using fallback export "${anyFunc[0]}" as middleware`);
  }
}

if (!x402) {
  throw new Error(
    `[x402-express] Could not find a function export. Available: ${exportKeys.join(", ")}`
  );
}

// ---- Configurable price & chain (defaults for Base Sepolia) ----
const priceWei = BigInt(process.env.X402_PRICE_WEI ?? "1");
const chainId = Number(process.env.X402_CHAIN_ID ?? "84532");

// Enable paywall
app.use(x402({ price: priceWei, chainId }));

app.get("/", (_req: Request, res: Response) =>
  res.send("x402 resource server is up. Try /health or /weather")
);

app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

app.get("/weather", (_req: Request, res: Response) => {
  res.json({
    temp: 72,
    condition: "Sunny",
    location: "Base Sepolia (demo)",
  });
});

const PORT = 4021;
app.listen(PORT, () => {
  console.log(`resource server running at http://localhost:${PORT}`);
});
