'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useCases } from '~/constants'
import BlurImage from './miscellaneous/blur-image'
import { cn } from '~/lib/utils'

const UseCaseSection = () => {
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
      className="py-16 sm:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="container mx-auto">
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            USE CASE
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 md:text-xl">
            Extend isn't just a tool—it's a solution to a widespread problem:
            digital content disappearing when individuals can no longer support
            it.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16">
          {useCases.slice(1).map((useCase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={cn(
                'flex items-center gap-8 max-md:flex-col',
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              )}
            >
              <motion.div
                className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                whileHover={{ x: index % 2 === 1 ? -10 : 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {useCase.title}
                </h3>
                <p className="text-lg leading-relaxed text-gray-600">
                  {useCase.subtitle}
                </p>
              </motion.div>

              <motion.div
                // className={cn(
                //   index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''
                // )}
                className="w-full"
                // whileHover={{ scale: 1.05 }}
                // transition={{ duration: 0.3 }}
              >
                <BlurImage
                  src={useCase.image || '/placeholder.svg'}
                  alt={useCase.title}
                  width={400}
                  height={400}
                  className="aspect-square"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default UseCaseSection
