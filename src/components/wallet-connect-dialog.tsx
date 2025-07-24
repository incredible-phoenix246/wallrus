'use client'

import { motion } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useWalletDialog } from './use-wallet-dialog'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { useWalletConnection } from '~/hooks/use-wallet-connection'
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet'
import BlurImage from './miscellaneous/blur-image'

export const WalletConnectDialog = () => {
  const { isConnectDialogOpen, closeConnectDialog } = useWalletDialog()
  const { wallets, connect, connectionError, isConnectingToWallet } =
    useWalletConnection()

  const handleWalletConnect = (walletName: string) => {
    const wallet = wallets.find((w) => w.name === walletName)
    if (wallet) {
      connect(wallet)
      closeConnectDialog()
    }
  }

  const allowedWallet = wallets.find((w) => w.name === SLUSH_WALLET_NAME)

  return (
    <Dialog open={isConnectDialogOpen} onOpenChange={closeConnectDialog}>
      <DialogContent className="rounded-2xl font-sans sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            CONNECT WALLET
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Connect your wallet and extend a blob
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {connectionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {connectionError.message || 'Connection failed'}
              </AlertDescription>
            </Alert>
          )}

          {/* Slush Wallet - Available */}
          {allowedWallet && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWalletConnect(SLUSH_WALLET_NAME)}
              disabled={isConnectingToWallet}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConnectingToWallet ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <BlurImage
                  src={allowedWallet.icon}
                  alt="Slush Wallet Icon"
                  width={40}
                  height={40}
                  className="size-6 rounded-full"
                />
              )}
              <span className="font-medium">Slush</span>
            </motion.button>
          )}

          {/* <Link
            href="https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
            target="_blank"
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <span className="text-xl">🦊</span>
              <span className="font-medium">SUI Metamask</span>
            </motion.div>
          </Link>

          <Link
            href="https://chromewebstore.google.com/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg"
            target="_blank"
            className="block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <span className="text-xl">🐸</span>
              <span className="font-medium">Leap Wallet</span>
            </motion.div>
          </Link> */}
        </div>

        <div className="border-t pt-4 text-center text-xs text-gray-500">
          By connecting, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
