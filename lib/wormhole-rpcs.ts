// lib/wormhole-rpcs.ts
import { RPCS, type ChainKey, type RpcBag } from './config';

export type Net = 'Mainnet' | 'Testnet';

// map our ChainKey -> Wormhole Connect chain id (only include chains Connect supports)
const CONNECT_CHAIN_IDS: Partial<Record<ChainKey, string>> = {
  Ethereum: 'ethereum',
  Base: 'base',
  Polygon: 'polygon',
  Arbitrum: 'arbitrum',
  Bsc: 'bsc',
  Avalanche: 'avalanche',
  Solana: 'solana',
  // Bitcoin: 'bitcoin', // include only if Connect supports it in your version
  // Sui: 'sui',         // include only if Connect supports it in your version
};

export function getRpcs(net: Net): Record<string, string> {
  const src: RpcBag = net === 'Mainnet' ? RPCS.mainnet : RPCS.testnet;
  const out: Record<string, string> = {};

  for (const k of Object.keys(src) as ChainKey[]) {
    const url = src[k];
    const id = CONNECT_CHAIN_IDS[k];
    if (url && url.trim() && id) {
      out[id] = url.trim();
    }
  }
  return out;
}

export function getChains(rpcs: Record<string, string>): string[] {
  return Object.keys(rpcs);
}
