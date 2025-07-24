import { useNetwork } from "./use-network"
import { getQueryClient } from "~/get-query-client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useWallets, useConnectWallet, useCurrentWallet } from "@mysten/dapp-kit"

export function useAutoConnect() {
    const queryClient = getQueryClient()
    const wallets = useWallets()
    const { mutate: connectWallet } = useConnectWallet()
    const { currentWallet, connectionStatus } = useCurrentWallet()
    const { lastConnectedWallet, autoConnectEnabled, setLastConnectedWallet } = useNetwork()

    const autoConnectQuery = useQuery({
        queryKey: ["auto-connect-check", lastConnectedWallet, autoConnectEnabled, connectionStatus, wallets.length],
        queryFn: async () => {
            if (!autoConnectEnabled || !lastConnectedWallet || connectionStatus !== "disconnected" || wallets.length === 0) {
                return { shouldAutoConnect: false, wallet: null }
            }
            const wallet = wallets.find((w) => w.name === lastConnectedWallet)
            return {
                shouldAutoConnect: !!wallet,
                wallet: wallet || null,
            }
        },
    })

    const autoConnectMutation = useMutation({
        mutationFn: async (wallet: { name: string }) => {
            return new Promise((resolve, reject) => {
                connectWallet(
                    { wallet },
                    {
                        onSuccess: (data) => {
                            console.log("Auto-connected successfully to:", wallet.name)
                            setLastConnectedWallet(wallet.name)
                            resolve(data)
                        },
                        onError: (error) => {
                            console.error("Auto-connect failed:", error)
                            setLastConnectedWallet(null)
                            reject(error)
                        },
                    },
                )
            })
        },
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        onError: () => {
            queryClient.invalidateQueries()
        },
    })

    const autoConnectProcessQuery = useQuery({
        queryKey: ["auto-connect-process", autoConnectQuery.data?.shouldAutoConnect, autoConnectQuery.data?.wallet?.name],
        queryFn: async () => {
            if (!autoConnectQuery.data?.shouldAutoConnect || !autoConnectQuery.data?.wallet) {
                return { attempted: false }
            }
            await autoConnectMutation.mutateAsync(autoConnectQuery.data.wallet)
            return { attempted: true }
        },
        enabled: autoConnectQuery.data?.shouldAutoConnect === true && !autoConnectMutation.isPending,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    const connectionStatusQuery = useQuery({
        queryKey: ["wallet-connection-status", connectionStatus, currentWallet?.name],
        queryFn: async () => {
            if (connectionStatus === "connected" && currentWallet) {
                setLastConnectedWallet(currentWallet.name)
                return { status: "connected", walletName: currentWallet.name }
            }
            return { status: connectionStatus, walletName: null }
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
    const clearWalletMutation = useMutation({
        mutationFn: async () => {
            setLastConnectedWallet(null)
            queryClient.invalidateQueries()
            return { cleared: true }
        },
    })

    return {
        isAutoConnecting: autoConnectMutation.isPending || autoConnectProcessQuery.isFetching,
        autoConnectError: autoConnectMutation.error || autoConnectProcessQuery.error,
        isAutoConnectEnabled: autoConnectEnabled,
        lastConnectedWallet,
        clearWallet: clearWalletMutation.mutate,
        isClearingWallet: clearWalletMutation.isPending,

        queries: {
            autoConnect: autoConnectQuery,
            autoConnectProcess: autoConnectProcessQuery,
            connectionStatus: connectionStatusQuery,
        },
    }
}
