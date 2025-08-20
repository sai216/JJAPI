"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ActionCards } from "@/components/action-cards"
import { WalletStatus } from "@/components/wallet-status"
import { PEGRateCard } from "@/components/peg-rate-card"
import { WalletGrid } from "@/components/wallet-grid"
import { JobsTicker } from "@/components/jobs-ticker"
import { DealTicker } from "@/components/deal-ticker"
import { FloatingActionButton } from "@/components/floating-action-button"
// import ProductionWormholeModal from '@/components/wormhole-bridge-modal' // (unchanged if you use it)

export default function FundioDashboard() {
  const [showJobsTicker, setShowJobsTicker] = useState(true)

  return (
    <div className="min-h-screen bg-[#1a1d18] text-white flex overflow-x-hidden">
      {/* Sidebar stays the same */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-64 pb-20 transition-all">
        <div className="pt-6">
          {/* ===== TOP SECTION =====
              Change: make it a single column stack on all sizes so PEG sits under Wallet Status */}
          <div className="grid grid-cols-1 gap-6">
            <ActionCards />

            {/* Wallet Status row (leave your toggles here if any) */}
            <div className="flex items-center gap-4">
              <WalletStatus />
              {/* If you render "Juice DealFI" toggle here, it can stay */}
            </div>

            {/* >>> Moved here: PEG Rate directly under Wallet Status <<< */}
            <PEGRateCard />
          </div>

          {/* ===== WALLET GRID + JOBS OVERLAY (unchanged) ===== */}
          <div className="mt-8 relative">
            <WalletGrid />
            {showJobsTicker && (
              <JobsTicker
                isVisible={showJobsTicker}
                onClose={() => setShowJobsTicker(false)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Global floating UI (unchanged) */}
      <FloatingActionButton />
      <DealTicker />

      {/* Global CSS fixes (unchanged) */}
      <style jsx global>{`
        body { overflow-x: hidden !important; }
        html, body { scroll-behavior: smooth !important; }
      `}</style>
    </div>
  )
}
