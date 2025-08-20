// mcp-x402/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor } from "x402-axios";
import { config as loadEnv } from "dotenv";

loadEnv();

// Normalize PRIVATE_KEY from .env (adds 0x, strips quotes/whitespace)
const normalizePrivateKey = (v: string | undefined): Hex => {
  if (!v) throw new Error("PRIVATE_KEY missing in .env");
  let k = v.trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'")))
    k = k.slice(1, -1);
  k = k.replace(/\s+/g, "");
  if (/^[0-9a-fA-F]{64}$/.test(k)) k = "0x" + k; // add 0x if user pasted raw hex
  if (!/^0x[0-9a-fA-F]{64}$/.test(k))
    throw new Error(`PRIVATE_KEY format invalid. Expect 0x + 64 hex, got length=${k.length}`);
  return k as Hex;
};

const privateKey = normalizePrivateKey(process.env.PRIVATE_KEY);
const baseURL = process.env.RESOURCE_SERVER_URL;
const endpointPath = process.env.ENDPOINT_PATH;

if (!baseURL || !endpointPath) {
  throw new Error("Missing env vars. Set RESOURCE_SERVER_URL and ENDPOINT_PATH in .env");
}

const account = privateKeyToAccount(privateKey);
const client = withPaymentInterceptor(axios.create({ baseURL }), account);

const server = new McpServer({ name: "x402-mcp-server", version: "1.0.0" });

// Tool to fetch the paywalled resource
server.tool(
  "get-paid-resource",
  "Fetch data from the x402-protected endpoint (e.g., /weather).",
  {},
  async () => {
    const res = await client.get(endpointPath);
    return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
  }
);

const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
