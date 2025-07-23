'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useTipDialogStore } from '~/hooks/tip-dialog-store'
import { Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useWalrusBlob } from '~/hooks/use-walrus-blob'

const PRESET_TIPS = [100000, 200000, 500000]

export function TipDialog() {
  const {
    isOpen,
    closeDialog,
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
    isSearching,
    isSendingTip,
    searchError,
    tipError,
  } = useWalrusBlob()

  const handleClose = () => {
    closeDialog()
    resetForm()
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchBlob()
    }
  }

  const handlePresetTip = (amount: number) => {
    setSelectedPresetTip(selectedPresetTip === amount ? null : amount)
  }

  const handleSendTip = () => {
    if (!blobInfo) return

    const tipAmount = selectedPresetTip || Number.parseInt(customTipAmount) || 0
    if (tipAmount > 0) {
      sendTip({ blobId: blobInfo.id, amount: tipAmount })
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getTipAmount = () => {
    return selectedPresetTip || Number.parseInt(customTipAmount) || 0
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="font-sans sm:min-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            TIP A BLOB
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Add funds to a shared blob to help keep it online longer
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Section */}
          <div className="flex flex-col gap-4">
            <div className="flex min-w-0 gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="blob-search"
                  placeholder="Search for Shared Blob"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 pl-10"
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-[#213b46] hover:bg-[#213b46]/90"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search for Blob'
              )}
            </Button>
          </div>

          {/* Error Display */}
          {(error || searchError || tipError) && (
            <div className="flex w-full flex-wrap items-start gap-2 rounded-md bg-red-50 p-3 text-sm break-words whitespace-normal text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1 break-words">
                {error || searchError?.message || tipError?.message}
              </span>
            </div>
          )}

          {blobInfo && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Blob Status</div>
                  <div className="text-muted-foreground text-sm">
                    {blobInfo.status === 'active' ? 'Active' : 'Not Active'}
                  </div>
                </div>
                {blobInfo.status === 'not_active' && (
                  <div className="ml-auto">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                      <span className="text-xs">⚠</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Tip Balance
                  </div>
                  <div className="text-lg font-semibold">
                    {formatNumber(blobInfo.tipBalance)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Cost/Epoch
                  </div>
                  <div className="text-lg font-semibold">
                    {formatNumber(blobInfo.costPerEpoch)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-sm">
                    Epochs Left
                  </div>
                  <div className="text-lg font-semibold">
                    {blobInfo.epochsLeft}
                  </div>
                </div>
              </div>

              {/* Tip Section */}
              <div className="space-y-3">
                <div>
                  <div className="font-medium">Send a Tip</div>
                  <div className="text-muted-foreground text-sm">
                    Choose your preferred tip or enter custom amount
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
                      Tip {amount / 1000}k
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Enter a custom amount</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="90"
                    value={customTipAmount}
                    onChange={(e) => setCustomTipAmount(e.target.value)}
                  />
                </div>

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
                    `Renew (${formatNumber(getTipAmount())} MIST)`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
