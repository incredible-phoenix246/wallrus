'use client'
import React from 'react'
import { motion } from 'framer-motion'

const WhyExtend = () => {
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
      className="bg-[#004369] to-teal-800 px-4 py-20 md:px-8 lg:px-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.div variants={itemVariants}>
          <h2 className="mb-12 text-4xl font-bold text-white md:text-6xl">
            WHY EXTEND?
          </h2>
          <motion.p
            className="mx-auto max-w-4xl text-lg leading-relaxed text-white/90 md:text-xl"
            variants={itemVariants}
          >
            On the Walrus blockchain, files aren&apos;t stored permanently by
            default. Each uploaded file—known as a SharedBlob—is assigned a
            specific lifespan, measured in units called epochs (think of them
            like digital time blocks). When a file's epochs run out, it expires
            and becomes inaccessible, effectively vanishing from the blockchain.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default WhyExtend
