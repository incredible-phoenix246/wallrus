'use client'
import {
  useWallets,
  useConnectWallet,
  useCurrentWallet,
} from '@mysten/dapp-kit'
import { motion } from 'framer-motion'
import BlurImage from './miscellaneous/blur-image'
import { WalletDropdown } from './wallet-dropdown'
import { inDevelopment } from '~/lib/utils'

export const Header = () => {
  const wallets = useWallets()
  const { mutate: connect } = useConnectWallet()
  const { currentWallet, connectionStatus } = useCurrentWallet()

  if (inDevelopment) {
    console.log('Current Wallet:', currentWallet)
    console.log('Connection Status:', connectionStatus)
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
      {connectionStatus === 'connected'
        ? currentWallet.accounts.map((account) => (
            <WalletDropdown key={account.address} address={account.address} />
          ))
        : wallets.map((wallet) => (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#213b46' }}
              whileTap={{ scale: 0.95 }}
              key={wallet.name}
              onClick={() => {
                connect(
                  { wallet },
                  {
                    onSuccess: () => console.log('connected'),
                  }
                )
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              CONNECT WALLET
              <BlurImage
                src={wallet.icon}
                alt={`${wallet.name} icon`}
                width={40}
                height={40}
                unoptimized
                className="ml-2 h-10 w-10"
              />
            </motion.button>
          ))}
    </motion.header>
  )
}
