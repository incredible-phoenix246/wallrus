'use client'

import { motion } from 'framer-motion'
import { Badge } from '~/components/ui/badge'
import { type NetworkType, useNetwork } from '~/hooks/use-network'

const networkColors: Record<
  NetworkType,
  'default' | 'secondary' | 'destructive'
> = {
  mainnet: 'default',
  testnet: 'secondary',
  devnet: 'destructive',
}

const networkLabels: Record<NetworkType, string> = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  devnet: 'Devnet',
}

export function FloatingNetworkIndicator() {
  const { currentNetwork } = useNetwork()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Badge
        variant={networkColors[currentNetwork]}
        className="border-2 bg-white/95 px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm"
      >
        {networkLabels[currentNetwork]}
      </Badge>
    </motion.div>
  )
}
