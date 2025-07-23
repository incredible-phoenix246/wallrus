'use client'
import React from 'react'
import { motion } from 'framer-motion'
export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white px-4 py-8"
    >
      <div className="container mx-auto flex flex-col items-center justify-between text-slate-600 md:flex-row">
        <motion.p whileHover={{ scale: 1.02 }} className="mb-4 md:mb-0">
          © {new Date().getFullYear()} WALPRESS
        </motion.p>
        <motion.p
          whileHover={{ scale: 1.02 }}
          className="text-center md:text-right"
        >
          Powered by Walrus Blockchain • Decentralized Storage for Everyone
        </motion.p>
      </div>
    </motion.footer>
  )
}
