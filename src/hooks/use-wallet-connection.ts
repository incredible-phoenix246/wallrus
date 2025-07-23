
import { useNetwork } from "./use-network"
import { getQueryClient } from "~/get-query-client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useWallets, useConnectWallet, useDisconnectWallet, useCurrentWallet } from "@mysten/dapp-kit"

export function useWalletConnection() {
    const queryClient = getQueryClient()
    const wallets = useWallets()
    const { mutate: connectWallet } = useConnectWallet()
    const { mutate: disconnectWallet } = useDisconnectWallet()
    const { currentWallet, connectionStatus } = useCurrentWallet()
    const { setLastConnectedWallet } = useNetwork()

    const walletsQuery = useQuery({
        queryKey: ["available-wallets"],
        queryFn: async () => wallets,
        enabled: wallets.length > 0,
    })

    const connectMutation = useMutation({
        mutationFn: async (wallet: any) => {
            return new Promise((resolve, reject) => {
                connectWallet(
                    { wallet },
                    {
                        onSuccess: (data) => {
                            setLastConnectedWallet(wallet.name)
                            queryClient.invalidateQueries()
                            queryClient.invalidateQueries()
                            resolve(data)
                        },
                        onError: (error) => {
                            console.error("Connection failed:", error)
                            reject(error)
                        },
                    },
                )
            })
        },
        retry: 1,
        retryDelay: 1000,
    })

    const disconnectMutation = useMutation({
        mutationFn: async () => {
            return new Promise<void>((resolve, reject) => {
                disconnectWallet(
                    undefined,
                    {
                        onSuccess: () => {
                            setLastConnectedWallet(null)
                            queryClient.invalidateQueries()
                            resolve()
                        },
                        onError: (error) => {
                            reject(error)
                        },
                    },
                )
            })
        },
    })


    return {
        wallets: walletsQuery.data || [],
        isLoadingWallets: walletsQuery.isLoading,
        connectionStatus,
        currentWallet,
        isConnected: connectionStatus === "connected",
        isConnecting: connectionStatus === "connecting" || connectMutation.isPending,
        isDisconnecting: disconnectMutation.isPending,
        connect: connectMutation.mutate,
        disconnect: disconnectMutation.mutate,
        connectionError: connectMutation.error,
        disconnectionError: disconnectMutation.error,
        isConnectingToWallet: connectMutation.isPending,
        isDisconnectingWallet: disconnectMutation.isPending,
    }
}
