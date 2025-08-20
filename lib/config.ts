// lib/config.ts
export type ChainKey =
  | 'Ethereum'
  | 'Base'
  | 'Polygon'
  | 'Arbitrum'
  | 'Bsc'
  | 'Avalanche'
  | 'Solana'
  | 'Bitcoin'   // optional, only if you actually intend to use it
  | 'Sui';      // optional, only if you actually intend to use it

export type RpcBag = Partial<Record<ChainKey, string>>;

export const RPCS: { mainnet: RpcBag; testnet: RpcBag } = {
  mainnet: {
    Ethereum: process.env.NEXT_PUBLIC_RPC_ETH_MAINNET || '',
    Base: process.env.NEXT_PUBLIC_RPC_BASE_MAINNET || '',
    Polygon: process.env.NEXT_PUBLIC_RPC_POLYGON_MAINNET || '',
    Arbitrum: process.env.NEXT_PUBLIC_RPC_ARBITRUM_MAINNET || '',
    Bsc: process.env.NEXT_PUBLIC_RPC_BSC_MAINNET || '',
    Avalanche: process.env.NEXT_PUBLIC_RPC_AVALANCHE_MAINNET || '',
    Solana: process.env.NEXT_PUBLIC_RPC_SOLANA_MAINNET || '',
    Bitcoin: process.env.NEXT_PUBLIC_RPC_BTC_MAINNET || '',     // if you want it
    Sui: process.env.NEXT_PUBLIC_RPC_SUI_MAINNET || ''          // if you want it
  },
  testnet: {
    Ethereum: process.env.NEXT_PUBLIC_RPC_ETH_TESTNET || '',
    Base: process.env.NEXT_PUBLIC_RPC_BASE_TESTNET || '',
    Polygon: process.env.NEXT_PUBLIC_RPC_POLYGON_TESTNET || '',
    Arbitrum: process.env.NEXT_PUBLIC_RPC_ARBITRUM_TESTNET || '',
    Bsc: process.env.NEXT_PUBLIC_RPC_BSC_TESTNET || '',
    Avalanche: process.env.NEXT_PUBLIC_RPC_AVALANCHE_TESTNET || '',
    Solana: process.env.NEXT_PUBLIC_RPC_SOLANA_DEVNET || '',
    Bitcoin: process.env.NEXT_PUBLIC_RPC_BTC_TESTNET || '',     // if you want it
    Sui: process.env.NEXT_PUBLIC_RPC_SUI_TESTNET || ''          // if you want it
  },
};
