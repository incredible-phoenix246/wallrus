'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Wallet,
  Info,
  Loader2,
} from 'lucide-react'
import { useDialogStore } from '../dialog-store'

const BlobManagement = () => {
  const [blobId, setBlobId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {
    data,
    setBlobStatus,
    setCurrentStep,
    resetBlobData,
    showBubble,
    wallet,
  } = useDialogStore()

  const {
    blobStatus,
    currentStep = 'input',
    tipAmount = '',
    extendEpochs = '',
  } = data

  const [customTipAmount, setCustomTipAmount] = useState('')
  const [customExtendEpochs, setCustomExtendEpochs] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock blob data
  const mockBlobStatus = {
    id: blobId,
    currentFunds: 500000,
    epochsRemaining: 3,
    costPerEpoch: 50000,
    isExpiringSoon: true,
    needsFunding: true,
    canExtend: true,
    recommendedAction: 'tip_first',
  }

  const checkBlobStatus = async () => {
    if (!blobId || blobId.length < 10) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setBlobStatus(mockBlobStatus)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (blobId) checkBlobStatus()
    }, 500)
    return () => clearTimeout(timer)
  }, [blobId])

  const getRecommendedAction = () => {
    if (!blobStatus) return null

    if (blobStatus.currentFunds < blobStatus.costPerEpoch) {
      return {
        type: 'tip',
        title: 'Add Funds First',
        description: 'This blob needs more funds before it can be extended',
        urgent: true,
      }
    }

    if (blobStatus.epochsRemaining <= 5) {
      return {
        type: 'extend',
        title: 'Extend Now',
        description: 'This blob is expiring soon and has enough funds',
        urgent: true,
      }
    }

    return {
      type: 'tip',
      title: 'Add Funds',
      description: 'Help keep this blob alive by adding more funds',
      urgent: false,
    }
  }

  const recommendation = getRecommendedAction()

  // Simulate transactions
  const simulateTipTransaction = async (amount: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const transactionId = `0x${Math.random().toString(16).substr(2, 8)}...`
    return {
      transactionId,
      amountTipped: `${amount} SUI`,
      success: true,
    }
  }

  const simulateExtendTransaction = async (epochs: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const transactionId = `0x${Math.random().toString(16).substr(2, 8)}...`
    const cost = Number.parseInt(epochs) * blobStatus.costPerEpoch
    return {
      transactionId,
      epochsExtended: epochs,
      costPaid: `${cost} SUI`,
      success: true,
    }
  }

  // Smart Quick Actions
  const QuickActions = () => {
    if (!blobStatus) return null
    const maxExtendable = Math.floor(
      blobStatus.currentFunds / blobStatus.costPerEpoch
    )

    return (
      <div className="space-y-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>

        {/* Extend Actions */}
        {blobStatus.canExtend && (
          <div className="space-y-4">
            <h4 className="text-md flex items-center space-x-2 font-medium text-blue-300">
              <Clock className="h-4 w-4" />
              <span>Extend Blob Lifecycle</span>
            </h4>

            <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                onClick={() => {
                  setCurrentStep('extend')
                  // Set extend epochs in store
                }}
                className="rounded-lg border border-blue-500/30 bg-blue-500/20 p-4 text-left transition-all hover:bg-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-300">
                      Extend 10 Epochs
                    </div>
                    <div className="text-sm text-blue-200">
                      Cost: {(blobStatus.costPerEpoch * 10).toLocaleString()}{' '}
                      SUI
                    </div>
                  </div>
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentStep('extend')
                  // Set max extend epochs in store
                }}
                className="rounded-lg border border-green-500/30 bg-green-500/20 p-4 text-left transition-all hover:bg-green-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-300">
                      Max Extend ({maxExtendable})
                    </div>
                    <div className="text-sm text-green-200">
                      Use all available funds
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
              </button>
            </div>

            {/* Manual Extend Input */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <label className="mb-2 block font-medium text-blue-300">
                Custom Epochs
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={customExtendEpochs}
                  onChange={(e) => setCustomExtendEpochs(e.target.value)}
                  placeholder="Enter epochs..."
                  max={maxExtendable}
                  className="flex-1 rounded-lg border border-blue-500/30 bg-white/10 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customExtendEpochs) {
                      setCurrentStep('extend')
                    }
                  }}
                  disabled={
                    !customExtendEpochs ||
                    Number.parseInt(customExtendEpochs) > maxExtendable
                  }
                  className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-500"
                >
                  Extend
                </button>
              </div>
              {customExtendEpochs && (
                <p className="mt-2 text-sm text-blue-200">
                  Cost:{' '}
                  {(
                    Number.parseInt(customExtendEpochs || '0') *
                    blobStatus.costPerEpoch
                  ).toLocaleString()}{' '}
                  SUI
                  {Number.parseInt(customExtendEpochs) > maxExtendable && (
                    <span className="ml-2 text-red-300">
                      ⚠ Insufficient funds
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Tip Actions */}
        <div className="space-y-4">
          <h4 className="text-md flex items-center space-x-2 font-medium text-purple-300">
            <Zap className="h-4 w-4" />
            <span>Add Funds (Tip)</span>
          </h4>

          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[100000, 500000, 1000000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setCurrentStep('tip')
                }}
                className="rounded-lg border border-purple-500/30 bg-purple-500/20 p-3 text-center transition-all hover:bg-purple-500/30"
              >
                <div className="font-medium text-purple-300">
                  Tip {(amount / 1000).toLocaleString()}K
                </div>
                <div className="text-xs text-purple-200">SUI</div>
              </button>
            ))}
          </div>

          {/* Manual Tip Input */}
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
            <label className="mb-2 block font-medium text-purple-300">
              Custom Amount
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                value={customTipAmount}
                onChange={(e) => setCustomTipAmount(e.target.value)}
                placeholder="Enter SUI amount..."
                className="flex-1 rounded-lg border border-purple-500/30 bg-white/10 px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (customTipAmount) {
                    setCurrentStep('tip')
                  }
                }}
                disabled={
                  !customTipAmount || Number.parseInt(customTipAmount) <= 0
                }
                className="rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition-all hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                Tip
              </button>
            </div>
            {customTipAmount && (
              <p className="mt-2 text-sm text-purple-200">
                This will add{' '}
                {Number.parseInt(customTipAmount || '0').toLocaleString()} SUI
                to the blob's funds
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Status Display
  const BlobStatusCard = () => {
    if (!blobStatus) return null

    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Blob Status</h3>
            <p className="font-mono text-sm text-gray-300">
              {blobStatus.id.slice(0, 20)}...
            </p>
          </div>
          {blobStatus.isExpiringSoon && (
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300">
              Expiring Soon
            </span>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {blobStatus.currentFunds.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Current Funds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {blobStatus.epochsRemaining}
            </div>
            <div className="text-sm text-gray-300">Epochs Left</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {blobStatus.costPerEpoch.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Cost/Epoch</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.floor(blobStatus.currentFunds / blobStatus.costPerEpoch)}
            </div>
            <div className="text-sm text-gray-300">Max Extend</div>
          </div>
        </div>

        {recommendation && (
          <div
            className={`rounded-lg border p-4 ${
              recommendation.urgent
                ? 'border-red-500/30 bg-red-500/20'
                : 'border-blue-500/30 bg-blue-500/20'
            }`}
          >
            <div className="mb-2 flex items-center space-x-2">
              {recommendation.urgent ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : (
                <Info className="h-5 w-5 text-blue-400" />
              )}
              <span
                className={`font-medium ${recommendation.urgent ? 'text-red-300' : 'text-blue-300'}`}
              >
                {recommendation.title}
              </span>
            </div>
            <p
              className={`text-sm ${recommendation.urgent ? 'text-red-200' : 'text-blue-200'}`}
            >
              {recommendation.description}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Two-Step Process Flow
  const ProcessFlow = () => {
    const steps = [
      { id: 'tip', label: 'Add Funds', icon: Wallet },
      { id: 'extend', label: 'Extend Life', icon: Clock },
    ]

    const handleTipConfirm = async () => {
      if (!wallet.isConnected) {
        showBubble('Please connect your wallet first')
        return
      }

      setIsProcessing(true)
      try {
        const result = await simulateTipTransaction(customTipAmount || '100')
        showBubble(`Successfully tipped ${result.amountTipped} to blob!`)
        setCurrentStep('extend')
      } catch (error) {
        showBubble('Transaction failed. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }

    const handleExtendConfirm = async () => {
      if (!wallet.isConnected) {
        showBubble('Please connect your wallet first')
        return
      }

      setIsProcessing(true)
      try {
        const result = await simulateExtendTransaction(
          customExtendEpochs || '10'
        )
        showBubble(
          `Successfully extended blob lifetime by ${result.epochsExtended} epochs!`
        )
        setCurrentStep('success')
      } catch (error) {
        showBubble('Transaction failed. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = false // You'd track this based on transaction status

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center space-x-2 ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      isActive
                        ? 'border-white bg-white/10'
                        : isCompleted
                          ? 'border-green-400 bg-green-400/10'
                          : 'border-gray-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {currentStep === 'tip' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-medium text-white">
                Amount to Add (SUI)
              </label>
              <input
                type="number"
                value={customTipAmount}
                onChange={(e) => setCustomTipAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleTipConfirm}
                disabled={isProcessing || !customTipAmount}
                className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Add Funds'
                )}
              </button>
              <button
                onClick={() => setCurrentStep('input')}
                disabled={isProcessing}
                className="rounded-lg border border-white/20 px-6 py-3 text-white transition-all hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {currentStep === 'extend' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-medium text-white">
                Epochs to Extend
              </label>
              <input
                type="number"
                value={customExtendEpochs}
                onChange={(e) => setCustomExtendEpochs(e.target.value)}
                placeholder="Enter epochs..."
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {customExtendEpochs && blobStatus && (
                <p className="mt-1 text-sm text-gray-300">
                  Cost:{' '}
                  {(
                    Number.parseInt(customExtendEpochs) *
                    blobStatus.costPerEpoch
                  ).toLocaleString()}{' '}
                  SUI
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExtendConfirm}
                disabled={isProcessing || !customExtendEpochs}
                className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Extend Lifecycle'
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentStep('input')
                  resetBlobData()
                }}
                disabled={isProcessing}
                className="rounded-lg border border-white/20 px-6 py-3 text-white transition-all hover:bg-white/10 disabled:opacity-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              Extension Successful!
            </h3>
            <p className="mb-4 text-gray-300">
              Your blob has been extended and will remain online longer.
            </p>
            <button
              onClick={() => {
                setCurrentStep('input')
                setBlobId('')
                resetBlobData()
                setCustomTipAmount('')
                setCustomExtendEpochs('')
              }}
              className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02]"
            >
              Extend Another Blob
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Keep Your Blobs{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Alive
            </span>
          </h1>
          <p className="text-gray-300">
            Enter a SharedBlob ID to see its status and available actions
          </p>
        </div>

        {/* Main Input */}
        <div className="mb-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={blobId}
              onChange={(e) => setBlobId(e.target.value)}
              placeholder="Enter SharedBlob Object ID (0x...)"
              className="flex-1 bg-transparent text-lg text-white placeholder-gray-400 focus:outline-none"
            />
            {isLoading && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            )}
          </div>
        </div>

        {/* Status and Actions */}
        {blobStatus && (
          <div className="space-y-6">
            <BlobStatusCard />
            {currentStep === 'input' && <QuickActions />}
            <ProcessFlow />
          </div>
        )}

        {!blobStatus && !isLoading && blobId && (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="text-gray-400">
              Enter a valid SharedBlob ID to continue
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlobManagement
