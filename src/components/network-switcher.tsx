'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { ChevronUp, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { type NetworkType, useNetwork } from '~/hooks/use-network'

const networkLabels: Record<NetworkType, string> = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  devnet: 'Devnet',
}

const networkColors: Record<
  NetworkType,
  'default' | 'secondary' | 'destructive'
> = {
  mainnet: 'default',
  testnet: 'secondary',
  devnet: 'destructive',
}

export function NetworkSwitcher() {
  const { currentNetwork, switchNetwork } = useNetwork()

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full border-2 border-gray-200 bg-white shadow-lg transition-all duration-200 hover:border-gray-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-1">
                <Wifi className="h-4 w-4" />
                <ChevronUp className="h-3 w-3" />
              </div>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className="mb-2 min-w-[140px]"
        >
          <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
            Switch Network
          </div>
          {Object.entries(networkLabels).map(([network, label]) => (
            <DropdownMenuItem
              key={network}
              onClick={() => switchNetwork(network as NetworkType)}
              className="cursor-pointer gap-2"
            >
              <Badge
                variant={networkColors[network as NetworkType]}
                className="text-xs"
              >
                {label}
              </Badge>
              {currentNetwork === network && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
