'use client'

import { useState } from 'react'
import { Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useDialogStore } from '~/dialog-store'

const simulateTipTransaction = async (amount: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const transactionId = `0x${Math.random().toString(16).substr(2, 8)}...`
  const currentFunds = Math.floor(Math.random() * 1000000000) + 6000000000

  return {
    transactionId,
    amountTipped: `${amount} SUI`,
    newTotalFunds: `${currentFunds.toLocaleString()} SUI`,
  }
}

export function TipDialogs() {
  const {
    isOpen,
    type,
    data,
    closeDialog,
    openDialog,
    isProcessing,
    setProcessing,
  } = useDialogStore()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState('')

  const handleCopy = async (text: string, fieldName: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirm = async () => {
    if (type === 'tip-shared-blob') {
      if (!fundAmount.trim()) {
        alert('Please enter an amount to fund')
        return
      }

      try {
        setProcessing(true)

        // Simulate the tipping process
        const result = await simulateTipTransaction(
          fundAmount
          //   data.sharedBlobId || ''
        )

        // After successful tip, show success dialog
        openDialog('tip-successful', {
          transactionId: result.transactionId,
          amountTipped: result.amountTipped,
          newTotalFunds: result.newTotalFunds,
        })

        // Reset form
        setFundAmount('')
      } catch (error) {
        console.error('Tip failed:', error)
        alert('Transaction failed. Please try again.')
      } finally {
        setProcessing(false)
      }
    } else if (type === 'tip-successful') {
      // Handle tip successful confirmation
      console.log('Tip successful confirmed')
      closeDialog()
    }
  }

  const handleCancel = () => {
    if (isProcessing) return // Prevent canceling during processing
    setFundAmount('')
    closeDialog()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isProcessing && handleCancel()}
    >
      <DialogContent className="font-sans sm:max-w-md">
        {type === 'tip-successful' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                TIP SUCCESSFUL
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This blog post has been published. Team members will be able to
                edit this post and republish changes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    {data.transactionId || '0x726f2a60...'}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() =>
                      handleCopy(
                        data.transactionId || '0x726f2a60...',
                        'transaction'
                      )
                    }
                  >
                    {copiedField === 'transaction' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Amount Tipped:</span>
                <span className="text-sm font-semibold">
                  {data.amountTipped || '7 SUI'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Total Funds:</span>
                <span className="text-sm font-semibold">
                  {data.newTotalFunds || '6,153,429,999 SUI'}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-transparent px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-slate-700 px-8 hover:bg-slate-800"
              >
                Confirm
              </Button>
            </div>
          </>
        )}

        {type === 'tip-shared-blob' && (
          <>
            <DialogHeader>
              <DialogTitle>TIP A SHARED BLOB</DialogTitle>
              <DialogDescription>
                Add funds to a shared blob to help keep it online longer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shared-blob-id">Shared Blob Object ID</Label>
                <Input
                  id="shared-blob-id"
                  value={data.sharedBlobId || '0x5ce5...e638'}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount-to-fund">Amount to Fund (SUI)</Label>
                <Input
                  id="amount-to-fund"
                  placeholder="e.g. 10"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  disabled={isProcessing}
                  type="number"
                  min="0"
                  step="0.1"
                />
                <p className="text-muted-foreground text-xs">
                  Amount in smallest unit (1 SUI = 1,000,000,000 units)
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-slate-700 hover:bg-slate-800"
                disabled={isProcessing || !fundAmount.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
