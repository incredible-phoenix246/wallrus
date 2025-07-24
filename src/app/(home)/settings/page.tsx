'use client'

import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useAutoConnect } from '~/hooks/use-auto-connect'
import { useWalletConnection } from '~/hooks/use-wallet-connection'
import { Loader2 } from 'lucide-react'
import { useNetwork } from '~/hooks/use-network'

export default function WalletSettings() {
  const { autoConnectEnabled, setAutoConnectEnabled } = useNetwork()
  const { clearWallet, isClearingWallet, lastConnectedWallet } =
    useAutoConnect()
  const { currentWallet, disconnect, isDisconnectingWallet } =
    useWalletConnection()

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Wallet Settings</h3>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-connect"
          checked={autoConnectEnabled}
          onCheckedChange={setAutoConnectEnabled}
        />
        <Label htmlFor="auto-connect">Auto-connect wallet on page load</Label>
      </div>

      {currentWallet && (
        <div className="space-y-2">
          <div className="text-muted-foreground text-sm">
            Connected to: <strong>{currentWallet.name}</strong>
          </div>
          <Button
            variant="outline"
            onClick={() => disconnect()}
            disabled={isDisconnectingWallet}
            className="w-full bg-transparent"
          >
            {isDisconnectingWallet ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect Wallet'
            )}
          </Button>
        </div>
      )}

      {lastConnectedWallet && (
        <div className="text-muted-foreground text-sm">
          Last connected: <strong>{lastConnectedWallet}</strong>
        </div>
      )}

      <Button
        variant="outline"
        onClick={() => clearWallet()}
        disabled={isClearingWallet}
        className="w-full bg-transparent"
      >
        {isClearingWallet ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Clearing...
          </>
        ) : (
          'Clear Wallet Data'
        )}
      </Button>
    </div>
  )
}
