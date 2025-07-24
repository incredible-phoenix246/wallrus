'use client'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useWALBalance } from '~/hooks/use-wal-balance'
import { useCurrentWallet } from '@mysten/dapp-kit'
import { Coins, RefreshCw, Wallet } from 'lucide-react'

export default function WALBalanceDisplay() {
  const { currentWallet } = useCurrentWallet()
  const {
    formattedWALBalance,
    walCoinCount,
    isLoadingBalance,
    balanceError,
    refetchBalance,
  } = useWALBalance()

  if (!currentWallet) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4" />
            WAL Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Connect wallet to view balance
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            WAL Balance
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchBalance()}
            disabled={isLoadingBalance}
            className="h-6 w-6 p-0"
          >
            <RefreshCw
              className={`h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {balanceError ? (
          <p className="text-destructive text-sm">Error loading balance</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold">
                {formattedWALBalance}
              </span>
              <Badge variant="secondary">WAL</Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {walCoinCount} coin{walCoinCount !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
