'use client'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { motion } from 'framer-motion'

const HowItWorksSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  }

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
      className="bg-[#FEDF89] px-4 py-16 sm:py-24 md:px-8 lg:px-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="container mx-auto">
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            HOW IT WORKS?
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-800 md:text-xl">
            Anyone can perform either action for any file—making Extend a fully
            decentralized, community-powered preservation system.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full border-0 bg-white/90 shadow-xl backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                  TIP
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  This function lets users contribute WAL tokens to a file's
                  funding pool on the Walrus blockchain, similar to tipping a
                  website or document. While the tokens don't directly extend
                  storage, they boost the balance for purchasing more time
                  later.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="h-full border-0 bg-white/90 shadow-xl backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                  EXTEND
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  This function lets users use the tokens in a file's funding
                  pool to purchase additional storage time—measured in epochs.
                  When someone clicks "Extend," they're using those WAL tokens
                  to ensure the file stays online longer.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default HowItWorksSection
