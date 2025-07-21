'use client'

import type React from 'react'
import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessBubbleProps {
  show: boolean
  message: string
  onClose: () => void
}

export const SuccessBubble = ({
  show,
  message,
  onClose,
}: SuccessBubbleProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          className="fixed top-4 right-4 z-[9999] max-w-sm"
        >
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 shadow-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
            <p className="flex-1 text-sm font-medium text-green-800">
              {message}
            </p>
            <button
              onClick={onClose}
              className="text-green-600 transition-colors hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-1 rounded-b-lg bg-green-400"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
