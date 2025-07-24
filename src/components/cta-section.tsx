'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import BlurImage from './miscellaneous/blur-image'

const CtaSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }
  return (
    <motion.section
      className="px-4 py-16 md:px-8 lg:px-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="container mx-auto rounded-2xl bg-white py-8 text-center">
        <motion.div variants={itemVariants}>
          <BlurImage
            src="/message.png"
            alt=""
            width={50}
            height={50}
            className="mx-auto mb-6 h-12 w-12"
          />
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            READY TO GET STARTED
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Connect your wallet to get started and Tip or Extend your current
            Blob
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="rounded-lg bg-slate-800 px-8 py-3 text-lg font-semibold text-white hover:bg-slate-700"
            >
              CONNECT WALLET
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default CtaSection
