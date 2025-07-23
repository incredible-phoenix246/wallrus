'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { faqData } from '~/constants'
import { Minus, Plus } from 'lucide-react'

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
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
      className="bg-gray-50 px-4 py-16 md:px-8 lg:px-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-4xl">
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about the product and billing.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-0">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
              initial={false}
            >
              <motion.button
                className="group flex w-full cursor-pointer items-start justify-between px-6 py-8 text-left transition-colors hover:bg-white"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                whileHover={{ backgroundColor: '#f9fafb' }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="pr-8 text-xl leading-tight font-bold text-gray-900">
                  {faq.question}
                </span>
                <motion.div
                  className="mt-1 flex-shrink-0"
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 transition-colors group-hover:border-gray-600">
                    {openFaq === index ? (
                      <Minus className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8">
                      <p className="max-w-4xl text-lg leading-relaxed text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FaqSection
