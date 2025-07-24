'use client'

import { useAutoConnect } from '~/hooks/use-auto-connect'
import { useWalletConnection } from '~/hooks/use-wallet-connection'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

export default function WalletDebug() {
  const { queries, isAutoConnecting, autoConnectError, lastConnectedWallet } =
    useAutoConnect()
  const { connectionStatus, currentWallet, wallets } = useWalletConnection()

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Wallet Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Connection Status</h4>
            <Badge
              variant={
                connectionStatus === 'connected' ? 'default' : 'secondary'
              }
            >
              {connectionStatus}
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold">Auto-Connecting</h4>
            <Badge variant={isAutoConnecting ? 'destructive' : 'secondary'}>
              {isAutoConnecting ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Current Wallet</h4>
          <p className="text-muted-foreground text-sm">
            {currentWallet?.name || 'None'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Last Connected</h4>
          <p className="text-muted-foreground text-sm">
            {lastConnectedWallet || 'None'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Available Wallets</h4>
          <p className="text-muted-foreground text-sm">
            {wallets.length} wallets detected
          </p>
        </div>

        {autoConnectError && (
          <div>
            <h4 className="font-semibold text-red-600">Auto-Connect Error</h4>
            <p className="text-sm text-red-500">{autoConnectError.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold">Query States</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="font-medium">Auto-Connect:</span>
              <Badge variant="outline" className="ml-1">
                {queries.autoConnect.status}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Process:</span>
              <Badge variant="outline" className="ml-1">
                {queries.autoConnectProcess.status}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge variant="outline" className="ml-1">
                {queries.connectionStatus.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
