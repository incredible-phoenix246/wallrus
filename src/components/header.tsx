'use client'

import { motion } from 'framer-motion'
import BlurImage from './miscellaneous/blur-image'
import { WalletDropdown } from './wallet-dropdown'
import { inDevelopment } from '~/lib/utils'
import { useAutoConnect } from '~/hooks/use-auto-connect'
import { useWalletConnection } from '~/hooks/use-wallet-connection'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet'

export const Header = () => {
  const { isAutoConnecting, autoConnectError } = useAutoConnect()
  const {
    wallets,
    connectionStatus,
    currentWallet,
    isConnecting,
    connect,
    connectionError,
    isConnectingToWallet,
  } = useWalletConnection()

  if (inDevelopment) {
    console.log('Current Wallet:', currentWallet)
    console.log('Connection Status:', connectionStatus)
    console.log(wallets)
  }

  const showError = autoConnectError || connectionError
  const allowedWallet = wallets.find((w) => w.name === SLUSH_WALLET_NAME)

  if (!allowedWallet) return

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto flex max-w-7xl flex-col items-center justify-between bg-white p-4 sm:px-6 md:p-6 lg:flex-row lg:px-12"
    >
      <BlurImage
        src="/logo.png"
        alt="Logo"
        width={40}
        height={40}
        className="h-10 w-10"
      />

      <div className="flex flex-col items-center gap-2">
        {showError && (
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {autoConnectError?.message ||
                connectionError?.message ||
                'Connection failed'}
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === 'connected' ? (
          currentWallet?.accounts.map((account) => (
            <WalletDropdown key={account.address} address={account.address} />
          ))
        ) : isConnecting || isAutoConnecting || isConnectingToWallet ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {isAutoConnecting ? 'AUTO-CONNECTING...' : 'CONNECTING...'}
          </motion.div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#213b46' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => connect(allowedWallet)}
              disabled={isConnectingToWallet}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CONNECT WALLET
            </motion.button>
          </div>
        )}
      </div>
    </motion.header>
  )
}
