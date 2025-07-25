'use client'

import { motion } from 'framer-motion'
import BlurImage from './miscellaneous/blur-image'
import { WalletDropdown } from './wallet-dropdown'
import { WalletConnectDialog } from './wallet-connect-dialog'
import { inDevelopment } from '~/lib/utils'
import { useAutoConnect } from '~/hooks/use-auto-connect'

import { useWalletConnection } from '~/hooks/use-wallet-connection'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet'
import Link from 'next/link'
import { useWalletDialog } from './use-wallet-dialog'

export const Header = () => {
  const { isAutoConnecting, autoConnectError } = useAutoConnect()
  const { openConnectDialog } = useWalletDialog()
  const {
    wallets,
    connectionStatus,
    currentWallet,
    isConnecting,
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

  if (!allowedWallet)
    return (
      <>
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[#F2F2F2]/70 backdrop-blur-md"
        >
          <div className="container mx-auto flex items-center justify-between p-4 sm:px-6 md:p-6 lg:px-12">
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
                  <WalletDropdown
                    key={account.address}
                    address={account.address}
                  />
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
                  <Link
                    href="https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                    target="_blank"
                    passHref
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#213b46' }}
                      whileTap={{ scale: 0.95 }}
                      className="flex cursor-pointer items-center gap-2 rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      CONNECT WALLET
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.header>
        <WalletConnectDialog />
      </>
    )

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[#F2F2F2]/70 backdrop-blur-md"
      >
        <div className="container mx-auto flex flex-col items-center justify-between p-4 sm:px-6 md:p-6 lg:flex-row lg:px-12">
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
                <WalletDropdown
                  key={account.address}
                  address={account.address}
                />
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
                  onClick={openConnectDialog}
                  disabled={isConnectingToWallet}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  CONNECT WALLET
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.header>
      <WalletConnectDialog />
    </>
  )
}
