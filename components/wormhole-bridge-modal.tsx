'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

const WormholeConnectNoSSR = dynamic(
  () => import('@wormhole-foundation/wormhole-connect'),
  { ssr: false }
);

export type Net = 'Mainnet' | 'Testnet';

interface WormholeBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  network: Net;
  setNetwork: (n: Net) => void;
}

/** Your desired order (Connect will ignore unsupported chain ids) */
const MAINNET_ORDER: readonly string[] = [
  'Base',       // 1
  'Solana',     // 2
  'Optimism',   // 3
  'Arbitrum',   // 4
  /* 'Zora', */  // not a Wormhole chain (kept for clarity)
  'Ethereum',   // 6 (ETH mainnet)
  'Bsc',
  'Sui',
  'Fantom',
  // others you already listed
  'Polygon', 'Avalanche', 'Celo', 'Moonbeam', 'Scroll', 'Mantle',
  'Aptos', 'Blast', 'Kaia', 'X Layer', 'World Chain',
];

const TESTNET_ORDER: readonly string[] = [
  'BaseSepolia',
  'SolanaDevnet',
  'OPSepolia',
  'ArbitrumSepolia',
  /* 'ZoraTestnet', */
  'EthereumSepolia',   // use this id for ETH testnet
  'BscTestnet',
  'SuiTestnet',
  'FantomTestnet',
  'PolygonAmoy',
  'AvalancheFuji',
  'ScrollSepolia',
  'MantleSepolia',
];

const dedupe = (arr: readonly string[]) =>
  Array.from(new Set(arr.filter(Boolean)));

export default function WormholeBridgeModal({
  isOpen,
  onClose,
  network,
  setNetwork,
}: WormholeBridgeModalProps) {
  if (!isOpen) return null;

  const chains = useMemo(
    () => dedupe(network === 'Mainnet' ? MAINNET_ORDER : TESTNET_ORDER),
    [network]
  );

  const tokens: string[] = [
    'USDC', 'ETH', 'SOL', 'BTC', 'ARB',
    'WETH', 'WBTC', 'DAI', 'BUSD', 'wstETH', 'tBTC',
    'MATIC', 'AVAX', 'BNB', 'OP', 'CELO', 'GLMR', 'MNT', 'SUI', 'BLAST',
  ];

  // Build RPCs per network
  const rpcs = useMemo<Record<string, string>>(() => {
    const base = network === 'Mainnet'
      ? {
          ethereum: process.env.NEXT_PUBLIC_ETHEREUM_RPC ?? 'https://eth.llamarpc.com',
          base:     process.env.NEXT_PUBLIC_BASE_RPC ?? 'https://mainnet.base.org',
          polygon:  process.env.NEXT_PUBLIC_POLYGON_RPC ?? 'https://polygon.llamarpc.com',
          arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_RPC ?? 'https://arb1.arbitrum.io/rpc',
          bsc:      process.env.NEXT_PUBLIC_BSC_RPC ?? 'https://bsc.llamarpc.com',
          avalanche:process.env.NEXT_PUBLIC_AVALANCHE_RPC ?? 'https://api.avax.network/ext/bc/C/rpc',
          optimism: process.env.NEXT_PUBLIC_OPTIMISM_RPC ?? 'https://mainnet.optimism.io',
          fantom:   process.env.NEXT_PUBLIC_FANTOM_RPC ?? 'https://rpc.ftm.tools',
          celo:     process.env.NEXT_PUBLIC_CELO_RPC ?? 'https://forno.celo.org',
          moonbeam: process.env.NEXT_PUBLIC_MOONBEAM_RPC ?? 'https://rpc.api.moonbeam.network',
          kaia:     process.env.NEXT_PUBLIC_KAIA_RPC ?? 'https://public-en.node.kaia.io',
          scroll:   process.env.NEXT_PUBLIC_SCROLL_RPC ?? 'https://rpc.scroll.io',
          mantle:   process.env.NEXT_PUBLIC_MANTLE_RPC ?? 'https://rpc.mantle.xyz',
          blast:    process.env.NEXT_PUBLIC_BLAST_RPC ?? 'https://rpc.blast.io',
          'x layer':process.env.NEXT_PUBLIC_X_LAYER_RPC ?? 'https://rpc.xlayer.tech',
          'world chain': process.env.NEXT_PUBLIC_WORLDCHAIN_RPC ?? '',
        }
      : {
          // ✅ fix key name: 'base', not 'baseseoplia'
          base: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC ?? 'https://sepolia.base.org',
          // add more testnet RPCs if you have them
        };

    return Object.fromEntries(Object.entries(base).filter(([,v]) => v && v.trim()));
  }, [network]);

  // Build config whenever network (or rpcs) changes
  const config = useMemo(() => {
    return {
      network,
      chains,
      tokens,
      rpcs,
      ui: {
        title: network === 'Testnet' ? 'Wormhole Bridge (Testnet)' : 'Wormhole Bridge',
        mode: 'dark',
        primary: '#16a34a',
      },
    } as any;
  }, [network, chains, rpcs]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
      <div className="bg-[#111318] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Wormhole Bridge</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Network Toggle */}
        <div className="p-4 border-b border-gray-800">
          <div className="mx-auto w-fit bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setNetwork('Testnet')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                network === 'Testnet' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              Testnet
            </button>
            <button
              onClick={() => setNetwork('Mainnet')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                network === 'Mainnet' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              Mainnet
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-gray-400">
            {network === 'Testnet'
              ? 'Showing Base Sepolia and other testnets'
              : 'Showing mainnets'}
          </p>
        </div>

        {/* Wormhole Connect */}
        <div className="p-4 overflow-auto max-h-[65vh]">
          {/* Force remount so header switches between (Testnet) and (Mainnet) */}
          <WormholeConnectNoSSR key={network} config={config} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 bg-black/30 text-center">
          <span className="text-[11px] text-gray-500">Powered by Wormhole</span>
        </div>
      </div>
    </div>
  );
}
