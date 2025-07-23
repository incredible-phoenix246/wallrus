'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ChevronDown, LogOut } from 'lucide-react'
import { useDialogStore } from '../dialog-store'
import { useDisconnectWallet } from '@mysten/dapp-kit'
import { cn } from '~/lib/utils'
import { useTipDialogStore } from '~/hooks/tip-dialog-store'

interface WalletDropdownProps {
  address: string
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({ address }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: disconnect } = useDisconnectWallet()
  const dropdownRef = useRef<HTMLDivElement>(null)
  // const { openDialog } = useDialogStore()
  const { openDialog } = useTipDialogStore()
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTipBlob = () => {
    setIsOpen(false)
    openDialog()
  }

  const handleExtendBlob = () => {
    setIsOpen(false)
    // openDialog('extend-blob')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <User className="h-4 w-4" />
        <span>{truncatedAddress}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="py-1">
              <button
                onClick={handleTipBlob}
                className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Tip Blob
              </button>
              <button
                onClick={handleExtendBlob}
                className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Extend Blob
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => disconnect()}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
