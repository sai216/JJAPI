'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Shield,
  Info,
  Wallet as WalletIcon,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

// OnchainKit v2
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { FundButton } from '@coinbase/onchainkit/fund';

// wagmi
import { useAccount } from 'wagmi';

interface OnchainKitOnRampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnchainKitOnRampModal({ isOpen, onClose }: OnchainKitOnRampModalProps) {
  const { address: connectedAddress, isConnected } = useAccount();

  const handleOpenChange = (open: boolean): void => {
    if (!open) onClose();
  };

  // --- SESSION TOKEN FLOW (uses your snippet) ---
  const openCoinbasePay = async (): Promise<void> => {
    if (!isConnected || !connectedAddress) {
      alert('Please connect a wallet first.');
      return;
    }

    // Build the session request
    const addresses = [
      {
        address: connectedAddress,
        blockchains: ['base', 'ethereum', 'arbitrum', 'polygon', 'optimism', 'bsc'],
      },
    ];
    const assets = ['USDC', 'ETH']; // optional filter

    // Ask your backend for a one-time session token
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses, assets }),
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const { error } = await res.json();
        message = error ?? message;
      } catch {}
      alert(`Failed to init onramp: ${message}`);
      return;
    }

    const { token } = await res.json();
    if (!token) {
      alert('No session token returned.');
      return;
    }

    // Open Coinbase Onramp with the session token
    const url = new URL('https://pay.coinbase.com/buy/select-asset');
    url.searchParams.set('sessionToken', token);

    const width = 500, height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      url.toString(),
      'coinbase_onramp',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  };
  // --- END SESSION TOKEN FLOW ---

  const openCoinbaseWallet = () => window.open('https://wallet.coinbase.com/', 'coinbase_wallet');
  const openCoinbaseApp = () => window.open('https://www.coinbase.com/buy', 'coinbase_buy');

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-h-[90dvh] bg-white flex flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Onramp / Buy
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Wallet connect (no manual address) */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-gray-800 mb-2">🔗 OnchainKit Wallet (v2)</h3>

            <Wallet className="w-full">
              <ConnectWallet className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Avatar className="h-4 w-4" />
                  <Name />
                </div>
              </ConnectWallet>

              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>

            {/* Onramp actions (only when connected) */}
            <div className="mt-3 p-3 bg-white rounded border border-gray-200 space-y-2">
              {isConnected && connectedAddress ? (
                <>
                  {/* Optional: OnchainKit's own onramp button */}
                  <div className="flex items-center justify-center min-h-[84px]">
                    <FundButton />
                  </div>

                  {/* Coinbase Pay via session token */}
                  <Button
                    onClick={openCoinbasePay}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Fund with Coinbase Pay
                  </Button>

                  <div className="text-[11px] text-gray-500">
                    Your connected wallet will be used as the destination.
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-700">
                  Connect your wallet above to start funding.
                </div>
              )}
            </div>
          </div>

          {/* Instant Funding shortcuts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">💳 Instant Funding</h3>
              <span className="text-xs text-gray-500">Always Available</span>
            </div>

            <div className="space-y-2">
              <Button
                onClick={openCoinbasePay}
                disabled={!isConnected || !connectedAddress}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-left justify-start"
              >
                <div className="flex items-center w-full">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Coinbase Pay</div>
                    <div className="text-xs opacity-90">Official onramp • Uses connected wallet</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>

              <Button
                onClick={openCoinbaseWallet}
                variant="outline"
                className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 h-10 text-left justify-start"
              >
                <div className="flex items-center w-full">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <WalletIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Coinbase Wallet</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-gray-800">Base Network Optimized</span>
            </div>
            <p className="text-xs text-gray-600">
              Fast transactions (~2s) • Low fees (~$0.01) • Great for DeFi
            </p>
          </div>

          <Alert className="border-orange-200 bg-orange-50">
            <Info className="w-3 h-3 text-orange-600" />
            <AlertDescription className="text-xs text-orange-700">
              <strong>How it works:</strong> Connect wallet → Buy → Crypto delivered to your wallet.
            </AlertDescription>
          </Alert>
        </div>

        <div className="border-t p-4 bg-gray-50">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
