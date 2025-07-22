'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white px-4 py-16 text-center md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-4xl">
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-4xl leading-tight font-bold text-slate-900 md:text-5xl lg:text-6xl"
        >
          KEEP YOUR FILES
          <br />
          ALIVE FOREVER
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
        >
          Extend is a decentralized service that lets anyone fund and prolong
          the storage life of shared blobs on the Walrus Blockchain. Think of it
          as a tip jar for your website files — enabling the community to help
          keep them online.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#1e293b' }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer rounded-md bg-[#213b46] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-slate-800"
          >
            GET STARTED
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-lg font-medium text-slate-600 transition-colors hover:text-slate-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-400">
              <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            </div>
            JOIN OUR COMMUNITY
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
