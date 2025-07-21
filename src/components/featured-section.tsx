'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '!/lib/utils'

interface FeatureSectionProps {
  title: string
  description: string
  className: string
  icon: React.ReactNode
  reverse?: boolean
}

export const FeatureSection = ({
  title,
  description,
  className,
  icon,
  reverse = false,
}: FeatureSectionProps) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: reverse ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={cn('py-16 md:py-24', className)}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            'flex flex-col items-center gap-12 lg:flex-row',
            reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
          )}
        >
          <motion.div variants={itemVariants} className="flex-1">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              {title}
            </h2>
            <p className="text-lg leading-relaxed text-white/90">
              {description}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex flex-1 justify-center"
          >
            {icon}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
