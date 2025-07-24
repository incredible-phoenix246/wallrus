'use client'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Activity, Clock, Zap } from 'lucide-react'

interface NetworkStatusDisplayProps {
  networkStatus: {
    currentEpoch: number
    systemState: unknown
    networkMetrics?: unknown
  } | null
  isLoading: boolean
}

export function NetworkStatusDisplay({
  networkStatus,
  isLoading,
}: NetworkStatusDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!networkStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Unable to load network status
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatGasPrice = (price: string | bigint) => {
    const priceNum = typeof price === 'bigint' ? Number(price) : Number(price)
    return `${priceNum.toLocaleString()} FROST`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
              <Clock className="h-3 w-3" />
              Current Epoch
            </label>
            <p className="text-lg font-semibold">
              {networkStatus.currentEpoch}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
              <Zap className="h-3 w-3" />
              Reference Gas Price
            </label>
            <p className="text-sm">
              {formatGasPrice(networkStatus.systemState.referenceGasPrice)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Active Validators
            </label>
            <p className="text-sm">
              {networkStatus.systemState.activeValidators?.length || 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Total Stake
            </label>
            <p className="text-sm">
              {networkStatus.systemState.totalStake
                ? `${(Number(networkStatus.systemState.totalStake) / 1e9).toFixed(2)} SUI`
                : 'N/A'}
            </p>
          </div>
        </div>

        {networkStatus.networkMetrics && (
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Network Health
            </label>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Healthy
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
