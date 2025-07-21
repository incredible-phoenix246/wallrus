'use client'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import BlurImage from './miscellaneous/blur-image'
import { useDialogStore } from '../dialog-store'
import { WalletDropdown } from './wallet-dropdown'

export const Header = () => {
  const { wallet, connectWallet } = useDialogStore()

  const handleConnectWallet = async () => {
    if (!wallet.isConnected && !wallet.isConnecting) {
      await connectWallet()
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto flex max-w-7xl items-center justify-between bg-white p-4 sm:px-6 md:p-6 lg:px-12"
    >
      <BlurImage
        src="/logo.png"
        alt="Logo"
        width={40}
        height={40}
        className="h-10 w-10"
      />

      {wallet.isConnected && wallet.address ? (
        <WalletDropdown address={wallet.address} />
      ) : (
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#213b46' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnectWallet}
          disabled={wallet.isConnecting}
          className="flex cursor-pointer items-center gap-2 rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {wallet.isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              CONNECTING...
            </>
          ) : (
            'CONNECT WALLET'
          )}
        </motion.button>
      )}
    </motion.header>
  )
}
