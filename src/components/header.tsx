'use client'
import React from 'react'
import { motion } from 'framer-motion'
import BlurImage from './miscellaneous/blur-image'
import { useDialogStore } from '!/dialog-store'

export const Header = () => {
  const { openDialog } = useDialogStore()
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

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#213b46' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => openDialog('tip-shared-blob')}
        className="cursor-pointer rounded-md bg-[#213b46] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        CONNECT WALLET
      </motion.button>
    </motion.header>
  )
}
