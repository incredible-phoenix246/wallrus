'use client'

import type React from 'react'

import { AlertCircle, Loader2, Search } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { formatNumber } from '~/lib/utils'
import { BlobInfoDisplay } from '~/components/blob-info-display'
import { useTipDialogStore } from '~/hooks/tip-dialog-store'
import { useWalrusBlob } from '~/hooks/use-walrus-blob'

const PRESET_TIPS = [
  Number(process.env.NEXT_PUBLIC_TIP_PRESET_1) || 50000,
  Number(process.env.NEXT_PUBLIC_TIP_PRESET_2) || 100000,
  Number(process.env.NEXT_PUBLIC_TIP_PRESET_3) || 500000,
]


export function TipDialog() {
  const [blobIdInput, setBlobIdInput] = useState('')

  const {
    isOpen,
    closeDialog,
    openDialog,
    searchQuery,
    setSearchQuery,
    blobInfo,
    customTipAmount,
    setCustomTipAmount,
    selectedPresetTip,
    setSelectedPresetTip,
    error,
    resetForm,
  } = useTipDialogStore()

  const {
    searchBlob,
    sendTip,
    downloadBlob,
    blobData,
    isSearching,
    isSendingTip,
    searchError,
    tipError,
    tipResult,
    networkError,
  } = useWalrusBlob()

  const handleOpen = () => {
    openDialog()
    resetForm()
  }

  const handleClose = () => {
    closeDialog()
    resetForm()
    setBlobIdInput('')
  }

  const handleSearch = useCallback(() => {
    if (blobIdInput.trim()) {
      setSearchQuery(blobIdInput.trim())
      searchBlob()
    }
  }, [blobIdInput, setSearchQuery, searchBlob])

  const handlePresetTip = useCallback(
    (amount: number) => {
      setSelectedPresetTip(selectedPresetTip === amount ? null : amount)
      setCustomTipAmount('')
    },
    [selectedPresetTip, setSelectedPresetTip, setCustomTipAmount]
  )

  const getTipAmount = () => {
    return selectedPresetTip || Number.parseInt(customTipAmount) || 0
  }

  const handleSendTip = async () => {
    if (!blobInfo) return
    const tipAmount = getTipAmount()
    if (tipAmount > 0) {
      sendTip(tipAmount)
    }
  }

  useEffect(() => {
    if (blobIdInput.length > 10 && blobIdInput !== searchQuery) {
      const timeoutId = setTimeout(() => {
        handleSearch()
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [blobIdInput, searchQuery, handleSearch])

  return (
    <Dialog open={isOpen} onOpenChange={isOpen ? handleClose : handleOpen}>
      <DialogContent className="hide-scrollbar max-h-[90vh] overflow-y-auto rounded-2xl font-sans sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tip a Blob</DialogTitle>
          <DialogDescription>
            Add funds to a shared blob to help keep it online longer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex w-full flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="blob-id">Blob ID</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="blob-id"
                    placeholder="Enter blob ID to search..."
                    value={blobIdInput}
                    onChange={(e) => setBlobIdInput(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={!blobIdInput.trim() || isSearching}
                className="w-full bg-[#213b46] hover:bg-[#213b46]/90"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>

          {/* Success Display */}
          {tipResult?.success && (
            <div className="flex w-full flex-wrap items-start gap-2 rounded-md bg-green-50 p-3 text-sm break-words whitespace-normal text-green-600">
              <div className="h-4 w-4 shrink-0 rounded-full bg-green-500" />
              <span className="flex-1 break-words">
                Tip sent successfully! Transaction: {tipResult.txHash.slice(0, 8)}...
              </span>
            </div>
          )}

          {/* Error Display */}
          {(error || searchError || tipError || networkError) && (
            <div className="flex w-full flex-wrap items-start gap-2 rounded-md bg-red-50 p-3 text-sm break-words whitespace-normal text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1 break-words">
                {error ||
                  searchError?.message ||
                  tipError?.message ||
                  networkError?.message}
              </span>
            </div>
          )}

          {/* Results Section */}
          {blobInfo && (
            <div className="space-y-4">
              {/* Network Status
              <NetworkStatusDisplay
                networkStatus={networkStatus || null}
                isLoading={isLoadingNetworkStatus}
              /> */}

              {/* Blob Information */}
              <BlobInfoDisplay
                blobInfo={blobInfo}
                onDownload={
                  blobData ? () => downloadBlob(blobInfo, blobData) : undefined
                }
              />

              {/* Storage Stats */}
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Tip Balance
                  </div>
                  <div className="text-lg font-semibold">
                    {formatNumber(blobInfo.tipBalance)} FROST
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Cost/Epoch
                  </div>
                  <div className="text-lg font-semibold">
                    {formatNumber(blobInfo.costPerEpoch)} FROST
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Epochs Left
                  </div>
                  <div
                    className={`text-lg font-semibold ${blobInfo.epochsLeft <= 2 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {blobInfo.epochsLeft}
                  </div>
                  {blobInfo.storageEndEpoch && (
                    <div className="text-muted-foreground text-xs">
                      Until epoch {blobInfo.storageEndEpoch}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Blob Details */}
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Blob Size</div>
                    <div className="text-muted-foreground text-xs">
                      {(blobInfo.size / 1024).toFixed(2)} KB (
                      {blobInfo.size.toLocaleString()} bytes)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Content Type</div>
                    <div className="text-muted-foreground text-xs">
                      {blobInfo.contentType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip Section */}
              <div className="space-y-3">
                <div>
                  <div className="font-medium">Send a Tip</div>
                  <div className="text-muted-foreground text-sm">
                    Choose your preferred tip amount or enter a custom amount to
                    extend storage
                  </div>
                </div>

                {/* Preset Tips */}
                <div className="flex gap-2">
                  {PRESET_TIPS.map((amount) => (
                    <Button
                      key={amount}
                      variant={
                        selectedPresetTip === amount ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => handlePresetTip(amount)}
                      className="flex-1"
                    >
                      {amount >= 1000000
                        ? `${amount / 1000000}M`
                        : `${amount / 1000}K`}{' '}
                      FROST
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Custom amount (FROST)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount in FROST"
                    value={customTipAmount}
                    onChange={(e) => setCustomTipAmount(e.target.value)}
                  />
                  {customTipAmount && Number.parseInt(customTipAmount) > 0 && (
                    <div className="text-muted-foreground text-xs">
                      ≈{' '}
                      {(Number.parseInt(customTipAmount) / 1000000000).toFixed(
                        6
                      )}{' '}
                      SUI
                    </div>
                  )}
                </div>

                {/* Tip Calculation */}
                {getTipAmount() > 0 && blobInfo.costPerEpoch > 0 && (
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="text-sm font-medium text-green-800">
                      This tip will extend storage by approximately{' '}
                      <span className="font-bold">
                        {Math.floor(getTipAmount() / blobInfo.costPerEpoch)}{' '}
                        epochs
                      </span>
                    </div>
                    {blobInfo.storageEndEpoch && (
                      <div className="mt-1 text-xs text-green-600">
                        Storage will be extended until epoch{' '}
                        {blobInfo.storageEndEpoch +
                          Math.floor(getTipAmount() / blobInfo.costPerEpoch)}
                      </div>
                    )}
                  </div>
                )}

                {/* Send Button */}
                <Button
                  onClick={handleSendTip}
                  disabled={getTipAmount() <= 0 || isSendingTip}
                  className="w-full bg-[#213b46] hover:bg-[#213b46]/90"
                  size="lg"
                >
                  {isSendingTip ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Tip...
                    </>
                  ) : (
                    `Send Tip (${formatNumber(getTipAmount())} FROST)`
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!blobInfo && !isSearching && blobIdInput.length > 0 && (
            <div className="text-muted-foreground py-8 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Enter a valid blob ID to view storage information</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
